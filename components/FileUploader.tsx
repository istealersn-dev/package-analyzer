"use client";

import { useState, useRef } from "react";
import { FileJson, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import PackageAnalysis from "@/components/PackageAnalysis";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PackageData {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export default function FileUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) handleFiles(files);
  };

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;

    const file = files[0];
    if (file.name !== "package.json") {
      toast.error("Please upload a package.json file");
      return;
    }

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      setPackageData(json);
      toast.success("Package.json file uploaded successfully!");
    } catch (error) {
      toast.error("Error parsing package.json file");
      console.error(error);
    }
  };

  const resetUpload = () => {
    setPackageData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-8">
      {!packageData && (
        <div className="text-center mb-12">
          <h1 className="text-h1 mb-4">
            Package.json Analyzer
          </h1>
          <p className="text-body-lg text-muted-foreground">
            Upload your package.json file to get insights about dependencies and optimization recommendations
          </p>
        </div>
      )}
      
      {!packageData ? (
        <Card
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors",
            isDragging && "border-primary bg-primary/5",
            "cursor-pointer"
          )}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileUpload}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="application/json"
            onChange={handleFileInput}
          />
          <FileJson className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-h4 mb-2">
            Drop your package.json file here
          </h3>
          <p className="text-small text-muted-foreground mb-4">
            or click to browse your files
          </p>
          <Button variant="secondary" size="sm">
            Select File
          </Button>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
              <FileJson className="w-8 h-8 mx-auto mb-3 text-primary" />
              <p className="text-body mb-2">
                Project "{packageData.name}" (v{packageData.version}) contains {Object.keys(packageData.dependencies || {}).length} dependencies and {Object.keys(packageData.devDependencies || {}).length} dev dependencies.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={resetUpload}
              className="space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </Button>
          </div>
        </Card>
      )}

      {packageData && <PackageAnalysis packageData={packageData} />}
    </div>
  );
}