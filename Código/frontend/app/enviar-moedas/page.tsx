"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/headers/header"
import { CoinSenderHeader } from "@/components/headers/coin-sender-header"
import { StudentList } from "@/components/student-list"
import { TransferModal } from "@/components/transfer-modal"
import type { Student } from "@/shared/interfaces/coin-sender.interface"
import { transacaoService } from "@/shared/services/transacao.service"
import { loginService } from "@/shared/services/login.service"
import { Loader2 } from "lucide-react"
import type { AlunoResponse } from "@/shared/interfaces/transacao.interface"

export default function CoinSenderPage() {
    const router = useRouter()
    const [students, setStudents] = useState<Student[]>([])
    const [professorBalance, setProfessorBalance] = useState(0)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isTransferring, setIsTransferring] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const loadData = async () => {
        setIsLoading(true)
        try {
            const userData = loginService.getUserData()

            if (!userData) {
                router.push('/login')
                return
            }

            if (userData.tipo !== 'PROFESSOR') {
                router.push('/home')
                return
            }

            // Buscar saldo do professor
            const saldo = await transacaoService.getSaldoProfessor(userData.id)
            setProfessorBalance(saldo)

            // Buscar lista de alunos das instituições do professor
            const alunosData = await transacaoService.getAlunosDasInstituicoes(userData.id)

            // Mapear para o formato Student
            const alunosFormatados: Student[] = alunosData.map((aluno: AlunoResponse) => ({
                id: aluno.id,
                nome: aluno.nome,
                email: aluno.email,
                cpf: aluno.cpf,
                curso: "Não informado", // Backend não retorna curso
                instituicao: "N/A",
                saldoMoedas: aluno.saldoMoedas
            }))

            setStudents(alunosFormatados)
            setIsLoading(false)
        } catch (err) {
            console.error('Erro ao carregar dados:', err)
            setError('Erro ao carregar dados. Tente novamente.')
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])

    const handleSelectStudent = (student: Student) => {
        setSelectedStudent(student)
        setIsModalOpen(true)
    }

    const handleTransfer = async (amount: number, description: string) => {
        if (isTransferring) {
            return
        }

        if (!selectedStudent || amount > professorBalance) {
            return
        }

        setIsTransferring(true)
        setError(null)

        try {
            const userData = loginService.getUserData()
            if (!userData) {
                router.push('/login')
                return
            }

            await transacaoService.enviarMoedas(userData.id, {
                alunoId: selectedStudent.id,
                valor: amount,
                motivo: description
            })

            setProfessorBalance(prev => prev - amount)

            setStudents(prev => prev.map(student =>
                student.id === selectedStudent.id
                    ? { ...student, saldoMoedas: student.saldoMoedas + amount }
                    : student
            ))

            setIsModalOpen(false)
            setSelectedStudent(null)
        } catch (err: any) {
            console.error('Erro ao transferir moedas:', err)
            setError(err.message || 'Erro ao transferir moedas. Tente novamente.')
        } finally {
            setIsTransferring(false)
        }
    }

    const filteredStudents = students.filter(student =>
        student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.curso.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
                {error && (
                    <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md">
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-between gap-4">
                    <CoinSenderHeader
                        professorBalance={professorBalance}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                    />

                    {/*<div>*/}
                    {/*    <button*/}
                    {/*        className="ml-2 inline-flex items-center px-4 py-2 bg-[#268c90] text-white rounded-md hover:opacity-90"*/}
                    {/*        onClick={() => setIsQRModalOpen(true)}*/}
                    {/*    >*/}
                    {/*        Pagar por QR / Código / Link*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                </div>

                <StudentList
                    students={filteredStudents}
                    onSelectStudent={handleSelectStudent}
                />

                <TransferModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setSelectedStudent(null)
                    }}
                    student={selectedStudent}
                    professorBalance={professorBalance}
                    onTransfer={handleTransfer}
                    isTransferring={isTransferring}
                />
            </main>
        </div>
    )
}