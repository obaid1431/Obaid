import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, File } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  onUploadSuccess: (fileId: number, fileName: string) => void;
  onUploadError?: (error: string) => void;
}

export default function FileUpload({
  accept = "application/pdf",
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 1,
  onUploadSuccess,
  onUploadError
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      const data = await response.json();
      
      onUploadSuccess(data.id, data.name);
      toast({
        title: "Upload Successful",
        description: `${data.name} has been uploaded successfully.`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
      
      if (onUploadError) {
        onUploadError(errorMessage);
      }
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [onUploadSuccess, onUploadError, toast]);

  // Parse accept string into object format for react-dropzone
  const acceptObject: Record<string, string[]> = {};
  accept.split(',').forEach(type => {
    acceptObject[type.trim()] = [];
  });

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections
  } = useDropzone({
    onDrop,
    accept: acceptObject,
    maxSize,
    maxFiles,
    disabled: isUploading
  });

  // Format file size to human readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Show error message based on rejection reason
  const getErrorMessage = () => {
    if (fileRejections.length === 0) return null;
    
    const rejection = fileRejections[0];
    if (rejection.errors[0].code === "file-too-large") {
      return `File is too large. Maximum size is ${formatFileSize(maxSize)}.`;
    }
    if (rejection.errors[0].code === "file-invalid-type") {
      return `Invalid file type. Only ${accept.split(",").join(", ")} files are allowed.`;
    }
    return rejection.errors[0].message;
  };

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${
        isDragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-500"
      } ${isDragReject ? "border-red-500 bg-red-50" : ""} ${isUploading ? "opacity-60" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
            <p className="text-sm text-gray-500">Uploading...</p>
          </div>
        ) : (
          <>
            {isDragActive ? (
              <Upload className="h-10 w-10 text-purple-600 mb-2" />
            ) : (
              <File className="h-10 w-10 text-gray-400 mb-2" />
            )}
            <p className="text-sm text-gray-500 mb-2">
              {isDragActive
                ? "Drop the file here"
                : "Drag & drop your file here or"}
            </p>
            <Button
              type="button"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Browse Files
            </Button>
            <p className="text-xs text-gray-400 mt-2">
              Maximum file size: {formatFileSize(maxSize)}
            </p>
            {getErrorMessage() && (
              <p className="text-sm text-red-500 mt-2">{getErrorMessage()}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
