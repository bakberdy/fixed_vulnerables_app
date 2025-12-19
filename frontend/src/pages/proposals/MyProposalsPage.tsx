import { Link, useNavigate } from 'react-router-dom';
import { useMyProposals } from '@/features/proposals/model/useMyProposals';
import { Button, Card, Container, Heading, Loading, Text } from '@/shared/ui';

export function MyProposalsPage() {
  const navigate = useNavigate();
  const { proposals, isLoading, error } = useMyProposals();

  if (isLoading) {
    return (
      <Container className="py-8">
        <Loading />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <Card className="p-6">
          <Heading level={3} className="mb-2">Unable to load proposals</Heading>
          <Text color="muted">{error}</Text>
          <Button className="mt-4" onClick={() => navigate('/projects')}>
            Browse projects
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level={2}>My proposals</Heading>
          <Text color="muted">Track the bids you have submitted.</Text>
        </div>
        <Button onClick={() => navigate('/projects')}>
          Find projects
        </Button>
      </div>

      {proposals.length === 0 ? (
        <Card className="p-8 text-center">
          <Heading level={4} className="mb-2">No proposals yet</Heading>
          <Text color="muted" className="mb-4">Submit your first proposal to get started.</Text>
          <Button onClick={() => navigate('/projects')}>Browse projects</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="p-6 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <Heading level={4} className="text-lg">
                    {proposal.project_title || `Project #${proposal.project_id}`}
                  </Heading>
                  <Text color="muted" className="text-sm">
                    {proposal.cover_letter.slice(0, 120)}{proposal.cover_letter.length > 120 ? '…' : ''}
                  </Text>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>${proposal.proposed_amount}</span>
                    <span>•</span>
                    <span>{proposal.delivery_days} days</span>
                    <span>•</span>
                    <span className={`font-medium ${
                      proposal.status === 'accepted'
                        ? 'text-green-600'
                        : proposal.status === 'rejected'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                    }`}>
                      {proposal.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={() => navigate(`/projects/${proposal.project_id}`)}>
                    View project
                  </Button>
                  <Button variant="outline" onClick={() => navigate(`/messages?user=${proposal.freelancer_id}`)}>
                    Message
                  </Button>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Submitted: {new Date(proposal.created_at).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
