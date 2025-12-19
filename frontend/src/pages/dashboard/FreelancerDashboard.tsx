import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StatsCard, RevenueChart, ActiveOrdersList } from '@/widgets/dashboard';
import { apiClient } from '@/shared/api/client';
import type { Order } from '@/entities/order';
import type { Gig } from '@/entities/gig';
import type { UserStats } from '@/shared/types';
import { Button, Container, Grid } from '@/shared/ui';
import { useAuth } from '@/app/providers/AuthProvider';

export function FreelancerDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const [statsRes, ordersRes, gigsRes] = await Promise.all([
        apiClient.get('/users/stats'),
        apiClient.get('/orders/my-orders'),
        apiClient.get('/gigs/my-gigs'),
      ]);

      setStats(statsRes.data);
      setOrders(ordersRes.data.filter((o: Order) => o.status !== 'completed' && o.status !== 'cancelled'));
      setGigs(gigsRes.data);
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

  const revenueData = [
    { month: 'Jan', revenue: stats?.total_earned ? stats.total_earned * 0.1 : 0 },
    { month: 'Feb', revenue: stats?.total_earned ? stats.total_earned * 0.15 : 0 },
    { month: 'Mar', revenue: stats?.total_earned ? stats.total_earned * 0.2 : 0 },
    { month: 'Apr', revenue: stats?.total_earned ? stats.total_earned * 0.25 : 0 },
    { month: 'May', revenue: stats?.total_earned ? stats.total_earned * 0.3 : 0 },
  ];

  return (
    <Container className="py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Freelancer Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your gigs and orders</p>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Grid cols={4} gap={6} className="mb-8">
          <StatsCard
            title="Total Earnings"
            value={`$${stats?.total_earned || 0}`}
            icon="💰"
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard title="Active Orders" value={orders.length} icon="📦" />
          <StatsCard title="Completed Jobs" value={stats?.completed_jobs || 0} icon="✅" />
          <StatsCard title="Rating" value={`${stats?.rating || 0}/5`} icon="⭐" />
        </Grid>

        <Grid cols={3} gap={6} className="mb-8">
          <div className="lg:col-span-2 col-span-3">
            <RevenueChart data={revenueData} />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/gigs/create"
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create New Gig
                </Link>
                <Link
                  to="/projects"
                  className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Browse Projects
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

        <Grid cols={2} gap={6}>
          <ActiveOrdersList orders={orders} userRole="freelancer" />

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">My Gigs</h3>
              <Link to="/gigs/my-gigs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
            {gigs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No gigs yet</p>
            ) : (
              <div className="space-y-4">
                {gigs.slice(0, 3).map((gig) => (
                  <Link
                    key={gig.id}
                    to={`/gigs/${gig.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{gig.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{gig.category}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>${gig.price}</span>
                          <span>•</span>
                          <span>{gig.delivery_days} days</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          gig.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : gig.status === 'paused'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {gig.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Grid>
      </Container>
  );
}
