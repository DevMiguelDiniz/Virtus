"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {Coins, ArrowRight, Send, History, DollarSign, User, FileSpreadsheet, Loader2} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { loginService } from "@/shared/services/login.service"
import type { UserData } from "@/shared/interfaces/login.interface"
import { transacaoService } from "@/shared/services/transacao.service"

export function ProfessorDashboard() {
    const [professor, setProfessor] = useState<UserData | null>(null)
    const [saldo, setSaldo] = useState<number | null>(null)
    const [isLoadingSaldo, setIsLoadingSaldo] = useState(true)

    useEffect(() => {
        const userData = loginService.getUserData()
        if (userData && userData.tipo === 'PROFESSOR') {
            setProfessor(userData)
            loadSaldo(userData.id)
        }
    }, [])

    const loadSaldo = async (professorId: number) => {
        try {
            const saldoAtual = await transacaoService.getSaldoProfessor(professorId)
            setSaldo(saldoAtual)
        } catch (error) {
            console.error('Erro ao carregar saldo:', error)
        } finally {
            setIsLoadingSaldo(false)
        }
    }

    return (
        <section className="container mx-auto px-4 py-20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#268c90] to-[#6ed3d8] bg-clip-text text-transparent">
                        Bem-vindo, {professor?.nome}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Reconheça e recompense seus alunos com moedas acadêmicas
                    </p>
                </div>

                {/* Card de Saldo */}
                <div className="mb-8 max-w-md mx-auto">
                    <Card className="p-6 bg-gradient-to-br from-[#268c90] to-[#155457] text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90 mb-1">Saldo Disponível</p>
                                {isLoadingSaldo ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="text-2xl font-bold">Carregando...</span>
                                    </div>
                                ) : (
                                    <p className="text-4xl font-bold">{saldo ?? 0} moedas</p>
                                )}
                            </div>
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                                <Coins className="w-8 h-8" />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Card principal - Transferir Moedas */}
                    <Link href="/enviar-moedas" className="block group">
                        <Card className="p-8 hover:shadow-2xl transition-all duration-300 border-2 border-[#268c90] bg-gradient-to-br from-[#268c90]/5 to-[#6ed3d8]/5 h-full">
                            <div className="flex flex-col items-center text-center">
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-[#268c90]"
                                >
                                    <Send className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="font-heading font-semibold text-3xl mb-4 text-foreground">
                                    Transferir Moedas
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Envie moedas para seus alunos como reconhecimento pelo desempenho acadêmico excepcional
                                </p>
                                <Button
                                    size="lg"
                                    className="bg-[#268c90] hover:bg-[#155457] text-white group-hover:gap-3 transition-all"
                                >
                                    Acessar
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </Card>
                    </Link>

                    {/* Card secundário - Histórico de Transações */}
                        <Link href="/extrato" className="block group">
                            <Card className="p-8 hover:shadow-2xl transition-all duration-300 border-2 border-[#268c90] bg-gradient-to-br from-[#268c90]/5 to-[#6ed3d8]/5 h-full">
                                <div className="flex flex-col items-center text-center">
                                    <div
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-[#268c90]"
                                    >
                                        <FileSpreadsheet className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="font-heading font-semibold text-3xl mb-4 text-foreground">
                                        Visualizar Extrato
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        Clique aqui para visualizar o histórico completo de transações de moedas acadêmicas enviadas para alunos
                                    </p>
                                    <Button
                                        size="lg"
                                        className="bg-[#268c90] hover:bg-[#155457] text-white group-hover:gap-3 transition-all"
                                    >
                                        Acessar
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </Card>
                        </Link>
                </div>

                {/* Informações adicionais */}
                <div className="mt-12 max-w-4xl mx-auto">
                    <Card className="p-6 bg-gradient-to-r from-[#268c90]/10 to-[#6ed3d8]/10 border-[#268c90]/20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#268c90] flex items-center justify-center">
                                <DollarSign className="w-16 h-8 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-1">Como funciona?</h4>
                                <p className="text-muted-foreground">
                                    Selecione um aluno, defina a quantidade de moedas e adicione uma descrição para o reconhecimento.
                                    As moedas serão transferidas instantaneamente e o aluno poderá utilizá-las para resgatar vantagens.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    )
}