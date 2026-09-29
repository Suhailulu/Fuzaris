import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './shared/components/Sidebar';
import TopBar from './shared/components/TopBar';
import ExpeditionModule from './modules/expedition/ExpeditionModule';
import CargoModule from './modules/cargo/CargoModule';
import InventoryModule from './modules/inventory/InventoryModule';
import PersonnelModule from './modules/personnel/PersonnelModule';
import EmergencyModule from './modules/emergency/EmergencyModule';
import { Dashboard } from './pages/Dashboard';
import { AuthProvider, useAuth } from './lib/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PendingAccess from './pages/PendingAccess';
import AccessRequests from './pages/AccessRequests';
import { Reports } from './pages/Reports';
import { ActivityFeed } from './pages/Activity';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (user.status === 'PENDING') {
    return <PendingAccess />;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <TopBar />
        <div className="content-full">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expeditions/*" element={<ExpeditionModule />} />
            <Route path="/cargo/*" element={<CargoModule />} />
            <Route path="/inventory/*" element={<InventoryModule />} />
            <Route path="/personnel/*" element={<PersonnelModule />} />
            <Route path="/emergency/*" element={<EmergencyModule />} />
            <Route path="/access-requests" element={<AccessRequests />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/activity" element={<ActivityFeed />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
