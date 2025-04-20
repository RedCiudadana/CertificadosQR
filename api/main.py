from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import qrcode
from PIL import Image, ImageDraw, ImageFont
import io
import os
import uuid
import shutil
import json
from datetime import datetime

# Create necessary directories
os.makedirs("uploads/templates", exist_ok=True)
os.makedirs("uploads/excel", exist_ok=True)
os.makedirs("output/certificates", exist_ok=True)
os.makedirs("output/docs", exist_ok=True)

app = FastAPI(title="Certificate Generator API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CertificateData(BaseModel):
    name: str
    event: str
    date: str
    id: Optional[str] = None

class GitHubConfig(BaseModel):
    username: str
    repo: str

@app.get("/")
async def root():
    return {"message": "Certificate Generator API is running"}

@app.post("/upload/template")
async def upload_template(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="File must be PNG or JPG")
    
    file_location = f"uploads/templates/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"filename": file.filename, "path": file_location}

@app.post("/upload/excel")
async def upload_excel(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.xlsx', '.xls', '.csv')):
        raise HTTPException(status_code=400, detail="File must be Excel or CSV")
    
    file_location = f"uploads/excel/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Parse Excel/CSV file to get preview data
    try:
        if file.filename.lower().endswith('.csv'):
            df = pd.read_csv(file_location)
        else:
            df = pd.read_excel(file_location)
        
        # Get first 5 rows for preview
        preview_data = df.head(5).to_dict(orient="records")
        columns = df.columns.tolist()
        
        return {
            "filename": file.filename,
            "path": file_location,
            "columns": columns,
            "preview": preview_data,
            "total_rows": len(df)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing file: {str(e)}")

@app.post("/generate/certificate")
async def generate_certificate(
    template: str = Form(...),
    github_username: str = Form(...),
    github_repo: str = Form(...),
    excel_file: str = Form(...),
    name_column: str = Form(...),
    event_name: str = Form(...),
    date: str = Form(...)
):
    # Validate files exist
    template_path = f"uploads/templates/{template}"
    excel_path = f"uploads/excel/{excel_file}"
    
    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail="Template file not found")
    
    if not os.path.exists(excel_path):
        raise HTTPException(status_code=404, detail="Excel file not found")
    
    # Create output directory for this batch
    batch_id = datetime.now().strftime("%Y%m%d%H%M%S")
    output_dir = f"output/certificates/{batch_id}"
    docs_dir = f"output/docs/{batch_id}"
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(docs_dir, exist_ok=True)
    
    # Read data from Excel
    try:
        if excel_file.lower().endswith('.csv'):
            df = pd.read_csv(excel_path)
        else:
            df = pd.read_excel(excel_path)
        
        if name_column not in df.columns:
            raise HTTPException(status_code=400, detail=f"Column '{name_column}' not found in Excel file")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading Excel file: {str(e)}")
    
    # Generate certificates for each entry
    certificates = []
    github_base_url = f"https://{github_username}.github.io/{github_repo}"
    
    for index, row in df.iterrows():
        try:
            # Generate unique ID for this certificate
            cert_id = str(uuid.uuid4())
            recipient_name = str(row[name_column])
            
            # Generate QR code with verification URL
            verification_url = f"{github_base_url}/verify.html?id={cert_id}"
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(verification_url)
            qr.make(fit=True)
            qr_img = qr.make_image(fill_color="black", back_color="white")
            
            # Open certificate template
            template_img = Image.open(template_path)
            
            # Add QR code to bottom right corner
            qr_size = 150
            qr_img = qr_img.resize((qr_size, qr_size))
            position = (template_img.width - qr_size - 50, template_img.height - qr_size - 50)
            template_img.paste(qr_img, position)
            
            # Add text to certificate
            draw = ImageDraw.Draw(template_img)
            
            # Using a default font - in production should use a proper font file
            try:
                font_large = ImageFont.truetype("arial.ttf", 60)
                font_medium = ImageFont.truetype("arial.ttf", 40)
            except:
                # Fallback to default PIL font
                font_large = ImageFont.load_default()
                font_medium = ImageFont.load_default()
            
            # Position text - these are approximations and may need adjustment
            # Name position (centered horizontally, at about 40% of height)
            name_position = (template_img.width // 2, int(template_img.height * 0.4))
            # Event position (centered horizontally, below name)
            event_position = (template_img.width // 2, int(template_img.height * 0.5))
            # Date position (centered horizontally, below event)
            date_position = (template_img.width // 2, int(template_img.height * 0.6))
            
            # Draw text on image (centered)
            draw.text(name_position, recipient_name, fill="black", font=font_large, anchor="mm")
            draw.text(event_position, event_name, fill="black", font=font_medium, anchor="mm")
            draw.text(date_position, date, fill="black", font=font_medium, anchor="mm")
            
            # Save certificate to output directory
            certificate_path = f"{output_dir}/{cert_id}.png"
            template_img.save(certificate_path)
            
            # Create HTML verification page
            verification_html = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Certificate Verification</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
                <div class="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
                    <div class="text-center mb-8">
                        <h1 class="text-2xl font-bold text-green-600">Certificate Verified ✓</h1>
                        <p class="text-gray-500">This certificate is authentic and has been verified.</p>
                    </div>
                    <div class="mb-6">
                        <h2 class="text-xl font-semibold mb-2">Certificate Details</h2>
                        <div class="border-t border-b border-gray-200 py-3">
                            <div class="flex justify-between py-1">
                                <span class="font-medium text-gray-600">Name:</span>
                                <span>{recipient_name}</span>
                            </div>
                            <div class="flex justify-between py-1">
                                <span class="font-medium text-gray-600">Event:</span>
                                <span>{event_name}</span>
                            </div>
                            <div class="flex justify-between py-1">
                                <span class="font-medium text-gray-600">Date:</span>
                                <span>{date}</span>
                            </div>
                            <div class="flex justify-between py-1">
                                <span class="font-medium text-gray-600">Certificate ID:</span>
                                <span class="text-sm">{cert_id}</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-center">
                        <a href="index.html" class="text-blue-600 hover:underline">Back to Home</a>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Save verification page
            with open(f"{docs_dir}/{cert_id}.html", "w") as f:
                f.write(verification_html)
            
            # Copy certificate to docs directory
            shutil.copy(certificate_path, f"{docs_dir}/{cert_id}.png")
            
            # Store certificate data for the response
            certificates.append({
                "id": cert_id,
                "name": recipient_name,
                "event": event_name,
                "date": date,
                "image_url": f"{cert_id}.png",
                "verification_url": f"{cert_id}.html"
            })
            
            # Create metadata file for verification
            cert_data = {
                "id": cert_id,
                "name": recipient_name,
                "event": event_name,
                "date": date,
                "issued_at": datetime.now().isoformat()
            }
            with open(f"{docs_dir}/{cert_id}.json", "w") as f:
                json.dump(cert_data, f)
                
        except Exception as e:
            # Log the error but continue with other certificates
            print(f"Error generating certificate for {row[name_column]}: {str(e)}")
    
    # Create index.html for the docs directory
    index_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate Verification System</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
            <div class="text-center mb-8">
                <h1 class="text-2xl font-bold text-blue-600">Certificate Verification System</h1>
                <p class="text-gray-500">Scan the QR code on your certificate to verify its authenticity.</p>
            </div>
            <div class="mb-6">
                <p class="text-center text-gray-600">
                    This system verifies certificates issued for {event_name}.
                </p>
            </div>
            <div class="text-center">
                <p class="text-sm text-gray-400">Powered by QR Certificate Generator</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Create verify.html that redirects to the right verification page
    verify_html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifying Certificate...</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const urlParams = new URLSearchParams(window.location.search);
                const certId = urlParams.get('id');
                
                if (certId) {
                    window.location.href = certId + '.html';
                } else {
                    document.getElementById('error-message').style.display = 'block';
                }
            });
        </script>
    </head>
    <body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
            <div class="text-center mb-8">
                <h1 class="text-2xl font-bold text-blue-600">Verifying Certificate...</h1>
                <p class="text-gray-500">Please wait while we redirect you to the verification page.</p>
            </div>
            <div id="error-message" class="mb-6 hidden">
                <p class="text-center text-red-600">
                    Invalid certificate ID. Please scan the QR code again.
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    with open(f"{docs_dir}/index.html", "w") as f:
        f.write(index_html)
        
    with open(f"{docs_dir}/verify.html", "w") as f:
        f.write(verify_html)
    
    # Create a zip file of the docs directory for easy download
    shutil.make_archive(f"output/{batch_id}", 'zip', docs_dir)
    
    return {
        "batch_id": batch_id,
        "github_base_url": github_base_url,
        "total_certificates": len(certificates),
        "certificates": certificates[:5],  # Return just the first 5 for preview
        "download_url": f"/download/{batch_id}"
    }

@app.get("/download/{batch_id}")
async def download_certificates(batch_id: str):
    zip_path = f"output/{batch_id}.zip"
    
    if not os.path.exists(zip_path):
        raise HTTPException(status_code=404, detail="Generated certificates not found")
    
    return FileResponse(
        path=zip_path,
        filename=f"certificates_{batch_id}.zip",
        media_type="application/zip"
    )

@app.get("/verify/{cert_id}")
async def verify_certificate(cert_id: str):
    # This would normally check against a database
    # For this example, we'll check if the JSON file exists
    json_path = f"output/docs/{cert_id}.json"
    
    if not os.path.exists(json_path):
        raise HTTPException(status_code=404, detail="Certificate not found or invalid")
    
    with open(json_path, "r") as f:
        cert_data = json.load(f)
    
    return cert_data