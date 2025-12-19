import type { FileEntityType, FileRecord } from '@/entities/file';
import { apiClient } from './client';

export interface UploadRequest {
  file: File;
  entityType: FileEntityType;
  entityId: number;
  onProgress?: (percent: number) => void;
}

export async function uploadFile({ file, entityType, entityId, onProgress }: UploadRequest): Promise<FileRecord> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entity_type', entityType);
  formData.append('entity_id', String(entityId));

  const { data } = await apiClient.post<FileRecord>('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (!onProgress || !event.total) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(percent);
    },
  });

  return data;
}
