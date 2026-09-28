// Aplana un cuadrilátero de una imagen (p. ej. la tapa de un mockup en perspectiva) a un
// rectángulo, con una homografía y muestreo bicúbico. No redibuja nada: solo deshace la
// perspectiva del render para poder usar la portada tal cual en el libro 3D de CSS.
import sharp from 'sharp'

function solveHomography(src, dst) {
  // dst(u,v) -> src(x,y):  x = (a u + b v + c) / (g u + h v + 1),  y = (d u + e v + f) / (g u + h v + 1)
  const A = []
  const B = []
  for (let i = 0; i < 4; i++) {
    const [u, v] = dst[i]
    const [x, y] = src[i]
    A.push([u, v, 1, 0, 0, 0, -u * x, -v * x])
    B.push(x)
    A.push([0, 0, 0, u, v, 1, -u * y, -v * y])
    B.push(y)
  }
  const n = 8
  for (let col = 0; col < n; col++) {
    let piv = col
    for (let r = col + 1; r < n; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r
    ;[A[col], A[piv]] = [A[piv], A[col]]
    ;[B[col], B[piv]] = [B[piv], B[col]]
    for (let r = 0; r < n; r++) {
      if (r === col) continue
      const f = A[r][col] / A[col][col]
      for (let c = col; c < n; c++) A[r][c] -= f * A[col][c]
      B[r] -= f * B[col]
    }
  }
  return B.map((b, i) => b / A[i][i])
}

// Catmull-Rom
function cubic(p0, p1, p2, p3, t) {
  return p1 + 0.5 * t * (p2 - p0 + t * (2 * p0 - 5 * p1 + 4 * p2 - p3 + t * (3 * (p1 - p2) + p3 - p0)))
}

/**
 * @param {string} file imagen de origen
 * @param {{tl:number[],tr:number[],br:number[],bl:number[]}} quad esquinas en px del origen
 * @param {number} width ancho de salida
 * @param {number} height alto de salida
 * @param {number} inset px que se recortan hacia dentro en cada borde (evita el fondo del mockup)
 * @returns {Promise<Buffer>} PNG
 */
export async function flattenQuad(file, quad, width, height, inset = 1.5) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const h = solveHomography(
    [quad.tl, quad.tr, quad.br, quad.bl],
    [
      [-inset, -inset],
      [width + inset, -inset],
      [width + inset, height + inset],
      [-inset, height + inset],
    ],
  )
  const px = (x, y, c) => {
    x = Math.min(info.width - 1, Math.max(0, x))
    y = Math.min(info.height - 1, Math.max(0, y))
    return data[(y * info.width + x) * 3 + c]
  }
  const sample = (x, y, c) => {
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const tx = x - x0
    const ty = y - y0
    const rows = []
    for (let j = -1; j <= 2; j++) {
      rows.push(cubic(px(x0 - 1, y0 + j, c), px(x0, y0 + j, c), px(x0 + 1, y0 + j, c), px(x0 + 2, y0 + j, c), tx))
    }
    return Math.min(255, Math.max(0, Math.round(cubic(rows[0], rows[1], rows[2], rows[3], ty))))
  }
  const out = Buffer.alloc(width * height * 3)
  for (let v = 0; v < height; v++) {
    for (let u = 0; u < width; u++) {
      const uu = u + 0.5
      const vv = v + 0.5
      const den = h[6] * uu + h[7] * vv + 1
      const x = (h[0] * uu + h[1] * vv + h[2]) / den - 0.5
      const y = (h[3] * uu + h[4] * vv + h[5]) / den - 0.5
      for (let c = 0; c < 3; c++) out[(v * width + u) * 3 + c] = sample(x, y, c)
    }
  }
  return sharp(out, { raw: { width, height, channels: 3 } }).png().toBuffer()
}
