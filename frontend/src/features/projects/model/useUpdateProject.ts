import { useState } from 'react';
import type { UpdateProjectDto, Project } from '@/entities/project';
import { updateProject } from '../api/projectsApi';

interface UseUpdateProject {
  isSubmitting: boolean;
  error: string | null;
  submit: (id: number, payload: UpdateProjectDto) => Promise<Project>;
}

export function useUpdateProject(): UseUpdateProject {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (id: number, payload: UpdateProjectDto) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const project = await updateProject(id, payload);
      return project;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, error, submit };
}
