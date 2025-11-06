"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Mail, Lock, Loader2, CheckCircle, ArrowLeft } from "lucide-react"
import { loginService } from "@/shared/services/login.service"
import type { AuthError } from "@/shared/interfaces/login.interface"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image";

export function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const registered = searchParams.get('registered')

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const response = await loginService.login(email, password)

            console.log("Login realizado com sucesso:", response)

            // Redirecionar para /home após login
            router.push('/home')

        } catch (err) {
            const authError = err as AuthError

            if (authError.status === 401) {
                setError("Email ou senha incorretos")
            } else if (authError.status === 0) {
                setError("Não foi possível conectar ao servidor. Tente novamente.")
            } else {
                setError(authError.message || "Erro ao realizar login. Tente novamente.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md p-6 border-border">
            <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Voltar à página inicial</span>
            </Link>
            <div className="flex items-center justify-center w-40 h-40 rounded-2xl mb-6 mx-auto">
                <Image
                    src="/logo-virtus.png"
                    alt="Virtus Logo"
                    width={200}
                    height={100}
                    className="h-40 w-auto object-contain"
                    priority
                />
            </div>

            <div className="text-center mb-8">
                <h2 className="font-heading font-bold text-3xl mb-2 text-foreground">Bem-vindo de volta</h2>
                <p className="text-muted-foreground">Entre com suas credenciais para acessar sua conta</p>
            </div>

            {registered && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-green-800 text-sm font-medium">Cadastro realizado com sucesso!</p>
                        <p className="text-green-700 text-xs mt-1">Faça login para acessar sua conta.</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                        Email
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="Entre com o seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12 text-black placeholder:text-gray-500"
                            disabled={isLoading}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium">
                        Senha
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="Entre a sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 h-12 text-black placeholder:text-gray-500"
                            disabled={isLoading}
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[#268c90] hover:bg-[#155457] text-white font-medium text-base"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Entrando...
                        </>
                    ) : (
                        "Entrar"
                    )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Não tem uma conta?{" "}
                    <Link href="/cadastro" className="text-[#268c90] hover:text-[#155457] font-medium">
                        Cadastre-se
                    </Link>
                </p>
            </form>
        </Card>
    )
}