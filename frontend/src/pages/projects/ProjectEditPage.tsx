import { useNavigate, useParams } from 'react-router-dom';
import { ProjectForm, useProjectDetails, useUpdateProject } from '@/features/projects';
import { Alert, Container, Heading, Loading, Text } from '@/shared/ui';

export function ProjectEditPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const navigate = useNavigate();
  const { project, isLoading, error: loadError } = useProjectDetails(projectId);
  const { submit, isSubmitting, error: submitError } = useUpdateProject();

  const handleSubmit = async (values: Parameters<typeof submit>[1]) => {
    await submit(projectId, values);
    navigate(`/projects/${projectId}`);
  };

  if (isLoading) {
    return (
      <Container className="py-8">
        <Loading />
      </Container>
    );
  }

  if (loadError || !project) {
    return (
      <Container className="py-8">
        <Alert variant="error">{loadError || 'Project not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-8 max-w-3xl">
      <div className="space-y-2 mb-6">
        <Heading level={2}>Edit project</Heading>
        <Text color="muted">Update your project scope and details.</Text>
        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      </div>
      <ProjectForm
        initialValue={project}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Save changes"
      />
    </Container>
  );
}
