import { CONVERTERS } from "@/config/converters";

export function validateFile(file: File, type: string): { valid: boolean; error?: string } {
  const converter = CONVERTERS.find(c => c.id === type);
  if (!converter) return { valid: true };

  const extension = file.name.split(".").pop()?.toLowerCase();
  
  if (!extension || !converter.extensions.includes(extension)) {
    return { 
      valid: false, 
      error: `Invalid file type. Please upload a ${converter.title.split(' ')[0]} file.` 
    };
  }

  if (file.size > converter.maxSize) {
    return { 
      valid: false, 
      error: `File is too large. Max size is ${converter.maxSize / 1024 / 1024}MB.` 
    };
  }

  return { valid: true };
}
