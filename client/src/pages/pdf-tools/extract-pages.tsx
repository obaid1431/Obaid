import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/ui/file-upload";
import PdfViewer from "@/components/ui/pdf-viewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";

export default function ExtractPages() {
  const [fileId, setFileId] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pageRangeInput, setPageRangeInput] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState<string>("single");
  const [preserveBookmarks, setPreserveBookmarks] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [outputFileId, setOutputFileId] = useState<number | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("");
  const { toast } = useToast();

  const handleUploadSuccess = (id: number, name: string) => {
    setFileId(id);
    setFileName(name);
    setSelectedPages([]);
    setPageRangeInput("");
    setOutputFileId(null);
    setOutputFileName("");
  };

  const handlePageSelectionChange = (pages: number[]) => {
    setSelectedPages(pages);
    
    // Update page range input when pages are selected via thumbnails
    if (pages.length > 0) {
      const ranges: string[] = [];
      let start = pages[0];
      let end = pages[0];
      
      for (let i = 1; i < pages.length; i++) {
        if (pages[i] === end + 1) {
          end = pages[i];
        } else {
          ranges.push(start === end ? `${start}` : `${start}-${end}`);
          start = end = pages[i];
        }
      }
      
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      setPageRangeInput(ranges.join(", "));
    } else {
      setPageRangeInput("");
    }
  };

  const handlePageRangeChange = (value: string) => {
    setPageRangeInput(value);
    
    // Parse page range input
    try {
      const newSelectedPages: number[] = [];
      
      if (value.trim() === "") {
        setSelectedPages([]);
        return;
      }
      
      const ranges = value.split(",").map(r => r.trim());
      
      for (const range of ranges) {
        if (range.includes("-")) {
          const [start, end] = range.split("-").map(n => parseInt(n.trim(), 10));
          if (isNaN(start) || isNaN(end)) continue;
          
          // Add all pages in range
          for (let i = start; i <= end; i++) {
            if (!newSelectedPages.includes(i)) {
              newSelectedPages.push(i);
            }
          }
        } else {
          const page = parseInt(range, 10);
          if (isNaN(page)) continue;
          
          if (!newSelectedPages.includes(page)) {
            newSelectedPages.push(page);
          }
        }
      }
      
      // Sort pages
      newSelectedPages.sort((a, b) => a - b);
      setSelectedPages(newSelectedPages);
    } catch (error) {
      console.error("Error parsing page range:", error);
    }
  };

  const handleExtractPages = async () => {
    if (!fileId || selectedPages.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a PDF file and at least one page to extract.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      const response = await apiRequest("POST", "/api/pdf/extract", {
        fileId,
        pages: selectedPages,
        outputFormat,
        preserveBookmarks,
      });
      
      const data = await response.json();
      
      setOutputFileId(data.fileId);
      setOutputFileName(data.name);
      
      toast({
        title: "PDF Extraction Successful",
        description: "Your PDF pages have been extracted successfully.",
      });
    } catch (error) {
      console.error("Error extracting pages:", error);
      toast({
        title: "Extraction Failed",
        description: error instanceof Error ? error.message : "Failed to extract PDF pages",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!outputFileId) return;
    
    try {
      window.open(`/api/files/${outputFileId}/download`, "_blank");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download the extracted PDF",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setSelectedPages([]);
    setPageRangeInput("");
    setOutputFileId(null);
    setOutputFileName("");
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Extract PDF Pages</h2>
      <p className="text-gray-600 mb-8">
        Select specific pages or page ranges to extract from your PDF document.
      </p>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        {/* File Upload Area */}
        {!fileId && (
          <div className="mb-6">
            <FileUpload 
              onUploadSuccess={handleUploadSuccess}
              accept="application/pdf"
              maxSize={10 * 1024 * 1024} // 10MB
            />
          </div>
        )}

        {/* PDF Preview */}
        {fileId && (
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Document Preview</h4>
            <div className="bg-gray-100 p-4 rounded-lg">
              <PdfViewer 
                fileId={fileId}
                fileName={fileName}
                onPageSelectionChange={handlePageSelectionChange}
              />
            </div>
          </div>
        )}

        {/* Page Range Selection */}
        {fileId && (
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Select Pages to Extract</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="page-range" className="block text-sm font-medium text-gray-700 mb-1">
                  Page Range
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="page-range"
                    value={pageRangeInput}
                    onChange={(e) => handlePageRangeChange(e.target.value)}
                    placeholder="e.g. 1-3, 5, 7-9"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button
                    variant="outline"
                    onClick={() => handlePageSelectionChange(selectedPages.length > 0 ? [] : Array.from({ length: 100 }, (_, i) => i + 1))}
                  >
                    {selectedPages.length > 0 ? "Clear All" : "Select All"}
                  </Button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Specify individual pages, ranges, or a combination (e.g., 1, 3-5, 7)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Extract Options */}
        {fileId && selectedPages.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Extraction Options</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="output-format" className="block text-sm font-medium text-gray-700 mb-1">
                  Output Format
                </Label>
                <Select
                  value={outputFormat}
                  onValueChange={setOutputFormat}
                >
                  <SelectTrigger id="output-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">PDF - Single Document</SelectItem>
                    <SelectItem value="multiple">PDF - Multiple Files (One per page)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="preserve-bookmarks"
                  checked={preserveBookmarks}
                  onCheckedChange={(checked) => 
                    setPreserveBookmarks(checked as boolean)
                  }
                />
                <Label
                  htmlFor="preserve-bookmarks"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Preserve bookmarks
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* Output File */}
        {outputFileId && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="text-md font-medium text-green-800 mb-2">Extraction Complete</h4>
            <p className="text-sm text-green-600 mb-3">
              Your PDF pages have been extracted successfully. The new file is ready for download.
            </p>
            <div className="flex items-center text-sm text-gray-700">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="mr-2">File:</span>
              <span className="font-medium">{outputFileName}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          
          {outputFileId ? (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleDownload}
            >
              Download
            </Button>
          ) : (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleExtractPages}
              disabled={!fileId || selectedPages.length === 0 || isProcessing}
            >
              {isProcessing ? "Processing..." : "Extract Pages"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
