"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, Minus } from "lucide-react"
import type { UsuarioListItem } from "@/shared/interfaces/admin.interface"

interface GerenciarMoedasModalProps {
    isOpen: boolean
    onClose: () => void
    usuario: UsuarioListItem | null
    onConfirm: (valor: number, motivo: string, operacao: 'adicionar' | 'remover') => Promise<void>
}

export function GerenciarMoedasModal({
    isOpen,
    onClose,
    usuario,
    onConfirm
}: GerenciarMoedasModalProps) {
    const [valor, setValor] = useState("")
    const [motivo, setMotivo] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (operacao: 'adicionar' | 'remover') => {
        const valorNum = parseInt(valor)

        if (!valorNum || valorNum <= 0) {
            setError("Valor deve ser maior que zero")
            return
        }

        if (operacao === 'remover' && usuario && valorNum > usuario.saldoMoedas) {
            setError("Saldo insuficiente")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            await onConfirm(valorNum, motivo, operacao)
            setValor("")
            setMotivo("")
            onClose()
        } catch (err: any) {
            setError(err.message || "Erro ao processar operação")
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        if (!isLoading) {
            setValor("")
            setMotivo("")
            setError(null)
            onClose()
        }
    }

    if (!usuario) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground">
                        Gerenciar Moedas
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {usuario.tipo === 'ALUNO' ? 'Aluno' : 'Professor'}: {usuario.nome}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Saldo Atual */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Saldo Atual</p>
                        <p className="text-3xl font-bold text-[#268c90]">
                            {usuario.saldoMoedas} moedas
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Valor */}
                    <div className="space-y-2">
                        <Label htmlFor="valor">Valor</Label>
                        <Input
                            id="valor"
                            type="number"
                            min="1"
                            placeholder="Quantidade de moedas"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Motivo */}
                    <div className="space-y-2">
                        <Label htmlFor="motivo">Motivo (opcional)</Label>
                        <Textarea
                            id="motivo"
                            placeholder="Descreva o motivo desta operação..."
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>

                    {/* Botões */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            onClick={() => handleSubmit('adicionar')}
                            disabled={isLoading || !valor}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Plus className="w-4 h-4 mr-2" />
                            )}
                            Adicionar
                        </Button>

                        <Button
                            onClick={() => handleSubmit('remover')}
                            disabled={isLoading || !valor}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Minus className="w-4 h-4 mr-2" />
                            )}
                            Remover
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="w-full"
                    >
                        Cancelar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
