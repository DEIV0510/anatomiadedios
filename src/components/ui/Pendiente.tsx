import { IS_DEV } from '@/lib/site'

/**
 * Marcador de dato que falta en src/data/libro.ts. Solo se ve en `npm run dev`;
 * en producción no renderiza nada (no se publican huecos ni datos inventados).
 */
export function Pendiente({ dato, className = '' }: { dato: string; className?: string }) {
  if (!IS_DEV) return null
  return (
    <span className={`pending ${className}`} title="Complétalo en src/data/libro.ts (solo visible en desarrollo)">
      <span aria-hidden>◇</span> Pendiente: {dato}
    </span>
  )
}
