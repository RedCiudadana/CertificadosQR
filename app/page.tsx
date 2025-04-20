import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Award, FileCheck, QrCode, Upload } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Generate Verifiable Certificates with QR Codes
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Create, manage, and verify digital certificates for your events, courses, and achievements.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/generate">
                <Button size="lg" className="gap-1">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/verify">
                <Button variant="outline" size="lg">
                  Verify a Certificate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Key Features
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Everything you need to create and verify professional certificates
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Certificate Templates</h3>
              <p className="text-center text-muted-foreground">
                Upload your custom certificate designs and generate professional certificates
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">QR Verification</h3>
              <p className="text-center text-muted-foreground">
                Each certificate includes a QR code for easy verification and authenticity checks
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Bulk Generation</h3>
              <p className="text-center text-muted-foreground">
                Import recipient data from Excel to generate certificates in bulk
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">GitHub Pages Hosting</h3>
              <p className="text-center text-muted-foreground">
                Host your certificates and verification pages on GitHub Pages for free
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Easy Interface</h3>
              <p className="text-center text-muted-foreground">
                User-friendly interface for creating, managing, and verifying certificates
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Secure & Transparent</h3>
              <p className="text-center text-muted-foreground">
                Open-source solution with transparent verification process
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How It Works
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Generate and verify certificates in just a few simple steps
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                1
              </div>
              <div className="absolute top-6 left-full hidden h-0.5 w-full -translate-y-1/2 bg-muted md:block"></div>
              <h3 className="mt-4 text-xl font-bold">Upload Template</h3>
              <p className="text-center text-muted-foreground">
                Upload your certificate template and import recipient data from Excel
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="relative flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                2
              </div>
              <div className="absolute top-6 left-full hidden h-0.5 w-full -translate-y-1/2 bg-muted md:block"></div>
              <h3 className="mt-4 text-xl font-bold">Generate Certificates</h3>
              <p className="text-center text-muted-foreground">
                Configure settings, generate certificates with QR codes, and download
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mt-4 text-xl font-bold">Deploy & Verify</h3>
              <p className="text-center text-muted-foreground">
                Upload to GitHub Pages for hosting and enable verification via QR codes
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Generate Certificates?
              </h2>
              <p className="mx-auto max-w-[700px] md:text-xl">
                Get started with our easy-to-use certificate generator for your next event or course
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/generate">
                <Button size="lg" variant="secondary" className="gap-1">
                  Generate Certificates <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}