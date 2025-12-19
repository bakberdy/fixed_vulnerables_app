import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StatsCard, ActiveOrdersList } from '@/widgets/dashboard'
import { ProjectImagePreview } from '@/features/projects'
import { apiClient } from '@/shared/api/client'
import type { Order } from '@/entities/order'
import type { Project } from '@/entities/project'
import { Button, Container, Grid } from '@/shared/ui'
import { useAuth } from '@/app/providers/AuthProvider'

interface ClientStats {
  total_spent: number;
  active_projects: number;
  hired_freelancers: number;
  completed_projects: number;
}

export function ClientDashboard() {
  const [stats, setStats] = useState<ClientStats>({
    total_spent: 0,
    active_projects: 0,
    hired_freelancers: 0,
    completed_projects: 0,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const [ordersRes, projectsRes] = await Promise.all([
        apiClient.get('/orders/my-orders'),
        apiClient.get('/projects/my-projects'),
      ]);
      
      const allOrders = ordersRes.data;
      const allProjects = projectsRes.data;
      
      setOrders(allOrders.filter((o: Order) => o.status !== 'completed' && o.status !== 'cancelled'));
      setProjects(allProjects);
      
      setStats({
        total_spent: allOrders.reduce((sum: number, o: Order) => sum + Number(o.amount), 0),
        active_projects: allProjects.filter((p: Project) => p.status === 'open' || p.status === 'in_progress').length,
        hired_freelancers: new Set(allOrders.map((o: Order) => o.seller_id)).size,
        completed_projects: allProjects.filter((p: Project) => p.status === 'completed').length,
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <Container className="py-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your projects and orders</p>
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Grid cols={4} gap={6} className="mb-8">
        <StatsCard
          title="Total Spent"
          value={`$${stats.total_spent.toFixed(2)}`}
          icon="💳"
        />
        <StatsCard
          title="Active Projects"
          value={stats.active_projects}
          icon="📋"
        />
        <StatsCard
          title="Hired Freelancers"
          value={stats.hired_freelancers}
          icon="👥"
        />
        <StatsCard
          title="Completed"
          value={stats.completed_projects}
          icon="✅"
        />
      </Grid>

      <Grid cols={3} gap={6} className="mb-8">
        <div className="lg:col-span-2 col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">My Projects</h3>
              <Link to="/projects/my-projects" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
            {projects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No projects yet</p>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 4).map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="block border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
                  >
                    <ProjectImagePreview 
                      projectId={project.id} 
                      className="aspect-video w-full bg-gray-100 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 flex-1">{project.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ml-4 ${
                          project.status === 'open' ? 'bg-green-100 text-green-800' :
                          project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Budget: ${project.budget_min} - ${project.budget_max}
                        </span>
                        <span className="text-gray-500">
                          {project.proposals_count || 0} proposals
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/projects/create"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Post New Project
              </Link>
              <Link
                to="/gigs"
                className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Browse Gigs
              </Link>
              <Link
                to="/messages"
                className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Messages
              </Link>
            </div>
          </div>
        </div>
      </Grid>

      <ActiveOrdersList orders={orders} userRole="client" />
    </Container>
  );
}
