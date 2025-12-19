import { useState, useEffect } from 'react';
import type { Project } from '@/entities/project';
import { getProjectById } from '../api/projectsApi';

export function useProjectDetails(projectId: number) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProjectById(projectId);
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return { project, isLoading, error };
}
