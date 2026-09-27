import { Menu, Bell, User as UserIcon } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user, organization, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="btn btn-outline" style={{ padding: '0.5rem' }}>
          <Menu size={20} />
        </button>
        <div className="font-semibold">{organization?.name}</div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="btn btn-outline" style={{ padding: '0.5rem', border: 'none' }} title="Notifications (Future)">
          <Bell size={20} className="text-muted" />
        </button>
        
        <div style={{ position: 'relative' }}>
          <button 
            className="flex items-center gap-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="kpi-icon-wrap" style={{ width: 36, height: 36, background: 'var(--color-bg-hover)' }}>
              <UserIcon size={18} />
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span className="text-sm font-semibold">{user?.full_name}</span>
              <span className="text-xs text-muted">{user?.role}</span>
            </div>
          </button>
          
          {menuOpen && (
            <div style={{ 
              position: 'absolute', 
              top: '100%', 
              right: 0, 
              marginTop: '0.5rem',
              background: 'white',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              minWidth: '200px',
              zIndex: 10
            }}>
              <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column' }}>
                <button 
                  className="btn" 
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                >
                  Profile
                </button>
                <button 
                  className="btn" 
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => { setMenuOpen(false); navigate('/settings'); }}
                >
                  Settings
                </button>
                <hr style={{ margin: '0.5rem 0', borderColor: 'var(--color-border)' }} />
                <button 
                  className="btn" 
                  style={{ justifyContent: 'flex-start', color: 'var(--color-critical)' }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
