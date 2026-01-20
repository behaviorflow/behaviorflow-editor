/**
 * Triggers a download of a file with the given content and filename.
 * @param content The file content as a string or Blob.
 * @param filename The name for the downloaded file.
 * @param mimeType The MIME type of the file (default: 'application/octet-stream').
 */
export function downloadFile(
  content: string | Blob,
  filename: string,
  mimeType: string = "application/octet-stream",
) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
