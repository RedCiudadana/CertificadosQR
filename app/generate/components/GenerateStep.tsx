'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Check, Download, Github, Loader2, ExternalLink } from 'lucide-react';
import { generateCertificates, downloadCertificates } from '@/lib/api';
import { Progress } from '@/components/ui/progress';

interface GenerateStepProps {
  templateFile: {
    file: File | null;
    preview: string | null;
  };
  excelFile: {
    file: File | null;
    data: any | null;
  };
  githubConfig: {
    username: string;
    repo: string;
  };
  certificateDetails: {
    event: string;
    date: string;
    nameColumn: string;
  };
  generationResult: any;
  setGenerationResult: React.Dispatch<React.SetStateAction<any>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export function GenerateStep({
  templateFile,
  excelFile,
  githubConfig,
  certificateDetails,
  generationResult,
  setGenerationResult,
  setError,
}: GenerateStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    if (isGenerating && !generationResult) {
      // Simulate progress for better UX
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 5;
          return next > 95 ? 95 : next;
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [isGenerating, generationResult]);

  const handleGenerate = async () => {
    if (!templateFile.file || !excelFile.file || !githubConfig.username || !githubConfig.repo) {
      setError('Missing required information. Please complete all previous steps.');
      return;
    }

    try {
      setIsGenerating(true);
      setProgress(10);

      const result = await generateCertificates({
        template: templateFile.file.name,
        github_username: githubConfig.username,
        github_repo: githubConfig.repo,
        excel_file: excelFile.file.name,
        name_column: certificateDetails.nameColumn,
        event_name: certificateDetails.event,
        date: certificateDetails.date,
      });

      setProgress(100);
      setGenerationResult(result);
    } catch (error) {
      console.error('Generation error:', error);
      setError('Failed to generate certificates. Please check your inputs and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generationResult) return;

    try {
      setIsDownloading(true);
      const blob = await downloadCertificates(generationResult.batch_id);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificates_${generationResult.batch_id}.zip`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download certificates.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Generate Certificates</h2>
          <p className="text-muted-foreground">
            Generate certificates with QR codes based on your template and data.
          </p>
        </div>

        {!generationResult ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configuration Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 border rounded-lg">
                  <p className="text-sm font-medium">Template</p>
                  <p className="text-sm text-muted-foreground">{templateFile.file?.name || 'Not selected'}</p>
                </div>
                
                <div className="space-y-2 p-4 border rounded-lg">
                  <p className="text-sm font-medium">Excel Data</p>
                  <p className="text-sm text-muted-foreground">
                    {excelFile.file?.name || 'Not selected'} 
                    {excelFile.data && ` (${excelFile.data.total_rows} recipients)`}
                  </p>
                </div>
                
                <div className="space-y-2 p-4 border rounded-lg">
                  <p className="text-sm font-medium">GitHub Configuration</p>
                  <p className="text-sm text-muted-foreground">
                    {githubConfig.username ? `${githubConfig.username}/${githubConfig.repo}` : 'Not configured'}
                  </p>
                </div>
                
                <div className="space-y-2 p-4 border rounded-lg">
                  <p className="text-sm font-medium">Certificate Details</p>
                  <p className="text-sm text-muted-foreground">
                    {certificateDetails.event ? (
                      <>
                        Event: {certificateDetails.event}<br />
                        Date: {certificateDetails.date}<br />
                        Name Column: {certificateDetails.nameColumn}
                      </>
                    ) : 'Not configured'}
                  </p>
                </div>
              </div>
            </div>

            {isGenerating ? (
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <p className="text-center text-sm text-muted-foreground flex items-center justify-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating certificates... This may take a moment.
                </p>
              </div>
            ) : (
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleGenerate}
              >
                Generate Certificates
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <Alert className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-900">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-800 dark:text-green-300">Generation Complete!</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-400">
                Successfully generated {generationResult.total_certificates} certificates. 
                Download the ZIP file and upload it to your GitHub repository.
              </AlertDescription>
            </Alert>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Generation Results</h3>
                    <Badge variant="outline">Batch #{generationResult.batch_id}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-2 p-4 border rounded-lg">
                      <p className="text-sm font-medium">Total Certificates</p>
                      <p className="text-2xl font-bold">{generationResult.total_certificates}</p>
                    </div>
                    
                    <div className="space-y-2 p-4 border rounded-lg">
                      <p className="text-sm font-medium">GitHub Pages URL</p>
                      <div className="flex items-center gap-2">
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-medium overflow-hidden text-ellipsis">
                          {generationResult.github_base_url}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(generationResult.github_base_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="default"
                      className="flex-1 gap-2"
                      onClick={handleDownload}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      {isDownloading ? 'Downloading...' : 'Download Certificates (ZIP)'}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Next Steps:</h4>
                    <ol className="list-decimal pl-6 space-y-2 text-sm text-muted-foreground">
                      <li>Download the ZIP file containing all certificates and verification pages</li>
                      <li>Extract the ZIP file to get the <code>docs</code> folder</li>
                      <li>Upload the entire <code>docs</code> folder to your GitHub repository</li>
                      <li>Wait for GitHub Pages to deploy (usually takes 1-2 minutes)</li>
                      <li>Test the QR codes to verify they link to the correct verification pages</li>
                    </ol>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Certificate Previews</h3>
                  <p className="text-sm text-muted-foreground">
                    Below are previews of the first 5 certificates. All certificates have been generated and are included in the ZIP file.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {generationResult.certificates.map((cert: any, index: number) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <div className="aspect-[3/2] bg-muted flex items-center justify-center text-center">
                          <div className="p-4">
                            <p className="font-medium">Certificate Preview:</p>
                            <p>{cert.name}</p>
                            <p className="text-sm text-muted-foreground">{cert.id}</p>
                          </div>
                        </div>
                        <div className="p-3 border-t">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">{cert.name}</p>
                            <p className="text-xs text-muted-foreground">{cert.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {generationResult.total_certificates > 5 && (
                    <p className="text-center text-sm text-muted-foreground">
                      Showing 5 of {generationResult.total_certificates} certificates
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}