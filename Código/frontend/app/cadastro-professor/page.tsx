import { Header } from "@/components/headers/header"
import { RegisterProfessorForm } from "@/components/forms/register-professor-form"

export default function RegisterProfessorPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <RegisterProfessorForm />
      </main>
    </div>
  )
}
