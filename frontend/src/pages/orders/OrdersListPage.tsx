import { useNavigate } from 'react-router-dom';
import { useMyOrders } from '@/features/orders';
import { Button, Card, Container, Heading, Loading, Text } from '@/shared/ui';
import { useAuth } from '@/app/providers/AuthProvider';

export function OrdersListPage() {
  const { orders, isLoading, error } = useMyOrders();
  const { user } = useAuth();
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
          <Heading level={3} className="mb-2">Unable to load orders</Heading>
          <Text color="muted">{error}</Text>
          <Button className="mt-4" onClick={() => navigate('/gigs')}>
            Browse gigs
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level={2}>My orders</Heading>
          <Text color="muted">Review your active and past orders.</Text>
        </div>
        {user?.role === 'client' && (
          <Button onClick={() => navigate('/orders/create')}>
            Create order
          </Button>
        )}
      </div>

      {orders.length === 0 ? (
        <Card className="p-8 text-center">
          <Heading level={4} className="mb-2">No orders yet</Heading>
          <Text color="muted" className="mb-4">Start by hiring from gigs or projects.</Text>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => navigate('/gigs')}>Browse gigs</Button>
            <Button variant="secondary" onClick={() => navigate('/projects')}>Browse projects</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <Heading level={4} className="text-lg">Order #{order.id}</Heading>
                  <Text color="muted" className="text-sm">
                    {order.gig_title || order.project_title || 'Custom order'}
                  </Text>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>${order.amount}</span>
                    <span>•</span>
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'delivered'
                        ? 'bg-purple-100 text-purple-800'
                        : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => navigate(`/orders/${order.id}`)}>
                  View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
