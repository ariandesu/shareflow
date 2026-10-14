/**
 * P2P Workflow Chaining Utility
 * Connects 40+ utilities to WebRTC P2P direct transfers and Ephemeral Secret Sharing.
 */

export function pipeFileToP2P(
  fileOrBlob: File | Blob,
  defaultFilename: string = "shareflow-output.bin",
  navigate?: (path: string, options?: any) => void
): void {
  let file: File;
  if (fileOrBlob instanceof File) {
    file = fileOrBlob;
  } else {
    file = new File([fileOrBlob], defaultFilename, {
      type: fileOrBlob.type || "application/octet-stream",
      lastModified: Date.now(),
    });
  }

  // Pre-seed window global as safe backup across router navigation
  (window as any).__pendingShareFiles = [file];

  if (navigate) {
    navigate("/file-share", { state: { files: [file] } });
  } else {
    window.location.href = "/file-share";
  }
}

export function pipeTextToSecret(
  text: string,
  navigate?: (path: string, options?: any) => void
): void {
  if (!text) return;

  (window as any).__pendingShareText = text;

  if (navigate) {
    navigate("/text-share", { state: { prefilledText: text } });
  } else {
    window.location.href = "/text-share";
  }
}
