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
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">Upload your file below to start the conversion process.</p>
      </div>

      <Card className="w-full shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>Drag and drop your file or click to browse</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "idle" || status === "failed" ? (
            <div className="space-y-6">
              <div
                onDragOver={onDragOver}
                onDrop={onDrop}
                className="border-2 border-dashed border-input rounded-xl p-12 text-center hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept={converter?.accept}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full text-primary">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  {file ? (
                    <div>
                      <p className="font-medium text-lg">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-lg">Click or drag file to this area to upload</p>
                      <p className="text-sm text-muted-foreground">Support for single file upload.</p>
                    </div>
                  )}
                </div>
              </div>

              {errorMsg && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-3">
                  <AlertCircle className="h-5 w-5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              {file && (
                <div className="flex justify-center">
                  <Button size="lg" className="w-full sm:w-auto px-8" onClick={handleConvert}>
                    Start Conversion
                  </Button>
                </div>
              )}
            </div>
          ) : status === "completed" ? (
            <div className="text-center py-12 space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-20 bg-success/10 text-success rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Conversion Successful!</h3>
                <p className="text-muted-foreground">Your file is ready to download.</p>
              </div>
              <div className="flex justify-center gap-4">
                <Button size="lg" asChild className="gap-2">
                  <a href={downloadUrl!} download>
                    <Download className="h-5 w-5" /> Download File
                  </a>
                </Button>
                <Button size="lg" variant="outline" onClick={() => { setFile(null); setStatus("idle"); setDownloadUrl(null); }}>
                  Convert Another
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-6">
              <div className="flex justify-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {status === "uploading" ? "Uploading your file..." : "Processing conversion..."}
                </h3>
                <div className="w-full max-w-md mx-auto bg-muted rounded-full h-2.5 mb-2 overflow-hidden">
                  <div className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-sm text-muted-foreground">{progress}% Complete</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
