/**
 * Utility function to download files from public directory
 * @param filePath - Path to the file in the public directory
 * @param fileName - Optional custom filename for download
 */
export const downloadFile = (filePath: string, fileName?: string) => {
  try {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = filePath;
    
    // Extract filename from path if not provided
    const defaultFileName = filePath.split('/').pop() || 'download';
    link.download = fileName || defaultFileName;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error downloading file:', error);
    return false;
  }
};

/**
 * Download rule book file for paper presentation events
 * @param event - Event object containing ruleBookFile path
 */
export const downloadRuleBook = (event: { ruleBookFile?: string; name: string }) => {
  if (!event.ruleBookFile) {
    console.warn('No rule book file available for this event');
    return false;
  }
  
  const fileName = `${event.name.replace(/\s+/g, '_')}_Rules.docx`;
  return downloadFile(event.ruleBookFile, fileName);
};
