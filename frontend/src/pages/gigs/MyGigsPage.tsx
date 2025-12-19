import { Link, useNavigate } from 'react-router-dom';
import { useMyGigs } from '@/features/gigs';
import { Button, Card, Container, Heading, Loading, Text } from '@/shared/ui';

export function MyGigsPage() {
  const { gigs, isLoading, error } = useMyGigs();
  const navigate = useNavigate();

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
          <Heading level={3} className="mb-2">Unable to load gigs</Heading>
          <Text color="muted">{error}</Text>
          <Button className="mt-4" onClick={() => navigate('/gigs/create')}>
            Create a gig
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level={2}>My gigs</Heading>
          <Text color="muted">Manage the services you offer.</Text>
        </div>
        <Button onClick={() => navigate('/gigs/create')}>
          Create new gig
        </Button>
      </div>

      {gigs.length === 0 ? (
        <Card className="p-8 text-center">
          <Heading level={4} className="mb-2">No gigs yet</Heading>
          <Text color="muted" className="mb-4">Publish your first gig to start receiving orders.</Text>
          <Button onClick={() => navigate('/gigs/create')}>
            Create gig
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {gigs.map((gig) => (
            <Card key={gig.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <Heading level={4} className="text-lg">{gig.title}</Heading>
                  <Text color="muted" className="text-sm line-clamp-2">{gig.description}</Text>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>${gig.price}</span>
                    <span>•</span>
                    <span>{gig.delivery_days} days</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  gig.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : gig.status === 'paused'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {gig.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => navigate(`/gigs/${gig.id}`)}>
                  View
                </Button>
                <Button className="flex-1" onClick={() => navigate(`/gigs/${gig.id}/edit`)}>
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
