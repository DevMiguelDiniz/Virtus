import { Header } from "@/components/headers/header"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            <Header />
            <main>
                <HeroSection isAuthenticated={false} />
                <FeaturesSection />
            </main>
        </div>
    )
}