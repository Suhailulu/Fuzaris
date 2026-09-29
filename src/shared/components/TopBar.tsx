import { useState } from 'react';
import { Search, Bell, ChevronDown, Settings, LogOut, Menu, AlertTriangle, ShieldAlert, PackageSearch } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export default function TopBar() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Critical Alert: Fire in Generator Room 2', time: '2 mins ago', type: 'EMERGENCY', read: false },
    { id: 2, title: 'Low Stock: Emergency Blankets (Aisle 4)', time: '1 hour ago', type: 'INVENTORY', read: false },
    { id: 3, title: 'Severe Weather Warning: Blizzard approaching Base Camp Alpha', time: '3 hours ago', type: 'WEATHER', read: true },
    { id: 4, title: 'Purchase Order #PO-2026-1042 Approved', time: '5 hours ago', type: 'INVENTORY', read: true },
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'EMERGENCY': return <ShieldAlert size={16} className="text-red-600" />;
      case 'INVENTORY': return <PackageSearch size={16} className="text-blue-600" />;
      case 'WEATHER': return <AlertTriangle size={16} className="text-amber-600" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button 
          className="mobile-menu-btn" 
          onClick={() => document.body.classList.toggle('mobile-sidebar-open')}
        >
          <Menu size={24} />
        </button>
        <div className="topbar-expedition-selector">
          <span className="topbar-expedition-dot"></span>
          <span className="hide-on-mobile">EXP-001 — Arctic Frontier Alpha</span>
          <span className="mobile-only" style={{ display: 'none' }}>EXP-001</span>
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="topbar-spacer" />

      <div className="topbar-search">
        <Search size={16} className="topbar-search-icon" />
        <input type="text" placeholder="Search expeditions, personnel, cargo…" />
      </div>

      <div className="topbar-actions" style={{ position: 'relative' }}>
        <button 
          className={`topbar-btn ${showNotifications ? 'active' : ''}`} 
          title="Notifications"
          onClick={() => setShowNotifications(!showNotifications)}
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="topbar-btn-badge" style={{
              position: 'absolute', top: '-4px', right: '-4px',
              backgroundColor: 'var(--color-danger)', color: 'white',
              fontSize: '10px', fontWeight: 'bold',
              minWidth: '16px', height: '16px',
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: '8px',
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
            width: '320px', zIndex: 1000, overflow: 'hidden'
          }}>
            <div style={{ padding: 'var(--space-md)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 600 }}>Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Mark all as read
                </button>
              )}
            </div>
            
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: 'var(--space-lg)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                  No notifications
                </div>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} style={{ 
                    padding: 'var(--space-sm) var(--space-md)', 
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: notif.read ? 'transparent' : 'rgba(59,130,246,0.05)',
                    display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    const newNotifs = [...notifications];
                    const idx = newNotifs.findIndex(n => n.id === notif.id);
                    if (idx > -1) newNotifs[idx].read = true;
                    setNotifications(newNotifs);
                  }}>
                    <div style={{ marginTop: '2px', padding: '6px', borderRadius: '50%', backgroundColor: 'var(--color-surface-alt)' }}>
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: notif.read ? 500 : 600, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                        {notif.title}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                        {notif.time}
                      </div>
                    </div>
                    {!notif.read && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', marginTop: '6px' }} />
                    )}
                  </div>
                ))
              )}
            </div>
            <div style={{ padding: 'var(--space-sm)', textAlign: 'center', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-alt)' }}>
              <a href="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', textDecoration: 'none' }}>View all notifications</a>
            </div>
          </div>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <div className="topbar-user" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="topbar-user-avatar">
            {user ? (user.name || user.full_name || 'U').split(' ').map((n: string) => n[0]).slice(0, 2).join('') : 'U'}
          </div>
          <span className="topbar-user-name">{user ? (user.name || user.full_name) : 'User'}</span>
          <ChevronDown size={14} style={{ color: 'var(--color-text-tertiary)' }} />
        </div>
        
        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            width: '200px',
            zIndex: 1000,
            padding: 'var(--space-sm)'
          }}>
            <div style={{ padding: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-sm)' }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{user?.title}</div>
            </div>
            
            <button 
              onClick={() => {
                setShowDropdown(false);
                logout();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: 'var(--space-sm)',
                border: 'none',
                background: 'transparent',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'left'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-alt)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <LogOut size={16} /> Switch Role / Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
