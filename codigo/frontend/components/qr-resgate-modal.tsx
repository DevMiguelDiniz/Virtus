"use client"

import { QRCodeSVG } from "qrcode.react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface QrResgateModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    codigoResgate: string
    vantagemNome: string
    onConfirm: () => void
}

export function QrResgateModal({
    open,
    onOpenChange,
    codigoResgate,
    vantagemNome,
    onConfirm
}: QrResgateModalProps) {
    const handleOk = () => {
        onConfirm()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-gray-300 dark:bg-gray-300">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">
                        Validação de Resgate
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {vantagemNome}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <QRCodeSVG
                            value={codigoResgate}
                            size={256}
                            level="H"
                            includeMargin={true}
                        />
                    </div>

                    <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Código de resgate
                        </p>
                        <p className="font-mono font-bold text-lg text-[#268c90]">
                            {codigoResgate}
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex justify-center">
                    <Button
                        onClick={handleOk}
                        className="w-full bg-[#268c90] hover:bg-[#155457] text-white"
                    >
                        OK
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
