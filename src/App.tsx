import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { UserRole } from './types';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';

// Protected route component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: UserRole;
}> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

// Route to correct dashboard based on role
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === UserRole.MANAGER ? (
    <ManagerDashboard />
  ) : (
    <EmployeeDashboard />
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>}
            />
            
            {/* This is just a stub for now, additional routes will be added */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;