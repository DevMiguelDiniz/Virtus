"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/headers/header"
import { AdvantageForm } from "@/components/forms/advantage-form"
import { loginService } from "@/shared/services/login.service"
import { Loader2 } from "lucide-react"

export default function CadastroVantagensPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [empresaId, setEmpresaId] = useState<number | null>(null)

    useEffect(() => {
        const checkAuth = () => {
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
            setIsLoading(false)
        }

        checkAuth()
    }, [router])

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
            <main className="container mx-auto px-4 py-16 flex items-center justify-center">
                {empresaId && <AdvantageForm empresaId={empresaId} />}
            </main>
        </div>
    )
}
