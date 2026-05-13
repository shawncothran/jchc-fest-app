/**
 * scripts/generate-icons.cjs
 *
 * Generates clean, minimal PWA icons with a bold geometric "J" letterform.
 * Dark background (#09090b) with white letter — monochrome and sparse.
 */

const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

// ── PNG primitives ─────────────────────────────────────────────────────────

function uint32BE(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n >>> 0);
  return b;
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++)
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const combined = Buffer.concat([t, data]);
  return Buffer.concat([
    uint32BE(data.length),
    t,
    data,
    uint32BE(crc32(combined)),
  ]);
}

/**
 * Creates a minimal icon with bold geometric "J" letterform.
 * Dark background (#09090b) with white letter.
 */
function createIconPNG(size) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = pngChunk(
    "IHDR",
    Buffer.concat([
      uint32BE(size),
      uint32BE(size),
      Buffer.from([8, 2, 0, 0, 0]),
    ])
  );

  // Build raw RGB pixels
  const rowBytes = 1 + size * 3;
  const raw = Buffer.alloc(size * rowBytes * size, 0);

  // Dark background: #09090b
  const bgR = 9,
    bgG = 9,
    bgB = 11;
  // White foreground: #ffffff
  const fgR = 255,
    fgG = 255,
    fgB = 255;

  // Fill background
  for (let y = 0; y < size; y++) {
    raw[y * rowBytes] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const i = y * rowBytes + 1 + x * 3;
      raw[i] = bgR;
      raw[i + 1] = bgG;
      raw[i + 2] = bgB;
    }
  }

  // Helper: draw filled rectangle
  function fillRect(x1, y1, x2, y2) {
    for (
      let y = Math.max(0, Math.floor(y1));
      y <= Math.min(size - 1, Math.floor(y2));
      y++
    ) {
      for (
        let x = Math.max(0, Math.floor(x1));
        x <= Math.min(size - 1, Math.floor(x2));
        x++
      ) {
        const i = y * rowBytes + 1 + x * 3;
        raw[i] = fgR;
        raw[i + 1] = fgG;
        raw[i + 2] = fgB;
      }
    }
  }

  // Draw bold "J": thick vertical stroke + bottom hook
  const strokeW = Math.round(size * 0.18); // ~20% of size
  const margin = Math.round(size * 0.2);
  const xCenter = size * 0.5;
  const yTop = margin;
  const yBottom = size - margin;
  const xLeft = xCenter - strokeW / 2;
  const xRight = xCenter + strokeW / 2;

  // Vertical stroke
  fillRect(xLeft, yTop, xRight, yBottom * 0.7);

  // Bottom hook (curve sweep)
  const hookStartY = yBottom * 0.65;
  const hookEndY = yBottom;
  const hookRadius = strokeW * 1.2;

  for (let y = hookStartY; y <= hookEndY; y++) {
    const fy = (y - hookStartY) / (hookEndY - hookStartY); // 0 to 1
    const rx = Math.sqrt(1 - fy * fy) * hookRadius; // Quarter arc
    const cx = xLeft - rx;
    fillRect(cx - strokeW / 2, y, cx + strokeW / 2, y);
  }

  const idat = pngChunk("IDAT", zlib.deflateSync(raw, { level: 6 }));
  const iend = pngChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// ── Generate ───────────────────────────────────────────────────────────────

const outDir = path.join(__dirname, "..", "public", "icons");
fs.mkdirSync(outDir, { recursive: true });

const icons = [
  { name: "icon-192x192.png", size: 192 },
  { name: "icon-512x512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of icons) {
  const buf = createIconPNG(size);
  const outPath = path.join(outDir, name);
  fs.writeFileSync(outPath, buf);
  console.log(`✓ ${name} (${size}×${size})`);
}

console.log("\nDone! Minimal monochrome icons generated.");
console.log("Icons written to: public/icons/");
