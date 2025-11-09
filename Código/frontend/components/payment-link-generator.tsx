"use client"

import React, { useState } from "react"
import { loginService } from "@/shared/services/login.service"
import { transacaoService } from "@/shared/services/transacao.service"
import { Copy, Check, QrCode } from "lucide-react"

interface PaymentLinkGeneratorProps {
    userId?: number
}

export default function PaymentLinkGenerator({ userId }: PaymentLinkGeneratorProps) {
    const [valor, setValor] = useState<number | "">("")
    const [link, setLink] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCreateLink = async () => {
        setError(null)
        if (!valor || Number(valor) <= 0) {
            setError("Informe um valor válido")
            return
        }

        let userIdToUse = userId
        if (!userIdToUse) {
            const userData = loginService.getUserData()
            if (!userData) {
                setError("Usuário não autenticado")
                return
            }
            userIdToUse = userData.id
        }

        setIsLoading(true)
        try {
            if (typeof transacaoService.criarLinkPagamento === 'function') {
                const resp = await transacaoService.criarLinkPagamento(userIdToUse, { valorLinkPagamento: Number(valor) })
                console.log('Resposta do backend:', resp)
                setLink(resp.linkPagamento || null)
            } else {
                throw new Error('Método criarLinkPagamento não implementado no transacaoService')
            }
        } catch (e: any) {
            console.error('Erro ao criar link:', e)
            setError(e.message || "Erro ao criar link de pagamento")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopyLink = async () => {
        if (!link) return
        
        try {
            await navigator.clipboard.writeText(link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Erro ao copiar link:', err)
        }
    }

    const handleReset = () => {
        setLink(null)
        setValor("")
        setError(null)
        setCopied(false)
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <QrCode className="w-6 h-6 text-[#268c90]" />
                <h2 className="text-xl font-semibold">Gerar Link de Pagamento</h2>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md text-sm">
                    {error}
                </div>
            )}

            {!link ? (
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Crie um link de pagamento para receber moedas de professores
                    </p>
                    
                    <div className="flex gap-3 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-2">
                                Valor em moedas
                            </label>
                            <input
                                type="number"
                                value={valor}
                                onChange={e => setValor(e.target.value === "" ? "" : Number(e.target.value))}
                                placeholder="Ex: 10"
                                min="0.01"
                                step="0.01"
                                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <button
                            className="px-6 py-2 bg-[#268c90] text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleCreateLink}
                            disabled={isLoading || !valor}
                        >
                            {isLoading ? "Gerando..." : "Gerar Link"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                        <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                            ✓ Link de pagamento criado com sucesso!
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-400">
                            Valor: <span className="font-semibold">{valor} moedas</span>
                        </p>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`} 
                            alt="QR code do link de pagamento"
                            className="w-48 h-48"
                        />
                    </div>

                    {/* Link para copiar */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Link de pagamento
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={link}
                                readOnly
                                className="flex-1 px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-sm"
                            />
                            <button
                                onClick={handleCopyLink}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:opacity-90 flex items-center gap-2"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Copiado!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copiar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Instruções */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            💡 <strong>Como usar:</strong> Envie este link ou mostre o QR code para o professor efetuar o pagamento.
                        </p>
                    </div>

                    {/* Botão para gerar novo link */}
                    <button
                        onClick={handleReset}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Gerar Novo Link
                    </button>
                </div>
            )}
        </div>
    )
}