import { useState } from 'react';
import type { CreateProjectDto, Project } from '@/entities/project';
import { createProject } from '../api/projectsApi';

interface UseCreateProject {
  isSubmitting: boolean;
  error: string | null;
  submit: (payload: CreateProjectDto) => Promise<Project>;
}

export function useCreateProject(): UseCreateProject {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (payload: CreateProjectDto) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const project = await createProject(payload);
      return project;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, error, submit };
}
