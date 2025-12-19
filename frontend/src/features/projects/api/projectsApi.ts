import { apiClient } from '@/shared/api/client';
import type { Project, ProjectFilters, CreateProjectDto, UpdateProjectDto } from '@/entities/project';

export async function getMyProjects(): Promise<Project[]> {
  const { data } = await apiClient.get('/projects/my-projects');
  return data;
}

export async function searchProjects(filters: ProjectFilters): Promise<Project[]> {
  const { data } = await apiClient.get('/projects/search', { params: filters });
  return data;
}

export async function getProjectById(id: number): Promise<Project> {
  const { data } = await apiClient.get(`/projects/${id}`);
  return data;
}

export async function createProject(dto: CreateProjectDto): Promise<Project> {
  const { data } = await apiClient.post('/projects', dto);
  return data;
}

export async function updateProject(id: number, dto: UpdateProjectDto): Promise<Project> {
  const { data } = await apiClient.put(`/projects/${id}`, dto);
  return data;
}

export async function deleteProject(id: number): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}
