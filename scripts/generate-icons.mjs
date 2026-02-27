import sharp from "sharp";
import pngToIco from "png-to-ico";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, "../public/icons/icon.svg");
const outDir = resolve(__dirname, "../public/icons");
const appDir = resolve(__dirname, "../src/app");

const svg = readFileSync(svgPath);

const pngSizes = [16, 32, 48, 192, 512];
const pngBuffers = {};

for (const size of pngSizes) {
  const buf = await sharp(svg).resize(size, size).png().toBuffer();
  pngBuffers[size] = buf;
  if (size >= 192) {
    await sharp(buf).toFile(`${outDir}/icon-${size}.png`);
    console.log(`Generated icon-${size}.png`);
  }
}

const ico = await pngToIco([pngBuffers[16], pngBuffers[32], pngBuffers[48]]);
writeFileSync(`${appDir}/favicon.ico`, ico);
console.log("Generated favicon.ico");
