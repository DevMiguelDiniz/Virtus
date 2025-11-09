"use client"

import React, { useEffect, useRef, useState } from "react"

export interface QRPaymentModalProps {
    isOpen: boolean
    onClose: () => void
    onApplyCode: (codigo: string) => Promise<void>
    onApplyLink?: (link: string) => Promise<void>
}

const QRPaymentModal: React.FC<QRPaymentModalProps> = ({ isOpen, onClose, onApplyCode, onApplyLink }) => {
    const [codigo, setCodigo] = useState("")
    const [scanning, setScanning] = useState(false)
    const [scannerSupported, setScannerSupported] = useState<boolean | null>(null)
    const [error, setError] = useState<string | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const intervalRef = useRef<number | null>(null)
    const detectorRef = useRef<any>(null)

    useEffect(() => {
        setScannerSupported('BarcodeDetector' in window || !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia))
    }, [])

    useEffect(() => {
        if (!isOpen) {
            stopScanning()
            setCodigo("")
            setError(null)
        }
        return () => stopScanning()
    }, [isOpen])

    const startScanning = async () => {
        setError(null)
        try {
            if (!(window as any).BarcodeDetector) {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    setError("Navegador não suporta leitura de QR via câmera.")
                    return
                }
                const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
                streamRef.current = s
                if (videoRef.current) {
                    videoRef.current.srcObject = s
                    await videoRef.current.play()
                }
                setScanning(true)
                return
            }

            const BarcodeDetector = (window as any).BarcodeDetector
            detectorRef.current = new BarcodeDetector({ formats: ["qr_code"] })
            const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            streamRef.current = s
            if (videoRef.current) {
                videoRef.current.srcObject = s
                await videoRef.current.play()
            }
            setScanning(true)

            intervalRef.current = window.setInterval(async () => {
                try {
                    if (!videoRef.current) return
                    const barcodes = await detectorRef.current.detect(videoRef.current)
                    if (barcodes && barcodes.length > 0) {
                        setCodigo(barcodes[0].rawValue)
                        stopScanning()
                    }
                } catch (e) {
                }
            }, 500)
        } catch (e: any) {
            setError(e.message || "Erro ao iniciar câmera para escanear QR.")
            stopScanning()
        }
    }

    const stopScanning = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop())
            streamRef.current = null
        }
        if (videoRef.current) {
            videoRef.current.pause()
            videoRef.current.srcObject = null
        }
        setScanning(false)
    }

    const handleApply = async () => {
        if (!codigo) return
        setError(null)
        try {
            // Detecta se é um URL de pagamento
            let isUrl = false
            try {
                new URL(codigo)
                isUrl = true
            } catch {
                isUrl = /^https?:\/\//i.test(codigo)
            }

            if (isUrl && onApplyLink) {
                await onApplyLink(codigo)
            } else {
                await onApplyCode(codigo)
            }
        } catch (e: any) {
            setError(e.message || "Erro ao aplicar código/link.")
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Pagar por QR / Código / Link</h3>
                    <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" onClick={() => { stopScanning(); onClose() }}>✕</button>
                </div>

                {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md text-sm">{error}</div>}

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Código da transação ou link de pagamento</label>
                    <input
                        value={codigo}
                        onChange={e => setCodigo(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Cole o código ou link aqui"
                    />
                </div>

                <div className="mb-4">
                    {scannerSupported === false && (
                        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-md text-sm">
                            ⚠️ Leitura de QR code não suportada neste navegador. Cole o link/código manualmente.
                        </div>
                    )}

                    {scannerSupported !== false && (
                        <div className="flex gap-2 mb-3">
                            <button
                                className="flex-1 px-4 py-2 bg-[#268c90] text-white rounded-md hover:opacity-90"
                                onClick={() => (scanning ? stopScanning() : startScanning())}
                            >
                                {scanning ? "Parar Escaneamento" : "Escanear QR Code"}
                            </button>

                            <button
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:opacity-90 disabled:opacity-50"
                                onClick={handleApply}
                                disabled={!codigo}
                            >
                                Aplicar
                            </button>
                        </div>
                    )}

                    {scanning && (
                        <div className="relative bg-black rounded-md overflow-hidden">
                            <video 
                                ref={videoRef} 
                                className="w-full h-64 object-cover" 
                                autoPlay 
                                playsInline 
                            />
                            <div className="absolute inset-0 border-2 border-[#268c90] pointer-events-none" />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => { stopScanning(); onClose() }}>Cancelar</button>
                </div>
            </div>
        </div>
    )
}

export default QRPaymentModal
