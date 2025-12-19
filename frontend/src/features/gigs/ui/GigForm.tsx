import { useEffect, useState } from 'react';
import type { CreateGigDto, Gig } from '@/entities/gig';
import { Button, Card, Input, Textarea } from '@/shared/ui';

export interface GigFormValues extends CreateGigDto {}

interface GigFormProps {
  initialValue?: Partial<Gig>;
  onSubmit: (values: GigFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function GigForm({ initialValue, onSubmit, isSubmitting = false, submitLabel = 'Save gig' }: GigFormProps) {
  const [title, setTitle] = useState(initialValue?.title || '');
  const [description, setDescription] = useState(initialValue?.description || '');
  const [category, setCategory] = useState(initialValue?.category || '');
  const [price, setPrice] = useState(initialValue?.price?.toString() || '');
  const [deliveryDays, setDeliveryDays] = useState(initialValue?.delivery_days?.toString() || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(initialValue?.title || '');
    setDescription(initialValue?.description || '');
    setCategory(initialValue?.category || '');
    setPrice(initialValue?.price?.toString() || '');
    setDeliveryDays(initialValue?.delivery_days?.toString() || '');
  }, [initialValue]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const priceValue = Number(price);
    const daysValue = Number(deliveryDays);

    if (!title.trim() || !description.trim() || !category.trim()) {
      setError('All fields are required');
      return;
    }

    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      setError('Price must be greater than zero');
      return;
    }

    if (!Number.isFinite(daysValue) || daysValue < 1) {
      setError('Delivery days must be at least 1');
      return;
    }

    const payload: GigFormValues = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      price: priceValue,
      delivery_days: daysValue,
    };

    await onSubmit(payload);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="I will build a landing page"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <Input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Web Development"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            placeholder="Describe your service, deliverables, and process"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Price (USD)</label>
            <Input
              type="number"
              min={1}
              step={1}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Delivery days</label>
            <Input
              type="number"
              min={1}
              step={1}
              value={deliveryDays}
              onChange={(event) => setDeliveryDays(event.target.value)}
              required
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </form>
    </Card>
  );
}
