export interface FileEntity {
  id: number;
  uploader_id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  entity_type: 'gig' | 'project' | 'proposal' | 'order' | 'message' | 'profile';
  entity_id: number;
  uploaded_at: string;
}

export interface UploadFileDto {
  entity_type: FileEntity['entity_type'];
  entity_id: number;
}
