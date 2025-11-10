"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { VantagemResponse } from "@/shared/interfaces/vantagem.interface"
import { Coins, AlertCircle, Loader2 } from "lucide-react"

interface ConfirmResgateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    vantagem: VantagemResponse | null
    saldoAtual: number
    onConfirm: (vantagem: VantagemResponse) => Promise<void>
}

export function ConfirmResgateDialog({
    open,
    onOpenChange,
    vantagem,
    saldoAtual,
    onConfirm
}: ConfirmResgateDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    if (!vantagem) return null

    const saldoInsuficiente = saldoAtual < vantagem.custoMoedas
    const saldoRestante = saldoAtual - vantagem.custoMoedas

    const handleConfirm = async () => {
        setIsLoading(true)
        try {
            await onConfirm(vantagem)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-gray-300 dark:bg-gray-300">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Confirmar Resgate
                    </DialogTitle>
                    <DialogDescription>
                        Revise as informações antes de confirmar o resgate
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Informações da Vantagem */}
                    <div className="rounded-lg border p-4 space-y-2">
                        <h4 className="font-semibold text-lg">{vantagem.nome}</h4>
                        <p className="text-sm text-muted-foreground">{vantagem.descricao}</p>
                    </div>

                    {/* Resumo Financeiro */}
                    <div className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Custo da vantagem</span>
                            <div className="flex items-center gap-2 font-semibold">
                                <Coins className="w-4 h-4 text-[#268c90]" />
                                <span>{vantagem.custoMoedas} moedas</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Seu saldo atual</span>
                            <div className="flex items-center gap-2 font-semibold">
                                <Coins className="w-4 h-4 text-[#268c90]" />
                                <span>{saldoAtual} moedas</span>
                            </div>
                        </div>

                        <div className="pt-2 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Saldo restante</span>
                                <div className={`flex items-center gap-2 font-bold text-lg ${
                                    saldoInsuficiente ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                                }`}>
                                    <Coins className="w-5 h-5" />
                                    <span>{saldoRestante} moedas</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alerta de Saldo Insuficiente */}
                    {saldoInsuficiente && (
                        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                                <div>
                                    <h5 className="font-semibold text-red-900 dark:text-red-300 mb-1">
                                        Saldo Insuficiente
                                    </h5>
                                    <p className="text-sm text-red-700 dark:text-red-400">
                                        Você não possui moedas suficientes para resgatar esta vantagem.
                                        Faltam {vantagem.custoMoedas - saldoAtual} moedas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={saldoInsuficiente || isLoading}
                        className="bg-[#268c90] hover:bg-[#155457] text-white"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Confirmar Resgate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
