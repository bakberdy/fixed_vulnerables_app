import { useNavigate } from 'react-router-dom';
import { ProjectForm, useCreateProject } from '@/features/projects';
import { Container, Heading, Text } from '@/shared/ui';

export function ProjectCreatePage() {
  const navigate = useNavigate();
  const { submit, isSubmitting, error } = useCreateProject();

  const handleSubmit = async (values: Parameters<typeof submit>[0]) => {
    const project = await submit(values);
    navigate(`/projects/${project.id}`);
  };

  return (
    <Container className="py-8 max-w-3xl">
      <div className="space-y-2 mb-6">
        <Heading level={2}>Post a new project</Heading>
        <Text color="muted">Share requirements so freelancers can propose solutions.</Text>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <ProjectForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Create project" />
    </Container>
  );
}
