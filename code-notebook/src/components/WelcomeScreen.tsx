import { ArrowRight, Code2, Sparkles } from 'lucide-react'

interface WelcomeScreenProps {
  onEnter: () => void
}

export function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  return (
    <main className="welcome-screen">
      <div className="welcome-screen__glow welcome-screen__glow--one" />
      <div className="welcome-screen__glow welcome-screen__glow--two" />

      <section className="welcome-card">
        <div className="welcome-card__brand">
          <span className="brand-mark">CD</span>
          <span>CODE DATA</span>
        </div>

        <div className="welcome-card__icon">
          <Code2 size={25} />
        </div>
        <span className="eyebrow"><Sparkles size={13} /> SEU WORKSPACE DE CÓDIGO</span>
        <h1>Bem-vindo, Pedro.</h1>
        <p className="welcome-card__subtext">
          Seu conhecimento está esperando por você. Vamos construir algo incrível hoje?
        </p>
        <p className="welcome-card__affirmation">Lembre-se: você é genial.</p>

        <button className="welcome-card__cta" onClick={onEnter}>
          Entrar no workspace
          <ArrowRight size={16} />
        </button>
        <span className="welcome-card__hint">Seu próximo grande insight começa aqui.</span>
      </section>
    </main>
  )
}
