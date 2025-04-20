'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TemplateStep } from './components/TemplateStep';
import { ExcelStep } from './components/ExcelStep';
import { GitHubStep } from './components/GitHubStep';
import { DetailStep } from './components/DetailStep';
import { GenerateStep } from './components/GenerateStep';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileWarning } from 'lucide-react';

export default function GeneratePage() {
  const [activeStep, setActiveStep] = useState<string>('template');
  const [templateFile, setTemplateFile] = useState<{file: File | null, preview: string | null}>({file: null, preview: null});
  const [excelFile, setExcelFile] = useState<{file: File | null, data: any | null}>({file: null, data: null});
  const [githubConfig, setGithubConfig] = useState<{username: string, repo: string}>({username: '', repo: ''});
  const [certificateDetails, setCertificateDetails] = useState<{event: string, date: string, nameColumn: string}>({
    event: '',
    date: '',
    nameColumn: ''
  });
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: 'template', label: 'Template', isComplete: !!templateFile.file },
    { id: 'excel', label: 'Data', isComplete: !!excelFile.file },
    { id: 'github', label: 'GitHub', isComplete: !!githubConfig.username && !!githubConfig.repo },
    { id: 'details', label: 'Details', isComplete: !!certificateDetails.event && !!certificateDetails.date && !!certificateDetails.nameColumn },
    { id: 'generate', label: 'Generate', isComplete: !!generationResult }
  ];

  const goToNextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === activeStep);
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1].id);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.findIndex(step => step.id === activeStep);
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1].id);
    }
  };

  const isNextDisabled = () => {
    switch (activeStep) {
      case 'template':
        return !templateFile.file;
      case 'excel':
        return !excelFile.file;
      case 'github':
        return !githubConfig.username || !githubConfig.repo;
      case 'details':
        return !certificateDetails.event || !certificateDetails.date || !certificateDetails.nameColumn;
      default:
        return false;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Generate Certificates</h1>
          <p className="text-muted-foreground">
            Follow the steps below to generate certificates with QR codes.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <FileWarning className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="hidden sm:flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold
                  ${activeStep === step.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : step.isComplete
                      ? 'border-primary text-primary'
                      : 'border-muted-foreground text-muted-foreground'
                  }`}
              >
                {index + 1}
              </div>
              <span className="ml-2 font-medium hidden md:inline">{step.label}</span>
              {index < steps.length - 1 && (
                <div className="hidden sm:block w-24 h-0.5 mx-2 bg-muted"></div>
              )}
            </div>
          ))}
        </div>

        <Tabs value={activeStep} onValueChange={setActiveStep} className="mt-8">
          <TabsList className="grid grid-cols-5 sm:hidden mb-4">
            {steps.map((step, index) => (
              <TabsTrigger key={step.id} value={step.id}>
                {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="template">
            <TemplateStep 
              templateFile={templateFile} 
              setTemplateFile={setTemplateFile} 
              setError={setError}
            />
          </TabsContent>

          <TabsContent value="excel">
            <ExcelStep 
              excelFile={excelFile} 
              setExcelFile={setExcelFile} 
              setError={setError}
            />
          </TabsContent>

          <TabsContent value="github">
            <GitHubStep 
              githubConfig={githubConfig} 
              setGithubConfig={setGithubConfig}
            />
          </TabsContent>

          <TabsContent value="details">
            <DetailStep 
              certificateDetails={certificateDetails} 
              setCertificateDetails={setCertificateDetails} 
              availableColumns={excelFile.data?.columns || []}
            />
          </TabsContent>

          <TabsContent value="generate">
            <GenerateStep 
              templateFile={templateFile}
              excelFile={excelFile}
              githubConfig={githubConfig}
              certificateDetails={certificateDetails}
              generationResult={generationResult}
              setGenerationResult={setGenerationResult}
              setError={setError}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={activeStep === 'template'}
          >
            Previous
          </Button>
          <Button
            onClick={goToNextStep}
            disabled={isNextDisabled() || activeStep === 'generate'}
          >
            {activeStep === steps[steps.length - 2].id ? 'Generate' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}