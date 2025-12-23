import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '@/shared/api/client';
import type { Proposal } from '@/entities/proposal';

export function ProposalListPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProposals();
  }, [projectId]);

  async function loadProposals() {
    try {
      const response = await apiClient.get(`/proposals/project/${projectId}`);
      setProposals(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to load proposals:', error);
      setError('Unable to load proposals. Please check your connection or login session.');
    } finally {
      setLoading(false);
    }
  }

  async function acceptProposal(proposalId: number) {
    if (!confirm('Are you sure you want to accept this proposal?')) return;

    try {
      await apiClient.put(`/proposals/${proposalId}`, { status: 'accepted' });
      setProposals(proposals.map(p => 
        p.id === proposalId ? { ...p, status: 'accepted' as const } : p
      ));
    } catch (error) {
      console.error('Failed to accept proposal:', error);
      alert('Failed to accept proposal');
    }
  }

  async function rejectProposal(proposalId: number) {
    if (!confirm('Are you sure you want to reject this proposal?')) return;

    try {
      await apiClient.put(`/proposals/${proposalId}`, { status: 'rejected' });
      setProposals(proposals.map(p => 
        p.id === proposalId ? { ...p, status: 'rejected' as const } : p
      ));
    } catch (error) {
      console.error('Failed to reject proposal:', error);
      alert('Failed to reject proposal');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading proposals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Proposals ({proposals.length})
          </h1>
          <Link
            to={`/projects/${projectId}`}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Project
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {proposals.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No proposals yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {proposal.freelancer_name || `Freelancer #${proposal.freelancer_id}`}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>${proposal.proposed_amount}</span>
                      <span>•</span>
                      <span>{proposal.delivery_days} days</span>
                      <span>•</span>
                      <span className={`font-medium ${
                        proposal.status === 'accepted' ? 'text-green-600' :
                        proposal.status === 'rejected' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {proposal.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{proposal.cover_letter}</p>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  Submitted: {new Date(proposal.created_at).toLocaleDateString()}
                </div>

                {proposal.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => acceptProposal(proposal.id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => rejectProposal(proposal.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Reject
                    </button>
                    <Link
                      to={`/messages?user=${proposal.freelancer_id}`}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                    >
                      Message
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
