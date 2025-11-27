import { Header } from "@/components/headers/header"
import { RegisterForm } from "@/components/forms/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <RegisterForm />
      </main>
    </div>
  )
}
