import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './app/providers/AuthProvider';
import { ToastProvider } from './shared/ui/notification';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { HomePage } from './pages/home';
import { BrowseGigsPage, GigCreatePage, GigDetailPage, GigEditPage, MyGigsPage } from './pages/gigs';
import { BrowseProjectsPage, ProjectCreatePage, ProjectDetailPage, ProjectEditPage, MyProjectsPage } from './pages/projects';
import { FreelancerDashboard, ClientDashboard } from './pages/dashboard';
import { OrderCreatePage, OrderDetailPage, OrdersListPage } from './pages/orders';
import { SubmitProposalPage, ProposalListPage, MyProposalsPage } from './pages/proposals';
import { MessagesPage } from './pages/messages';
import { ReviewCreatePage } from './pages/reviews';
import { Loading } from './shared/ui';
import { ProtectedLayout } from './app/layouts/ProtectedLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function ProtectedOutlet() {
  return (
    <ProtectedRoute>
      <ProtectedLayout />
    </ProtectedRoute>
  );
}

function RoleRoute({ roles, children }: { roles: Array<'freelancer' | 'client'>; children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (user && roles.includes(user.role as 'freelancer' | 'client')) {
    return <>{children}</>;
  }

  const redirectPath = user?.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client';
  return <Navigate to={redirectPath} replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    const redirectPath = user?.role === 'freelancer'
      ? '/dashboard/freelancer'
      : '/dashboard/client';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider position="top-right">
          <Routes>
            <Route element={<ProtectedOutlet />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/gigs" element={<BrowseGigsPage />} />
              <Route
                path="/gigs/create"
                element={(
                  <RoleRoute roles={['freelancer']}>
                    <GigCreatePage />
                  </RoleRoute>
                )}
              />
              <Route path="/gigs/:id" element={<GigDetailPage />} />
              <Route
                path="/gigs/:id/edit"
                element={(
                  <RoleRoute roles={['freelancer']}>
                    <GigEditPage />
                  </RoleRoute>
                )}
              />
              <Route
                path="/gigs/my-gigs"
                element={(
                  <RoleRoute roles={['freelancer']}>
                    <MyGigsPage />
                  </RoleRoute>
                )}
              />
              <Route path="/projects" element={<BrowseProjectsPage />} />
              <Route
                path="/projects/create"
                element={(
                  <RoleRoute roles={['client']}>
                    <ProjectCreatePage />
                  </RoleRoute>
                )}
              />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route
                path="/projects/:id/edit"
                element={(
                  <RoleRoute roles={['client']}>
                    <ProjectEditPage />
                  </RoleRoute>
                )}
              />
              <Route
                path="/projects/my-projects"
                element={(
                  <RoleRoute roles={['client']}>
                    <MyProjectsPage />
                  </RoleRoute>
                )}
              />
              <Route
                path="/dashboard/freelancer"
                element={(
                  <RoleRoute roles={['freelancer']}>
                    <FreelancerDashboard />
                  </RoleRoute>
                )}
              />
              <Route
                path="/dashboard/client"
                element={(
                  <RoleRoute roles={['client']}>
                    <ClientDashboard />
                  </RoleRoute>
                )}
              />
              <Route
                path="/orders/create"
                element={(
                  <RoleRoute roles={['client']}>
                    <OrderCreatePage />
                  </RoleRoute>
                )}
              />
              <Route path="/orders/my-orders" element={<OrdersListPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route
                path="/proposals/submit"
                element={(
                  <RoleRoute roles={['freelancer']}>
                    <SubmitProposalPage />
                  </RoleRoute>
                )}
              />
              <Route
                path="/proposals/project/:projectId"
                element={(
                  <RoleRoute roles={['client']}>
                    <ProposalListPage />
                  </RoleRoute>
                )}
              />
              <Route
                path="/proposals/mine"
                element={(
                  <RoleRoute roles={['freelancer']}>
                    <MyProposalsPage />
                  </RoleRoute>
                )}
              />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/reviews/create" element={<ReviewCreatePage />} />
            </Route>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
