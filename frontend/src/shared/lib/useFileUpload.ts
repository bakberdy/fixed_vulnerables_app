import { useState } from 'react';
import type { FileRecord, FileEntityType } from '@/entities/file';
import { uploadFile } from '@/shared/api/upload';
import { extractApiErrorMessage } from '@/shared/api/error';

interface UseFileUploadResult {
  isUploading: boolean;
  progress: number;
  error: string | null;
  lastFile: FileRecord | null;
  upload: (params: { file: File; entityType: FileEntityType; entityId: number }) => Promise<FileRecord>;
}

export function useFileUpload(): UseFileUploadResult {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [lastFile, setLastFile] = useState<FileRecord | null>(null);

  const upload = async ({ file, entityType, entityId }: { file: File; entityType: FileEntityType; entityId: number }) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    try {
      const record = await uploadFile({ file, entityType, entityId, onProgress: setProgress });
      setLastFile(record);
      return record;
    } catch (err) {
      const message = extractApiErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, progress, error, lastFile, upload };
}
