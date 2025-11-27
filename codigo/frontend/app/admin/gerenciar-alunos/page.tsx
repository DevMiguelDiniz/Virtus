"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/headers/header"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GerenciarMoedasModal } from "@/components/admin/gerenciar-moedas-modal"
import { adminService } from "@/shared/services/admin.service"
import { loginService } from "@/shared/services/login.service"
import { Loader2, Search, Users, Settings } from "lucide-react"
import type { UsuarioListItem } from "@/shared/interfaces/admin.interface"

export default function GerenciarAlunosPage() {
    const router = useRouter()
    const [alunos, setAlunos] = useState<UsuarioListItem[]>([])
    const [alunoSelecionado, setAlunoSelecionado] = useState<UsuarioListItem | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                const userData = loginService.getUserData()

                if (!userData) {
                    router.push('/login')
                    return
                }

                if (userData.tipo !== 'ADMIN') {
                    router.push('/home')
                    return
                }

                const alunosData = await adminService.listarAlunos()
                setAlunos(alunosData)
                setIsLoading(false)
            } catch (err) {
                console.error('Erro ao carregar alunos:', err)
                setError('Erro ao carregar dados. Tente novamente.')
                setIsLoading(false)
            }
        }

        loadData()
    }, [router])

    const handleSelectAluno = (aluno: UsuarioListItem) => {
        setAlunoSelecionado(aluno)
        setIsModalOpen(true)
        setError(null)
        setSuccessMessage(null)
    }

    const handleConfirmOperation = async (valor: number, motivo: string, operacao: 'adicionar' | 'remover') => {
        if (!alunoSelecionado) return

        try {
            let mensagem: string

            if (operacao === 'adicionar') {
                mensagem = await adminService.adicionarMoedasAluno({
                    usuarioId: alunoSelecionado.id,
                    valor,
                    motivo
                })
            } else {
                mensagem = await adminService.removerMoedasAluno({
                    usuarioId: alunoSelecionado.id,
                    valor,
                    motivo
                })
            }

            // Atualizar lista local
            setAlunos(prev => prev.map(aluno =>
                aluno.id === alunoSelecionado.id
                    ? {
                        ...aluno,
                        saldoMoedas: operacao === 'adicionar'
                            ? aluno.saldoMoedas + valor
                            : aluno.saldoMoedas - valor
                    }
                    : aluno
            ))

            setSuccessMessage(mensagem)
            setTimeout(() => setSuccessMessage(null), 5000)
        } catch (err: any) {
            throw err
        }
    }

    const alunosFiltrados = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aluno.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-8 h-8 text-[#268c90]" />
                            <h1 className="text-3xl font-semibold text-foreground">
                                Gerenciar Alunos
                            </h1>
                        </div>
                        <p className="text-muted-foreground">
                            Adicione ou remova moedas das contas dos alunos
                        </p>
                    </div>

                    {/* Mensagens */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-md">
                            {successMessage}
                        </div>
                    )}

                    {/* Barra de Busca */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Buscar por nome ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Lista de Alunos */}
                    <Card className="overflow-hidden">
                        <div className="divide-y divide-border">
                            {alunosFiltrados.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Nenhum aluno encontrado</h3>
                                    <p className="text-muted-foreground text-sm">
                                        {searchTerm ? "Tente ajustar sua busca" : "Não há alunos cadastrados no sistema"}
                                    </p>
                                </div>
                            ) : (
                                alunosFiltrados.map((aluno) => (
                                    <div
                                        key={aluno.id}
                                        className="p-6 hover:bg-muted/30 transition-colors flex items-center justify-between"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-foreground mb-1">
                                                {aluno.nome}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {aluno.email}
                                            </p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="text-sm font-medium text-[#268c90]">
                                                    Saldo: {aluno.saldoMoedas} moedas
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleSelectAluno(aluno)}
                                            className="bg-[#268c90] hover:bg-[#155457] text-white"
                                        >
                                            <Settings className="w-4 h-4 mr-2" />
                                            Gerenciar
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                <GerenciarMoedasModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setAlunoSelecionado(null)
                    }}
                    usuario={alunoSelecionado}
                    onConfirm={handleConfirmOperation}
                />
            </main>
        </div>
    )
}
