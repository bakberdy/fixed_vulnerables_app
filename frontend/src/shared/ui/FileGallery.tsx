import { useState, useEffect } from 'react';
import type { FileEntityType, FileRecord } from '@/entities/file';
import { getFilesByEntity, getFileUrl } from '@/shared/api/files';
import { Card } from './Card';
import { Loading } from './Loading';

interface FileGalleryProps {
  entityType: FileEntityType;
  entityId: number;
}

export function FileGallery({ entityType, entityId }: FileGalleryProps) {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, [entityType, entityId]);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const data = await getFilesByEntity(entityType, entityId);
      setFiles(data);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isImage = (mimeType: string) => {
    return mimeType.startsWith('image/');
  };

  if (isLoading) {
    return <Loading />;
  }

  if (files.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file) => (
          <div key={file.id} className="space-y-2">
            {isImage(file.mime_type) ? (
              <a
                href={getFileUrl(file.file_path)}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
              >
                <img
                  src={getFileUrl(file.file_path)}
                  alt={file.original_name}
                  className="w-full h-full object-cover"
                />
              </a>
            ) : (
              <a
                href={getFileUrl(file.file_path)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center aspect-square rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </a>
            )}
            <p className="text-xs text-gray-600 truncate">{file.original_name}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
