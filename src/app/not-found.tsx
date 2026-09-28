import Link from 'next/link'
import { libro } from '@/data/libro'

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center bg-void px-6 text-center">
      <div>
        <p className="hud">
          <span className="text-neon">&gt;</span> Error 404 · Señal perdida
        </p>
        <h1 className="mt-6 font-display text-5xl font-black text-bone uppercase md:text-7xl">Fuera del código</h1>
        <p className="mx-auto mt-6 max-w-md text-mist">Esta página no existe. El camino sigue en el inicio.</p>
        <Link href="/" className="btn-neon mt-10">
          Volver a {libro.titulo}
        </Link>
      </div>
    </main>
  )
}
