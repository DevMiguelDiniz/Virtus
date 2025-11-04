import {useEffect, useState} from "react";
import {UserData} from "@/shared/interfaces/login.interface";
import {loginService} from "@/shared/services/login.service";
import Link from "next/link";
import {Card} from "@/components/ui/card";
import {ArrowRight, DollarSign, ListChecks, Plus, User} from "lucide-react";
import {Button} from "@/components/ui/button";

export function EmpresaDashboard(){
    const [empresa, setEmpresa] = useState<UserData | null>(null);

    useEffect(() => {
        const userData = loginService.getUserData()
        if (userData && userData.tipo === 'EMPRESA') {
            setEmpresa(userData);
        }
    }, []);

    return (
        <section className='container mx-auto px-4 py-20'>
            <div className='max-w-6xl mx-auto'>
                <div className='text-center mb-12'>
                    <h1 className='text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#268c90] to-[#6ed3d8] bg-clip-text text-transparent'>
                        Bem-vindo, {empresa?.nome}
                    </h1>
                    <p className='text-xl text-muted-foreground'>
                        Cadastre e gerencie vantagens exclusivas para alunos das melhores instituições de ensino do país
                    </p>
                </div>
            </div>

            <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
                <Link href="/cadastro-vantagens" className='block group'>
                    <Card className='p-8 hover:shadow-2xl transition-all duration-300 border-2 border-[#268c90] bg-gradient-to-br from-[#268c90]/5 to-[#6ed3d8]/5 h-full'>
                        <div className='flex flex-col items-center text-center'>
                            <div
                                className='w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-[#268c90]'
                            >
                                <Plus className='w-10 h-10 text-white' />
                            </div>
                            <h3 className="font-heading font-semibold text-2xl mb-4 text-foreground">
                                Cadastrar Vantagens
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                Utilize suas moedas acadêmicas para desbloquear benefícios exclusivos e recompensas
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


                <Link href="/listar-vantagens" className='block group'>
                    <Card className='p-8 hover:shadow-2xl transition-all duration-300 border-2 border-[#268c90] bg-gradient-to-br from-[#268c90]/5 to-[#6ed3d8]/5 h-full'>
                        <div className='flex flex-col items-center text-center'>
                            <div
                                className='w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-[#268c90]'
                            >
                                <ListChecks className='w-10 h-10 text-white' />
                            </div>
                            <h3 className="font-heading font-semibold text-2xl mb-4 text-foreground">
                                Ver Vantagens
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                Acompanhe todas as suas transações de moedas acadêmicas em um só lugar
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


                <Link href="/perfil" className='block group'>
                    <Card className='p-8 hover:shadow-2xl transition-all duration-300 border-2 border-[#268c90] bg-gradient-to-br from-[#268c90]/5 to-[#6ed3d8]/5 h-full'>
                        <div className='flex flex-col items-center text-center'>
                            <div
                                className='w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-[#268c90]'
                            >
                                <User className='w-10 h-10 text-white' />
                            </div>
                            <h3 className="font-heading font-semibold text-2xl mb-4 text-foreground">
                                Editar Perfil
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                Atualize suas informações pessoais e gerencie os dados do seu perfil acadêmico
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

            <div className="mt-12 max-w-4xl mx-auto">
                <Card className="p-6 bg-gradient-to-r from-[#268c90]/10 to-[#6ed3d8]/10 border-[#268c90]/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#268c90] flex items-center justify-center">
                            <DollarSign className="w-16 h-8 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-1">Como funciona?</h4>
                            <p className="text-muted-foreground">
                                As vantagens cadastradas por sua empresa estarão disponíveis para resgate pelos alunos utilizando suas moedas acadêmicas. Isso permite que você ofereça benefícios exclusivos, aumentando a visibilidade da sua marca entre a comunidade estudantil e incentivando o engajamento dos alunos com sua empresa.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    )
}