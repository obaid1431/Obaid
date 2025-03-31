import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { Clipboard, Download, FileText, Image } from "lucide-react";

export default function OcrTextExtractor() {
  const [fileId, setFileId] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [extractedText, setExtractedText] = useState<string>("");
  const [language, setLanguage] = useState<string>("eng");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const { toast } = useToast();

  const handleUploadSuccess = (id: number, name: string) => {
    setFileId(id);
    setFileName(name);
    setExtractedText("");
  };

  const handleExtractText = async () => {
    if (!fileId) {
      toast({
        title: "Missing File",
        description: "Please upload an image or PDF file to extract text.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Call the OCR API endpoint
      const response = await apiRequest("POST", "/api/ocr/extract", {
        fileId,
        language,
      });
      
      const data = await response.json();
      
      // Set the extracted text from the API response
      setExtractedText(data.text);
      
      toast({
        title: "Text Extraction Successful",
        description: "Text has been extracted from your image.",
      });
    } catch (error) {
      console.error("Error extracting text:", error);
      toast({
        title: "Extraction Failed",
        description: error instanceof Error ? error.message : "Failed to extract text from image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(extractedText);
    toast({
      title: "Copied to Clipboard",
      description: "The extracted text has been copied to your clipboard.",
    });
  };

  const handleDownloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([extractedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `extracted_text_${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExtractedText(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">OCR Text Extractor</h2>
      <p className="text-gray-600 mb-8">
        Extract text from images or scanned documents using Optical Character Recognition (OCR) technology.
      </p>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        {/* File Upload Area */}
        {!fileId && (
          <div className="mb-6">
            <FileUpload 
              onUploadSuccess={handleUploadSuccess}
              accept="application/pdf,image/jpeg,image/png,image/gif,image/bmp,image/tiff"
              maxSize={10 * 1024 * 1024} // 10MB
            />
          </div>
        )}

        {/* File Info and Language Selection */}
        {fileId && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-gray-800">{fileName}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setFileId(null);
                  setFileName("");
                  setExtractedText("");
                }}
              >
                Change File
              </Button>
            </div>
            
            <div className="mb-6">
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <Select
                value={language}
                onValueChange={setLanguage}
              >
                <SelectTrigger id="language" className="w-full md:w-64">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eng">English</SelectItem>
                  <SelectItem value="spa">Spanish</SelectItem>
                  <SelectItem value="fra">French</SelectItem>
                  <SelectItem value="deu">German</SelectItem>
                  <SelectItem value="ita">Italian</SelectItem>
                  <SelectItem value="por">Portuguese</SelectItem>
                  <SelectItem value="rus">Russian</SelectItem>
                  <SelectItem value="chi_sim">Chinese (Simplified)</SelectItem>
                  <SelectItem value="jpn">Japanese</SelectItem>
                  <SelectItem value="kor">Korean</SelectItem>
                  <SelectItem value="ara">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {!extractedText && (
              <Button
                onClick={handleExtractText}
                className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Extracting Text...
                  </div>
                ) : (
                  "Extract Text"
                )}
              </Button>
            )}
          </div>
        )}

        {/* Extracted Text */}
        {extractedText && (
          <div className="mb-6">
            <Tabs defaultValue="view" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="view">View Text</TabsTrigger>
                  <TabsTrigger value="edit">Edit Text</TabsTrigger>
                </TabsList>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyText}
                  >
                    <Clipboard className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadText}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              
              <TabsContent value="view" className="mt-0">
                <Card>
                  <CardContent className="p-4 bg-gray-50">
                    <div className="whitespace-pre-wrap text-gray-700 min-h-[200px] max-h-[500px] overflow-y-auto">
                      {extractedText}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="edit" className="mt-0">
                <Textarea
                  value={extractedText}
                  onChange={handleTextChange}
                  className="min-h-[200px] max-h-[500px]"
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="mt-10 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">About OCR Text Extraction</h3>
        <div className="text-sm text-gray-600 space-y-4">
          <p>
            Optical Character Recognition (OCR) technology allows computers to extract text content from images and 
            scanned documents. Our OCR tool can recognize text in multiple languages from various file formats.
          </p>
          <p>
            <strong>Best Practices for Better Results:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use high-resolution images with clear, readable text</li>
            <li>Ensure good lighting and contrast between text and background</li>
            <li>Avoid skewed or rotated text where possible</li>
            <li>Select the correct language for more accurate recognition</li>
            <li>For multi-language documents, process each section separately</li>
          </ul>
          <p>
            <strong>Supported File Types:</strong> JPG, PNG, GIF, BMP, TIFF, PDF
          </p>
        </div>
      </div>
    </div>
  );
}