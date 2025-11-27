import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Coins, ArrowRight } from "lucide-react"
import Image from "next/image";

interface HeroSectionProps {
    isAuthenticated?: boolean
}

export function HeroSection({ isAuthenticated = false }: HeroSectionProps) {
    return (
        <section className="container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-40 h-40 rounded-2xl mb-6">
                    <Image
                        src="/logo-virtus.png"
                        alt="Virtus Logo"
                        width={200}
                        height={100}
                        className="h-40 w-auto"
                        priority
                    />
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#268c90] to-[#6ed3d8] bg-clip-text text-transparent">
                    Sistema de Moeda Estudantil
                </h1>

                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    {isAuthenticated
                        ? "Bem-vindo de volta! Gerencie suas moedas, resgate vantagens e acompanhe seu progresso acadêmico."
                        : "Reconheça e recompense o mérito acadêmico. Alunos ganham moedas por bom desempenho e trocam por vantagens exclusivas."
                    }
                </p>

                {!isAuthenticated && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/cadastro">
                            <Button size="lg" className="bg-[#268c90] hover:bg-[#155457] text-white">
                                Começar Agora
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline">
                                Fazer Login
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}