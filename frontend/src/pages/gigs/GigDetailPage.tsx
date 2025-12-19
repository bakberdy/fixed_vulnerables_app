import { useParams, useNavigate } from 'react-router-dom';
import { useGigDetails } from '@/features/gigs/model/useGigDetails';
import { Loading, Alert, Button, Card, Container, Text } from '@/shared/ui';
import { useAuth } from '@/app/providers/AuthProvider';

export function GigDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const gigId = Number(id);
  const { user } = useAuth();
  
  const { gig, isLoading, error } = useGigDetails(gigId);

  if (isLoading) {
    return (
      <Container className="py-8">
        <Loading />
      </Container>
    );
  }

  if (error || !gig) {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Alert variant="error">{error || 'Gig not found'}</Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
        <Button
          variant="secondary"
          onClick={() => navigate('/gigs')}
          className="mb-6"
        >
          ← Back to Gigs
        </Button>

        <Card className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {gig.title}
          </h1>

          <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Freelancer</p>
              <p className="font-semibold text-gray-900">{gig.freelancer_name}</p>
            </div>
            
            {gig.freelancer_rating && (
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-semibold text-yellow-600">
                  ⭐ {gig.freelancer_rating.toFixed(1)}
                </p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-600">Price</p>
              <p className="text-2xl font-bold text-green-600">
                ${gig.price}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {gig.description}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Delivery: {gig.delivery_days} {gig.delivery_days === 1 ? 'day' : 'days'}
            </div>
            
            {user?.role === 'client' ? (
              <Button
                size="lg"
                onClick={() => navigate(`/orders/create?gig=${gig.id}&seller=${gig.freelancer_id}&amount=${gig.price}`)}
              >
                Order Now - ${gig.price}
              </Button>
            ) : (
              <Text color="muted" className="text-sm">Orders are available to clients.</Text>
            )}
          </div>
        </Card>
    </Container>)};
