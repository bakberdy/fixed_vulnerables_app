import { useState, useEffect } from 'react';
import type { Project, ProjectFilters } from '@/entities/project';
import { searchProjects } from '../api/projectsApi';

export function useSearchProjects(filters: ProjectFilters) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchProjects(filters);
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [filters]);

  return { projects, isLoading, error };
}
