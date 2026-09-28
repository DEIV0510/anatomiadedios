'use client'

import { useEffect } from 'react'

/**
 * Carga la capa de movimiento (GSAP y compañía) en un solo chunk, después de la pantalla de
 * entrada y cuando el navegador está libre. Renderiza el cursor propio (lo activa ese módulo).
 */
export function Efectos() {
  useEffect(() => {
    let cancelado = false
    const cargar = () =>
      import('@/motion/enhance').then((m) => {
        if (!cancelado) m.iniciar()
      })
    const espera = document.documentElement.dataset.intro === 'skip' ? 120 : 1000
    const t = window.setTimeout(() => {
      if ('requestIdleCallback' in window) window.requestIdleCallback(() => cargar(), { timeout: 1200 })
      else cargar()
    }, espera)
    return () => {
      cancelado = true
      window.clearTimeout(t)
    }
  }, [])

  return (
    <div className="cursor" aria-hidden>
      <div className="cursor__ring" />
      <div className="cursor__dot" />
    </div>
  )
}
