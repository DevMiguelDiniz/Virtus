"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Building2, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import type { UserData } from "@/shared/interfaces/login.interface"
import type {
    AlunoUpdateResponse,
    EmpresaUpdateResponse,
    AlunoUpdateRequest,
    EmpresaUpdateRequest,
    ApiError
} from "@/shared/interfaces/edicao.interface"
import { edicaoService } from "@/shared/services/edicao.service"
import { useRouter } from "next/navigation"

interface EditarFormProps {
    userData: UserData
    profileData: AlunoUpdateResponse | EmpresaUpdateResponse
}

export function EditarForm({ userData, profileData }: EditarFormProps) {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const [formData, setFormData] = useState({
        nome: profileData.nome || '',
        email: profileData.email || '',
        endereco: profileData.endereco || '',
        ...(userData.tipo === 'ALUNO' && 'cpf' in profileData && {
            cpf: profileData.cpf || '',
            rg: profileData.rg || '',
        }),
        ...(userData.tipo === 'EMPRESA' && 'cnpj' in profileData && {
            cnpj: profileData.cnpj || '',
        }),
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        setFieldErrors({})
        setIsLoading(true)

        try {
            if (isChangingPassword) {
                if (!passwordData.currentPassword) {
                    setFieldErrors(prev => ({ ...prev, currentPassword: "Senha atual é obrigatória" }))
                    setIsLoading(false)
                    return
                }
                if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
                    setFieldErrors(prev => ({ ...prev, newPassword: "A nova senha deve ter pelo menos 6 caracteres" }))
                    setIsLoading(false)
                    return
                }
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    setFieldErrors(prev => ({ ...prev, confirmPassword: "As senhas não coincidem" }))
                    setIsLoading(false)
                    return
                }
            }

            if (userData.tipo === 'ALUNO') {
                const alunoData: AlunoUpdateRequest = {
                    nome: formData.nome || undefined,
                    email: formData.email || undefined,
                    rg: 'rg' in formData ? formData.rg || undefined : undefined,
                    endereco: formData.endereco || undefined,
                    senha: isChangingPassword ? passwordData.newPassword : undefined,
                }

                const response = await edicaoService.editarAluno(userData.id, alunoData)

                const updatedUserData = {
                    ...userData,
                    nome: response.nome,
                    email: response.email,
                    rg: response.rg,
                    endereco: response.endereco
                }

                localStorage.setItem('@virtus:user', JSON.stringify(updatedUserData))

            } else if (userData.tipo === 'EMPRESA') {
                const empresaData: EmpresaUpdateRequest = {
                    nome: formData.nome,
                    endereco: formData.endereco,
                    email: formData.email || undefined,
                }

                const response = await edicaoService.editarEmpresa(userData.id, empresaData)

                const updatedUserData = {
                    ...userData,
                    nome: response.nome,
                    email: response.email,
                    endereco: response.endereco
                }

                localStorage.setItem('@virtus:user', JSON.stringify(updatedUserData))
            }

            setSuccess(true)

            if (isChangingPassword) {
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                })
                setIsChangingPassword(false)
            }

            setTimeout(() => {
                router.push('/home')
            }, 2000)

        } catch (err) {
            const apiError = err as ApiError
            setError(apiError.message)

            if (apiError.errors && apiError.errors.length > 0) {
                const newFieldErrors: Record<string, string> = {}
                apiError.errors.forEach(error => {
                    newFieldErrors[error.field] = error.message
                })
                setFieldErrors(newFieldErrors)
            }

            if (apiError.status === 401) {
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (fieldErrors[field]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const updatePasswordField = (field: string, value: string) => {
        setPasswordData((prev) => ({ ...prev, [field]: value }))
        if (fieldErrors[field]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const getUserTypeIcon = () => {
        if (userData.tipo === 'ALUNO') {
            return <User className="w-8 h-8 text-[#268c90]" />
        } else if (userData.tipo === 'PROFESSOR') {
            return <User className="w-8 h-8 text-[#268c90]" />
        } else {
            return <Building2 className="w-8 h-8 text-[#268c90]" />
        }
    }

    const getUserTypeLabel = () => {
        if (userData.tipo === 'ALUNO') return 'Aluno'
        if (userData.tipo === 'PROFESSOR') return 'Professor'
        return 'Empresa'
    }

    return (
        <Card className="w-full max-w-6xl p-8 border-border">
            <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#268c90]/10 flex items-center justify-center mx-auto mb-3">
                    {getUserTypeIcon()}
                </div>
                <h2 className="font-heading font-bold text-3xl mb-2 text-foreground">Editar Perfil</h2>
                <p className="text-muted-foreground">Atualize suas informações pessoais</p>
                <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 bg-[#268c90]/10 rounded-lg">
                    <span className="text-sm font-medium text-[#268c90]">Tipo de conta: {getUserTypeLabel()}</span>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-green-800 text-sm font-medium">Perfil atualizado com sucesso!</p>
                        <p className="text-green-700 text-xs mt-1">Redirecionando...</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campos comuns para todos os tipos */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome" className="text-foreground font-medium">
                            Nome {userData.tipo === 'EMPRESA' && 'da Empresa'}
                        </Label>
                        <Input
                            id="nome"
                            placeholder={userData.tipo === 'ALUNO' || userData.tipo === 'PROFESSOR' ? "Seu nome completo" : "Nome da empresa"}
                            value={formData.nome}
                            onChange={(e) => updateField("nome", e.target.value)}
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
                        />
                        {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                    </div>
                </div>

                {/* Campos específicos para ALUNO */}
                {userData.tipo === 'ALUNO' && 'cpf' in formData && 'rg' in formData && (
                    <>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cpf" className="text-foreground font-medium">
                                    CPF
                                </Label>
                                <Input
                                    id="cpf"
                                    placeholder="000.000.000-00"
                                    value={formData.cpf}
                                    className="h-11 bg-muted"
                                    disabled={true}
                                />
                                <p className="text-xs text-muted-foreground">Campo não editável</p>
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
                                />
                                {fieldErrors.rg && <p className="text-red-500 text-xs mt-1">{fieldErrors.rg}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endereco" className="text-foreground font-medium">
                                Endereço
                            </Label>
                            <Input
                                id="endereco"
                                placeholder="Rua, número, bairro, cidade"
                                value={formData.endereco}
                                onChange={(e) => updateField("endereco", e.target.value)}
                                className={`h-11 ${fieldErrors.endereco ? 'border-red-500' : ''}`}
                                disabled={isLoading}
                            />
                            {fieldErrors.endereco && <p className="text-red-500 text-xs mt-1">{fieldErrors.endereco}</p>}
                        </div>
                    </>
                )}

                {/* Campos específicos para EMPRESA */}
                {userData.tipo === 'EMPRESA' && 'cnpj' in formData && (
                    <>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cnpj" className="text-foreground font-medium">
                                    CNPJ
                                </Label>
                                <Input
                                    id="cnpj"
                                    placeholder="00.000.000/0000-00"
                                    value={formData.cnpj}
                                    className="h-11 bg-muted"
                                    disabled={true}
                                />
                                <p className="text-xs text-muted-foreground">Campo não editável</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endereco" className="text-foreground font-medium">
                                    Endereço
                                </Label>
                                <Input
                                    id="endereco"
                                    placeholder="Rua, número, bairro, cidade"
                                    value={formData.endereco}
                                    onChange={(e) => updateField("endereco", e.target.value)}
                                    className={`h-11 ${fieldErrors.endereco ? 'border-red-500' : ''}`}
                                    disabled={isLoading}
                                    required
                                />
                                {fieldErrors.endereco && <p className="text-red-500 text-xs mt-1">{fieldErrors.endereco}</p>}
                            </div>
                        </div>
                    </>
                )}

                    <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-foreground">Alterar Senha</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsChangingPassword(!isChangingPassword)}
                                disabled={isLoading}
                            >
                                {isChangingPassword ? "Cancelar" : "Alterar Senha"}
                            </Button>
                        </div>

                        {isChangingPassword && (
                            <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword" className="text-foreground font-medium">
                                        Senha Atual *
                                    </Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        placeholder="Digite sua senha atual"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => updatePasswordField("currentPassword", e.target.value)}
                                        className={`h-11 ${fieldErrors.currentPassword ? 'border-red-500' : ''}`}
                                        disabled={isLoading}
                                    />
                                    {fieldErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.currentPassword}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword" className="text-foreground font-medium">
                                        Nova Senha *
                                    </Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="Mínimo 6 caracteres"
                                        value={passwordData.newPassword}
                                        onChange={(e) => updatePasswordField("newPassword", e.target.value)}
                                        className={`h-11 ${fieldErrors.newPassword ? 'border-red-500' : ''}`}
                                        disabled={isLoading}
                                    />
                                    {fieldErrors.newPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.newPassword}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                                        Confirmar Nova Senha *
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Digite a nova senha novamente"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => updatePasswordField("confirmPassword", e.target.value)}
                                        className={`h-11 ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
                                        disabled={isLoading}
                                    />
                                    {fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
                                </div>
                            </div>
                        )}
                    </div>

                <div className="flex gap-4 pt-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/home')}
                        disabled={isLoading}
                        className="flex-1 h-12"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 h-12 bg-[#268c90] hover:bg-[#155457] text-white font-medium text-base"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            "Salvar Alterações"
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    )
}