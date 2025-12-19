import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCreateReview } from '@/features/reviews';
import { Button, Card, Container, Heading, Input, Text, Textarea } from '@/shared/ui';

export function ReviewCreatePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = Number(params.get('order'));
  const revieweeId = Number(params.get('user'));
  const { submit, isSubmitting, error } = useCreateReview();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const rating = Number(formData.get('rating'));
    const comment = String(formData.get('comment') || '').trim();

    await submit({ order_id: orderId, reviewee_id: revieweeId, rating, comment });
    navigate(-1);
  };

  const isInvalidParams = !Number.isFinite(orderId) || !Number.isFinite(revieweeId);

  return (
    <Container className="py-8 max-w-2xl">
      <Card className="p-6 space-y-4">
        <Heading level={2}>Leave a review</Heading>
        <Text color="muted">Feedback is available after a completed order.</Text>
        {isInvalidParams && (
          <Text color="muted" className="text-red-600">Missing order or user identifier.</Text>
        )}
        {error && <Text color="muted" className="text-red-600">{error}</Text>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Rating (1-5)</label>
            <Input name="rating" type="number" min={1} max={5} step={1} required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Comment</label>
            <Textarea name="comment" rows={5} required placeholder="Share your experience working together" />
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" type="button" onClick={() => navigate(-1)} fullWidth>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isInvalidParams} fullWidth>
              {isSubmitting ? 'Submitting...' : 'Submit review'}
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  );
}
