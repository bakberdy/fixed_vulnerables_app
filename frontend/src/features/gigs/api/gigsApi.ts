import { apiClient } from '@/shared/api/client';
import type { Gig, GigFilters, CreateGigDto, UpdateGigDto } from '@/entities/gig';

export async function getMyGigs(): Promise<Gig[]> {
  const { data } = await apiClient.get('/gigs/my-gigs');
  return data;
}

export async function searchGigs(filters: GigFilters): Promise<Gig[]> {
  const { data } = await apiClient.get('/gigs/search', { params: filters });
  return data;
}

export async function getGigById(id: number): Promise<Gig> {
  const { data } = await apiClient.get(`/gigs/${id}`);
  return data;
}

export async function createGig(dto: CreateGigDto): Promise<Gig> {
  const { data } = await apiClient.post('/gigs', dto);
  return data;
}

export async function updateGig(id: number, dto: UpdateGigDto): Promise<Gig> {
  const { data } = await apiClient.put(`/gigs/${id}`, dto);
  return data;
}

export async function deleteGig(id: number): Promise<void> {
  await apiClient.delete(`/gigs/${id}`);
}
