import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Map, Package, Warehouse, Users, ShieldAlert,
  Compass, FileText, Activity
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'Expedition Manager', 'Logistics Officer', 'Inventory & Asset Officer', 'Personnel Officer', 'Emergency Response Officer'] },
  { to: '/expeditions', icon: Compass, label: 'Expeditions', roles: ['ADMIN', 'Expedition Manager'] },
  { to: '/cargo', icon: Package, label: 'Cargo & Logistics', roles: ['ADMIN', 'Expedition Manager', 'Logistics Officer'] },
  { to: '/inventory', icon: Warehouse, label: 'Inventory & Assets', roles: ['ADMIN', 'Expedition Manager', 'Inventory & Asset Officer'] },
  { to: '/personnel', icon: Users, label: 'Personnel', roles: ['ADMIN', 'Expedition Manager', 'Personnel Officer'] },
  { to: '/emergency', icon: ShieldAlert, label: 'Emergency Response', badge: 0, roles: ['ADMIN', 'Expedition Manager', 'Emergency Response Officer'] },
  { to: '/reports', icon: FileText, label: 'Reports & Analytics', roles: ['ADMIN', 'Expedition Manager', 'Logistics Officer'] },
  { to: '/activity', icon: Activity, label: 'Audit Trails', roles: ['ADMIN'] },
  { to: '/access-requests', icon: Users, label: 'Access Requests', roles: ['ADMIN', 'Expedition Manager'] },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div 
        className="sidebar-overlay" 
        onClick={() => document.body.classList.remove('mobile-sidebar-open')}
      />
      <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Map size={20} />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">Fuzaris</span>
          <span className="sidebar-brand-sub">Logistics & Asset Mgmt</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Operations</div>
        {navItems
          .filter(item => !user || item.roles.includes(user.role))
          .map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={`sidebar-link ${isActive(item.to) ? 'active' : ''}`}
            end={item.to === '/dashboard'}
            onClick={() => document.body.classList.remove('mobile-sidebar-open')}
          >
            <item.icon className="sidebar-link-icon" size={20} />
            <span>{item.label}</span>
            {item.badge && (
              <span className="sidebar-link-badge">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user ? (user.name || user.full_name || 'U').split(' ').map((n: string) => n[0]).slice(0, 2).join('') : 'U'}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user ? (user.name || user.full_name) : 'User'}</span>
            <span className="sidebar-user-role">{user ? (user.title || user.role) : 'Role'}</span>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
