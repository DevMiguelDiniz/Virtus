"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/headers/header"
import { EditarForm } from "@/components/forms/editar-form"
import { loginService } from "@/shared/services/login.service"
import { edicaoService } from "@/shared/services/edicao.service"
import type { UserData } from "@/shared/interfaces/login.interface"
import type { AlunoUpdateResponse, EmpresaUpdateResponse, ApiError } from "@/shared/interfaces/edicao.interface"
import { Loader2, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PerfilPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [userData, setUserData] = useState<UserData | null>(null)
    const [profileData, setProfileData] = useState<AlunoUpdateResponse | EmpresaUpdateResponse | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadUserData = async () => {
            const user = loginService.getUserData()

            if (!user) {
                router.push('/login')
                return
            }

            setUserData(user)

            try {
                if (user.tipo === 'ALUNO') {
                    const alunoData = await edicaoService.buscarAluno(user.id)
                    setProfileData(alunoData)
                } else if (user.tipo === 'EMPRESA') {
                    const empresaData = await edicaoService.buscarEmpresa(user.id)
                    setProfileData(empresaData)
                }
            } catch (err) {
                const apiError = err as ApiError
                setError(apiError.message)

                if (apiError.status === 401) {
                    router.push('/login')
                }
            } finally {
                setIsLoading(false)
            }
        }

        loadUserData()
    }, [router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#268c90]" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-16 flex items-center justify-center">
                    <Card className="w-full max-w-md p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h2 className="text-lg font-semibold text-foreground mb-1">
                                    Erro ao carregar perfil
                                </h2>
                                <p className="text-sm text-muted-foreground">{error}</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => router.push('/home')}
                            className="w-full bg-[#268c90] hover:bg-[#155457]"
                        >
                            Voltar para Home
                        </Button>
                    </Card>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-16 flex items-center justify-center">
                {userData && profileData && (
                    <EditarForm userData={userData} profileData={profileData} />
                )}
            </main>
        </div>
    )
}