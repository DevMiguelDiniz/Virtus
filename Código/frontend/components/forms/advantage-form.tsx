"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Gift, FileText, Coins, Image, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { vantagemService } from "@/shared/services/vantagem.service"
import type { ApiError } from "@/shared/interfaces/vantagem.interface"
import { useRouter } from "next/navigation"

interface AdvantageFormProps {
    empresaId: number;
    onSuccess?: () => void;
}

export function AdvantageForm({ empresaId, onSuccess }: AdvantageFormProps) {
    const router = useRouter()

    const [nome, setNome] = useState("")
    const [descricao, setDescricao] = useState("")
    const [custoMoedas, setCustoMoedas] = useState("")
    const [urlFoto, setUrlFoto] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {}

        if (!nome.trim()) {
            errors.nome = "Nome e obrigatorio"
        } else if (nome.length > 200) {
            errors.nome = "Nome deve ter no maximo 200 caracteres"
        }

        if (!descricao.trim()) {
            errors.descricao = "Descricao e obrigatoria"
        } else if (descricao.length > 1000) {
            errors.descricao = "Descricao deve ter no maximo 1000 caracteres"
        }

        const custoNum = Number(custoMoedas)
        if (!custoMoedas || isNaN(custoNum) || custoNum < 1) {
            errors.custoMoedas = "Custo deve ser um numero maior que zero"
        } else if (!Number.isInteger(custoNum)) {
            errors.custoMoedas = "Custo deve ser um numero inteiro"
        }

        if (urlFoto && urlFoto.length > 500) {
            errors.urlFoto = "URL da foto deve ter no maximo 500 caracteres"
        }

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            await vantagemService.cadastrarVantagem(empresaId, {
                nome: nome.trim(),
                descricao: descricao.trim(),
                custoMoedas: Number(custoMoedas),
                urlFoto: urlFoto.trim() || undefined
            })

            setSuccess(true)

            // Limpar formulario
            setNome("")
            setDescricao("")
            setCustoMoedas("")
            setUrlFoto("")
            setFieldErrors({})

            // Callback de sucesso
            if (onSuccess) {
                onSuccess()
            }

            // Redirecionar apos 2 segundos
            setTimeout(() => {
                router.push('/listar-vantagens')
            }, 2000)

        } catch (err) {
            const apiError = err as ApiError
            if (apiError.status === 401) {
                setError("Sessao expirada. Faca login novamente.")
                setTimeout(() => router.push('/login'), 2000)
            } else if (apiError.status === 403) {
                setError("Voce nao tem permissao para cadastrar vantagens.")
            } else if (apiError.status === 0) {
                setError("Nao foi possivel conectar ao servidor. Tente novamente.")
            } else {
                setError(apiError.message || "Erro ao cadastrar vantagem. Tente novamente.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-6xl p-8 border-border">
            <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-[#268c90]/10 flex items-center justify-center">
                        <Gift className="w-8 h-8 text-[#268c90]" />
                    </div>
                    <h2 className="font-heading font-bold text-3xl mb-0 text-foreground">
                        Cadastrar Nova Vantagem
                    </h2>
                </div>
            </div>

            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-green-800 text-sm font-medium">Vantagem cadastrada com sucesso!</p>
                        <p className="text-green-700 text-xs mt-1">Redirecionando...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome" className="text-foreground font-medium">
                            Nome da Vantagem <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                id="nome"
                                type="text"
                                placeholder="Ex: Vale-compra R$ 50"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className={`pl-10 h-11 ${fieldErrors.nome ? 'border-red-500' : ''}`}
                                disabled={isLoading}
                                maxLength={200}
                                required
                            />
                        </div>
                        {fieldErrors.nome && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.nome}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="custoMoedas" className="text-foreground font-medium">
                            Custo em Moedas <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                id="custoMoedas"
                                type="number"
                                placeholder="Digite o custo em moedas"
                                value={custoMoedas}
                                onChange={(e) => setCustoMoedas(e.target.value)}
                                className={`pl-10 h-11 ${fieldErrors.custoMoedas ? 'border-red-500' : ''}`}
                                disabled={isLoading}
                                min="1"
                                step="1"
                                required
                            />
                        </div>
                        {fieldErrors.custoMoedas && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.custoMoedas}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="descricao" className="text-foreground font-medium">
                        Descricao <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Textarea
                            id="descricao"
                            placeholder="Descreva a vantagem em detalhes..."
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className={`pl-10 min-h-[120px] resize-none ${fieldErrors.descricao ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                            maxLength={1000}
                            rows={5}
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            {fieldErrors.descricao && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.descricao}</p>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {descricao.length}/1000 caracteres
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="urlFoto" className="text-foreground font-medium">
                        URL da Foto (opcional)
                    </Label>
                    <div className="relative">
                        <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="urlFoto"
                            type="url"
                            placeholder="https://exemplo.com/imagem.jpg"
                            value={urlFoto}
                            onChange={(e) => setUrlFoto(e.target.value)}
                            className={`pl-10 h-11 ${fieldErrors.urlFoto ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                            maxLength={500}
                        />
                    </div>
                    {fieldErrors.urlFoto && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.urlFoto}</p>
                    )}
                </div>

                <div className="flex gap-4 pt-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
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
                                Cadastrando...
                            </>
                        ) : (
                            "Cadastrar Vantagem"
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    )
}
