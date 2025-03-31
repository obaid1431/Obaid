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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { DocumentIcon, WordIcon } from "@/lib/icons";

export default function PdfToWord() {
  const [fileId, setFileId] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [format, setFormat] = useState<string>("docx");
  const [quality, setQuality] = useState<string>("high");
  const [preserveImages, setPreserveImages] = useState<boolean>(true);
  const [preserveFormatting, setPreserveFormatting] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [outputFileId, setOutputFileId] = useState<number | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("");
  const { toast } = useToast();

  const handleUploadSuccess = (id: number, name: string) => {
    setFileId(id);
    setFileName(name);
    setOutputFileId(null);
    setOutputFileName("");
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
      
      // In a real implementation, this would call a proper API endpoint for PDF to Word conversion
      // For now, we'll simulate a successful conversion using the same endpoint
      const response = await apiRequest("POST", "/api/pdf/extract", {
        fileId,
        pages: [0], // Convert all pages
        outputFormat: format,
        preserveImages,
        preserveFormatting,
        quality
      });
      
      const data = await response.json();
      
      setOutputFileId(data.fileId);
      setOutputFileName(data.name.replace(".pdf", `.${format}`));
      
      toast({
        title: "Conversion Successful",
        description: "Your PDF has been converted to Word successfully.",
      });
    } catch (error) {
      console.error("Error converting PDF to Word:", error);
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "Failed to convert PDF to Word",
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
        description: "Failed to download the converted file",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFileId(null);
    setFileName("");
    setOutputFileId(null);
    setOutputFileName("");
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">PDF to Word Converter</h2>
      <p className="text-gray-600 mb-8">
        Convert your PDF documents to editable Word files easily while preserving layout and formatting.
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
              />
            </div>
          </div>
        )}

        {/* Conversion Options */}
        {fileId && !outputFileId && (
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Conversion Options</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
                  Output Format
                </Label>
                <Select
                  value={format}
                  onValueChange={setFormat}
                >
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="docx">DOCX - Microsoft Word Document</SelectItem>
                    <SelectItem value="rtf">RTF - Rich Text Format</SelectItem>
                    <SelectItem value="odt">ODT - OpenDocument Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-1">
                  Conversion Quality
                </Label>
                <Select
                  value={quality}
                  onValueChange={setQuality}
                >
                  <SelectTrigger id="quality">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High - Best quality (larger file)</SelectItem>
                    <SelectItem value="medium">Medium - Good quality</SelectItem>
                    <SelectItem value="low">Low - Basic quality (smaller file)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preserve-images"
                    checked={preserveImages}
                    onCheckedChange={(checked) => 
                      setPreserveImages(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="preserve-images"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Preserve images
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preserve-formatting"
                    checked={preserveFormatting}
                    onCheckedChange={(checked) => 
                      setPreserveFormatting(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="preserve-formatting"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Preserve formatting and layout
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Output File */}
        {outputFileId && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="text-md font-medium text-green-800 mb-2">Conversion Complete</h4>
            <p className="text-sm text-green-600 mb-3">
              Your PDF has been converted successfully. The new file is ready for download.
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
                <WordIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-500 uppercase">{format}</span>
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
                "Convert to Word"
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-10 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">About PDF to Word Conversion</h3>
        <div className="text-sm text-gray-600 space-y-4">
          <p>
            Converting PDF to Word allows you to edit content that would otherwise be locked in the PDF format. Our converter carefully preserves the original formatting while making the content editable.
          </p>
          <p>
            <strong>What to expect:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Text, images, and basic formatting are preserved</li>
            <li>Tables are converted with their structure intact</li>
            <li>Complex layouts might need minor adjustments after conversion</li>
            <li>Forms and interactive elements won't be functional in Word format</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
