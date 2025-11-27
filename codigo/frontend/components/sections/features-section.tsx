import { FeatureCard } from "@/components/feature-card"
import { Award, Send, Store } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 py-16 pb-32">
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <FeatureCard
          icon={<Award className="w-8 h-8" />}
          title="Alunos"
          description="Resgate prêmios exclusivos usando suas moedas conquistadas através do desempenho acadêmico e participação."
          color="#3fbec5"
        />
        <FeatureCard
          icon={<Send className="w-8 h-8" />}
          title="Professores"
          description="Reconheça e recompense os melhores alunos enviando moedas como incentivo ao excelente desempenho."
          color="#268c90"
        />
        <FeatureCard
          icon={<Store className="w-8 h-8" />}
          title="Empresas"
          description="Cadastre produtos e serviços como prêmios, aumentando a visibilidade da sua marca entre estudantes."
          color="#155457"
        />
      </div>
    </section>
  )
}
