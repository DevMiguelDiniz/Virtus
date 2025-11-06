"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MultiSelect } from "@/components/ui/multi-select"
import Link from "next/link"
import { User, Building2, GraduationCap, Loader2, ArrowLeft } from "lucide-react"
import { cadastroService } from "@/shared/services/cadastro.service"
import { instituicaoService } from "@/shared/services/instituicao.service"
import type { AlunoRequest, ProfessorRequest, EmpresaRequest, ApiError } from "@/shared/interfaces/cadastro.interface"
import type { Instituicao } from "@/shared/interfaces/instituicao.interface"
import { useRouter } from "next/navigation"

type UserType = "student" | "professor" | "company"

export function RegisterForm() {
    const router = useRouter()
    const [userType, setUserType] = useState<UserType>("student")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [instituicoes, setInstituicoes] = useState<Instituicao[]>([])

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        cpf: "",
        rg: "",
        address: "",
        institution: "", // Para aluno
        course: "",
        departamento: "",
        instituicoesProfessor: [] as string[], // Para professor (array de siglas)
        cnpj: "",
        description: "",
    })

    // Buscar instituições ao carregar componente
    useEffect(() => {
        const fetchInstituicoes = async () => {
            try {
                const data = await instituicaoService.listarTodas()
                setInstituicoes(data)
            } catch (err) {
                console.error('Erro ao carregar instituições:', err)
            }
        }
        fetchInstituicoes()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setFieldErrors({})
        setIsLoading(true)

        try {
            if (userType === "student") {
                // Remover pontuação do CPF (000.000.000-00 -> 00000000000)
                const cpfLimpo = formData.cpf.replace(/[.-]/g, '')

                const alunoData: AlunoRequest = {
                    login: formData.email, // Usando email como login
                    senha: formData.password,
                    nome: formData.name,
                    email: formData.email,
                    cpf: cpfLimpo,
                    rg: formData.rg,
                    endereco: formData.address,
                    instituicao: formData.institution, // Sigla da instituição
                }

                const response = await cadastroService.cadastrarAluno(alunoData)
                console.log("Aluno cadastrado com sucesso:", response)

                // Redirecionar para login ou dashboard
                router.push("/login?registered=true")

            } else if (userType === "professor") {
                // Remover pontuação do CPF (000.000.000-00 -> 00000000000)
                const cpfLimpo = formData.cpf.replace(/[.-]/g, '')

                // Validar se selecionou pelo menos uma instituição
                if (formData.instituicoesProfessor.length === 0) {
                    setError("Selecione pelo menos uma instituição de ensino")
                    setIsLoading(false)
                    return
                }

                const professorData: ProfessorRequest = {
                    login: formData.email, // Usando email como login
                    senha: formData.password,
                    nome: formData.name,
                    cpf: cpfLimpo,
                    rg: formData.rg,
                    departamento: formData.departamento,
                    instituicoes: formData.instituicoesProfessor, // Array de siglas
                }

                const response = await cadastroService.cadastrarProfessor(professorData)
                console.log("Professor cadastrado com sucesso:", response)

                // Redirecionar para login ou dashboard
                router.push("/login?registered=true")

            } else {
                // Remover pontuação do CNPJ (00.000.000/0000-00 -> 00000000000000)
                const cnpjLimpo = formData.cnpj.replace(/[./-]/g, '')

                const empresaData: EmpresaRequest = {
                    login: formData.email, // Usando email como login
                    senha: formData.password,
                    nome: formData.name,
                    cnpj: cnpjLimpo,
                    endereco: formData.address,
                    email: formData.email,
                }

                const response = await cadastroService.cadastrarEmpresa(empresaData)
                console.log("Empresa cadastrada com sucesso:", response)

                // Redirecionar para login ou dashboard
                router.push("/login?registered=true")
            }
        } catch (err) {
            const apiError = err as ApiError

            if (apiError.errors && apiError.errors.length > 0) {
                // Mapear erros de validação para os campos
                const errors: Record<string, string> = {}
                apiError.errors.forEach(validationError => {
                    errors[validationError.field] = validationError.message
                })
                setFieldErrors(errors)
                setError("Por favor, corrija os erros nos campos destacados")
            } else {
                setError(apiError.message || "Erro ao realizar cadastro. Tente novamente.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Limpar erro do campo quando o usuário começar a digitar
        if (fieldErrors[field]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    return (
        <Card className="w-full max-w-6xl p-8 border-border">
            <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Voltar à página inicial</span>
            </Link>
            <div className="text-center mb-6">
                <h2 className="font-heading font-bold text-3xl mb-2 text-foreground">Criar conta</h2>
                <p className="text-muted-foreground">Escolha o tipo de conta e preencha seus dados</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <div className="flex gap-4 mb-6">
                <button
                    type="button"
                    onClick={() => setUserType("student")}
                    disabled={isLoading}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        userType === "student" ? "border-[#268c90] bg-[#268c90]/5" : "border-border hover:border-[#6ed3d8]"
                    }`}
                >
                    <User
                        className={`w-8 h-8 mx-auto mb-2 ${userType === "student" ? "text-[#268c90]" : "text-muted-foreground"}`}
                    />
                    <p className={`font-medium ${userType === "student" ? "text-[#268c90]" : "text-foreground"}`}>Aluno</p>
                </button>

                <button
                    type="button"
                    onClick={() => setUserType("professor")}
                    disabled={isLoading}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        userType === "professor" ? "border-[#268c90] bg-[#268c90]/5" : "border-border hover:border-[#6ed3d8]"
                    }`}
                >
                    <GraduationCap
                        className={`w-8 h-8 mx-auto mb-2 ${userType === "professor" ? "text-[#268c90]" : "text-muted-foreground"}`}
                    />
                    <p className={`font-medium ${userType === "professor" ? "text-[#268c90]" : "text-foreground"}`}>Professor</p>
                </button>

                <button
                    type="button"
                    onClick={() => setUserType("company")}
                    disabled={isLoading}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        userType === "company" ? "border-[#268c90] bg-[#268c90]/5" : "border-border hover:border-[#6ed3d8]"
                    }`}
                >
                    <Building2
                        className={`w-8 h-8 mx-auto mb-2 ${userType === "company" ? "text-[#268c90]" : "text-muted-foreground"}`}
                    />
                    <p className={`font-medium ${userType === "company" ? "text-[#268c90]" : "text-foreground"}`}>Empresa</p>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campos comuns - Nome, Email e Senha em linha */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground font-medium">
                            Nome {userType === "company" && "da Empresa"}{userType === "professor" && "Completo"}
                        </Label>
                        <Input
                            id="name"
                            placeholder={userType === "student" ? "Seu nome completo" : userType === "professor" ? "Seu nome completo" : "Nome da empresa"}
                            value={formData.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            className={`h-11 ${fieldErrors.nome ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                            required
                        />
                        {fieldErrors.nome && <p className="text-red-500 text-xs mt-1">{fieldErrors.nome}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground font-medium">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            className={`h-11 ${fieldErrors.email ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                            required
                        />
                        {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-foreground font-medium">
                            Senha
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            value={formData.password}
                            onChange={(e) => updateField("password", e.target.value)}
                            className={`h-11 ${fieldErrors.senha ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                            required
                        />
                        {fieldErrors.senha && <p className="text-red-500 text-xs mt-1">{fieldErrors.senha}</p>}
                    </div>
                </div>

                {userType === "student" ? (
                    <>
                        {/* CPF, RG e Instituição em linha */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cpf" className="text-foreground font-medium">
                                    CPF
                                </Label>
                                <Input
                                    id="cpf"
                                    placeholder="000.000.000-00"
                                    value={formData.cpf}
                                    onChange={(e) => updateField("cpf", e.target.value)}
                                    className={`h-11 ${fieldErrors.cpf ? 'border-red-500' : ''}`}
                                    disabled={isLoading}
                                    maxLength={14}
                                    required
                                />
                                {fieldErrors.cpf && <p className="text-red-500 text-xs mt-1">{fieldErrors.cpf}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rg" className="text-foreground font-medium">
                                    RG
                                </Label>
                                <Input
                                    id="rg"
                                    placeholder="00.000.000-0"
                                    value={formData.rg}
                                    onChange={(e) => updateField("rg", e.target.value)}
                                    className={`h-11 ${fieldErrors.rg ? 'border-red-500' : ''}`}
                                    disabled={isLoading}
                                    required
                                />
                                {fieldErrors.rg && <p className="text-red-500 text-xs mt-1">{fieldErrors.rg}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="institution" className="text-foreground font-medium">
                                    Instituição de Ensino
                                </Label>
                                <Select
                                    value={formData.institution}
                                    onValueChange={(value) => updateField("institution", value)}
                                    disabled={isLoading}
                                    required
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {instituicoes.map((inst) => (
                                            <SelectItem key={inst.id} value={inst.sigla}>
                                                {inst.sigla} - {inst.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Curso e Endereço em linha */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="course" className="text-foreground font-medium">
                                    Curso
                                </Label>
                                <Input
                                    id="course"
                                    placeholder="Ex: Ciência da Computação"
                                    value={formData.course}
                                    onChange={(e) => updateField("course", e.target.value)}
                                    className="h-11"
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-foreground font-medium">
                                    Endereço
                                </Label>
                                <Input
                                    id="address"
                                    placeholder="Rua, número, bairro, cidade"
                                    value={formData.address}
                                    onChange={(e) => updateField("address", e.target.value)}
                                    className={`h-11 ${fieldErrors.endereco ? 'border-red-500' : ''}`}
                                    disabled={isLoading}
                                    required
                                />
                                {fieldErrors.endereco && <p className="text-red-500 text-xs mt-1">{fieldErrors.endereco}</p>}
                            </div>
                        </div>
                    </>
                ) : userType === "professor" ? (
                    <>
                        {/* CPF e RG em linha */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cpf" className="text-foreground font-medium">
                                    CPF
                                </Label>
                                <Input
                                    id="cpf"
                                    placeholder="000.000.000-00"
                                    value={formData.cpf}
                                    onChange={(e) => updateField("cpf", e.target.value)}
                                    className={`h-11 ${fieldErrors.cpf ? 'border-red-500' : ''}`}
                                    disabled={isLoading}
                                    maxLength={14}
                                    required
                                />
                                {fieldErrors.cpf && <p className="text-red-500 text-xs mt-1">{fieldErrors.cpf}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rg" className="text-foreground font-medium">
                                    RG
                                </Label>
                                <Input
                                    id="rg"
                                    placeholder="00.000.000-0"
                                    value={formData.rg}
                                    onChange={(e) => updateField("rg", e.target.value)}
                                    className={`h-11 ${fieldErrors.rg ? 'border-red-500' : ''}`}
                                    disabled={isLoading}
                                    required
                                />
                                {fieldErrors.rg && <p className="text-red-500 text-xs mt-1">{fieldErrors.rg}</p>}
                            </div>
                        </div>

                        {/* Departamento */}
                        <div className="space-y-2">
                            <Label htmlFor="departamento" className="text-foreground font-medium">
                                Departamento
                            </Label>
                            <Input
                                id="departamento"
                                placeholder="Ex: Computação, Matemática"
                                value={formData.departamento}
                                onChange={(e) => updateField("departamento", e.target.value)}
                                className={`h-11 ${fieldErrors.departamento ? 'border-red-500' : ''}`}
                                disabled={isLoading}
                                required
                            />
                            {fieldErrors.departamento && <p className="text-red-500 text-xs mt-1">{fieldErrors.departamento}</p>}
                        </div>

                        {/* Instituições de Ensino (Multiselect) */}
                        <div className="space-y-2">
                            <Label className="text-foreground font-medium">
                                Instituições de Ensino *
                            </Label>
                            <p className="text-sm text-muted-foreground mb-2">
                                Selecione todas as instituições em que você leciona
                            </p>
                            <MultiSelect
                                options={instituicoes.map(inst => ({
                                    label: `${inst.sigla} - ${inst.nome}`,
                                    value: inst.sigla
                                }))}
                                selected={formData.instituicoesProfessor}
                                onChange={(values) => setFormData(prev => ({ ...prev, instituicoesProfessor: values }))}
                                placeholder="Selecione instituições..."
                                emptyText="Nenhuma instituição encontrada"
                                disabled={isLoading}
                            />
                            {formData.instituicoesProfessor.length === 0 && (
                                <p className="text-amber-600 text-xs mt-1">Selecione pelo menos uma instituição</p>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* CNPJ e Endereço em linha */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cnpj" className="text-foreground font-medium">
                                    CNPJ
                                </Label>
                                <Input
                                    id="cnpj"
                                    placeholder="00.000.000/0000-00"
                                    value={formData.cnpj}
                                    onChange={(e) => updateField("cnpj", e.target.value)}
                                    className={`h-11 ${fieldErrors.cnpj ? 'border-red-500' : ''}`}
                                    disabled={isLoading}
                                    maxLength={18}
                                    required
                                />
                                {fieldErrors.cnpj && <p className="text-red-500 text-xs mt-1">{fieldErrors.cnpj}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-foreground font-medium">
                                    Endereço
                                </Label>
                                <Input
                                    id="address"
                                    placeholder="Rua, número, bairro, cidade"
                                    value={formData.address}
                                    onChange={(e) => updateField("address", e.target.value)}
                                    className={`h-11 ${fieldErrors.endereco ? 'border-red-500' : ''}`}
                                    disabled={isLoading}
                                    required
                                />
                                {fieldErrors.endereco && <p className="text-red-500 text-xs mt-1">{fieldErrors.endereco}</p>}
                            </div>
                        </div>

                        {/* Descrição */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-foreground font-medium">
                                Descrição da Empresa (opcional)
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Conte um pouco sobre sua empresa..."
                                value={formData.description}
                                onChange={(e) => updateField("description", e.target.value)}
                                className="min-h-20 resize-none"
                                disabled={isLoading}
                            />
                        </div>
                    </>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[#268c90] hover:bg-[#155457] text-white font-medium text-base mt-4"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Criando conta...
                        </>
                    ) : (
                        "Criar conta"
                    )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="text-[#268c90] hover:text-[#155457] font-medium">
                        Faça login
                    </Link>
                </p>
            </form>
        </Card>
    )
}