"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Coins, Calendar, FileText, Package } from "lucide-react"
import type { VantagemResponse } from "@/shared/interfaces/vantagem.interface"

interface AdvantageListProps {
    vantagens: VantagemResponse[]
    onSelectVantagem?: (vantagem: VantagemResponse) => void
    showActions?: boolean
    emptyMessage?: string
}

export function AdvantageList({
    vantagens,
    onSelectVantagem,
    showActions = false,
    emptyMessage = "Nenhuma vantagem cadastrada"
}: AdvantageListProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return "Data nao disponivel"
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date)
    }

    if (vantagens.length === 0) {
        return (
            <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                    <Package className="w-16 h-16 text-muted-foreground" />
                    <div>
                        <h3 className="text-lg font-semibold mb-2">{emptyMessage}</h3>
                        <p className="text-muted-foreground text-sm">
                            As vantagens cadastradas aparecerao aqui
                        </p>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {vantagens.map((vantagem) => (
                    <Card
                        key={vantagem.id}
                        className="p-6 hover:shadow-lg transition-all duration-300 flex flex-col"
                    >
                        {vantagem.urlFoto && (
                            <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                <img
                                    src={vantagem.urlFoto}
                                    alt={vantagem.nome}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.style.display = 'none'
                                        if (target.parentElement) {
                                            const icon = document.createElement('div')
                                            icon.className = 'flex items-center justify-center'
                                            icon.innerHTML = '<svg class="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
                                            target.parentElement.appendChild(icon)
                                        }
                                    }}
                                />
                            </div>
                        )}

                        {!vantagem.urlFoto && (
                            <div className="w-full h-48 mb-4 rounded-lg bg-gradient-to-br from-[#268c90] to-[#6ed3d8] flex items-center justify-center">
                                <Gift className="w-16 h-16 text-white" />
                            </div>
                        )}

                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                                {vantagem.nome}
                            </h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <p className="line-clamp-3">{vantagem.descricao}</p>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Coins className="w-4 h-4 text-[#268c90] flex-shrink-0" />
                                    <span className="font-semibold text-[#268c90]">
                                        {vantagem.custoMoedas} moedas
                                    </span>
                                </div>

                                {vantagem.dataCadastro && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3 flex-shrink-0" />
                                        <span>Cadastrada em {formatDate(vantagem.dataCadastro)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {showActions && onSelectVantagem && (
                            <Button
                                className="w-full bg-[#268c90] hover:bg-[#155457] text-white mt-4"
                                onClick={() => onSelectVantagem(vantagem)}
                            >
                                <Gift className="w-4 h-4 mr-2" />
                                Resgatar Vantagem
                            </Button>
                        )}

                        {vantagem.ativo === false && (
                            <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded text-center">
                                <span className="text-xs text-red-600 font-medium">Inativa</span>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    )
}
