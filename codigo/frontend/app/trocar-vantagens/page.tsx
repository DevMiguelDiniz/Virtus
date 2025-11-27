"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/headers/header"
import { AdvantageStudent } from "@/components/advantage-student"
import { Input } from "@/components/ui/input"
import { ConfirmResgateDialog } from "@/components/confirm-resgate-dialog"
import { vantagemService } from "@/shared/services/vantagem.service"
import { loginService } from "@/shared/services/login.service"
import { transacaoService } from "@/shared/services/transacao.service"
import type { VantagemResponse } from "@/shared/interfaces/vantagem.interface"
import { Loader2, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function VantagensAlunoPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [vantagens, setVantagens] = useState<VantagemResponse[]>([])
    const [vantagensFiltradas, setVantagensFiltradas] = useState<VantagemResponse[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [saldoAtual, setSaldoAtual] = useState<number>(0)
    const [selectedVantagem, setSelectedVantagem] = useState<VantagemResponse | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect(() => {
        const loadVantagens = async () => {
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

                // Carregar vantagens e saldo em paralelo
                const [vantagensData, saldo] = await Promise.all([
                    vantagemService.listarTodas(),
                    transacaoService.getSaldoAluno(userData.id)
                ])

                setVantagens(vantagensData)
                setVantagensFiltradas(vantagensData)
                setSaldoAtual(saldo)
                setIsLoading(false)
            } catch (err) {
                console.error('Erro ao carregar vantagens:', err)
                setError('Erro ao carregar vantagens. Tente novamente.')
                setIsLoading(false)
            }
        }

        loadVantagens()
    }, [router])

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setVantagensFiltradas(vantagens)
        } else {
            const filtered = vantagens.filter(vantagem =>
                vantagem.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vantagem.descricao.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setVantagensFiltradas(filtered)
        }
    }, [searchTerm, vantagens])

    const handleResgatar = (vantagem: VantagemResponse) => {
        setSelectedVantagem(vantagem)
        setDialogOpen(true)
    }

    const handleConfirmResgate = async (vantagem: VantagemResponse) => {
        try {
            const userData = loginService.getUserData()
            if (!userData) {
                router.push('/login')
                return
            }

            await vantagemService.trocarVantagem(userData.id, vantagem.id)

            setDialogOpen(false)

            toast({
                title: "Resgate realizado com sucesso!",
                description: "Você será redirecionado para ver seu código de resgate.",
                variant: "default",
            })

            // Redirecionar para a página de resgates após sucesso
            setTimeout(() => {
                router.push('/meus-resgates')
            }, 1500)
        } catch (err: any) {
            console.error('Erro ao resgatar vantagem:', err)

            setDialogOpen(false)

            toast({
                title: "Erro ao resgatar vantagem",
                description: err.message || 'Erro ao resgatar vantagem. Tente novamente.',
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
                                Vantagens Disponiveis
                            </h1>
                            <p className="text-muted-foreground">
                                Confira as vantagens disponiveis para resgate
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Buscar vantagens por nome ou descricao..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-12"
                        />
                    </div>

                    <AdvantageStudent
                        vantagens={vantagensFiltradas}
                        onSelectVantagem={handleResgatar}
                        emptyMessage={
                            searchTerm
                                ? "Nenhuma vantagem encontrada com esse termo"
                                : "Nenhuma vantagem disponivel no momento"
                        }
                    />
                </div>
            </main>

            <ConfirmResgateDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                vantagem={selectedVantagem}
                saldoAtual={saldoAtual}
                onConfirm={handleConfirmResgate}
            />
        </div>
    )
}
