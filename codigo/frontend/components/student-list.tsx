import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, BookOpen, Coins, Send } from "lucide-react"
import type { Student } from "@/shared/interfaces/coin-sender.interface"

interface StudentListProps {
    students: Student[]
    onSelectStudent: (student: Student) => void
}

export function StudentList({ students, onSelectStudent }: StudentListProps) {
    if (students.length === 0) {
        return (
            <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                    <User className="w-16 h-16 text-muted-foreground" />
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Nenhum aluno encontrado</h3>
                        <p className="text-muted-foreground text-sm">
                            Tente ajustar os termos de busca
                        </p>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                    Alunos Cadastrados
                </h2>
                <span className="text-sm text-muted-foreground">
                    {students.length} {students.length === 1 ? 'aluno' : 'alunos'}
                </span>
            </div>

            <div className="grid gap-4">
                {students.map((student) => (
                    <Card
                        key={student.id}
                        className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        onClick={() => onSelectStudent(student)}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#268c90] to-[#6ed3d8] flex items-center justify-center flex-shrink-0">
                                    <User className="w-6 h-6 text-white" />
                                </div>

                                {/* Informações do Aluno */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-[#268c90] transition-colors">
                                        {student.nome}
                                    </h3>

                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">{student.email}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <BookOpen className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">{student.curso}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Coins className="w-4 h-4 flex-shrink-0" />
                                            <span>Saldo atual: <span className="font-medium text-[#268c90]">{student.saldoMoedas} moedas</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botão de Ação */}
                            <Button
                                size="lg"
                                className="bg-[#268c90] hover:bg-[#155457] text-white flex-shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onSelectStudent(student)
                                }}
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Enviar Moedas
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}