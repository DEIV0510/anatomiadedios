/**
 * Pantalla de entrada tipo interfaz (~1 s, CSS puro: no espera a React ni a GSAP).
 * Se salta sola en visitas repetidas de la sesión, con ahorro de datos o «reducir movimiento».
 */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro__box">
        <span className="intro__line">&gt; Initializing...</span>
        <span className="intro__line">&gt; Accessing knowledge...</span>
        <span className="intro__line">&gt; Connection established</span>
        <span className="intro__line">Welcome</span>
        <div className="intro__bar" />
      </div>
    </div>
  )
}
