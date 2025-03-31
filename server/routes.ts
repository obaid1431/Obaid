import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import * as path from "path";
import { insertFileSchema, insertConversionJobSchema } from "@shared/schema";
import { z } from "zod";
import { createWorker } from "tesseract.js";

// Configure file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB size limit
  },
});

// Temporary directory for file storage
const TEMP_DIR = path.join(process.cwd(), "temp");

// Ensure temp directory exists
async function ensureTempDir() {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create temp directory", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  await ensureTempDir();

  // Upload PDF file
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { originalname, mimetype, buffer, size } = req.file;

      // Validate file type
      const allowedMimeTypes = [
        "application/pdf", 
        "image/jpeg", 
        "image/png", 
        "image/gif", 
        "image/bmp", 
        "image/tiff"
      ];
      
      if (!allowedMimeTypes.includes(mimetype)) {
        return res.status(400).json({ message: "Only PDF and image files (JPEG, PNG, GIF, BMP, TIFF) are allowed" });
      }

      // Generate a unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}_${originalname.replace(/\s+/g, "_")}`;
      const filePath = path.join(TEMP_DIR, filename);

      // Save file to disk
      await fs.writeFile(filePath, buffer);

      // Create file record
      const fileRecord = {
        filename,
        originalFilename: originalname,
        mimeType: mimetype,
        size,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours expiration
      };

      const file = await storage.createFile(fileRecord);

      return res.status(201).json({
        id: file.id,
        name: file.originalFilename,
        size: file.size,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Get PDF information
  app.get("/api/files/:fileId/info", async (req, res) => {
    try {
      const fileId = parseInt(req.params.fileId);
      const file = await storage.getFile(fileId);

      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      const filePath = path.join(TEMP_DIR, file.filename);
      const pdfBytes = await fs.readFile(filePath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      return res.json({
        id: file.id,
        name: file.originalFilename,
        size: file.size,
        pageCount: pdfDoc.getPageCount(),
      });
    } catch (error) {
      console.error("Error getting PDF info:", error);
      return res.status(500).json({ message: "Failed to get PDF information" });
    }
  });

  // Extract pages from PDF
  app.post("/api/pdf/extract", async (req, res) => {
    try {
      const schema = z.object({
        fileId: z.number(),
        pages: z.array(z.number()),
      });

      const validatedData = schema.parse(req.body);
      const { fileId, pages } = validatedData;

      const file = await storage.getFile(fileId);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      const filePath = path.join(TEMP_DIR, file.filename);
      const pdfBytes = await fs.readFile(filePath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Create a new document with selected pages
      const newPdfDoc = await PDFDocument.create();
      
      for (const pageIndex of pages) {
        if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) {
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex]);
          newPdfDoc.addPage(copiedPage);
        }
      }
      
      const newPdfBytes = await newPdfDoc.save();
      
      // Save extracted PDF
      const outputFilename = `extracted_${file.filename}`;
      const outputPath = path.join(TEMP_DIR, outputFilename);
      await fs.writeFile(outputPath, newPdfBytes);
      
      // Create file record for the output
      const outputFile = await storage.createFile({
        filename: outputFilename,
        originalFilename: `extracted_${file.originalFilename}`,
        mimeType: "application/pdf",
        size: newPdfBytes.length,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
      
      // Create job record
      const job = await storage.createConversionJob({
        fileId,
        outputFileId: outputFile.id,
        status: "completed",
        jobType: "extract",
        options: { pages },
        createdAt: new Date().toISOString(),
      });
      
      return res.status(200).json({
        jobId: job.id,
        fileId: outputFile.id,
        name: outputFile.originalFilename,
        size: outputFile.size,
      });
    } catch (error) {
      console.error("Error extracting pages:", error);
      return res.status(500).json({ message: "Failed to extract pages" });
    }
  });

  // Download processed file
  app.get("/api/files/:fileId/download", async (req, res) => {
    try {
      const fileId = parseInt(req.params.fileId);
      const file = await storage.getFile(fileId);

      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      const filePath = path.join(TEMP_DIR, file.filename);
      
      res.setHeader("Content-Type", file.mimeType);
      res.setHeader("Content-Disposition", `attachment; filename="${file.originalFilename}"`);
      
      const fileStream = await fs.readFile(filePath);
      return res.send(fileStream);
    } catch (error) {
      console.error("Error downloading file:", error);
      return res.status(500).json({ message: "Failed to download file" });
    }
  });

  // OCR Text Extraction
  app.post("/api/ocr/extract", async (req, res) => {
    try {
      const schema = z.object({
        fileId: z.number(),
        language: z.string().default("eng"),
      });

      const validatedData = schema.parse(req.body);
      const { fileId, language } = validatedData;

      const file = await storage.getFile(fileId);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      const filePath = path.join(TEMP_DIR, file.filename);
      
      // Initialize tesseract worker
      const worker = await createWorker(language);
      
      try {
        // For PDFs, we would need to convert to images first
        // For simplicity in this demo, we'll just process the first page or the image directly
        let textResult;
        
        if (file.mimeType === "application/pdf") {
          // For PDFs, we could extract the first page and convert to image, but this is simplified
          textResult = await worker.recognize(filePath);
        } else {
          // For images, process directly
          textResult = await worker.recognize(filePath);
        }
        
        await worker.terminate();
        
        return res.status(200).json({
          text: textResult.data.text,
          confidence: textResult.data.confidence,
        });
      } catch (err) {
        await worker.terminate();
        throw err;
      }
    } catch (error) {
      console.error("Error extracting text with OCR:", error);
      return res.status(500).json({ message: "Failed to extract text" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
