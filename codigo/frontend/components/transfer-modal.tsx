"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Coins, User, AlertCircle } from "lucide-react"
import type { Student } from "@/shared/interfaces/coin-sender.interface"

interface TransferModalProps {
    isOpen: boolean
    onClose: () => void
    student: Student | null
    professorBalance: number
    onTransfer: (amount: number, description: string) => void
    isTransferring?: boolean
}

export function TransferModal({
                                  isOpen,
                                  onClose,
                                  student,
                                  professorBalance,
                                  onTransfer,
                                  isTransferring = false
                              }: TransferModalProps) {
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [errors, setErrors] = useState<{ amount?: string; description?: string }>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleClose = () => {
        setAmount("")
        setDescription("")
        setErrors({})
        setIsSubmitting(false)
        onClose()
    }

    useEffect(() => {
        if (!isTransferring && isSubmitting) {
            setIsSubmitting(false)
        }
    }, [isTransferring, isSubmitting])

    const validateForm = (): boolean => {
        const newErrors: { amount?: string; description?: string } = {}

        const amountNum = Number(amount)

        if (!amount || amountNum <= 0) {
            newErrors.amount = "Digite um valor válido maior que zero"
        } else if (amountNum > professorBalance) {
            newErrors.amount = `Saldo insuficiente. Você possui apenas ${professorBalance} moedas`
        } else if (!Number.isInteger(amountNum)) {
            newErrors.amount = "Digite um valor inteiro"
        }

        if (!description.trim()) {
            newErrors.description = "A descrição é obrigatória"
        } else if (description.trim().length < 10) {
            newErrors.description = "A descrição deve ter pelo menos 10 caracteres"
        } else if (description.trim().length > 500) {
            newErrors.description = "A descrição deve ter no máximo 500 caracteres"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (isSubmitting || isTransferring) {
            return
        }

        if (validateForm() && student) {
            setIsSubmitting(true)
            onTransfer(Number(amount), description.trim())
        }
    }

    if (!student) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] !bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground">Enviar Moedas</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Reconheça o desempenho do aluno enviando moedas virtuais
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Informações do Aluno */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#268c90] to-[#6ed3d8] flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">{student.nome}</p>
                                <p className="text-sm text-muted-foreground">{student.curso}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Coins className="w-4 h-4" />
                            <span>Saldo atual do aluno: <span className="font-medium text-[#268c90]">{student.saldoMoedas} moedas</span></span>
                        </div>
                    </div>

                    {/* Saldo do Professor */}
                    <div className="bg-gradient-to-r from-[#268c90]/10 to-[#6ed3d8]/10 border border-[#268c90]/20 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">Seu saldo disponível</span>
                            <span className="text-2xl font-bold text-[#268c90]">{professorBalance} moedas</span>
                        </div>
                    </div>

                    {/* Campo de Valor */}
                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-foreground font-medium">
                            Quantidade de Moedas *
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="Digite a quantidade"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value)
                                setErrors(prev => ({ ...prev, amount: undefined }))
                            }}
                            className={`h-12 ${errors.amount ? 'border-red-500' : ''}`}
                            min="1"
                            max={professorBalance}
                        />
                        {errors.amount && (
                            <div className="flex items-start gap-2 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{errors.amount}</span>
                            </div>
                        )}
                    </div>

                    {/* Campo de Descrição */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-foreground font-medium">
                            Motivo/Descrição *
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Ex: Excelente desempenho no projeto final, dedicação excepcional nas atividades..."
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                                setErrors(prev => ({ ...prev, description: undefined }))
                            }}
                            className={`min-h-24 resize-none ${errors.description ? 'border-red-500' : ''}`}
                            maxLength={500}
                        />
                        <div className="flex items-center justify-between">
                            {errors.description ? (
                                <div className="flex items-start gap-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>{errors.description}</span>
                                </div>
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    Mínimo 10 caracteres
                                </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                                {description.length}/500
                            </span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-[#268c90] hover:bg-[#155457] text-white"
                        disabled={!amount || !description.trim() || isSubmitting || isTransferring}
                    >
                        <Coins className="w-4 h-4 mr-2" />
                        {isSubmitting || isTransferring ? 'Enviando...' : 'Confirmar Envio'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}