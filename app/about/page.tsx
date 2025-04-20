export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">About QR Certificate Generator</h1>
          <p className="text-muted-foreground text-lg">
            QR Certificate Generator is an open-source project designed to help organizations create, manage, and verify digital certificates efficiently.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground">
            Our mission is to provide a simple, accessible tool for creating verifiable digital certificates that can be easily shared and authenticated. In an increasingly digital world, the need for secure, verifiable credentials is more important than ever. Our QR Certificate Generator addresses this need by combining modern web technologies with practical verification methods.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Key Features</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Generate professional certificates from customizable templates</li>
            <li>Automatic QR code generation for verification</li>
            <li>Bulk certificate generation from Excel data</li>
            <li>Seamless GitHub Pages integration for certificate hosting</li>
            <li>User-friendly web interface for easy management</li>
            <li>Secure verification system through QR codes</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Technology Stack</h2>
          <p className="text-muted-foreground">
            This application is built using a modern technology stack:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Frontend:</strong> Next.js, React, Tailwind CSS, shadcn/ui</li>
            <li><strong>Backend:</strong> FastAPI (Python)</li>
            <li><strong>Certificate Generation:</strong> Pillow, qrcode</li>
            <li><strong>Data Processing:</strong> Pandas, openpyxl</li>
            <li><strong>Deployment:</strong> GitHub Pages</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Open Source</h2>
          <p className="text-muted-foreground">
            QR Certificate Generator is proudly open source. We believe in the power of community-driven development and welcome contributions from developers of all skill levels. Our source code is available on GitHub, where you can report issues, suggest improvements, or contribute directly to the codebase.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">CBIT Open Source Community</h2>
          <p className="text-muted-foreground">
            This project is maintained by the CBIT Open Source Community, a group dedicated to promoting open-source development and collaboration. We aim to create practical tools that address real-world needs while providing opportunities for developers to learn and grow.
          </p>
        </div>
      </div>
    </div>
  );
}