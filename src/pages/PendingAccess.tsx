import { useEffect } from 'react';
import { Clock, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

export default function PendingAccess() {
  const { logout, user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', user.id)
        .single();
        
      if (data && data.status === 'ACTIVE') {
        window.location.reload();
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [user]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <div style={{ 
        maxWidth: '480px', width: '100%', padding: 'var(--space-2xl)', 
        background: 'white', borderRadius: 'var(--radius-lg)', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
        textAlign: 'center'
      }}>
        <div style={{ 
          width: '64px', height: '64px', borderRadius: '50%', 
          background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto var(--space-lg)'
        }}>
          <Clock size={32} />
        </div>
        
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-navy)', marginBottom: '8px' }}>
          Access Request Pending
        </h2>
        
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
          Your registration has been submitted successfully. An Expedition Manager must approve your request before operational access is granted.
        </p>
        
        <div style={{ 
          background: 'var(--color-bg)', padding: 'var(--space-md)', 
          borderRadius: 'var(--radius-md)', textAlign: 'left',
          marginBottom: 'var(--space-xl)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Status:</span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#F59E0B' }}>Pending Approval</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Account:</span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-navy)' }}>{user?.email}</span>
          </div>
        </div>

        <button 
          onClick={logout}
          className="btn btn-secondary" 
          style={{ width: '100%', padding: '12px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <LogOut size={18} /> Sign out
        </button>
      </div>
    </div>
  );
}
