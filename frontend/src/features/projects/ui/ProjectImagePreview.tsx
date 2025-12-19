import { useState, useEffect } from 'react';
import type { FileRecord } from '@/entities/file';
import { getFilesByEntity, getFileUrl } from '@/shared/api/files';

interface ProjectImagePreviewProps {
  projectId: number;
  className?: string;
}

export function ProjectImagePreview({ projectId, className = '' }: ProjectImagePreviewProps) {
  const [projectImage, setProjectImage] = useState<FileRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjectImage = async () => {
      try {
        setIsLoading(true);
        const files = await getFilesByEntity('project', projectId);
        const imageFile = files.find((file) => file.mime_type.startsWith('image/'));
        if (imageFile) {
          setProjectImage(imageFile);
        }
      } catch (error) {
        console.error('Failed to load project image:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectImage();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`} />
    );
  }

  if (!projectImage) {
    return null;
  }

  return (
    <img
      src={getFileUrl(projectImage.file_path)}
      alt="Project preview"
      className={className}
    />
  );
}
