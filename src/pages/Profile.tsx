import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Unable to save profile changes. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 className="text-2xl font-bold mb-8">User Profile</h1>
      
      {message.text && (
        <div className="mb-6 text-sm" style={{ 
          padding: '1rem', 
          backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
          color: message.type === 'success' ? 'var(--color-success)' : 'var(--color-critical)', 
          borderRadius: 'var(--radius-md)' 
        }}>
          {message.text}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.full_name} 
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                disabled={!isEditing}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="tel" 
                className="form-input" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <input 
                type="text" 
                className="form-input" 
                value={user.role} 
                disabled 
                style={{ backgroundColor: 'var(--color-bg-base)' }}
              />
              <span className="text-xs text-muted mt-1 inline-block">Role cannot be changed by the user.</span>
            </div>
          </div>

          <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--color-border)', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            {isEditing ? (
              <>
                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
              </>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
