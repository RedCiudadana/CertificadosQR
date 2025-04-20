# QR Certificate Generator

A web application built with Next.js and FastAPI that allows you to generate verifiable certificates with QR codes. This tool helps organizations create, manage, and verify digital certificates efficiently.

## Features

- Generate certificates from templates
- Automatic QR code generation for verification
- Bulk certificate generation from Excel data
- GitHub Pages integration for certificate hosting
- Web-based interface for easy management
- Verification system through QR codes

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- Python
- pip

You'll also need:

- A certificate template (PNG/JPG)
- An Excel sheet with recipient details
- A GitHub account for hosting certificates

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/qr-certificate-generator.git
cd qr-certificate-generator
```

2. Install dependencies:
```bash
npm install
pip install -r requirements.txt
```

## Usage

Start the development server:
```bash
npm run dev
```

This command will automatically start both the Next.js frontend and FastAPI backend.

Open your browser and navigate to http://localhost:3000

## Certificate Generation Process

### Prepare Your Template

1. Create a certificate template with space for text and a QR code, then export it as a PNG or JPG.
2. Convert the template to SVG format using tools like Pixelied PNG to SVG Converter (optional)

### Setup GitHub Repository

1. Create a new public repository on GitHub
2. Enable GitHub Pages in repository settings
3. Configure Pages to use the main branch and /docs folder

### Generate Certificates

1. Enter your GitHub details to generate the base URL
2. Upload your certificate template
3. Import recipient data from Excel
4. Generate certificates with QR codes
5. Download the generated docs folder

### Deploy Certificates

1. Upload the generated docs folder to your GitHub repository
2. Certificates will be accessible via GitHub Pages
3. QR codes will link to verification pages

## Verification Process

- Scan the QR code on any certificate
- The QR code links to a unique verification page
- The verification page displays certificate authenticity and details

## Project Structure

```
├── api/                  # FastAPI backend
│   └── main.py           # Main API endpoints
├── app/                  # Next.js frontend
│   ├── components/       # React components
│   ├── generate/         # Certificate generation pages
│   ├── verify/           # Certificate verification page
│   └── page.tsx          # Home page
├── lib/                  # Utility functions
├── public/               # Static assets
└── server.js             # Combined server for development
```

## License

[MIT](LICENSE)