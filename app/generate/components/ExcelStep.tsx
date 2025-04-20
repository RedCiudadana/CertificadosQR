'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, X, FileSpreadsheet } from 'lucide-react';
import { uploadExcel } from '@/lib/api';

interface ExcelStepProps {
  excelFile: {
    file: File | null;
    data: any | null;
  };
  setExcelFile: React.Dispatch<React.SetStateAction<{
    file: File | null;
    data: any | null;
  }>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export function ExcelStep({ excelFile, setExcelFile, setError }: ExcelStepProps) {
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
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      setError('Please upload a valid Excel or CSV file');
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadExcel(file);
      setExcelFile({
        file,
        data: result
      });
      setIsUploading(false);
    } catch (error) {
      setError('Failed to upload Excel file to server');
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setExcelFile({ file: null, data: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Upload Recipient Data</h2>
          <p className="text-muted-foreground">
            Upload an Excel or CSV file containing recipient information for certificate generation.
          </p>
        </div>

        {!excelFile.file ? (
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
                <FileSpreadsheet className="h-8 w-8" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold">Drag & drop your Excel file</h3>
                <p className="text-sm text-muted-foreground">
                  Drop your Excel or CSV file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">Excel (.xlsx, .xls) or CSV files</p>
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
                accept=".xlsx, .xls, .csv"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{excelFile.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {excelFile.data?.total_rows || 0} recipients
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {excelFile.data?.preview && (
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-80 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {excelFile.data.columns.map((column: string) => (
                          <TableHead key={column}>{column}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {excelFile.data.preview.map((row: any, i: number) => (
                        <TableRow key={i}>
                          {excelFile.data.columns.map((column: string) => (
                            <TableCell key={`${i}-${column}`}>{row[column]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {excelFile.data.total_rows > 5 && (
                  <div className="px-4 py-2 bg-muted text-center text-sm text-muted-foreground">
                    Showing 5 of {excelFile.data.total_rows} rows
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Data Requirements:</h3>
          <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
            <li>File must be Excel (.xlsx, .xls) or CSV format</li>
            <li>First row should contain column headers</li>
            <li>Include at least one column with recipient names</li>
            <li>Make sure data is clean and formatted correctly</li>
            <li>Each row will generate one certificate</li>
          </ul>

          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/50 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Note:</strong> For large datasets (200+ recipients), the generation process may take a few minutes.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}