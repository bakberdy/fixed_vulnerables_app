import { useParams, useNavigate } from 'react-router-dom';
import { GigForm, useGigDetails, useUpdateGig } from '@/features/gigs';
import { Alert, Container, Heading, Loading, Text } from '@/shared/ui';

export function GigEditPage() {
  const { id } = useParams<{ id: string }>();
  const gigId = Number(id);
  const navigate = useNavigate();
  const { gig, isLoading, error: loadError } = useGigDetails(gigId);
  const { submit, isSubmitting, error: submitError } = useUpdateGig();

  const handleSubmit = async (values: Parameters<typeof submit>[1]) => {
    await submit(gigId, values);
    navigate(`/gigs/${gigId}`);
  };

  if (isLoading) {
    return (
      <Container className="py-8">
        <Loading />
      </Container>
    );
  }

  if (loadError || !gig) {
    return (
      <Container className="py-8">
        <Alert variant="error">{loadError || 'Gig not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-8 max-w-3xl">
      <div className="space-y-2 mb-6">
        <Heading level={2}>Edit gig</Heading>
        <Text color="muted">Update your gig details and pricing.</Text>
        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      </div>
      <GigForm
        initialValue={gig}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Save changes"
      />
    </Container>
  );
}
