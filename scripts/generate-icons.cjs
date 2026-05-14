/**
 * scripts/generate-icons.cjs
 *
 * Resizes src/assets/icon.png into PWA icons at required sizes.
 */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SOURCE = path.join(__dirname, "..", "src", "assets", "icon.png");
const OUT_DIR = path.join(__dirname, "..", "public", "icons");

const icons = [
  { name: "favicon-48x48.png", size: 48 },
  { name: "icon-192x192.png", size: 192 },
  { name: "icon-512x512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const { name, size } of icons) {
    await sharp(SOURCE)
      .resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(path.join(OUT_DIR, name));
    console.log(`✓ ${name} (${size}×${size})`);
  }

  console.log("\nDone! Icons written to: public/icons/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
