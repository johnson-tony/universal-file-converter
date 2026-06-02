import convert from "heic-convert";
import sharp from "sharp";

/**
 * Converts HEIC buffer to JPG buffer.
 * @param buffer HEIC file buffer.
 * @returns JPG file buffer.
 */
export async function heicToJpg(buffer: Buffer): Promise<Buffer> {
  const outputBuffer = await convert({
    buffer: buffer,
    format: "JPEG",
    quality: 0.9,
  });
  return Buffer.from(outputBuffer);
}

/**
 * Converts SVG buffer to PNG buffer.
 * @param buffer SVG file buffer.
 * @returns PNG file buffer.
 */
export async function svgToPng(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer).png().toBuffer();
}

/**
 * Converts PNG buffer to SVG.
 * Note: Real raster-to-vector is complex. This wraps the PNG in an SVG container.
 * @param buffer PNG file buffer.
 * @returns SVG file buffer.
 */
export async function pngToSvg(buffer: Buffer): Promise<Buffer> {
  const metadata = await sharp(buffer).metadata();
  const base64 = buffer.toString("base64");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${metadata.width}" height="${metadata.height}">
      <image width="${metadata.width}" height="${metadata.height}" xlink:href="data:image/png;base64,${base64}" />
    </svg>
  `;
  return Buffer.from(svg);
}

/**
 * Converts JPG buffer to PNG buffer.
 */
export async function jpgToPng(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer).png().toBuffer();
}

/**
 * Converts WEBP buffer to PNG buffer.
 */
export async function webpToPng(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer).png().toBuffer();
}

/**
 * Converts PNG buffer to JPG buffer.
 */
export async function pngToJpg(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
}

/**
 * Converts PNG buffer to WEBP buffer.
 */
export async function pngToWebp(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer).webp({ quality: 80 }).toBuffer();
}

/**
 * Converts JPG buffer to WEBP buffer.
 * @param buffer JPG file buffer.
 * @returns WEBP file buffer.
 */
export async function jpgToWebp(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer).webp({ quality: 80 }).toBuffer();
}

/**
 * Converts WEBP buffer to JPG buffer.
 * @param buffer WEBP file buffer.
 * @returns JPG file buffer.
 */
export async function webpToJpg(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
}
