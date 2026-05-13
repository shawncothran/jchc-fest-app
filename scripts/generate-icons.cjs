/**
 * scripts/generate-icons.js
 *
 * Generates placeholder PWA icon PNGs using only Node.js built-ins.
 * These are solid #09090b (zinc-950) squares with a red "J" approximated
 * via a centered lighter block — good enough for PWA install / browser tabs.
 *
 * Replace public/icons/*.png with real artwork before launch.
 * Run with: node scripts/generate-icons.js
 */

const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

// ── PNG primitives ─────────────────────────────────────────────────────────

function uint32BE(n) {
  const b = Buffer.alloc(4)
  b.writeUInt32BE(n >>> 0)
  return b
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const combined = Buffer.concat([t, data])
  return Buffer.concat([uint32BE(data.length), t, data, uint32BE(crc32(combined))])
}

/**
 * Creates a solid-color PNG with an approximate "J" letter centered.
 * The "J" is drawn as white/light pixels in a simple pixel font pattern.
 */
function createIconPNG(size, bgR, bgG, bgB, fgR, fgG, fgB) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = pngChunk(
    'IHDR',
    Buffer.concat([uint32BE(size), uint32BE(size), Buffer.from([8, 2, 0, 0, 0])])
  )

  // Build raw RGBA pixels — each row: [filter=0, r,g,b, r,g,b, ...]
  const rowBytes = 1 + size * 3
  const raw = Buffer.alloc(size * rowBytes, 0)

  // Fill background
  for (let y = 0; y < size; y++) {
    raw[y * rowBytes] = 0 // filter: None
    for (let x = 0; x < size; x++) {
      const i = y * rowBytes + 1 + x * 3
      raw[i] = bgR
      raw[i + 1] = bgG
      raw[i + 2] = bgB
    }
  }

  // Draw a simple "J" using relative coordinates scaled to icon size
  // J pixel map on a 7×10 grid, scaled proportionally to icon size
  const jMap = [
    [3, 0], [4, 0], [5, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [2, 6], [4, 6],
    [3, 7], [4, 7],
  ]

  const gridW = 7
  const gridH = 10
  const padding = Math.round(size * 0.2)
  const usable = size - padding * 2
  const cellW = usable / gridW
  const cellH = usable / gridH

  for (const [gx, gy] of jMap) {
    const px = Math.round(padding + gx * cellW)
    const py = Math.round(padding + gy * cellH)
    const pw = Math.max(1, Math.round(cellW))
    const ph = Math.max(1, Math.round(cellH))

    for (let dy = 0; dy < ph; dy++) {
      for (let dx = 0; dx < pw; dx++) {
        const x = px + dx
        const y = py + dy
        if (x < 0 || x >= size || y < 0 || y >= size) continue
        const i = y * rowBytes + 1 + x * 3
        raw[i] = fgR
        raw[i + 1] = fgG
        raw[i + 2] = fgB
      }
    }
  }

  const idat = pngChunk('IDAT', zlib.deflateSync(raw, { level: 6 }))
  const iend = pngChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([sig, ihdr, idat, iend])
}

// ── Generate ───────────────────────────────────────────────────────────────

const outDir = path.join(__dirname, '..', 'public', 'icons')
fs.mkdirSync(outDir, { recursive: true })

// Background: #09090b (zinc-950), Foreground: #dc2626 (red-600)
const BG = [9, 9, 11]
const FG = [220, 38, 38]

const icons = [
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
]

for (const { name, size } of icons) {
  const buf = createIconPNG(size, ...BG, ...FG)
  const outPath = path.join(outDir, name)
  fs.writeFileSync(outPath, buf)
  console.log(`✓ ${name} (${size}×${size})`)
}

console.log('\nDone! Replace these with real artwork before launch.')
console.log('Icons written to: public/icons/')
