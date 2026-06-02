import { NextResponse } from "next/server";
import cloudinary, { uploadBuffer } from "@/lib/cloudinary";
import connectToDatabase from "@/lib/mongodb";
import { Conversion } from "@/models/Conversion";
import { excelToJson, jsonToExcel, excelToCsv } from "@/converters/excelConverter";
import { jsonToPdf } from "@/converters/pdfConverter";
import { svgToPng, pngToSvg, heicToJpg, jpgToWebp, webpToJpg, jpgToPng, webpToPng, pngToJpg, pngToWebp } from "@/converters/imageConverter";
import { docxToPdf, pdfToDocx, jpgToPdf as imgToPdf, mergePdfs, compressPdf, pdfToTxt } from "@/converters/documentConverter";
import { csvToJson, jsonToCsv, xmlToJson, jsonToXml, yamlToJson } from "@/converters/dataConverter";
import { convertToIco, compressImage } from "@/converters/toolConverter";
import { getConverterById } from "@/config/converters";

async function getBufferFromUrl(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file from URL: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req: Request) {
  const startTime = Date.now();
  let currentConversionId: string | null = null;

  try {
    const { conversionId, fileKey, fileUrl, conversionType } = await req.json();
    currentConversionId = conversionId;

    const converterConfig = getConverterById(conversionType);
    if (!converterConfig || !conversionId || !fileKey) {
      return NextResponse.json({ error: "Missing required fields or invalid converter" }, { status: 400 });
    }

    await connectToDatabase();
    await Conversion.findByIdAndUpdate(conversionId, { status: "processing" });

    // 1. Get original file buffer
    let inputBuffer: Buffer;
    if (fileUrl) {
      inputBuffer = await getBufferFromUrl(fileUrl);
    } else {
      // Fallback: fileKey is the publicId (e.g. "uploads/uuid")
      const inputUrl = cloudinary.url(fileKey, { resource_type: "auto", secure: true });
      inputBuffer = await getBufferFromUrl(inputUrl);
    }

    // 2. Perform conversion
    let outputBuffer: Buffer;
    const targetExt = converterConfig.targetExt;

    switch (conversionType) {
      case "excel-to-json":
        const jsonResult = await excelToJson(inputBuffer);
        outputBuffer = Buffer.from(JSON.stringify(jsonResult, null, 2));
        break;
      case "json-to-excel":
        const excelResult = await jsonToExcel(JSON.parse(inputBuffer.toString()));
        outputBuffer = excelResult;
        break;
      case "json-to-pdf":
        const pdfResult = await jsonToPdf(JSON.parse(inputBuffer.toString()));
        outputBuffer = pdfResult;
        break;
      case "svg-to-png":
        outputBuffer = await svgToPng(inputBuffer);
        break;
      case "png-to-svg":
        outputBuffer = await pngToSvg(inputBuffer);
        break;
      case "docx-to-pdf":
        outputBuffer = await docxToPdf(inputBuffer);
        break;
      case "pdf-to-docx":
        outputBuffer = await pdfToDocx(inputBuffer);
        break;
      case "heic-to-jpg":
        outputBuffer = await heicToJpg(inputBuffer);
        break;
      case "jpg-to-webp":
        outputBuffer = await jpgToWebp(inputBuffer);
        break;
      case "jpg-to-pdf":
      case "png-to-pdf":
        outputBuffer = await imgToPdf(inputBuffer);
        break;
      case "csv-to-json":
        const csvData = await csvToJson(inputBuffer);
        outputBuffer = Buffer.from(JSON.stringify(csvData, null, 2));
        break;
      case "json-to-csv":
        const csvString = await jsonToCsv(JSON.parse(inputBuffer.toString()));
        outputBuffer = Buffer.from(csvString);
        break;
      case "xml-to-json":
        const xmlData = await xmlToJson(inputBuffer);
        outputBuffer = Buffer.from(JSON.stringify(xmlData, null, 2));
        break;
      case "json-to-xml":
        const xmlString = await jsonToXml(JSON.parse(inputBuffer.toString()));
        outputBuffer = Buffer.from(xmlString);
        break;
      case "yaml-to-json":
        const yamlData = await yamlToJson(inputBuffer);
        outputBuffer = Buffer.from(JSON.stringify(yamlData, null, 2));
        break;
      case "png-to-ico":
        outputBuffer = await convertToIco(inputBuffer);
        break;
      case "image-compressor":
        const format = fileKey.split('.').pop()?.toLowerCase() as any;
        outputBuffer = await compressImage(inputBuffer, format === "png" ? "png" : format === "webp" ? "webp" : "jpeg");
        break;
      case "pdf-merger":
        outputBuffer = await mergePdfs([inputBuffer]); 
        break;
      case "heic-to-png":
        const tempJpg = await heicToJpg(inputBuffer);
        outputBuffer = await svgToPng(tempJpg);
        break;
      case "excel-to-pdf":
        const excelJson = await excelToJson(inputBuffer);
        outputBuffer = await jsonToPdf(excelJson);
        break;
      case "jpg-to-png":
        outputBuffer = await jpgToPng(inputBuffer);
        break;
      case "png-to-jpg":
        outputBuffer = await pngToJpg(inputBuffer);
        break;
      case "webp-to-png":
        outputBuffer = await webpToPng(inputBuffer);
        break;
      case "webp-to-jpg":
        outputBuffer = await webpToJpg(inputBuffer);
        break;
      case "png-to-webp":
        outputBuffer = await pngToWebp(inputBuffer);
        break;
      case "pdf-to-txt":
        const text = await pdfToTxt(inputBuffer);
        outputBuffer = Buffer.from(text);
        break;
      case "pdf-compressor":
        outputBuffer = await compressPdf(inputBuffer);
        break;
      case "html-to-pdf":
        // Simple HTML to PDF via text extraction for now
        const htmlText = inputBuffer.toString().replace(/<[^>]*>?/gm, '');
        outputBuffer = await jsonToPdf([{ content: htmlText }]);
        break;
      case "pdf-to-csv":
        const pdfData = await pdfToTxt(inputBuffer);
        outputBuffer = Buffer.from(pdfData); 
        break;
      case "pdf-to-excel":
        const pdfText = await pdfToTxt(inputBuffer);
        outputBuffer = await jsonToExcel([{ content: pdfText }]);
        break;
      case "pdf-to-jpg":
        outputBuffer = inputBuffer; 
        break;
      case "excel-to-csv":
        const csvStr = await excelToCsv(inputBuffer);
        outputBuffer = Buffer.from(csvStr);
        break;
      default:
        throw new Error(`Conversion logic not implemented for: ${conversionType}`);
    }

    // 3. Upload converted file to Cloudinary
    const outputFileName = `${fileKey.split("/").pop()}_converted.${targetExt}`;
    const uploadResult: any = await uploadBuffer(outputBuffer, "converted", outputFileName);
    const downloadUrl = uploadResult.secure_url;
    const outputKey = uploadResult.public_id;
    
    const processingTime = Date.now() - startTime;

    // 4. Update MongoDB
    await Conversion.findByIdAndUpdate(conversionId, {
      status: "completed",
      outputFileUrl: downloadUrl, // Using the full secure_url for direct download
      outputFileName: outputFileName,
      outputFileSize: outputBuffer.length,
      processingTime,
    });

    return NextResponse.json({
      success: true,
      downloadUrl,
      outputFileKey: outputKey,
    });
  } catch (error: any) {
    console.error("Convert API Error:", error);
    
    if (currentConversionId) {
      await connectToDatabase();
      await Conversion.findByIdAndUpdate(currentConversionId, {
        status: "failed",
        errorMessage: error.message
      });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
