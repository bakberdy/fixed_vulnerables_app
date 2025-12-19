import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { OrderForm, useCreateOrder } from '@/features/orders';
import { Container, Heading, Text } from '@/shared/ui';

export function OrderCreatePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { submit, isSubmitting, error } = useCreateOrder();

  const initialValue = useMemo(() => {
    const gigIdParam = params.get('gig');
    const projectIdParam = params.get('project');
    const sellerParam = params.get('seller');
    const amountParam = params.get('amount');

    return {
      gig_id: gigIdParam ? Number(gigIdParam) : undefined,
      project_id: projectIdParam ? Number(projectIdParam) : undefined,
      seller_id: sellerParam ? Number(sellerParam) : undefined,
      amount: amountParam ? Number(amountParam) : undefined,
    };
  }, [params]);

  const handleSubmit = async (values: Parameters<typeof submit>[0]) => {
    const order = await submit(values);
    navigate(`/orders/${order.id}`);
  };

  return (
    <Container className="py-8 max-w-3xl">
      <div className="space-y-2 mb-6">
        <Heading level={2}>Create order</Heading>
        <Text color="muted">Confirm details to start the engagement.</Text>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <OrderForm
        initialValue={initialValue}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Create order"
      />
    </Container>
  );
}
