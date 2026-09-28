// Corrige los archivos de prefetch del export estático cuando el build corre en Windows.
//
// Next 16 (export/index.js) arma el nombre `__next<segmento>.txt` reemplazando solo "/"
// por "."; en Windows las rutas de segmento vienen con "\" y terminan como carpetas
// (`__next.producto/$d$slug/__PAGE__.txt`). El navegador pide
// `__next.producto.$d$slug.__PAGE__.txt`, recibe 404 y la navegación pierde el prefetch.
// Este paso aplana esas carpetas al nombre con puntos. En Linux (Vercel) no hay nada que
// corregir y el script no hace cambios.
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.resolve(import.meta.dirname, '../out')
let moved = 0

function filesIn(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name)
    return e.isDirectory() ? filesIn(full, base) : [path.relative(base, full)]
  })
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (!entry.isDirectory()) continue
    if (entry.name.startsWith('__next.')) {
      for (const rel of filesIn(full)) {
        const flat = `${entry.name}.${rel.split(path.sep).join('.')}`
        fs.renameSync(path.join(full, rel), path.join(dir, flat))
        moved++
      }
      fs.rmSync(full, { recursive: true, force: true })
    } else {
      walk(full)
    }
  }
}

if (fs.existsSync(OUT)) {
  walk(OUT)
  console.log(moved ? `fix-export: ${moved} archivos de prefetch normalizados` : 'fix-export: nada que corregir')
}
