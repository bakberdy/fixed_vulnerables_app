import { useNavigate } from 'react-router-dom';
import { useMyProjects, ProjectImagePreview } from '@/features/projects';
import { Button, Card, Container, Heading, Loading, Text } from '@/shared/ui';

export function MyProjectsPage() {
  const { projects, isLoading, error } = useMyProjects();
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
          <Heading level={3} className="mb-2">Unable to load projects</Heading>
          <Text color="muted">{error}</Text>
          <Button className="mt-4" onClick={() => navigate('/projects/create')}>
            Post a project
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level={2}>My projects</Heading>
          <Text color="muted">Track work you have posted.</Text>
        </div>
        <Button onClick={() => navigate('/projects/create')}>
          Post project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="p-8 text-center">
          <Heading level={4} className="mb-2">No projects yet</Heading>
          <Text color="muted" className="mb-4">Publish a project to invite proposals.</Text>
          <Button onClick={() => navigate('/projects/create')}>
            Post project
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <ProjectImagePreview 
                projectId={project.id} 
                className="aspect-video w-full bg-gray-100 object-cover"
              />
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Heading level={4} className="text-lg">{project.title}</Heading>
                    <Text color="muted" className="text-sm line-clamp-2">{project.description}</Text>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>${project.budget_min} - ${project.budget_max}</span>
                      <span>•</span>
                      <span>{project.duration_days} days</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : project.status === 'completed'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => navigate(`/projects/${project.id}`)}>
                    View
                  </Button>
                  <Button className="flex-1" onClick={() => navigate(`/projects/${project.id}/edit`)}>
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
