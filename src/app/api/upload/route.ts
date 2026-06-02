import { NextResponse } from "next/server";
import { getUploadUrl } from "@/lib/r2";
import connectToDatabase from "@/lib/mongodb";
import { Conversion } from "@/models/Conversion";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { fileName, contentType, conversionType } = await req.json();

    if (!fileName || !contentType || !conversionType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const fileId = crypto.randomUUID();
    const fileExtension = fileName.split(".").pop();
    const storageKey = `uploads/${fileId}.${fileExtension}`;

    // Get signed URL from R2
    const uploadUrl = await getUploadUrl(storageKey, contentType);

    // Save record to MongoDB
    await connectToDatabase();
    
    const conversion = await Conversion.create({
      conversionType,
      originalFileName: fileName,
      originalFileSize: 0, // Will be updated later
      inputFileUrl: storageKey,
      status: "pending",
    });

    return NextResponse.json({
      uploadUrl,
      fileKey: storageKey,
      conversionId: conversion._id,
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
