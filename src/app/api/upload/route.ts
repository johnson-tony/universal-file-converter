import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import connectToDatabase from "@/lib/mongodb";
import { Conversion } from "@/models/Conversion";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { fileName, contentType, conversionType } = await req.json();

    if (!fileName || !contentType || !conversionType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const fileId = crypto.randomUUID();
    const publicId = `${fileId}`;
    const folder = "uploads";

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
        public_id: publicId,
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    // Save record to MongoDB
    await connectToDatabase();
    
    const conversion = await Conversion.create({
      conversionType,
      originalFileName: fileName,
      originalFileSize: 0, // Will be updated later
      inputFileUrl: `${folder}/${publicId}`, // Store publicId as the URL reference
      status: "pending",
    });

    return NextResponse.json({
      uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      publicId,
      folder,
      conversionId: conversion._id,
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
