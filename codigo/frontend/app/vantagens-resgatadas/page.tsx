"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/headers/header"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { vantagemService } from "@/shared/services/vantagem.service"
import { loginService } from "@/shared/services/login.service"
import type { ResgateVantagemResponse } from "@/shared/interfaces/vantagem.interface"
import { Loader2, Search, CheckCircle2, Calendar, Coins, Ticket, ImageIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function VantagensResgatadasPage() {
    const router = useRouter()
    const [resgates, setResgates] = useState<ResgateVantagemResponse[]>([])
    const [resgatesFiltrados, setResgatesFiltrados] = useState<ResgateVantagemResponse[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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
                // Filtrar apenas os resgates utilizados
                const resgatesUtilizados = resgatesData.filter(r => r.utilizado)
                setResgates(resgatesUtilizados)
                setResgatesFiltrados(resgatesUtilizados)
                setIsLoading(false)
            } catch (err) {
                console.error('Erro ao carregar vantagens resgatadas:', err)
                setError('Erro ao carregar vantagens resgatadas. Tente novamente.')
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
                                Vantagens Resgatadas
                            </h1>
                            <p className="text-muted-foreground">
                                Histórico de todas as vantagens que você já utilizou
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
                            <CheckCircle2 className="w-16 h-16 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                {searchTerm
                                    ? "Nenhuma vantagem resgatada encontrada"
                                    : "Você ainda não utilizou nenhuma vantagem"}
                            </h3>
                            <p className="text-muted-foreground">
                                {searchTerm
                                    ? "Tente buscar por outro termo"
                                    : "Valide seus códigos de resgate para vê-los aqui"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {resgatesFiltrados.map((resgate) => (
                                <Card key={resgate.id} className="overflow-hidden hover:shadow-lg transition-shadow border-[#268c90] dark:border-[#268c90]">
                                    {/* Imagem da Vantagem */}
                                    {resgate.vantagemUrlFoto ? (
                                        <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800">
                                            <Image
                                                src={resgate.vantagemUrlFoto}
                                                alt={resgate.vantagemNome}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-48 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-950/30 dark:to-green-900/30 flex items-center justify-center">
                                            <ImageIcon className="w-16 h-16 text-green-300 dark:text-green-700" />
                                        </div>
                                    )}

                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-lg">
                                                {resgate.vantagemNome}
                                            </CardTitle>
                                            <Badge variant="outline" className="bg-white dark:bg-[#268c90]/20 text-[#268c90] dark:text-[#268c90] border-[#268c90] dark:border-[#268c90]">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Utilizado
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2 pt-4">
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
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
