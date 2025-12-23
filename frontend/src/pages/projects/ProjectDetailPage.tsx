import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useProjectDetails } from '@/features/projects';
import { Loading, Alert, Button, Card, Container, FileUpload, FileGallery } from '@/shared/ui';
import { useAuth } from '@/app/providers/AuthProvider';
import { apiClient } from '@/shared/api/client';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = Number(id);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useAuth();
  const [proposalsCount, setProposalsCount] = useState<number | null>(null);
  
  const { project, isLoading, error } = useProjectDetails(projectId);

  useEffect(() => {
    const fetchProposalsCount = async () => {
      if (!user || user.role !== 'client') return;
      try {
        const { data } = await apiClient.get(`/proposals/project/${projectId}`);
        setProposalsCount(Array.isArray(data) ? data.length : 0);
      } catch {
        setProposalsCount(null);
      }
    };

    fetchProposalsCount();
  }, [projectId, user]);

  if (isLoading) {
    return (
      <Container className="py-8">
        <Loading />
      </Container>
    );
  }

  if (error || !project) {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Alert variant="error">{error || 'Project not found'}</Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
        <Button
          variant="secondary"
          onClick={() => {
            // Clients manage their projects; freelancers browse public projects
            if (user?.role === 'client') {
              navigate('/projects/my-projects');
            } else {
              navigate('/projects');
            }
          }}
          className="mb-6"
        >
          ← Back to Projects
        </Button>

        <Card className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {project.title}
            </h1>
            <span className={`px-3 py-1 text-sm rounded ${
              project.status === 'open' ? 'bg-green-100 text-green-800' :
              project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {project.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Client</p>
              <p className="font-semibold text-gray-900">{project.client_name}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Budget</p>
              <p className="text-2xl font-bold text-blue-600">
                ${project.budget_min} - ${project.budget_max}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Posted</p>
              <p className="font-semibold text-gray-900">
                {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>

            {user?.role === 'client' && (
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Proposals</p>
                  <p className="font-semibold text-gray-900">{proposalsCount ?? project.proposals_count ?? 0}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/proposals/project/${project.id}`)}
                >
                  View proposals
                </Button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Project Description
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {project.description}
            </div>
          </div>

          {project.status === 'open' && user?.role === 'freelancer' && (
            <div className="pt-6 border-t border-gray-200 space-y-3">
              {project.has_submitted_proposal && (
                <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded px-3 py-2">
                  You already submitted a proposal for this project.
                </p>
              )}
              <Button
                size="lg"
                className="w-full"
                disabled={project.has_submitted_proposal}
                onClick={() => navigate(`/proposals/submit?project=${project.id}`)}
              >
                {project.has_submitted_proposal ? 'Proposal Submitted' : 'Submit Proposal'}
              </Button>
            </div>
          )}

          {project.status === 'open' && user?.role === 'client' && (
            <p className="pt-6 border-t border-gray-200 text-sm text-gray-600">
              Only freelancers can submit proposals. Track proposals count above.
            </p>
          )}
        </Card>

        <div className="space-y-6">
          <FileGallery key={refreshKey} entityType="project" entityId={projectId} />
          
          <FileUpload 
            entityType="project" 
            entityId={projectId}
            label="Upload Project Files"
            onUploaded={() => setRefreshKey(prev => prev + 1)}
          />
        </div>
      </Container>
  );
}
