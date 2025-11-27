import { Card } from "@/components/ui/card"
import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  color: string
}

export function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <Card className="p-8 hover:shadow-lg transition-all duration-300 border-border group cursor-pointer">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
        style={{ backgroundColor: color }}
      >
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="font-heading font-semibold text-2xl mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  )
}
