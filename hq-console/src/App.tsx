import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Overview } from './pages/Overview';
import { RuleGraph } from './pages/RuleGraph';
import { ProductStudio } from './pages/ProductStudio';
import { Clinicians } from './pages/Clinicians';
import { Releases } from './pages/Releases';
import { Notices } from './pages/Notices';
import { Support } from './pages/Support';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-app)',
          color: 'var(--text-muted)',
          fontSize: '13px',
        }}
      >
        Initializing ClerQ HQ session...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="rules" element={<RuleGraph />} />
            <Route path="studio" element={<ProductStudio />} />
            <Route path="clinicians" element={<Clinicians />} />
            <Route path="releases" element={<Releases />} />
            <Route path="notices" element={<Notices />} />
            <Route path="support" element={<Support />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
