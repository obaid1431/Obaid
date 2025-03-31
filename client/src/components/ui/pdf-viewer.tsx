import { useState, useEffect, useRef } from "react";
import * as pdfjs from "pdfjs-dist";
import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/src/display/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  fileId: number;
  fileName: string;
  onPageSelectionChange?: (selectedPages: number[]) => void;
}

export default function PdfViewer({ fileId, fileName, onPageSelectionChange }: PdfViewerProps) {
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState<number[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());

  // Load PDF document
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch PDF from server
        const response = await fetch(`/api/files/${fileId}/download`);
        if (!response.ok) {
          throw new Error("Failed to fetch PDF");
        }
        
        const pdfData = await response.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
        
        setPdfDocument(pdf);
        setPageCount(pdf.numPages);
        setPages(Array.from({ length: pdf.numPages }, (_, i) => i + 1));
        setSelectedPages([]);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError(err instanceof Error ? err.message : "Failed to load PDF");
        setIsLoading(false);
      }
    };

    if (fileId) {
      loadPdf();
    }
  }, [fileId]);

  // Render thumbnails when document is loaded
  useEffect(() => {
    if (!pdfDocument || !canvasRefs.current) return;

    const renderPage = async (pageNum: number) => {
      try {
        const page = await pdfDocument.getPage(pageNum);
        const canvas = canvasRefs.current.get(pageNum);
        
        if (!canvas) return;
        
        const viewport = page.getViewport({ scale: 0.3 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: canvas.getContext('2d')!,
          viewport,
        };
        
        await page.render(renderContext).promise;
        
        // Convert canvas to data URL for thumbnail
        const imageURL = canvas.toDataURL('image/png');
        
        setThumbnails(prev => {
          const newThumbnails = [...prev];
          newThumbnails[pageNum - 1] = imageURL;
          return newThumbnails;
        });
      } catch (err) {
        console.error(`Error rendering page ${pageNum}:`, err);
      }
    };

    // Render all pages
    pages.forEach(pageNum => {
      renderPage(pageNum);
    });
  }, [pdfDocument, pages]);

  // Handle page selection
  const togglePageSelection = (pageNum: number) => {
    let newSelectedPages: number[];
    
    if (selectedPages.includes(pageNum)) {
      newSelectedPages = selectedPages.filter(p => p !== pageNum);
    } else {
      newSelectedPages = [...selectedPages, pageNum].sort((a, b) => a - b);
    }
    
    setSelectedPages(newSelectedPages);
    
    if (onPageSelectionChange) {
      onPageSelectionChange(newSelectedPages);
    }
  };

  // Handle select all / deselect all
  const toggleSelectAll = () => {
    if (selectedPages.length === pages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages([...pages]);
    }
    
    if (onPageSelectionChange) {
      onPageSelectionChange(selectedPages.length === pages.length ? [] : [...pages]);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error loading PDF: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 text-blue-600 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
            {fileName}
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-500">{pageCount} page{pageCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      {onPageSelectionChange && (
        <div className="flex justify-end mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectAll}
          >
            {selectedPages.length === pages.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {pages.map(pageNum => (
          <div
            key={pageNum}
            className={`border rounded p-1 shadow-sm ${
              selectedPages.includes(pageNum)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
            onClick={() => onPageSelectionChange && togglePageSelection(pageNum)}
          >
            <div className="relative">
              {thumbnails[pageNum - 1] ? (
                <img
                  src={thumbnails[pageNum - 1]}
                  alt={`Page ${pageNum}`}
                  className="w-full aspect-[3/4] object-contain bg-white"
                />
              ) : (
                <div className="w-full aspect-[3/4] flex items-center justify-center bg-gray-100">
                  <div className="animate-pulse h-full w-full bg-gray-200"></div>
                </div>
              )}
              
              <canvas
                ref={canvas => {
                  if (canvas) canvasRefs.current.set(pageNum, canvas);
                }}
                className="hidden"
              />

              {onPageSelectionChange && (
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selectedPages.includes(pageNum)}
                    className="h-4 w-4 border-gray-300 rounded"
                    onClick={e => e.stopPropagation()}
                    onCheckedChange={() => togglePageSelection(pageNum)}
                  />
                </div>
              )}
              
              <div className="text-center text-xs text-gray-500 mt-1">
                Page {pageNum}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
