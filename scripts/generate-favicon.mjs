import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const size = 32;
const bytesPerPixel = 4;
const pixelDataSize = size * size * bytesPerPixel;
const andMaskSize = (size * size) / 8;

const dibHeaderSize = 40;
const imageSize = dibHeaderSize + pixelDataSize + andMaskSize;
const iconOffset = 6 + 16;

const output = Buffer.alloc(iconOffset + imageSize);
let pointer = 0;

output.writeUInt16LE(0, pointer);
pointer += 2;
output.writeUInt16LE(1, pointer);
pointer += 2;
output.writeUInt16LE(1, pointer);
pointer += 2;

output.writeUInt8(size, pointer);
pointer += 1;
output.writeUInt8(size, pointer);
pointer += 1;
output.writeUInt8(0, pointer);
pointer += 1;
output.writeUInt8(0, pointer);
pointer += 1;
output.writeUInt16LE(1, pointer);
pointer += 2;
output.writeUInt16LE(32, pointer);
pointer += 2;
output.writeUInt32LE(imageSize, pointer);
pointer += 4;
output.writeUInt32LE(iconOffset, pointer);
pointer += 4;

output.writeUInt32LE(dibHeaderSize, pointer);
pointer += 4;
output.writeInt32LE(size, pointer);
pointer += 4;
output.writeInt32LE(size * 2, pointer);
pointer += 4;
output.writeUInt16LE(1, pointer);
pointer += 2;
output.writeUInt16LE(32, pointer);
pointer += 2;
output.writeUInt32LE(0, pointer);
pointer += 4;
output.writeUInt32LE(pixelDataSize, pointer);
pointer += 4;
output.writeInt32LE(0, pointer);
pointer += 4;
output.writeInt32LE(0, pointer);
pointer += 4;
output.writeUInt32LE(0, pointer);
pointer += 4;
output.writeUInt32LE(0, pointer);
pointer += 4;

const background = { r: 14, g: 116, b: 144, a: 255 };
const foreground = { r: 255, g: 255, b: 255, a: 255 };
const transparent = { r: 0, g: 0, b: 0, a: 0 };

const center = size / 2;
const radius = 13;
const crossHalfLength = 7;
const crossHalfThickness = 2;

for (let y = size - 1; y >= 0; y -= 1) {
  for (let x = 0; x < size; x += 1) {
    const dx = x + 0.5 - center;
    const dy = y + 0.5 - center;
    const inCircle = dx * dx + dy * dy <= radius * radius;

    const inVertical =
      Math.abs(x + 0.5 - center) <= crossHalfThickness &&
      Math.abs(y + 0.5 - center) <= crossHalfLength;

    const inHorizontal =
      Math.abs(y + 0.5 - center) <= crossHalfThickness &&
      Math.abs(x + 0.5 - center) <= crossHalfLength;

    const color = inCircle ? background : transparent;
    const finalColor = inVertical || inHorizontal ? foreground : color;

    output.writeUInt8(finalColor.b, pointer);
    pointer += 1;
    output.writeUInt8(finalColor.g, pointer);
    pointer += 1;
    output.writeUInt8(finalColor.r, pointer);
    pointer += 1;
    output.writeUInt8(finalColor.a, pointer);
    pointer += 1;
  }
}

for (let i = 0; i < andMaskSize; i += 1) {
  output.writeUInt8(0, pointer);
  pointer += 1;
}

const targetPath = resolve(process.cwd(), "app", "favicon.ico");
writeFileSync(targetPath, output);
console.log(`Wrote ${targetPath}`);
