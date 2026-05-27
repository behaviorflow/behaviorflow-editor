// Utility to upload a file and return its contents as a string
// Returns a Promise that resolves to the file contents

export function uploadFile(accept: string = "application/json"): Promise<{ contents: string; filename: string }> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.style.display = "none";
    document.body.appendChild(input);

    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) {
        reject(new Error("No file selected"));
        document.body.removeChild(input);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ contents: reader.result as string, filename: file.name });
        document.body.removeChild(input);
      };
      reader.onerror = (e) => {
        reject(e);
        document.body.removeChild(input);
      };
      reader.readAsText(file);
    };

    input.click();
  });
}
