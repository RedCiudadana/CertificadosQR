'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { uploadTemplate } from '@/lib/api';

interface TemplateStepProps {
  templateFile: {
    file: File | null;
    preview: string | null;
  };
  setTemplateFile: React.Dispatch<React.SetStateAction<{
    file: File | null;
    preview: string | null;
  }>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export function TemplateStep({ templateFile, setTemplateFile, setError }: TemplateStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.match('image/(jpeg|jpg|png)')) {
      setError('Please upload a valid image file (JPEG or PNG)');
      return;
    }

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setTemplateFile({
        file,
        preview: reader.result as string
      });
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      const result = await uploadTemplate(file);
      setIsUploading(false);
    } catch (error) {
      setError('Failed to upload template to server');
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setTemplateFile({ file: null, preview: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Upload Certificate Template</h2>
          <p className="text-muted-foreground">
            Upload your certificate template image. This will be used as the base for all generated certificates.
          </p>
        </div>

        {!templateFile.file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Upload className="h-8 w-8" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold">Drag & drop your template</h3>
                <p className="text-sm text-muted-foreground">
                  Drop your certificate template here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">PNG or JPG (Recommended size: 1920x1080px)</p>
              </div>
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Browse Files'}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
              />
            </div>
          </div>
        ) : (
          <div className="relative border rounded-lg p-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handleRemoveFile}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="aspect-video relative overflow-hidden rounded-lg">
              {templateFile.preview && (
                // Using img tag instead of Image for preview of local file
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={templateFile.preview}
                  alt="Certificate Template Preview"
                  className="object-contain w-full h-full"
                />
              )}
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium">{templateFile.file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(templateFile.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Template Requirements:</h3>
          <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
            <li>Use a high-resolution image (recommended 1920x1080px or larger)</li>
            <li>Leave space for recipient's name, event details, and QR code</li>
            <li>Ensure good contrast between text areas and background</li>
            <li>PNG or JPG format only</li>
            <li>Keep file size under 5MB for optimal performance</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}