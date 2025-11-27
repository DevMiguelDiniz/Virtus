"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { buscarResgate, validarResgate, ResgateDetalhes } from "@/shared/services/resgate.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, XCircle, Loader2, AlertCircle, Gift, Calendar, Coins } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ValidarResgatePage() {
    const params = useParams()
    const router = useRouter()
    const resgateId = params.id as string

    const [resgate, setResgate] = useState<ResgateDetalhes | null>(null)
    const [loading, setLoading] = useState(true)
    const [validando, setValidando] = useState(false)
    const [erro, setErro] = useState<string | null>(null)
    const [sucesso, setSucesso] = useState(false)

    useEffect(() => {
        carregarResgate()
    }, [resgateId])

    async function carregarResgate() {
        try {
            setLoading(true)
            setErro(null)
            const dados = await buscarResgate(Number(resgateId))
            setResgate(dados)
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Erro ao carregar resgate')
        } finally {
            setLoading(false)
        }
    }

    async function handleValidar() {
        if (!resgate) return

        try {
            setValidando(true)
            setErro(null)
            const resgateValidado = await validarResgate(Number(resgateId))
            setResgate(resgateValidado)
            setSucesso(true)
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Erro ao validar resgate')
        } finally {
            setValidando(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <Loader2 className="h-12 w-12 animate-spin text-[#268c90]" />
                            <p className="text-muted-foreground">Carregando resgate...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (erro && !resgate) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex items-center justify-center mb-4">
                            <XCircle className="h-16 w-16 text-destructive" />
                        </div>
                        <CardTitle className="text-center">Erro ao Carregar Resgate</CardTitle>
                        <CardDescription className="text-center">{erro}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button onClick={() => router.push('/')} variant="outline">
                            Voltar para Início
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    if (!resgate) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 py-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Validação de Resgate</h1>
                    <p className="text-muted-foreground">
                        Sistema Virtus - Moeda Estudantil
                    </p>
                </div>

                {/* Status do Resgate */}
                {resgate.utilizado && !sucesso && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Resgate já utilizado</AlertTitle>
                        <AlertDescription>
                            Este resgate já foi validado anteriormente e não pode ser reutilizado.
                        </AlertDescription>
                    </Alert>
                )}

                {sucesso && (
                    <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-600">Resgate validado com sucesso!</AlertTitle>
                        <AlertDescription className="text-green-600">
                            O aluno foi notificado por email sobre a validação.
                        </AlertDescription>
                    </Alert>
                )}

                {erro && resgate && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erro</AlertTitle>
                        <AlertDescription>{erro}</AlertDescription>
                    </Alert>
                )}

                {/* Card Principal */}
                <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-[#268c90] to-[#155457] text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">Detalhes do Resgate</CardTitle>
                                <CardDescription className="text-gray-200">
                                    Código: {resgate.codigoResgate}
                                </CardDescription>
                            </div>
                            <Badge
                                variant={resgate.utilizado ? "secondary" : "default"}
                                className={resgate.utilizado ? "bg-red-500" : "bg-green-500"}
                            >
                                {resgate.utilizado ? "Utilizado" : "Disponível"}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6 space-y-6">
                        {/* Informações da Vantagem */}
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                {resgate.vantagem.foto && (
                                    <img
                                        src={resgate.vantagem.foto}
                                        alt={resgate.vantagem.nome}
                                        className="w-24 h-24 rounded-lg object-cover"
                                    />
                                )}
                                <div className="flex-1">
                                    <div className="flex items-start gap-2">
                                        <Gift className="h-5 w-5 text-[#268c90] mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-lg">{resgate.vantagem.nome}</h3>
                                            <p className="text-sm text-muted-foreground">{resgate.vantagem.descricao}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Informações do Aluno */}
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Aluno:</span>
                                    <span className="font-medium">{resgate.aluno.nome}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                                    <span className="text-sm">{resgate.aluno.email}</span>
                                </div>
                            </div>

                            <Separator />

                            {/* Informações do Resgate */}
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Coins className="h-4 w-4" />
                                        Valor em Moedas:
                                    </span>
                                    <span className="font-bold text-[#268c90]">{resgate.valorMoedas} moedas</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        Data do Resgate:
                                    </span>
                                    <span className="text-sm">
                                        {new Date(resgate.dataResgate).toLocaleString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex gap-3 bg-gray-50 dark:bg-gray-900">
                        <Button
                            onClick={handleValidar}
                            disabled={resgate.utilizado || validando || sucesso}
                            className="flex-1 bg-[#268c90] hover:bg-[#155457]"
                            size="lg"
                        >
                            {validando ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Validando...
                                </>
                            ) : sucesso ? (
                                <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Validado
                                </>
                            ) : resgate.utilizado ? (
                                'Já Utilizado'
                            ) : (
                                <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Validar Resgate
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={() => router.push('/')}
                            variant="outline"
                            size="lg"
                        >
                            Voltar
                        </Button>
                    </CardFooter>
                </Card>

                {/* Informações Adicionais */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Instruções</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>• Verifique se as informações do resgate estão corretas antes de validar</p>
                        <p>• Cada resgate pode ser validado apenas uma vez</p>
                        <p>• O aluno receberá uma notificação por email após a validação</p>
                        <p>• Em caso de problemas, entre em contato com o suporte do sistema</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
