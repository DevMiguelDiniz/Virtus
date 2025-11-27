"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, Calendar, FileText, Loader2 } from "lucide-react"
import { transacaoService } from "@/shared/services/transacao.service"
import { loginService } from "@/shared/services/login.service"
import type { Transacao } from "@/shared/interfaces/transacao.interface"

interface Transaction {
    id: number
    tipo: "ENVIADA" | "RECEBIDA"
    valor: number
    descricao: string
    data: string
    nomeContato: string // Nome do aluno (para professor) ou professor (para aluno)
}

interface ExtratoContentProps {
    userType: string
}

export function ExtratoContent({ userType }: ExtratoContentProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const hasLoadedRef = useRef(false)

    useEffect(() => {
        if (hasLoadedRef.current) {
            return
        }
        hasLoadedRef.current = true

        const loadTransactions = async () => {
            try {
                const userData = loginService.getUserData()
                if (!userData) {
                    setError('Usuário não autenticado')
                    setIsLoading(false)
                    return
                }

                let transacoesData: Transacao[] = []

                if (userType === "PROFESSOR") {
                    transacoesData = await transacaoService.getExtratoProfessor(userData.id)
                } else if (userType === "ALUNO") {
                    transacoesData = await transacaoService.getExtratoAluno(userData.id)
                }

                const transacoesFormatadas: Transaction[] = transacoesData.map((t: Transacao) => ({
                    id: t.id,
                    tipo: userType === "PROFESSOR" ? "ENVIADA" : "RECEBIDA",
                    valor: t.valor,
                    descricao: t.motivo,
                    data: t.dataHora,
                    nomeContato: userType === "PROFESSOR" ? t.alunoNome : t.professorNome
                }))

                const unicosPorId = Array.from(
                    new Map(transacoesFormatadas.map((t) => [t.id, t])).values()
                )

                setTransactions(unicosPorId)
                setIsLoading(false)
            } catch (err) {
                console.error('Erro ao carregar extrato:', err)
                setError('Erro ao carregar extrato. Tente novamente.')
                setIsLoading(false)
            }
        }

        loadTransactions()

        return () => {
            hasLoadedRef.current = false
        }
    }, [userType])

    const totalTransferido = transactions.reduce((acc, t) => acc + t.valor, 0)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#268c90]" />
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md">
                    {error}
                </div>
            )}
            {/* Header com Total ao lado */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-foreground mb-2">Extrato de Transações</h1>
                    <p className="text-muted-foreground font-normal">
                        {userType === "PROFESSOR"
                            ? "Histórico completo de moedas enviadas aos alunos"
                            : "Histórico completo de moedas recebidas dos professores"
                        }
                    </p>
                </div>
            </div>

            {/* Lista de Transações */}
            <Card className="overflow-hidden rounded">
                <div className="divide-y divide-border">
                    {transactions.length === 0 ? (
                        <div className="p-12 text-center">
                            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Nenhuma transação encontrada</h3>
                            <p className="text-muted-foreground text-sm font-normal">
                                {userType === "PROFESSOR"
                                    ? "Você ainda não enviou moedas para nenhum aluno"
                                    : "Você ainda não recebeu moedas de nenhum professor"
                                }
                            </p>
                        </div>
                    ) : (
                        transactions.map((transaction, index) => (
                            <div
                                key={transaction.id}
                                className={`p-6 hover:bg-muted/30 transition-colors ${
                                    index === 0 ? 'bg-muted/20' : ''
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Ícone */}
                                    <div className={`w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 ${
                                        transaction.tipo === "ENVIADA"
                                            ? "bg-white dark:bg-white"
                                            : "bg-white dark:bg-white"
                                    }`}>
                                        {transaction.tipo === "ENVIADA" ? (
                                            <ArrowUpRight className="w-6 h-6 text-red-600 dark:text-red-400" />
                                        ) : (
                                            <ArrowDownLeft className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        )}
                                    </div>

                                    {/* Informações da Transação */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-foreground">
                                                        {transaction.tipo === "ENVIADA" ? "Enviado para" : "Recebido de"}:
                                                    </span>
                                                    <span className="text-foreground font-normal">
                                                        {transaction.nomeContato}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                                                    {transaction.descricao}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className={`text-2xl font-semibold ${
                                                    transaction.tipo === "ENVIADA"
                                                        ? "text-red-600 dark:text-red-400"
                                                        : "text-green-600 dark:text-green-400"
                                                }`}>
                                                    {transaction.tipo === "ENVIADA" ? "-" : "+"}{transaction.valor}
                                                </p>
                                                <p className="text-xs text-muted-foreground font-normal">moedas</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-normal">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{formatDate(transaction.data)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    )
}