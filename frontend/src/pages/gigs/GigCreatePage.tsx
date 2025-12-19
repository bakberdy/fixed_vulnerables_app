import { useNavigate } from 'react-router-dom';
import { GigForm, useCreateGig } from '@/features/gigs';
import { Container, Heading, Text } from '@/shared/ui';

export function GigCreatePage() {
  const navigate = useNavigate();
  const { submit, isSubmitting, error } = useCreateGig();

  const handleSubmit = async (values: Parameters<typeof submit>[0]) => {
    const gig = await submit(values);
    navigate(`/gigs/${gig.id}`);
  };

  return (
    <Container className="py-8 max-w-3xl">
      <div className="space-y-2 mb-6">
        <Heading level={2}>Create a new gig</Heading>
        <Text color="muted">Describe your service so clients can place orders quickly.</Text>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <GigForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Create gig" />
    </Container>
  );
}
