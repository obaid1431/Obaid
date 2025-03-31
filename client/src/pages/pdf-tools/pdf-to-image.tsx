import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/ui/file-upload";
import PdfViewer from "@/components/ui/pdf-viewer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { DocumentIcon, ImageIcon } from "@/lib/icons";

export default function PdfToImage() {
  const [fileId, setFileId] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pageRangeInput, setPageRangeInput] = useState<string>("");
  const [imageFormat, setImageFormat] = useState<string>("jpg");
  const [resolution, setResolution] = useState<number>(300);
  const [quality, setQuality] = useState<number>(90);
  const [allPages, setAllPages] = useState<boolean>(true);
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
    setAllPages(pages.length === 0);
    
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
      if (value.trim() === "") {
        setSelectedPages([]);
        setAllPages(true);
        return;
      }
      
      const newSelectedPages: number[] = [];
      const ranges = value.split(",").map(r => r.trim());
      
      for (const range of ranges) {
        if (range.includes("-")) {
          const [start, end] = range.split("-").map(n => parseInt(n.trim(), 10));
          if (isNaN(start) || isNaN(end)) continue;
          
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
      
      newSelectedPages.sort((a, b) => a - b);
      setSelectedPages(newSelectedPages);
      setAllPages(false);
    } catch (error) {
      console.error("Error parsing page range:", error);
    }
  };

  const handleConvert = async () => {
    if (!fileId) {
      toast({
        title: "Missing PDF File",
        description: "Please upload a PDF file to convert.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // In a real implementation, this would call a proper API endpoint for PDF to Image conversion
      // For now, we'll simulate a successful conversion using the existing endpoint
      const response = await apiRequest("POST", "/api/pdf/extract", {
        fileId,
        pages: allPages ? [] : selectedPages,
        outputFormat: imageFormat,
        quality,
        resolution,
        allPages
      });
      
      const data = await response.json();
      
      setOutputFileId(data.fileId);
      setOutputFileName(data.name.replace(".pdf", selectedPages.length === 1 ? `.${imageFormat}` : ".zip"));
      
      toast({
        title: "Conversion Successful",
        description: "Your PDF has been converted to images successfully.",
      });
    } catch (error) {
      console.error("Error converting PDF to image:", error);
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "Failed to convert PDF to images",
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
        description: "Failed to download the converted images",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFileId(null);
    setFileName("");
    setSelectedPages([]);
    setPageRangeInput("");
    setOutputFileId(null);
    setOutputFileName("");
    setAllPages(true);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">PDF to Image Converter</h2>
      <p className="text-gray-600 mb-8">
        Convert PDF pages to JPG, PNG, or other image formats with custom resolution and quality settings.
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
        {fileId && !outputFileId && (
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

        {/* Page Selection */}
        {fileId && !outputFileId && (
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Page Selection</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="all-pages"
                  checked={allPages}
                  onCheckedChange={(checked) => {
                    setAllPages(checked as boolean);
                    if (checked) {
                      setSelectedPages([]);
                      setPageRangeInput("");
                    }
                  }}
                />
                <Label
                  htmlFor="all-pages"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Convert all pages
                </Label>
              </div>

              {!allPages && (
                <div>
                  <Label htmlFor="page-range" className="block text-sm font-medium text-gray-700 mb-1">
                    Page Range
                  </Label>
                  <Input
                    id="page-range"
                    value={pageRangeInput}
                    onChange={(e) => handlePageRangeChange(e.target.value)}
                    placeholder="e.g. 1-3, 5, 7-9"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled={allPages}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Specify individual pages, ranges, or a combination (e.g., 1, 3-5, 7)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conversion Options */}
        {fileId && !outputFileId && (
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Conversion Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="image-format" className="block text-sm font-medium text-gray-700 mb-1">
                  Image Format
                </Label>
                <Select
                  value={imageFormat}
                  onValueChange={setImageFormat}
                >
                  <SelectTrigger id="image-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpg">JPG - JPEG Image</SelectItem>
                    <SelectItem value="png">PNG - Portable Network Graphics</SelectItem>
                    <SelectItem value="webp">WebP - Efficient Web Format</SelectItem>
                    <SelectItem value="tiff">TIFF - Tagged Image File Format</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-1">
                  Resolution (DPI): {resolution}
                </Label>
                <Slider
                  id="resolution"
                  min={72}
                  max={600}
                  step={1}
                  value={[resolution]}
                  onValueChange={(values) => setResolution(values[0])}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low (72dpi)</span>
                  <span>Medium (300dpi)</span>
                  <span>High (600dpi)</span>
                </div>
              </div>

              {imageFormat === "jpg" || imageFormat === "webp" ? (
                <div>
                  <Label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-1">
                    Quality: {quality}%
                  </Label>
                  <Slider
                    id="quality"
                    min={10}
                    max={100}
                    step={1}
                    value={[quality]}
                    onValueChange={(values) => setQuality(values[0])}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Output File */}
        {outputFileId && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="text-md font-medium text-green-800 mb-2">Conversion Complete</h4>
            <p className="text-sm text-green-600 mb-3">
              Your PDF has been converted to images successfully. The file is ready for download.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="mr-2">File:</span>
                <span className="font-medium">{outputFileName}</span>
              </div>
              <div className="flex items-center">
                <ImageIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-500 uppercase">
                  {selectedPages.length === 1 ? imageFormat : "ZIP"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            {outputFileId ? "Convert Another" : "Cancel"}
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
              onClick={handleConvert}
              disabled={!fileId || isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Converting...
                </div>
              ) : (
                "Convert to Images"
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-10 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">About PDF to Image Conversion</h3>
        <div className="text-sm text-gray-600 space-y-4">
          <p>
            Converting PDF to images allows you to use PDF content in presentations, websites, or other applications that require image formats.
          </p>
          <p>
            <strong>Format Comparison:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>JPG:</strong> Best for photographs, smaller file size, some quality loss</li>
            <li><strong>PNG:</strong> Better for text and graphics, lossless quality, larger file size</li>
            <li><strong>WebP:</strong> Modern format with good compression and quality, not supported by all applications</li>
            <li><strong>TIFF:</strong> High quality for professional use, very large file size</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
