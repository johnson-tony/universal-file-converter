"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, File, CheckCircle, AlertCircle, Loader2, Download } from "lucide-react";
import { validateFile } from "@/utils/validation";
import { CONVERTERS, getConverterById } from "@/config/converters";

export default function ConverterPage() {
  const params = useParams();
  const slug = params.slug as string;
  const converter = getConverterById(slug);
  
  const [title, setTitle] = useState(converter?.title || "Converter");

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "failed">("idle");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileSelection = (selectedFile: File) => {
    const validation = validateFile(selectedFile, slug);
    if (!validation.valid) {
      setErrorMsg(validation.error || "Invalid file.");
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setStatus("idle");
    setErrorMsg(null);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, [slug]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setStatus("uploading");
    setProgress(20);

    try {
      // 1. Get signed params for upload
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type, conversionType: slug }),
      });

      if (!res.ok) throw new Error("Failed to initialize upload.");
      
      const { uploadUrl, signature, timestamp, apiKey, publicId, folder, conversionId } = await res.json();
      setProgress(40);

      // 2. Upload file to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp.toString());
      formData.append("api_key", apiKey);
      formData.append("public_id", publicId);
      formData.append("folder", folder);

      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.error?.message || "Failed to upload file to storage.");
      }

      const uploadData = await uploadRes.json();
      const fileKey = uploadData.public_id; // Cloudinary public_id
      const fileUrl = uploadData.secure_url;

      setStatus("processing");
      setProgress(60);

      // 3. Request conversion
      const convertRes = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversionId, fileKey, fileUrl, conversionType: slug }),
      });

      if (!convertRes.ok) throw new Error("Failed to process conversion.");

      const result = await convertRes.json();
      setProgress(100);
      setDownloadUrl(result.downloadUrl);
      setStatus("completed");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during conversion.");
      setStatus("failed");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">{title}</h1>
        <p className="text-muted-foreground text-sm">Upload your file to start the conversion process.</p>
      </div>

      <Card className="w-full shadow-md border-primary/10 overflow-hidden">
        <CardHeader className="pb-3 border-b ">
          <CardTitle className="text-lg">File Upload</CardTitle>
          <CardDescription className="text-xs">Select or drop your file below</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {status === "idle" || status === "failed" ? (
            <div className="space-y-4">
              <div
                onDragOver={onDragOver}
                onDrop={onDrop}
                className="border-2 border-dashed border-input rounded-xl p-6 text-center hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept={converter?.accept}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  {file ? (
                    <div>
                      <p className="font-semibold text-sm truncate max-w-[200px] mx-auto">{file.name}</p>
                      <p className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-sm">Click or drag file to upload</p>
                      <p className="text-[10px] text-muted-foreground">Max size: {converter ? (converter.maxSize / 1024 / 1024).toFixed(0) : "10"}MB</p>
                    </div>
                  )}
                </div>
              </div>

              {errorMsg && (
                <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-lg flex items-center gap-2 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="line-clamp-2">{errorMsg}</p>
                </div>
              )}

              {file && (
                <div className="flex justify-center pt-2">
                  <Button className="w-full md:w-auto px-10 h-10 font-bold" onClick={handleConvert}>
                    Start Conversion
                  </Button>
                </div>
              )}
            </div>
          ) : status === "completed" ? (
            <div className="text-center py-2 space-y-4">
              <div className="flex justify-center">
                <div className="h-14 w-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
                  <CheckCircle className="h-8 w-8" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Done!</h3>
                <p className="text-muted-foreground text-xs">Your file is ready to download.</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-2 pt-2">
                <Button asChild className="gap-2 h-10 px-6 font-bold flex-1 sm:flex-none">
                  <a href={downloadUrl!} download>
                    <Download className="h-4 w-4" /> Download
                  </a>
                </Button>
                <Button variant="outline" className="h-10 px-6 font-bold flex-1 sm:flex-none" onClick={() => { setFile(null); setStatus("idle"); setDownloadUrl(null); }}>
                  New Conversion
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="flex justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
              <div className="max-w-xs mx-auto">
                <h3 className="text-base font-bold mb-2">
                  {status === "uploading" ? "Uploading..." : "Processing..."}
                </h3>
                <div className="w-full bg-muted rounded-full h-2 mb-1 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground">{progress}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
