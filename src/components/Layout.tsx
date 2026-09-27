import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../lib/AuthContext';

export function Layout() {
  const { user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-xl font-semibold">Loading POLAR-IMS...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-container">
      <Sidebar collapsed={collapsed} />
      <div className="main-wrapper">
        <Header toggleSidebar={() => setCollapsed(!collapsed)} />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
