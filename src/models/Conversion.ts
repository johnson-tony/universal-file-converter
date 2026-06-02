import mongoose, { Schema, Document } from "mongoose";

export interface IConversion extends Document {
  conversionType: string;
  originalFileName: string;
  outputFileName?: string;
  originalFileSize: number;
  outputFileSize?: number;
  inputFileUrl: string;
  outputFileUrl?: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  processingTime?: number; // in milliseconds
  errorMessage?: string;
}

const ConversionSchema: Schema = new Schema(
  {
    conversionType: { type: String, required: true },
    originalFileName: { type: String, required: true },
    outputFileName: { type: String },
    originalFileSize: { type: Number, required: true },
    outputFileSize: { type: Number },
    inputFileUrl: { type: String, required: true },
    outputFileUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    },
    processingTime: { type: Number },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

// Index for auto-deletion of expired documents (MongoDB TTL index)
ConversionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Conversion =
  mongoose.models.Conversion ||
  mongoose.model<IConversion>("Conversion", ConversionSchema);
