import * as pdfjs from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Extract pages from PDF
export async function extractPages(pdfBytes: ArrayBuffer, pageIndices: number[]): Promise<Uint8Array> {
  try {
    const srcDoc = await PDFDocument.load(pdfBytes);
    const newDoc = await PDFDocument.create();

    // Sort the page indices to preserve original order
    const sortedIndices = [...pageIndices].sort((a, b) => a - b);

    // Copy each selected page to the new document
    for (const pageIndex of sortedIndices) {
      if (pageIndex >= 0 && pageIndex < srcDoc.getPageCount()) {
        const [copiedPage] = await newDoc.copyPages(srcDoc, [pageIndex]);
        newDoc.addPage(copiedPage);
      }
    }

    // Save and return the new PDF
    return await newDoc.save();
  } catch (error) {
    console.error("Error extracting PDF pages:", error);
    throw new Error("Failed to extract pages from PDF");
  }
}

// Function to render PDF page to canvas
export async function renderPageToCanvas(
  pdf: pdfjs.PDFDocumentProxy,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale = 1.0
): Promise<void> {
  try {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const renderContext = {
      canvasContext: canvas.getContext("2d")!,
      viewport,
    };
    
    await page.render(renderContext).promise;
  } catch (error) {
    console.error(`Error rendering page ${pageNumber}:`, error);
    throw new Error(`Failed to render page ${pageNumber}`);
  }
}

// Function to render PDF page to image
export async function renderPageToImage(
  pdf: pdfjs.PDFDocumentProxy,
  pageNumber: number,
  scale = 1.0
): Promise<string> {
  try {
    const canvas = document.createElement("canvas");
    await renderPageToCanvas(pdf, pageNumber, canvas, scale);
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error(`Error converting page ${pageNumber} to image:`, error);
    throw new Error(`Failed to convert page ${pageNumber} to image`);
  }
}

// Function to get PDF info
export async function getPdfInfo(pdfBytes: ArrayBuffer): Promise<{
  pageCount: number;
  title?: string;
  author?: string;
  creationDate?: Date;
}> {
  try {
    const pdf = await pdfjs.getDocument({ data: pdfBytes }).promise;
    const metadata = await pdf.getMetadata();
    
    return {
      pageCount: pdf.numPages,
      title: metadata.info?.Title,
      author: metadata.info?.Author,
      creationDate: metadata.info?.CreationDate 
        ? new Date(metadata.info.CreationDate) 
        : undefined,
    };
  } catch (error) {
    console.error("Error getting PDF info:", error);
    throw new Error("Failed to get PDF information");
  }
}

// Function to compress PDF
export async function compressPdf(pdfBytes: ArrayBuffer, quality: "low" | "medium" | "high"): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Simple compression by creating a new document and copying pages
    // In a real implementation, we would use more sophisticated compression
    const newPdfDoc = await PDFDocument.create();
    
    // Copy all pages
    const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach(page => newPdfDoc.addPage(page));
    
    // Use different compression settings based on quality
    let compressionOptions = {};
    switch (quality) {
      case "low":
        compressionOptions = { objectStreamMode: 1, useObjectStreams: true };
        break;
      case "medium":
        compressionOptions = { objectStreamMode: 1 };
        break;
      case "high":
        compressionOptions = {};
        break;
    }
    
    // Save with compression options
    return await newPdfDoc.save(compressionOptions);
  } catch (error) {
    console.error("Error compressing PDF:", error);
    throw new Error("Failed to compress PDF");
  }
}

// Function to merge PDFs
export async function mergePdfs(pdfBytesList: ArrayBuffer[]): Promise<Uint8Array> {
  try {
    const mergedPdf = await PDFDocument.create();
    
    for (const pdfBytes of pdfBytesList) {
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }
    
    return await mergedPdf.save();
  } catch (error) {
    console.error("Error merging PDFs:", error);
    throw new Error("Failed to merge PDF documents");
  }
}
