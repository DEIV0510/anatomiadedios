// Servidor estático mínimo para probar el build de producción (carpeta out/) en local, con
// compresión, caché y peticiones por rangos (Safari y Chrome las usan para el video).
// Uso: node scripts/serve-out.mjs 5432
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const ROOT = path.resolve(import.meta.dirname, '../out')
const PORT = Number(process.argv[2] || 5432)
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webmanifest': 'application/manifest+json',
}
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.txt', '.xml', '.svg', '.webmanifest'])
const CACHE = new Map()

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/\.\.+/g, '')
  const direct = path.join(ROOT, clean)
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct
  const index = path.join(direct, 'index.html')
  if (fs.existsSync(index)) return index
  const html = `${direct.replace(/[\\/]$/, '')}.html`
  if (fs.existsSync(html)) return html
  return null
}

http
  .createServer((req, res) => {
    const url = req.url || '/'
    let file = resolve(url)
    let status = 200
    if (!file) {
      file = path.join(ROOT, '404.html')
      status = 404
    }
    const ext = path.extname(file)
    const headers = {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Cache-Control': url.startsWith('/_next/static/') ? 'public, max-age=31536000, immutable' : url.startsWith('/media/') ? 'public, max-age=604800' : 'no-cache',
    }

    // Video: rangos de bytes
    if (ext === '.mp4') {
      const size = fs.statSync(file).size
      headers['Accept-Ranges'] = 'bytes'
      const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '')
      if (m) {
        const start = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2]))
        const end = m[1] && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1
        headers['Content-Range'] = `bytes ${start}-${end}/${size}`
        headers['Content-Length'] = end - start + 1
        res.writeHead(206, headers)
        return fs.createReadStream(file, { start, end }).pipe(res)
      }
      headers['Content-Length'] = size
      res.writeHead(200, headers)
      return fs.createReadStream(file).pipe(res)
    }

    let body = fs.readFileSync(file)
    const accept = String(req.headers['accept-encoding'] || '')
    // Comprimido una sola vez por archivo y versión (como un hosting real con caché):
    // recomprimir en cada petición con brotli 11 sumaba ~1 s al tiempo de respuesta
    const enc = COMPRESSIBLE.has(ext) ? (accept.includes('br') ? 'br' : accept.includes('gzip') ? 'gzip' : null) : null
    if (enc) {
      const clave = `${file}|${fs.statSync(file).mtimeMs}|${enc}`
      if (!CACHE.has(clave)) CACHE.set(clave, enc === 'br' ? zlib.brotliCompressSync(body) : zlib.gzipSync(body))
      body = CACHE.get(clave)
      headers['Content-Encoding'] = enc
    }
    headers['Content-Length'] = body.length
    res.writeHead(status, headers)
    res.end(body)
  })
  .listen(PORT, () => console.log(`out/ en http://localhost:${PORT}`))
