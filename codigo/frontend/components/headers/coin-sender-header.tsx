import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Coins, Search } from "lucide-react"

interface CoinSenderHeaderProps {
    professorBalance: number
    searchTerm: string
    onSearchChange: (value: string) => void
}

export function CoinSenderHeader({ professorBalance, searchTerm, onSearchChange }: CoinSenderHeaderProps) {
    return (
        <div className="mb-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Enviar Moedas</h1>
                <p className="text-muted-foreground">
                    Selecione um aluno e envie moedas como reconhecimento pelo desempenho
                </p>
            </div>

            <div className="grid md:grid-cols-[1fr_2fr] gap-6">
                {/* Card de Saldo */}
                <Card className="p-6 bg-gradient-to-br from-[#268c90] to-[#6ed3d8] text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm font-medium mb-1">Saldo Disponível</p>
                            <p className="text-4xl font-bold">{professorBalance}</p>
                            <p className="text-white/80 text-sm mt-1">moedas para distribuir</p>
                        </div>
                        <Coins className="w-16 h-16 text-white/20" />
                    </div>
                </Card>

                {/* Campo de Busca */}
                <section className="p-6 flex items-top">
                    <div className="relative w-full">
                        <Search className="absolute left-2 top-1/4 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Buscar por nome, email ou curso..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 h-12 text-base"
                        />
                    </div>
                </section>
            </div>
        </div>
    )
}