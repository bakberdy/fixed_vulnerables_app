import { useEffect, useState } from 'react';
import type { Project } from '@/entities/project';
import { getMyProjects } from '../api/projectsApi';

interface MyProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

export function useMyProjects(): MyProjectsState {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMyProjects();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, isLoading, error };
}
