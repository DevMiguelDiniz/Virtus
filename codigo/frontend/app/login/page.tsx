import { Suspense } from "react"
import { Header } from "@/components/headers/header"
import { LoginForm } from "@/components/forms/login-form"
import { Loader2 } from "lucide-react"

function LoginFormWrapper() {
    return <LoginForm />
}

export default function LoginPage() {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
                <Suspense fallback={
                    <div className="flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#268c90]" />
                    </div>
                }>
                    <LoginFormWrapper />
                </Suspense>
            </main>
        </div>
    )
}