import { useState } from 'react';
import type { ProjectFilters } from '@/entities/project';
import { ProjectCard, useSearchProjects } from '@/features/projects';
import { Loading, Alert, Input, Button, Container } from '@/shared/ui';

export function BrowseProjectsPage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<ProjectFilters>({ status: 'open' });
  const { projects, isLoading, error } = useSearchProjects(filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, query: query || undefined });
  };

  return (
    <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Projects
          </h1>
          <p className="text-gray-600">
            Find projects to work on as a freelancer
          </p>
        </div>

        <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Search projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              Search
            </Button>
          </div>
        </form>

        {isLoading && <Loading />}
        
        {error && (
          <Alert variant="error">{error}</Alert>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No projects found</p>
              </div>
            )}
          </div>
        )}
      </Container>
  );
}
