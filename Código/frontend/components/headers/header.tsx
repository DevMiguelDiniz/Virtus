"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Coins, Menu, X, LogOut } from "lucide-react"
import { loginService } from "@/shared/services/login.service"
import type { UserData } from "@/shared/interfaces/login.interface"
import { useRouter, usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [user, setUser] = useState<UserData | null>(null)

    useEffect(() => {
        const userData = loginService.getUserData()
        setUser(userData)
    }, [pathname]) // Atualiza quando a rota muda

    const handleLogout = () => {
        loginService.logout()
        setUser(null)
        window.location.href = "/"
    }

    return (
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-22">
                    <Link href={user ? "/home" : "/public"} className="flex items-center gap-2 font-heading font-bold text-xl text-foreground">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#268c90] to-[#6ed3d8] rounded-lg flex items-center justify-center">
                            <Coins className="w-5 h-5 text-white" />
                        </div>
                        Virtus
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        {user ? (
                            <>
                <span className="text-sm font-medium text-foreground">
                  Bem-vindo, <span className="text-[#268c90] dark:text-[#6ed3d8]">{user.nome}</span>
                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sair
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/cadastro">
                                    <Button size="sm" className="bg-[#268c90] hover:bg-[#155457] text-white">
                                        Cadastre-se
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-border">
                        <div className="flex flex-col gap-4">
                            <div className="px-2">
                                <ThemeToggle />
                            </div>
                            {user ? (
                                <>
                                    <div className="px-2 py-2">
                                        <p className="text-sm font-medium text-foreground">
                                            Bem-vindo, <span className="text-[#268c90] dark:text-[#6ed3d8]">{user.nome}</span>
                                        </p>
                                        {user.tipo === 'ALUNO' && user.saldoMoedas !== undefined && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Saldo: <span className="font-medium text-[#268c90] dark:text-[#6ed3d8]">{user.saldoMoedas} moedas</span>
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="justify-start text-muted-foreground hover:text-foreground"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Sair
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="ghost" size="sm" className="w-full justify-start">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/cadastro" onClick={() => setIsMenuOpen(false)}>
                                        <Button size="sm" className="w-full bg-[#268c90] hover:bg-[#155457] text-white">
                                            Cadastre-se
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    )
}