export type FileEntityType = 'gig' | 'project' | 'proposal' | 'order' | 'message' | 'profile';

export interface FileRecord {
  id: number;
  uploader_id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  entity_type: FileEntityType;
  entity_id: number;
  uploaded_at: string;
}
