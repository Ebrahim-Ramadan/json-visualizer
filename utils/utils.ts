export const copyToClipboard = (text : string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
    } else {
      // Fallback method for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Could not copy text: ', err);
      }
      document.body.removeChild(textarea);
    }
  };
  

export function downloadJSONFile<T>(data: T, fileName: string): void {
  const jsonData = JSON.stringify(data, null, 2); 
  const blob = new Blob([jsonData], { type: 'application/json' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName; 
  document.body.appendChild(link);   link.click();

  URL.revokeObjectURL(url);
  document.body.removeChild(link);
}