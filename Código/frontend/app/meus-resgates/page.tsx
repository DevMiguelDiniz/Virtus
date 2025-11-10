"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/headers/header"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { vantagemService } from "@/shared/services/vantagem.service"
import { loginService } from "@/shared/services/login.service"
import type { ResgateVantagemResponse } from "@/shared/interfaces/vantagem.interface"
import { Loader2, Search, Ticket, Calendar, Coins, CheckCircle2, XCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { QrResgateModal } from "@/components/qr-resgate-modal"

export default function MeusResgatesPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [resgates, setResgates] = useState<ResgateVantagemResponse[]>([])
    const [resgatesFiltrados, setResgatesFiltrados] = useState<ResgateVantagemResponse[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [validandoId, setValidandoId] = useState<number | null>(null)
    const [qrModalOpen, setQrModalOpen] = useState(false)
    const [resgateAtual, setResgateAtual] = useState<ResgateVantagemResponse | null>(null)

    useEffect(() => {
        const loadResgates = async () => {
            try {
                const userData = loginService.getUserData()

                if (!userData) {
                    router.push('/login')
                    return
                }

                if (userData.tipo !== 'ALUNO') {
                    router.push('/home')
                    return
                }

                const resgatesData = await vantagemService.listarResgates(userData.id)
                // Filtrar apenas os resgates não utilizados
                const resgatesNaoUtilizados = resgatesData.filter(r => !r.utilizado)
                setResgates(resgatesNaoUtilizados)
                setResgatesFiltrados(resgatesNaoUtilizados)
                setIsLoading(false)
            } catch (err) {
                console.error('Erro ao carregar resgates:', err)
                setError('Erro ao carregar resgates. Tente novamente.')
                setIsLoading(false)
            }
        }

        loadResgates()
    }, [router])

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setResgatesFiltrados(resgates)
        } else {
            const filtered = resgates.filter(resgate =>
                resgate.vantagemNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resgate.codigoResgate.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setResgatesFiltrados(filtered)
        }
    }, [searchTerm, resgates])

    const formatarData = (dataStr: string) => {
        try {
            const data = new Date(dataStr)
            return format(data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
        } catch {
            return dataStr
        }
    }

    const handleValidarResgate = (resgate: ResgateVantagemResponse) => {
        setResgateAtual(resgate)
        setQrModalOpen(true)
    }

    const confirmarValidacao = async () => {
        if (!resgateAtual) return

        try {
            const userData = loginService.getUserData()
            if (!userData) {
                router.push('/login')
                return
            }

            setValidandoId(resgateAtual.id)
            await vantagemService.validarResgate(userData.id, resgateAtual.id)

            const novosResgates = resgates.filter(r => r.id !== resgateAtual.id)
            setResgates(novosResgates)
            setResgatesFiltrados(novosResgates)

            toast({
                title: "Resgate validado com sucesso!",
                description: "A vantagem foi utilizada e movida para vantagens resgatadas.",
                variant: "default",
            })

            setValidandoId(null)
            setResgateAtual(null)
        } catch (err: any) {
            console.error('Erro ao validar resgate:', err)
            setValidandoId(null)

            toast({
                title: "Erro ao validar resgate",
                description: err.message || 'Erro ao validar resgate. Tente novamente.',
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#268c90]" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                Meus Códigos de Resgate
                            </h1>
                            <p className="text-muted-foreground">
                                Visualize todos os seus códigos de resgate de vantagens
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Buscar por vantagem ou código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-12"
                        />
                    </div>

                    {resgatesFiltrados.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Ticket className="w-16 h-16 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                {searchTerm
                                    ? "Nenhum resgate encontrado"
                                    : "Você ainda não resgatou nenhuma vantagem"}
                            </h3>
                            <p className="text-muted-foreground">
                                {searchTerm
                                    ? "Tente buscar por outro termo"
                                    : "Acesse a página de vantagens para resgatar"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {resgatesFiltrados.map((resgate) => (
                                <Card key={resgate.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">
                                            {resgate.vantagemNome}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Ticket className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-mono font-semibold text-[#268c90]">
                                                    {resgate.codigoResgate}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Coins className="w-4 h-4" />
                                                <span>{resgate.valorMoedas} moedas</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatarData(resgate.dataResgate)}</span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleValidarResgate(resgate)}
                                            disabled={validandoId === resgate.id}
                                            className="w-full bg-[#268c90] hover:bg-[#155457] text-white"
                                        >
                                            {validandoId === resgate.id ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Validando...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    Validar Resgate
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {resgateAtual && (
                <QrResgateModal
                    open={qrModalOpen}
                    onOpenChange={setQrModalOpen}
                    codigoResgate={resgateAtual.codigoResgate}
                    vantagemNome={resgateAtual.vantagemNome}
                    onConfirm={confirmarValidacao}
                />
            )}
        </div>
    )
}
