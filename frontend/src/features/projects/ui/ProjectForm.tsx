import { useEffect, useState } from 'react';
import type { CreateProjectDto, Project } from '@/entities/project';
import { Button, Card, Input, Textarea } from '@/shared/ui';

export interface ProjectFormValues extends CreateProjectDto {}

interface ProjectFormProps {
  initialValue?: Partial<Project>;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function ProjectForm({ initialValue, onSubmit, isSubmitting = false, submitLabel = 'Save project' }: ProjectFormProps) {
  const [title, setTitle] = useState(initialValue?.title || '');
  const [description, setDescription] = useState(initialValue?.description || '');
  const [budgetMin, setBudgetMin] = useState(initialValue?.budget_min?.toString() || '');
  const [budgetMax, setBudgetMax] = useState(initialValue?.budget_max?.toString() || '');
  const [durationDays, setDurationDays] = useState(initialValue?.duration_days?.toString() || '');
  const [skills, setSkills] = useState(initialValue?.skills?.join(', ') || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(initialValue?.title || '');
    setDescription(initialValue?.description || '');
    setBudgetMin(initialValue?.budget_min?.toString() || '');
    setBudgetMax(initialValue?.budget_max?.toString() || '');
    setDurationDays(initialValue?.duration_days?.toString() || '');
    setSkills(initialValue?.skills?.join(', ') || '');
  }, [initialValue]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const minValue = Number(budgetMin);
    const maxValue = Number(budgetMax);
    const durationValue = Number(durationDays);

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    if (!Number.isFinite(minValue) || !Number.isFinite(maxValue) || minValue <= 0 || maxValue <= 0 || maxValue < minValue) {
      setError('Budget range is invalid');
      return;
    }

    if (!Number.isFinite(durationValue) || durationValue < 1) {
      setError('Duration must be at least 1 day');
      return;
    }

    const payload: ProjectFormValues = {
      title: title.trim(),
      description: description.trim(),
      budget_min: minValue,
      budget_max: maxValue,
      duration_days: durationValue,
      skills: skills.split(',').map((skill) => skill.trim()).filter(Boolean),
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
            placeholder="Mobile app redesign"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            placeholder="Describe the project goals, scope, and deliverables"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Budget min (USD)</label>
            <Input
              type="number"
              min={1}
              value={budgetMin}
              onChange={(event) => setBudgetMin(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Budget max (USD)</label>
            <Input
              type="number"
              min={1}
              value={budgetMax}
              onChange={(event) => setBudgetMax(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Duration (days)</label>
            <Input
              type="number"
              min={1}
              value={durationDays}
              onChange={(event) => setDurationDays(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Skills</label>
          <Input
            value={skills}
            onChange={(event) => setSkills(event.target.value)}
            placeholder="UI/UX, React Native, API design"
          />
          <p className="text-xs text-gray-500">Separate skills with commas</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </form>
    </Card>
  );
}
