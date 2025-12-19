import { apiClient } from '@/shared/api/client';
import type { Proposal, UpdateProposalDto } from '@/entities/proposal';

export async function getMyProposals(): Promise<Proposal[]> {
  const { data } = await apiClient.get('/proposals/my-proposals');
  return data;
}

export async function updateProposal(id: number, dto: UpdateProposalDto): Promise<Proposal> {
  const { data } = await apiClient.put(`/proposals/${id}`, dto);
  return data;
}
