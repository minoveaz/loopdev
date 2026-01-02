
export const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return 'picture_as_pdf';
  if (type.includes('image')) return 'image';
  return 'description';
};

export const getIconColorBg = (type: string) => {
  if (type.includes('pdf')) return 'bg-red-100 dark:bg-red-900/30 text-red-500';
  if (type.includes('image')) return 'bg-green-100 dark:bg-green-900/30 text-green-600';
  // Fallback to primary token instead of blue-100
  return 'bg-primary/10 text-primary';
};
