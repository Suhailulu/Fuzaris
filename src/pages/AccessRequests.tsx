import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Check, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function AccessRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('access_requests')
      .select('*')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setRequests(data);
    }
    setLoading(false);
  };

  const handleApprove = async (request: any) => {
    // Use a secure database function to bypass RLS restrictions for this admin action
    const { error } = await supabase.rpc('approve_access_request', {
      request_id: request.id,
      target_user_id: request.user_id,
      target_role: request.requested_role,
      reviewer_id: user?.id
    });

    if (error) {
      alert('Failed to approve: ' + error.message);
      return;
    }
      
    // Remove from local list
    setRequests(requests.filter(r => r.id !== request.id));
  };

  const handleReject = async (requestId: string) => {
    await supabase
      .from('access_requests')
      .update({ status: 'REJECTED', reviewed_by: user?.id, reviewed_at: new Date().toISOString() })
      .eq('id', requestId);
      
    setRequests(requests.filter(r => r.id !== requestId));
  };

  if (loading) {
    return <div style={{ padding: 'var(--space-2xl)' }}>Loading requests...</div>;
  }

  return (
    <div style={{ padding: 'var(--space-2xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-xl)' }}>
        <ShieldAlert size={28} color="var(--color-navy)" />
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-navy)' }}>
          Pending Access Requests
        </h1>
      </div>

      {requests.length === 0 ? (
        <div style={{ background: 'white', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          No pending access requests at this time.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {requests.map(req => (
            <div key={req.id} style={{ 
              background: 'white', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
            }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '4px' }}>
                  {req.full_name}
                </h3>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'flex', gap: '16px' }}>
                  <span><strong>Email:</strong> {req.email}</span>
                  <span><strong>Role:</strong> {req.requested_role}</span>
                  <span><strong>Org:</strong> {req.organization}</span>
                  {req.designation && <span><strong>Designation:</strong> {req.designation}</span>}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleReject(req.id)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', 
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--color-danger)', 
                    color: 'var(--color-danger)', background: 'transparent', cursor: 'pointer' 
                  }}
                >
                  <X size={16} /> Reject
                </button>
                <button 
                  onClick={() => handleApprove(req)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', 
                    borderRadius: 'var(--radius-md)', border: 'none', 
                    color: 'white', background: 'var(--color-success)', cursor: 'pointer' 
                  }}
                >
                  <Check size={16} /> Approve & Activate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
