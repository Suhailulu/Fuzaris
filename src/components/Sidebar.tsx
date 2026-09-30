import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Package, 
  Archive, 
  Settings2, 
  Users, 
  AlertTriangle, 
  BarChart2,
  History,
  Settings
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../lib/AuthContext';

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const { user } = useAuth();
  const role = user?.role || '';
  const isAdmin = role === 'ADMIN';
  const isExpeditionManager = ['Expedition Manager', 'ADMIN'].includes(role);
  const isStationOfficer = ['Logistics Officer', 'Inventory & Asset Officer', 'ADMIN'].includes(role);
  const isPersonnelOfficer = ['Personnel Officer', 'ADMIN'].includes(role);
  const allNavItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', show: true },
    { to: '/expeditions', icon: Map, label: 'Expeditions', show: isExpeditionManager },
    { to: '/cargo', icon: Package, label: 'Cargo', show: isExpeditionManager },
    { to: '/inventory', icon: Archive, label: 'Inventory', show: isStationOfficer },
    { to: '/assets', icon: Settings2, label: 'Assets', show: isStationOfficer },
    { to: '/personnel', icon: Users, label: 'Personnel', show: isPersonnelOfficer || isExpeditionManager },
    { to: '/operations-map', icon: Map, label: 'Operations Map', show: isExpeditionManager },
    { to: '/alerts', icon: AlertTriangle, label: 'Alerts & Emergency', show: true },
    { to: '/reports', icon: BarChart2, label: 'Reports', show: true },
    { to: '/activity', icon: History, label: 'Activity Feed', show: true },
  ];

  const navItems = allNavItems.filter(item => item.show);

  return (
    <div className={clsx('sidebar', collapsed && 'sidebar-collapsed')}>
      <div className="sidebar-logo">
        <div className="kpi-icon-wrap" style={{ width: 32, height: 32, background: 'var(--color-secondary)' }}>
          <Map size={20} color="white" />
        </div>
        {!collapsed && <span>POLAR-IMS</span>}
      </div>
      
      <div className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.to} 
              to={item.to} 
              className={({ isActive }) => clsx('nav-item', isActive && 'active')}
              title={item.label}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </div>
      
      <div style={{ marginTop: 'auto', paddingBottom: '1rem' }}>
        <NavLink to="/settings" className={({ isActive }) => clsx('nav-item', isActive && 'active')} title="Settings">
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </div>
  );
}
