"use client"

import { useEffect, useState } from "react";
import { UserData } from "@/shared/interfaces/login.interface";
import { loginService } from "@/shared/services/login.service";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, UserCog, Shield, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminDashboard() {
    const [admin, setAdmin] = useState<UserData | null>(null);

    useEffect(() => {
        const userData = loginService.getUserData();
        if (userData && userData.tipo === 'ADMIN') {
            setAdmin(userData);
        }
    }, []);

    return (
        <section className='container mx-auto px-4 py-20'>
            <div className='max-w-6xl mx-auto'>
                <div className='text-center mb-12'>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Shield className="w-12 h-12 text-[#268c90]" />
                        <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#268c90] to-[#6ed3d8] bg-clip-text text-transparent'>
                            Painel Administrativo
                        </h1>
                    </div>
                    <p className='text-xl text-muted-foreground'>
                        Bem-vindo, {admin?.nome}
                    </p>
                    <p className='text-sm text-muted-foreground mt-2'>
                        Gerencie moedas de alunos e professores do sistema
                    </p>
                </div>
            </div>

            <div className='grid md:grid-cols-2 gap-8 max-w-6xl mx-auto'>
                {/* Card - Gerenciar Alunos */}
                <Link href="/admin/gerenciar-alunos" className='block group'>
                    <Card className='p-8 hover:shadow-2xl transition-all duration-300 border-2 border-[#268c90] bg-gradient-to-br from-[#268c90]/5 to-[#6ed3d8]/5 h-full'>
                        <div className='flex flex-col items-center text-center'>
                            <div
                                className='w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-[#268c90]'
                            >
                                <Users className='w-10 h-10 text-white' />
                            </div>
                            <h3 className="font-heading font-semibold text-3xl mb-4 text-foreground">
                                Gerenciar Alunos
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                Adicione ou remova moedas das contas de alunos cadastrados no sistema
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

                {/* Card - Gerenciar Professores */}
                <Link href="/admin/gerenciar-professores" className='block group'>
                    <Card className='p-8 hover:shadow-2xl transition-all duration-300 border-2 border-[#268c90] bg-gradient-to-br from-[#268c90]/5 to-[#6ed3d8]/5 h-full'>
                        <div className='flex flex-col items-center text-center'>
                            <div
                                className='w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-[#268c90]'
                            >
                                <UserCog className='w-10 h-10 text-white' />
                            </div>
                            <h3 className="font-heading font-semibold text-3xl mb-4 text-foreground">
                                Gerenciar Professores
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                Adicione ou remova moedas das contas de professores cadastrados no sistema
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
                            <h4 className="font-semibold text-lg mb-1">Gerenciamento de Moedas</h4>
                            <p className="text-muted-foreground">
                                Como administrador, você tem controle total sobre o sistema de moedas virtuais.
                                Você pode adicionar ou remover moedas de qualquer usuário, seja aluno ou professor.
                                Todas as operações são registradas para fins de auditoria.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    )
}
