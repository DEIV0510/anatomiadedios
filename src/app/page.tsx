import { BarraMovil } from '@/components/BarraMovil'
import { CompraRapida } from '@/components/CompraRapida'
import { Concepto } from '@/components/Concepto'
import { Contenido } from '@/components/Contenido'
import { CtaFinal } from '@/components/CtaFinal'
import { Despertar } from '@/components/Despertar'
import { Ediciones } from '@/components/Ediciones'
import { Efectos } from '@/components/Efectos'
import { Faq } from '@/components/Faq'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { Intro } from '@/components/Intro'
import { MasQueUnLibro } from '@/components/MasQueUnLibro'
import { Mentoria } from '@/components/Mentoria'
import { Navbar } from '@/components/Navbar'
import { Pagos } from '@/components/Pagos'
import { PanelPendientes } from '@/components/PanelPendientes'
import { Testimonios } from '@/components/Testimonios'

export default function Home() {
  return (
    <>
      <Intro />
      <a
        href="#main"
        className="fixed top-2 left-2 z-[200] -translate-y-24 bg-neon px-4 py-3 font-mono text-xs tracking-[0.2em] text-void uppercase transition-transform focus-visible:translate-y-0"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Despertar />
        <Concepto />
        <MasQueUnLibro />
        <Contenido />
        <Mentoria />
        <Testimonios />
        <Ediciones />
        <Pagos />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
      <CompraRapida />
      <BarraMovil />
      <Efectos />
      <PanelPendientes />
    </>
  )
}
