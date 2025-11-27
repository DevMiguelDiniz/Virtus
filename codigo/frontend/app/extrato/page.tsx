"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/headers/header"
import { ExtratoContent } from "@/components/extrato-content"
import { loginService } from "@/shared/services/login.service"
import type { UserData } from "@/shared/interfaces/login.interface"
import { Loader2 } from "lucide-react"

export default function ExtratoPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [userData, setUserData] = useState<UserData | null>(null)

    useEffect(() => {
        const user = loginService.getUserData()

        if (!user) {
            router.push('/login')
        } else {
            setUserData(user)
            setIsLoading(false)
        }
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
            <main className="container mx-auto px-4 py-8">
                <ExtratoContent userType={userData?.tipo || 'ALUNO'} />
            </main>
        </div>
    )
}