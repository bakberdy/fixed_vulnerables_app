import { Link } from 'react-router-dom';
import type { Project } from '@/entities/project';
import { Card } from '@/shared/ui';
import { ProjectImagePreview } from './ProjectImagePreview';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        <ProjectImagePreview 
          projectId={project.id} 
          className="aspect-video w-full bg-gray-100 object-cover"
        />
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {project.title}
            </h3>
            <span className={`px-2 py-1 text-xs rounded ${
              project.status === 'open' ? 'bg-green-100 text-green-800' :
              project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {project.status}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              by {project.client_name}
            </div>
            
            <div className="text-right">
              <span className="text-lg font-bold text-blue-600">
                ${project.budget_min} - ${project.budget_max}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
