import mammoth from "mammoth";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";

/**
 * Converts DOCX buffer to PDF buffer.
 */
export async function docxToPdf(buffer: Buffer): Promise<Buffer> {
  const { value: text } = await mammoth.extractRawText({ buffer });
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let page = pdfDoc.addPage();
  const { height } = page.getSize();
  const fontSize = 12;
  const margin = 50;
  let y = height - margin;

  const lines = text.split('\n');
  for (const line of lines) {
    if (y < margin + fontSize) {
      page = pdfDoc.addPage();
      y = height - margin;
    }
    page.drawText(line, { x: margin, y: y, size: fontSize, font: font, color: rgb(0, 0, 0) });
    y -= fontSize * 1.2;
  }
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Converts PDF buffer to DOCX buffer.
 */
export async function pdfToDocx(buffer: Buffer): Promise<Buffer> {
  // Simple text extraction placeholder
  const fullText = "PDF to DOCX conversion result. (Note: Simple text extraction placeholder)";
  const doc = new Document({
    sections: [{ properties: {}, children: [new Paragraph({ children: [new TextRun(fullText)] })] }],
  });
  return await Packer.toBuffer(doc);
}

/**
 * Converts Image buffer to PDF buffer.
 */
export async function jpgToPdf(buffer: Buffer): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const image = await pdfDoc.embedJpg(buffer).catch(() => pdfDoc.embedPng(buffer));
  const page = pdfDoc.addPage([image.width, image.height]);
  page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

import pdf from "pdf-parse";

/**
 * Merges multiple PDF buffers into one.
 */
export async function mergePdfs(buffers: Buffer[]): Promise<Buffer> {
  const mergedPdf = await PDFDocument.create();
  for (const buffer of buffers) {
    const pdf = await PDFDocument.load(buffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  const pdfBytes = await mergedPdf.save();
  return Buffer.from(pdfBytes);
}

/**
 * Compresses a PDF buffer.
 */
export async function compressPdf(buffer: Buffer): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(buffer);
  // pdf-lib doesn't have native "compression" (like image downsampling),
  // but saving with useObjectStreams helps.
  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return Buffer.from(pdfBytes);
}

/**
 * Extracts text from a PDF buffer.
 */
export async function pdfToTxt(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text;
}
