import { BookOpen } from 'lucide-react'
import { Marca } from './Marca'

/**
 * Visual de la mentoría: no hay foto del autor en los materiales, así que en lugar de inventar
 * una imagen se dibuja lo que es: dos transmisiones entre el autor y el lector.
 * Animaciones solo con transform/opacity (compuestas en GPU); quietas con «reducir movimiento».
 */
export function VisualMentoria() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-abyss" aria-hidden>
      <div className="grid-bg absolute inset-0 opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgb(57_255_136/0.13),transparent_78%)]" />
      <div className="scanlines absolute inset-0 opacity-40" />

      <p className="hud absolute top-6 left-6">
        <span className="text-neon">&gt;</span> Enlace directo
      </p>
      <p className="hud absolute top-6 right-6 flex items-center gap-2">
        <span className="size-1.5 bg-neon shadow-[0_0_8px_var(--color-neon)]" /> Canal 1:1
      </p>

      {/* Autor <-> Lector */}
      <div className="absolute inset-x-[9%] top-1/2 flex -translate-y-[62%] items-center">
        <Nodo etiqueta="Autor">
          <Marca className="size-9 text-bone md:size-11" />
        </Nodo>
        <div className="mentoria-linea relative mx-2 h-px flex-1 md:mx-4">
          <span className="mentoria-pulso mentoria-pulso--ida">
            <span />
          </span>
          <span className="mentoria-pulso mentoria-pulso--vuelta">
            <span />
          </span>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-[0.62rem] tracking-[0.24em] whitespace-nowrap text-neon uppercase md:text-[0.68rem]">
            Tx 01 · Tx 02
          </span>
        </div>
        <Nodo etiqueta="Lector">
          <BookOpen className="size-8 text-bone md:size-10" strokeWidth={1.25} />
        </Nodo>
      </div>

      <div className="absolute right-6 bottom-6 left-6 flex items-end gap-4">
        <span className="font-display text-6xl leading-none font-black text-neon [text-shadow:0_0_30px_rgb(57_255_136/0.4)] md:text-7xl">02</span>
        <span className="pb-1 font-mono text-[0.68rem] leading-relaxed tracking-[0.22em] text-mist uppercase">
          Transmisiones
          <br />
          <span className="text-bone">Autor ⟷ Lector</span>
        </span>
      </div>
    </div>
  )
}

function Nodo({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div className="relative flex shrink-0 flex-col items-center gap-3">
      <div className="relative grid size-20 place-items-center rounded-full border border-neon/60 bg-void/80 shadow-[0_0_40px_-10px_rgb(57_255_136/0.6)] md:size-28">
        <span className="mentoria-anillo absolute -inset-3 rounded-full border border-dashed border-neon/30" />
        {children}
      </div>
      <span className="font-mono text-[0.66rem] tracking-[0.3em] text-bone uppercase">{etiqueta}</span>
    </div>
  )
}
