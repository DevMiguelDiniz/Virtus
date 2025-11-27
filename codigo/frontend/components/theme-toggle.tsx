"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = buttonRef.current
        if (!button) return

        const rect = button.getBoundingClientRect()
        const x = rect.left + rect.width / 2
        const y = rect.top + rect.height / 2

        // Calcular o raio necessário para cobrir toda a tela
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        )

        // Verificar se o navegador suporta View Transitions API
        const supportsViewTransitions = typeof document !== 'undefined' && 'startViewTransition' in document

        if (supportsViewTransitions) {
            // Usar View Transitions API (navegadores modernos)
            const transition = (document as any).startViewTransition(() => {
                setTheme(theme === "dark" ? "light" : "dark")
            })

            try {
                await transition.ready
                // Aplicar a animação circular com CSS
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${x}px ${y}px)`,
                            `circle(${endRadius}px at ${x}px ${y}px)`
                        ]
                    },
                    {
                        duration: 600,
                        easing: 'ease-in-out',
                        pseudoElement: '::view-transition-new(root)'
                    }
                )
            } catch (error) {
                // Fallback se a animação falhar
                console.log('View transition animation failed, using fallback')
            }
        } else {
            // Fallback: criar overlay animado manualmente
            const overlay = document.createElement('div')
            overlay.className = 'theme-transition-overlay-manual'

            const isDark = theme === "dark"
            const overlayColor = isDark ? 'rgb(245, 245, 242)' : 'rgb(23, 23, 23)'

            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
                pointer-events: none;
                background-color: ${overlayColor};
                clip-path: circle(0px at ${x}px ${y}px);
            `

            document.body.appendChild(overlay)

            // Animar o clip-path
            const animation = overlay.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`
                    ]
                },
                {
                    duration: 600,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                }
            )

            // Mudar tema no meio da animação
            setTimeout(() => {
                setTheme(theme === "dark" ? "light" : "dark")
            }, 300)

            // Remover overlay após a animação
            animation.onfinish = () => {
                setTimeout(() => {
                    overlay.remove()
                }, 100)
            }
        }
    }

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9"
                aria-label="Toggle theme"
            >
                <Sun className="w-4 h-4" />
            </Button>
        )
    }

    const isDark = theme === "dark"

    return (
        <Button
            ref={buttonRef}
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="w-9 h-9 relative transition-all duration-300 hover:scale-110"
            aria-label="Toggle theme"
        >
            <Sun className={`w-4 h-4 absolute transition-all duration-300 ${
                isDark
                    ? "rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
            }`} />
            <Moon className={`w-4 h-4 absolute transition-all duration-300 ${
                isDark
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-0 opacity-0"
            }`} />
        </Button>
    )
}
