// API client for communicating with the FastAPI backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function uploadTemplate(file: File): Promise<{ filename: string; path: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload/template`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to upload template');
  }

  return response.json();
}

export async function uploadExcel(file: File): Promise<{
  filename: string;
  path: string;
  columns: string[];
  preview: any[];
  total_rows: number;
}> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload/excel`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to upload Excel file');
  }

  return response.json();
}

export async function generateCertificates(data: {
  template: string;
  github_username: string;
  github_repo: string;
  excel_file: string;
  name_column: string;
  event_name: string;
  date: string;
}): Promise<{
  batch_id: string;
  github_base_url: string;
  total_certificates: number;
  certificates: any[];
  download_url: string;
}> {
  const formData = new FormData();
  formData.append('template', data.template);
  formData.append('github_username', data.github_username);
  formData.append('github_repo', data.github_repo);
  formData.append('excel_file', data.excel_file);
  formData.append('name_column', data.name_column);
  formData.append('event_name', data.event_name);
  formData.append('date', data.date);

  const response = await fetch(`${API_URL}/generate/certificate`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to generate certificates');
  }

  return response.json();
}

export async function downloadCertificates(batchId: string): Promise<Blob> {
  const response = await fetch(`${API_URL}/download/${batchId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to download certificates');
  }

  return response.blob();
}