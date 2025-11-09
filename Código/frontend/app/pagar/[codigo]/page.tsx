"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { transacaoService } from "@/shared/services/transacao.service"
import { loginService } from "@/shared/services/login.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react"

export default function PagarLinkPage() {
    const params = useParams()
    const router = useRouter()
    const codigo = params.codigo as string
    
    const [loading, setLoading] = useState(true)
    const [processando, setProcessando] = useState(false)
    const [linkInfo, setLinkInfo] = useState<{ valor: number; destinatario: string } | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [sucesso, setSucesso] = useState(false)
    const [usuarioLogado, setUsuarioLogado] = useState<any>(null)

    useEffect(() => {
        // Verificar se o usuário está logado
        const userData = loginService.getUserData()
        if (!userData) {
            router.push(`/login?redirect=/pagar/${codigo}`)
            return
        }
        setUsuarioLogado(userData)
        
        // Buscar informações do link (você precisará criar um endpoint no backend para isso)
        carregarInfoLink()
    }, [codigo])

    const carregarInfoLink = async () => {
        try {
            setLoading(true)
            // Por enquanto, vamos apenas construir o link completo
            const linkCompleto = `${window.location.origin}/pagar/${codigo}`
            
            // Aqui você poderia fazer uma requisição para buscar os detalhes do link
            // Por enquanto, vamos apenas preparar para o pagamento
            setLinkInfo({
                valor: 0, // Será preenchido quando implementar o endpoint
                destinatario: "Carregando..."
            })
            setLoading(false)
        } catch (err: any) {
            setError(err.message || "Erro ao carregar informações do link")
            setLoading(false)
        }
    }

    const handlePagar = async () => {
        if (!usuarioLogado) {
            router.push(`/login?redirect=/pagar/${codigo}`)
            return
        }

        try {
            setProcessando(true)
            setError(null)
            
            const linkCompleto = `${window.location.origin}/pagar/${codigo}`
            
            await transacaoService.pagarLinkPagamento(usuarioLogado.id, linkCompleto)
            
            setSucesso(true)
            
            // Redirecionar após 3 segundos
            setTimeout(() => {
                router.push('/extrato')
            }, 3000)
        } catch (err: any) {
            console.error('Erro ao processar pagamento:', err)
            setError(err.message || "Erro ao processar o pagamento")
        } finally {
            setProcessando(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-[#268c90] mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">Carregando informações do pagamento...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (sucesso) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center py-8">
                            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Pagamento realizado!</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                                O pagamento foi processado com sucesso.
                            </p>
                            <p className="text-sm text-gray-500">Redirecionando para o extrato...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <XCircle className="h-6 w-6 text-red-500" />
                            <CardTitle>Erro no Pagamento</CardTitle>
                        </div>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={() => setError(null)}
                                variant="outline"
                                className="w-full"
                            >
                                Tentar Novamente
                            </Button>
                            <Button
                                onClick={() => router.push('/home')}
                                variant="outline"
                                className="w-full"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Voltar para Home
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Confirmar Pagamento</CardTitle>
                    <CardDescription>
                        Você está prestes a realizar um pagamento via link
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">
                                <strong>Código do pagamento:</strong>
                            </p>
                            <p className="font-mono text-xs text-blue-600 dark:text-blue-400 break-all">
                                {codigo}
                            </p>
                        </div>

                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                ⚠️ <strong>Atenção:</strong> Verifique se você confia no destinatário antes de confirmar o pagamento.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            <Button
                                onClick={handlePagar}
                                disabled={processando}
                                className="w-full bg-[#268c90] hover:bg-[#1f7579]"
                            >
                                {processando ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    'Confirmar Pagamento'
                                )}
                            </Button>
                            
                            <Button
                                onClick={() => router.push('/home')}
                                variant="outline"
                                disabled={processando}
                                className="w-full"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
