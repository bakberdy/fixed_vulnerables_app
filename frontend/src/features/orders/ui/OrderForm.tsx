import { useEffect, useState } from 'react';
import type { CreateOrderDto } from '@/entities/order';
import { Button, Card, Input, Textarea } from '@/shared/ui';

interface OrderFormProps {
  initialValue?: Partial<CreateOrderDto> & { amount?: number };
  onSubmit: (values: CreateOrderDto) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function OrderForm({ initialValue, onSubmit, isSubmitting = false, submitLabel = 'Create order' }: OrderFormProps) {
  const [amount, setAmount] = useState(initialValue?.amount?.toString() || '');
  const [sellerId, setSellerId] = useState(initialValue?.seller_id?.toString() || '');
  const [gigId, setGigId] = useState(initialValue?.gig_id?.toString() || '');
  const [projectId, setProjectId] = useState(initialValue?.project_id?.toString() || '');
  const [requirements, setRequirements] = useState(initialValue?.requirements || '');
  const [deliveryDate, setDeliveryDate] = useState(initialValue?.delivery_date || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAmount(initialValue?.amount?.toString() || '');
    setSellerId(initialValue?.seller_id?.toString() || '');
    setGigId(initialValue?.gig_id?.toString() || '');
    setProjectId(initialValue?.project_id?.toString() || '');
    setRequirements(initialValue?.requirements || '');
    setDeliveryDate(initialValue?.delivery_date || '');
  }, [initialValue]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const amountValue = Number(amount);
    const sellerValue = Number(sellerId);
    const gigValue = gigId ? Number(gigId) : undefined;
    const projectValue = projectId ? Number(projectId) : undefined;

    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    if (!Number.isFinite(sellerValue) || sellerValue <= 0) {
      setError('Seller is required');
      return;
    }

    const payload: CreateOrderDto = {
      amount: amountValue,
      seller_id: sellerValue,
      requirements: requirements.trim() || undefined,
      delivery_date: deliveryDate || undefined,
      gig_id: gigValue,
      project_id: projectValue,
    };

    await onSubmit(payload);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Amount (USD)</label>
          <Input
            type="number"
            min={1}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Seller ID</label>
            <Input
              type="number"
              min={1}
              value={sellerId}
              onChange={(event) => setSellerId(event.target.value)}
              required
              disabled={Boolean(initialValue?.seller_id)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Delivery date</label>
            <Input
              type="date"
              value={deliveryDate}
              onChange={(event) => setDeliveryDate(event.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Gig ID (optional)</label>
            <Input
              type="number"
              min={1}
              value={gigId}
              onChange={(event) => setGigId(event.target.value)}
              disabled={Boolean(initialValue?.gig_id)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Project ID (optional)</label>
            <Input
              type="number"
              min={1}
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              disabled={Boolean(initialValue?.project_id)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Requirements</label>
          <Textarea
            value={requirements}
            onChange={(event) => setRequirements(event.target.value)}
            rows={4}
            placeholder="Share scope, assets, or links"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </form>
    </Card>
  );
}
