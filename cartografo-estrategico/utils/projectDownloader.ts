export async function generateProjectZip(): Promise<Blob> {
  const response = await fetch('/api/download-zip');
  if (!response.ok) {
    throw new Error(`Project download failed with status ${response.status}`);
  }
  return response.blob();
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
