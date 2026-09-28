import { useState } from 'react';
import { Search, Bell, ChevronDown, Settings, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export default function TopBar() {
  const unread: any[] = [];
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

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

      <div className="topbar-actions">
        <button className="topbar-btn" title="Notifications">
          <Bell size={18} />
          {unread.length > 0 && <span className="topbar-btn-badge" />}
        </button>
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
