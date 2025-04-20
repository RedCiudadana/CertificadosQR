'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Search, Loader2 } from 'lucide-react';

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId) {
      setError('Please enter a certificate ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Example verification - in a real app, you would check against your GitHub Pages URL
    // or use an API endpoint to verify the certificate ID
    setTimeout(() => {
      // This is just a simulation - in a real app you would redirect to the actual verification page
      setUrl(`https://username.github.io/repo/verify.html?id=${certificateId}`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Verify Certificate</h1>
          <p className="text-muted-foreground">
            Enter a certificate ID or scan a QR code to verify authenticity.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certificate-id">Certificate ID</Label>
                <Input
                  id="certificate-id"
                  placeholder="Enter certificate ID"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Verify Certificate
                  </>
                )}
              </Button>
            </form>

            {url && (
              <div className="mt-6 p-4 border rounded-lg bg-muted text-center">
                <p className="text-sm font-medium mb-2">Certificate Verification URL:</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 text-sm break-all hover:underline"
                >
                  {url}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="h-px bg-border flex-1" />
            <span className="px-3 text-sm text-muted-foreground">or</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <div className="space-y-2">
            <QrCode className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Scan the QR code on your certificate to verify authenticity
            </p>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-muted">
          <h2 className="font-medium mb-2">How Verification Works:</h2>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Each certificate includes a unique QR code</li>
            <li>Scanning the QR code or entering the ID connects to our verification system</li>
            <li>The system checks the certificate's authenticity against our records</li>
            <li>Verification confirms the certificate is legitimate and displays certificate details</li>
          </ol>
        </div>
      </div>
    </div>
  );
}