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

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', active: true },
    { to: '/expeditions', icon: Map, label: 'Expeditions', active: true },
    { to: '/cargo', icon: Package, label: 'Cargo', active: true },
    { to: '/inventory', icon: Archive, label: 'Inventory', active: true },
    { to: '/assets', icon: Settings2, label: 'Assets', active: true },
    { to: '/personnel', icon: Users, label: 'Personnel', active: true },
    { to: '/operations-map', icon: Map, label: 'Operations Map', active: true },
    { to: '/alerts', icon: AlertTriangle, label: 'Alerts & Emergency', active: true },
    { to: '/reports', icon: BarChart2, label: 'Reports', active: true },
    { to: '/activity', icon: History, label: 'Activity Feed', active: true },
  ];

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
          if (item.active) {
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
          } else {
            return (
              <div key={item.to} className="nav-item nav-item-disabled" title={`${item.label} (Phase 6)`}>
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </div>
            );
          }
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
