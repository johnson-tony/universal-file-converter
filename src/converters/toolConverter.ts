import pngToIco from "png-to-ico";
import sharp from "sharp";

/**
 * Converts PNG buffer to ICO buffer (favicon).
 */
export async function convertToIco(buffer: Buffer): Promise<Buffer> {
  return await pngToIco(buffer);
}

/**
 * Compresses an image buffer.
 */
export async function compressImage(buffer: Buffer, format: "jpeg" | "png" | "webp"): Promise<Buffer> {
  let pipeline = sharp(buffer);
  
  if (format === "jpeg") {
    pipeline = pipeline.jpeg({ quality: 60, progressive: true });
  } else if (format === "png") {
    pipeline = pipeline.png({ quality: 60, compressionLevel: 9 });
  } else if (format === "webp") {
    pipeline = pipeline.webp({ quality: 60 });
  }

  return await pipeline.toBuffer();
}
