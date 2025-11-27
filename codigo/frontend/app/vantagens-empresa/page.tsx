"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/headers/header"
import { AdvantageCompany } from "@/components/advantage-company"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { vantagemService } from "@/shared/services/vantagem.service"
import { loginService } from "@/shared/services/login.service"
import { useToast } from "@/components/ui/use-toast"
import type { VantagemResponse } from "@/shared/interfaces/vantagem.interface"
import { Loader2, Plus, Search } from "lucide-react"

export default function ListarVantagensPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [vantagens, setVantagens] = useState<VantagemResponse[]>([])
    const [vantagensFiltradas, setVantagensFiltradas] = useState<VantagemResponse[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [empresaId, setEmpresaId] = useState<number | null>(null)

    useEffect(() => {
        const loadVantagens = async () => {
            try {
                const userData = loginService.getUserData()

                if (!userData) {
                    router.push('/login')
                    return
                }

                if (userData.tipo !== 'EMPRESA') {
                    router.push('/home')
                    return
                }

                setEmpresaId(userData.id)

                const vantagensData = await vantagemService.listarVantagensPorEmpresa(userData.id)
                setVantagens(vantagensData)
                setVantagensFiltradas(vantagensData)
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

    const handleDelete = async (vantagemId: number) => {
        if (!empresaId) return

        try {
            await vantagemService.excluirVantagem(empresaId, vantagemId)

            // Atualiza a lista removendo a vantagem excluída
            const novasVantagens = vantagens.filter(v => v.id !== vantagemId)
            setVantagens(novasVantagens)
            setVantagensFiltradas(novasVantagens)

            toast({
                title: "Vantagem excluída",
                description: "A vantagem foi excluída com sucesso.",
                variant: "default",
            })
        } catch (err) {
            console.error('Erro ao excluir vantagem:', err)

            toast({
                title: "Erro ao excluir vantagem",
                description: "Não foi possível excluir a vantagem. Tente novamente.",
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
                                Vantagens Cadastradas
                            </h1>
                            <p className="text-muted-foreground">
                                Gerencie as vantagens cadastradas pela sua empresa
                            </p>
                        </div>
                        <Button
                            onClick={() => router.push('/cadastro-vantagens')}
                            className="bg-[#268c90] hover:bg-[#155457] text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Vantagem
                        </Button>
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

                    <AdvantageCompany
                        vantagens={vantagensFiltradas}
                        emptyMessage={
                            searchTerm
                                ? "Nenhuma vantagem encontrada com esse termo"
                                : "Voce ainda nao cadastrou vantagens"
                        }
                        isCompanyOwner={true}
                        onDelete={handleDelete}
                    />
                </div>
            </main>
        </div>
    )
}
