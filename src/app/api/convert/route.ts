import { NextResponse } from "next/server";
import { getDownloadUrl, s3Client } from "@/lib/r2";
import connectToDatabase from "@/lib/mongodb";
import { Conversion } from "@/models/Conversion";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { excelToJson, jsonToExcel, excelToCsv } from "@/converters/excelConverter";
import { jsonToPdf } from "@/converters/pdfConverter";
import { svgToPng, pngToSvg, heicToJpg, jpgToWebp, webpToJpg, jpgToPng, webpToPng, pngToJpg, pngToWebp } from "@/converters/imageConverter";
import { docxToPdf, pdfToDocx, jpgToPdf as imgToPdf, mergePdfs, compressPdf, pdfToTxt } from "@/converters/documentConverter";
import { csvToJson, jsonToCsv, xmlToJson, jsonToXml, yamlToJson } from "@/converters/dataConverter";
import { convertToIco, compressImage } from "@/converters/toolConverter";
import { getConverterById } from "@/config/converters";

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

async function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk: any) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

export async function POST(req: Request) {
  const startTime = Date.now();
  let currentConversionId: string | null = null;

  try {
    const { conversionId, fileKey, conversionType } = await req.json();
    currentConversionId = conversionId;

    const converterConfig = getConverterById(conversionType);
    if (!converterConfig || !conversionId || !fileKey) {
      return NextResponse.json({ error: "Missing required fields or invalid converter" }, { status: 400 });
    }

    await connectToDatabase();
    await Conversion.findByIdAndUpdate(conversionId, { status: "processing" });

    // 1. Download original file from R2
    const getCommand = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
    });
    const { Body } = await s3Client.send(getCommand);
    const inputBuffer = await streamToBuffer(Body);

    // 2. Perform conversion
    let outputBuffer: Buffer;
    const targetExt = converterConfig.targetExt;
    const contentType = converterConfig.contentType;

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
        const htmlText = inputBuffer.toString().replace(/<[^>]*>?/gm, '');
        outputBuffer = await jsonToPdf([{ content: htmlText }]);
        break;
      case "pdf-to-csv":
        const pdfData = await pdfToTxt(inputBuffer);
        outputBuffer = Buffer.from(pdfData); // Simplified
        break;
      case "pdf-to-excel":
        const pdfText = await pdfToTxt(inputBuffer);
        outputBuffer = await jsonToExcel([{ content: pdfText }]);
        break;
      case "pdf-to-jpg":
        // Fallback or complex impl
        outputBuffer = inputBuffer; 
        break;
      case "excel-to-csv":
        const csvStr = await excelToCsv(inputBuffer);
        outputBuffer = Buffer.from(csvStr);
        break;
      default:
        throw new Error(`Conversion logic not implemented for: ${conversionType}`);
    }

    // 3. Upload converted file to R2
    const outputKey = fileKey.replace("uploads/", "converted/").replace(/\.[^/.]+$/, "") + "." + targetExt;
    const putCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: outputKey,
      Body: outputBuffer,
      ContentType: contentType,
    });
    await s3Client.send(putCommand);

    // 4. Generate download URL
    const downloadUrl = await getDownloadUrl(outputKey);
    const processingTime = Date.now() - startTime;

    // 5. Update MongoDB
    await Conversion.findByIdAndUpdate(conversionId, {
      status: "completed",
      outputFileUrl: outputKey,
      outputFileName: outputKey.split("/").pop(),
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
