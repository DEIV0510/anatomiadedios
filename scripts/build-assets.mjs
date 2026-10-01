// Genera todos los medios del sitio a partir de la carpeta original del cliente (assets/source):
//
//   hero.mp4          -> video del hero en AV1 + H.264 (escritorio 1280x720 y recorte vertical
//                        576x720 para móvil), sin audio, con faststart, y su primer fotograma
//                        como póster AVIF/WebP (coincide con el arranque del video: sin salto).
//   libro-mockup.png  -> la portada aplanada (homografía, sin redibujar) para el libro 3D, y el
//                        mockup original optimizado para la tarjeta del producto.
//   autor-libro.jpg   -> el autor con el libro (sección de la mentoría) y su rostro (avatares).
//   assets/brand      -> favicon.ico, apple-icon.png, imagen Open Graph.
//
// Escribe src/data/media.json con rutas, anchos y tamaños reales para el componente <Picture>.
// Uso: npm run assets            (salta lo que ya existe)
//      npm run assets -- --force (regenera todo)
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import sharp from 'sharp'
import { flattenQuad } from './lib/homography.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'assets/source')
const BRAND = path.join(ROOT, 'assets/brand')
const OUT = path.join(ROOT, 'public/media')
const APP = path.join(ROOT, 'src/app')
const MANIFEST = path.join(ROOT, 'src/data/media.json')
const FORCE = process.argv.includes('--force')

fs.mkdirSync(OUT, { recursive: true })

// ---------------------------------------------------------------------------------------------
// ffmpeg: PATH, variable FFMPEG o la instalación de winget (Gyan.FFmpeg)
// ---------------------------------------------------------------------------------------------
function findFfmpeg() {
  const candidates = [process.env.FFMPEG, 'ffmpeg']
  const winget = path.join(process.env.LOCALAPPDATA || '', 'Microsoft/WinGet/Packages')
  if (fs.existsSync(winget)) {
    for (const pkg of fs.readdirSync(winget).filter((d) => d.startsWith('Gyan.FFmpeg'))) {
      const base = path.join(winget, pkg)
      for (const build of fs.readdirSync(base)) candidates.push(path.join(base, build, 'bin', 'ffmpeg.exe'))
    }
  }
  for (const c of candidates.filter(Boolean)) {
    const r = spawnSync(c, ['-version'], { encoding: 'utf8' })
    if (r.status === 0) return c
  }
  throw new Error('No se encontró ffmpeg (instálalo o define la variable FFMPEG)')
}
const FFMPEG = findFfmpeg()

function ffmpeg(args, label) {
  const r = spawnSync(FFMPEG, ['-v', 'error', '-y', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (r.status !== 0) throw new Error(`ffmpeg falló (${label}):\n${r.stderr}`)
}

const fresh = (file) => !FORCE && fs.existsSync(file) && fs.statSync(file).size > 0
const rel = (file) => '/' + path.relative(path.join(ROOT, 'public'), file).split(path.sep).join('/')
const kb = (file) => `${(fs.statSync(file).size / 1024).toFixed(0)} KB`

// ---------------------------------------------------------------------------------------------
// 1. Video del hero
// ---------------------------------------------------------------------------------------------
const HERO = path.join(SRC, 'hero.mp4')
// Recorte vertical centrado para móvil: el libro y la figura ocupan el centro del cuadro
const MOBILE_CROP = 'crop=576:720:352:0'
const common = ['-an', '-g', '48', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']
const videos = [
  { file: 'hero-1280.av1.mp4', vf: null, codec: ['-c:v', 'libsvtav1', '-preset', '4', '-crf', '42'] },
  { file: 'hero-1280.mp4', vf: null, codec: ['-c:v', 'libx264', '-preset', 'veryslow', '-crf', '28', '-profile:v', 'high'] },
  { file: 'hero-576.av1.mp4', vf: MOBILE_CROP, codec: ['-c:v', 'libsvtav1', '-preset', '4', '-crf', '42'] },
  { file: 'hero-576.mp4', vf: MOBILE_CROP, codec: ['-c:v', 'libx264', '-preset', 'veryslow', '-crf', '28', '-profile:v', 'high'] },
]
for (const v of videos) {
  const out = path.join(OUT, v.file)
  if (fresh(out)) continue
  ffmpeg(['-i', HERO, ...(v.vf ? ['-vf', v.vf] : []), ...v.codec, ...common, out], v.file)
  console.log(`video  ${v.file.padEnd(22)} ${kb(out)}`)
}

// Póster = fotograma 0 (el video arranca exactamente ahí)
async function posterFrom(vf, name, widths) {
  const tmp = path.join(OUT, `.${name}-frame.png`)
  ffmpeg(['-i', HERO, '-frames:v', '1', ...(vf ? ['-vf', vf] : []), tmp], `${name} frame`)
  const meta = await sharp(tmp).metadata()
  const variants = []
  for (const w of widths.filter((w) => w <= meta.width)) {
    const base = path.join(OUT, `${name}-${w}`)
    const img = () => sharp(tmp).resize({ width: w })
    if (!fresh(`${base}.avif`)) await img().avif({ quality: 58, effort: 6, chromaSubsampling: '4:4:4' }).toFile(`${base}.avif`)
    if (!fresh(`${base}.webp`)) await img().webp({ quality: 82, effort: 6 }).toFile(`${base}.webp`)
    variants.push({ w, avif: rel(`${base}.avif`), webp: rel(`${base}.webp`) })
  }
  fs.rmSync(tmp)
  return { width: meta.width, height: meta.height, variants }
}
const heroPosterDesktop = await posterFrom(null, 'hero-poster', [640, 960, 1280])
const heroPosterMobile = await posterFrom(MOBILE_CROP, 'hero-poster-m', [576])

// ---------------------------------------------------------------------------------------------
// 2. Portada aplanada (para el libro 3D) y mockup original (tarjeta del producto)
// ---------------------------------------------------------------------------------------------
const MOCKUP = path.join(SRC, 'libro-mockup.png')
// Esquinas de la tapa frontal medidas en el mockup (1240x1269). Proporción 0,65 comprobada:
// la «O» de ANATOMÍA sale circular (73x73 px).
const COVER_QUAD = { tl: [281.5, 138.5], tr: [946.5, 79.5], br: [949.5, 1214.5], bl: [277.5, 1159.5] }
const COVER_W = 668
const COVER_H = 1028
const coverPng = await flattenQuad(MOCKUP, COVER_QUAD, COVER_W, COVER_H)

async function responsive(input, name, widths, { avifQ = 60, webpQ = 84 } = {}) {
  const meta = await sharp(input).metadata()
  const variants = []
  for (const w of widths.filter((w) => w <= meta.width)) {
    const base = path.join(OUT, `${name}-${w}`)
    const img = () => sharp(input).resize({ width: w })
    if (!fresh(`${base}.avif`)) await img().avif({ quality: avifQ, effort: 6 }).toFile(`${base}.avif`)
    if (!fresh(`${base}.webp`)) await img().webp({ quality: webpQ, effort: 6 }).toFile(`${base}.webp`)
    variants.push({ w, avif: rel(`${base}.avif`), webp: rel(`${base}.webp`) })
  }
  // Marcador de carga: 24 px de ancho, difuminado, en base64 (unos 400 bytes)
  const lqip = await sharp(input).resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer()
  return {
    width: meta.width,
    height: meta.height,
    variants,
    lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
  }
}
const cover = await responsive(coverPng, 'portada', [360, 520, 668], { avifQ: 62, webpQ: 86 })
const mockup = await responsive(MOCKUP, 'libro-mockup', [480, 800, 1240])

// JPG del mockup para datos estructurados (Google no acepta AVIF en JSON-LD)
const mockupJpg = path.join(OUT, 'libro-mockup.jpg')
if (!fresh(mockupJpg)) await sharp(MOCKUP).resize({ width: 1200 }).jpeg({ quality: 84, mozjpeg: true }).toFile(mockupJpg)

// ---------------------------------------------------------------------------------------------
// 2b. El autor con el libro (foto del libro, para la mentoría). Llegó en 720x1280: se recorta y
//     nunca se amplía. 3:4 con gorra, rostro, libro y mano; y el rostro solo para los avatares.
//     Los recortes van en PNG (sin pérdida) antes de comprimir a AVIF/WebP.
// ---------------------------------------------------------------------------------------------
const AUTOR = path.join(SRC, 'autor-libro.jpg')
const autorFoto = await sharp(AUTOR).extract({ left: 0, top: 100, width: 720, height: 960 }).png().toBuffer()
const autor = await responsive(autorFoto, 'autor-libro', [240, 480, 720], { avifQ: 58, webpQ: 82 })
const autorRostro = await sharp(AUTOR).extract({ left: 350, top: 195, width: 310, height: 310 }).png().toBuffer()
const avatar = await responsive(autorRostro, 'autor-avatar', [96, 192, 288])

// ---------------------------------------------------------------------------------------------
// 3. Iconos: favicon.ico (16/32/48), apple-icon.png (180). icon.svg se escribe a mano en src/app.
// ---------------------------------------------------------------------------------------------
const MARK = path.join(BRAND, 'mark.svg')
const markPng = (size) => sharp(MARK, { density: Math.ceil((72 * size) / 64) * 2 }).resize(size, size).png().toBuffer()

const icoSizes = [16, 32, 48]
const pngs = await Promise.all(icoSizes.map(markPng))
{
  // ICO con PNG embebidos: cabecera (6) + directorio (16 por imagen) + datos
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngs.length, 4)
  let offset = 6 + 16 * pngs.length
  const dir = pngs.map((png, i) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(icoSizes[i] % 256, 0)
    e.writeUInt8(icoSizes[i] % 256, 1)
    e.writeUInt8(0, 2)
    e.writeUInt8(0, 3)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(png.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += png.length
    return e
  })
  fs.writeFileSync(path.join(APP, 'favicon.ico'), Buffer.concat([header, ...dir, ...pngs]))
}
fs.writeFileSync(path.join(APP, 'apple-icon.png'), await markPng(180))
fs.writeFileSync(path.join(OUT, 'icon-192.png'), await markPng(192))
fs.writeFileSync(path.join(OUT, 'icon-512.png'), await markPng(512))

// ---------------------------------------------------------------------------------------------
// 4. Open Graph 1200x630: el mockup real centrado sobre su propio fondo cósmico, ampliado,
//    difuminado y oscurecido. Sin textos añadidos: la portada ya lleva título y autor.
// ---------------------------------------------------------------------------------------------
{
  const W = 1200
  const H = 630
  const bg = await sharp(MOCKUP)
    .resize(W, H, { fit: 'cover' })
    .blur(18)
    .modulate({ brightness: 0.42, saturation: 0.9 })
    .toBuffer()
  const bookH = 630
  const resized = await sharp(MOCKUP).resize({ height: bookH }).removeAlpha().toBuffer()
  const bookMeta = await sharp(resized).metadata()
  // Bordes fundidos: el cuadro del mockup se disuelve en el fondo en vez de cortar en seco
  const f = 110
  const fade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${bookMeta.width}" height="${bookH}">
    <defs>
      <linearGradient id="x" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="${f / bookMeta.width}" stop-color="#fff"/><stop offset="${1 - f / bookMeta.width}" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="y" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".08" stop-color="#fff"/><stop offset=".92" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <mask id="m"><rect width="100%" height="100%" fill="url(#x)"/></mask>
    </defs>
    <rect width="100%" height="100%" fill="url(#y)" mask="url(#m)"/></svg>`)
  const alpha = await sharp(fade).extractChannel('alpha').png().toBuffer()
  const book = await sharp(resized).joinChannel(alpha).png().toBuffer()
  // Marco HUD fino en verde (esquinas) para enlazar con la identidad del sitio
  const c = 34
  const m = 22
  const green = '#39ff88'
  const hud = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><radialGradient id="v" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".75"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#v)"/>
    <g fill="none" stroke="${green}" stroke-width="2" stroke-opacity=".85">
      <path d="M${m} ${m + c}V${m}H${m + c}"/><path d="M${W - m - c} ${m}H${W - m}V${m + c}"/>
      <path d="M${m} ${H - m - c}V${H - m}H${m + c}"/><path d="M${W - m - c} ${H - m}H${W - m}V${H - m - c}"/>
    </g></svg>`)
  const og = await sharp(bg)
    .composite([
      { input: hud, top: 0, left: 0 },
      { input: book, top: Math.round((H - bookH) / 2), left: Math.round((W - bookMeta.width) / 2) },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer()
  fs.writeFileSync(path.join(APP, 'opengraph-image.jpg'), og)
  fs.writeFileSync(path.join(APP, 'twitter-image.jpg'), og)
}

// ---------------------------------------------------------------------------------------------
// 5. Manifiesto
// ---------------------------------------------------------------------------------------------
const media = {
  hero: {
    desktop: {
      av1: '/media/hero-1280.av1.mp4',
      h264: '/media/hero-1280.mp4',
      poster: heroPosterDesktop,
    },
    mobile: {
      av1: '/media/hero-576.av1.mp4',
      h264: '/media/hero-576.mp4',
      poster: heroPosterMobile,
    },
  },
  cover,
  mockup: { ...mockup, jpg: '/media/libro-mockup.jpg' },
  autor,
  avatar,
}
fs.writeFileSync(MANIFEST, JSON.stringify(media, null, 2) + '\n')

for (const f of fs.readdirSync(OUT).sort()) console.log(`       ${f.padEnd(28)} ${kb(path.join(OUT, f))}`)
console.log(`manifest -> ${path.relative(ROOT, MANIFEST)}`)
