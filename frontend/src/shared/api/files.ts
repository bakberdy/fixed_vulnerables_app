import type { FileEntityType, FileRecord } from '@/entities/file';
import { apiClient } from './client';

export async function getFilesByEntity(entityType: FileEntityType, entityId: number): Promise<FileRecord[]> {
  const { data } = await apiClient.get<FileRecord[]>(`/files/entity/${entityType}/${entityId}`);
  return data;
}

export function getFileUrl(filePath: string): string {
  const backendHost = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
  return `${backendHost}/${filePath}`;
}

export async function deleteFile(id: number): Promise<void> {
  await apiClient.delete(`/files/${id}`);
}
