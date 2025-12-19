import { useRef, useState } from 'react';
import type { FileEntityType, FileRecord } from '@/entities/file';
import { useFileUpload } from '@/shared/lib/useFileUpload';
import { Button } from './Button';
import { Card } from './Card';
import { Text } from './typography';

interface FileUploadProps {
  entityType: FileEntityType;
  entityId: number;
  onUploaded?: (file: FileRecord) => void;
  label?: string;
}

export function FileUpload({ entityType, entityId, onUploaded, label = 'Upload file' }: FileUploadProps) {
  const { upload, progress, isUploading, error, lastFile } = useFileUpload();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedName, setSelectedName] = useState<string>('');

  const handleChoose = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedName(file.name);
    const record = await upload({ file, entityType, entityId });
    onUploaded?.(record);
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Text className="text-sm font-medium text-gray-900">{label}</Text>
        </div>
        <Button onClick={handleChoose} disabled={isUploading}>
          {isUploading ? 'Uploading…' : 'Choose file'}
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {selectedName && (
        <div className="text-sm text-gray-700">Selected: {selectedName}</div>
      )}

      {isUploading && (
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {lastFile && (
        <div className="text-sm text-green-700">
          Uploaded: {lastFile.file_path}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
    </Card>
  );
}
