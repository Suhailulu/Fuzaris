import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import type { Expedition } from '../lib/types';
import { Link } from 'react-router-dom';
import { Map, Plus, Search } from 'lucide-react';

export function Expeditions() {
  const { organization, user } = useAuth();
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    expedition_code: '', name: '', description: '', origin: '', destination: '',
    start_date: '', expected_arrival: '', transport_mode: 'SHIP' as any, priority: 'MEDIUM' as any, status: 'PLANNING' as any
  });
  const [error, setError] = useState('');
  
  useEffect(() => { const loadAsync = async () => {
    if (organization) {
      setExpeditions(await api.getExpeditions(organization.id));
    }
  }; loadAsync(); }, [organization]);

  const filtered = expeditions.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.expedition_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user || !organization) return;
    if (new Date(formData.expected_arrival) < new Date(formData.start_date)) {
      setError('Expected arrival cannot be before start date.');
      return;
    }
    try {
      await api.createExpedition(organization.id, user, formData as any);
      setShowCreate(false);
      setExpeditions(await api.getExpeditions(organization.id));
    } catch (err: any) {
      setError(err.message || 'Error creating expedition');
    }
  };

  if (showCreate) {
    return (
      <div className="card" style={{ maxWidth: '800px' }}>
        <h2 className="text-xl font-bold mb-6">Create Expedition</h2>
        {error && <div className="mb-4 text-sm" style={{ padding: '0.75rem', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-critical)' }}>{error}</div>}
        <form onSubmit={handleCreate}>
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group"><label className="form-label">Code</label><input required className="form-input" value={formData.expedition_code} onChange={e => setFormData({...formData, expedition_code: e.target.value.trim()})} placeholder="ANT-2026-001" /></div>
            <div className="form-group"><label className="form-label">Name</label><input required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Supply Expedition" /></div>
            <div className="form-group"><label className="form-label">Origin</label><input required className="form-input" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Destination</label><input required className="form-input" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Start Date</label><input required type="date" className="form-input" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Expected Arrival</label><input required type="date" className="form-input" value={formData.expected_arrival} onChange={e => setFormData({...formData, expected_arrival: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Priority</label><select className="form-input" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as any})}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select></div>
            <div className="form-group"><label className="form-label">Transport Mode</label><select className="form-input" value={formData.transport_mode} onChange={e => setFormData({...formData, transport_mode: e.target.value as any})}><option value="SHIP">Ship</option><option value="AIRCRAFT">Aircraft</option><option value="LAND">Land</option><option value="MIXED">Mixed</option></select></div>
          </div>
          <div className="form-group mt-2">
            <label className="form-label">Description</label>
            <textarea className="form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3}></textarea>
          </div>
          <div className="flex gap-4 mt-6 justify-end">
            <button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Expedition</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Expeditions</h1>
          <p className="text-muted">Plan, monitor and manage polar expedition missions.</p>
        </div>
        {user?.role !== 'VIEWER' && (
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={18} className="mr-2" /> Create Expedition
          </button>
        )}
      </div>

      <div className="card mb-6">
        <div className="flex gap-4">
          <div className="form-group flex-1 mb-0" style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search expeditions..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <select className="form-input" style={{ width: 'auto' }}>
            <option value="">All Statuses</option>
            <option value="PLANNING">Planning</option>
            <option value="PREPARATION">Preparation</option>
            <option value="DEPLOYED">Deployed</option>
            <option value="ON_STATION">On Station</option>
            <option value="DEMOBILIZING">Demobilizing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)' }}>
              <th style={{ padding: '1rem' }}>Expedition ID</th>
              <th style={{ padding: '1rem' }}>Mission</th>
              <th style={{ padding: '1rem' }}>Origin</th>
              <th style={{ padding: '1rem' }}>Destination</th>
              <th style={{ padding: '1rem' }}>Start Date</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center' }}>
                  <div className="empty-state">
                    <Map size={48} />
                    <h3 className="text-lg font-semibold mt-4">No expeditions found.</h3>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(exp => (
                <tr key={exp.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }} className="font-semibold">{exp.expedition_code}</td>
                  <td style={{ padding: '1rem' }}>{exp.name}</td>
                  <td style={{ padding: '1rem' }}>{exp.origin}</td>
                  <td style={{ padding: '1rem' }}>{exp.destination}</td>
                  <td style={{ padding: '1rem' }}>{exp.start_date}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      backgroundColor: exp.status === 'ON_STATION' || exp.status === 'DEPLOYED' ? 'rgba(16, 185, 129, 0.1)' : 
                                       exp.status === 'PREPARATION' || exp.status === 'DEMOBILIZING' ? 'rgba(59, 130, 246, 0.1)' :
                                       'rgba(100, 116, 139, 0.1)',
                      color: exp.status === 'ON_STATION' || exp.status === 'DEPLOYED' ? 'var(--color-success)' : 
                             exp.status === 'PREPARATION' || exp.status === 'DEMOBILIZING' ? 'var(--color-primary)' :
                             'var(--color-text-muted)'
                    }}>
                      {exp.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link to={`/expeditions/${exp.id}`} className="btn btn-outline text-sm py-1 px-3">View</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
