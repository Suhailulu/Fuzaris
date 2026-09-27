import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import type { Asset } from '../lib/types';
import { Link } from 'react-router-dom';
import { Settings2, Plus, Search } from 'lucide-react';

export function Assets() {
  const { organization, user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  
  const [formData, setFormData] = useState({
    asset_code: '', name: '', description: '', asset_type: 'OTHER' as any, serial_number: '', model: '', manufacturer: '',
    location: '', condition: 'GOOD' as any, status: 'OPERATIONAL' as any, operating_hours: 0, acquisition_date: '', next_maintenance_date: ''
  });
  const [error, setError] = useState('');

  const loadData = async () => {
    if (organization) {
      setAssets(await api.getAssets(organization.id));
    }
  };

  useEffect(() => {
    loadData();
  }, [organization]);

  const filtered = assets.filter(a => 
    a.asset_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAssets = assets.length;
  const operational = assets.filter(a => a.status === 'OPERATIONAL').length;
  const maintenanceDue = assets.filter(a => a.status === 'MAINTENANCE_DUE').length;
  const underMaintenance = assets.filter(a => a.status === 'UNDER_MAINTENANCE').length;
  const damaged = assets.filter(a => a.status === 'DAMAGED').length;
  const retired = assets.filter(a => a.status === 'RETIRED').length;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user || !organization) return;
    
    try {
      await api.createAsset(organization.id, user, formData as any);
      setShowCreate(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Error creating asset');
    }
  };

  if (showCreate) {
    return (
      <div className="card" style={{ maxWidth: '800px' }}>
        <h2 className="text-xl font-bold mb-6">Register Asset</h2>
        {error && <div className="mb-4 text-sm" style={{ padding: '0.75rem', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-critical)' }}>{error}</div>}
        <form onSubmit={handleCreate}>
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group"><label className="form-label">Asset Code</label><input required className="form-input" value={formData.asset_code} onChange={e => setFormData({...formData, asset_code: e.target.value.trim()})} /></div>
            <div className="form-group"><label className="form-label">Name</label><input required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
            
            <div className="form-group"><label className="form-label">Type</label><select className="form-input" value={formData.asset_type} onChange={e => setFormData({...formData, asset_type: e.target.value as any})}><option value="VEHICLE">Vehicle</option><option value="SNOW_VEHICLE">Snow Vehicle</option><option value="GENERATOR">Generator</option><option value="COMMUNICATION_EQUIPMENT">Comm. Equipment</option><option value="OTHER">Other</option></select></div>
            <div className="form-group"><label className="form-label">Location</label><input required className="form-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
            
            <div className="form-group"><label className="form-label">Serial Number</label><input className="form-input" value={formData.serial_number} onChange={e => setFormData({...formData, serial_number: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Model</label><input className="form-input" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Manufacturer</label><input className="form-input" value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} /></div>
            
            <div className="form-group"><label className="form-label">Condition</label><select className="form-input" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value as any})}><option value="EXCELLENT">Excellent</option><option value="GOOD">Good</option><option value="FAIR">Fair</option><option value="POOR">Poor</option><option value="CRITICAL">Critical</option></select></div>
            <div className="form-group"><label className="form-label">Status</label><select className="form-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}><option value="OPERATIONAL">Operational</option><option value="MAINTENANCE_DUE">Maintenance Due</option><option value="UNDER_MAINTENANCE">Under Maintenance</option><option value="DAMAGED">Damaged</option></select></div>
            <div className="form-group"><label className="form-label">Operating Hours</label><input type="number" min="0" className="form-input" value={formData.operating_hours} onChange={e => setFormData({...formData, operating_hours: parseInt(e.target.value) || 0})} /></div>
            
            <div className="form-group"><label className="form-label">Acquisition Date</label><input type="date" className="form-input" value={formData.acquisition_date} onChange={e => setFormData({...formData, acquisition_date: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Next Maintenance</label><input type="date" className="form-input" value={formData.next_maintenance_date} onChange={e => setFormData({...formData, next_maintenance_date: e.target.value})} /></div>
          </div>
          <div className="form-group mt-2">
            <label className="form-label">Description</label>
            <textarea className="form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2}></textarea>
          </div>
          <div className="flex gap-4 mt-6 justify-end">
            <button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Register Asset</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Assets & Equipment</h1>
          <p className="text-muted">Manage reusable equipment, machinery, and track maintenance.</p>
        </div>
        {user?.role !== 'VIEWER' && (
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={18} className="mr-2" /> Register Asset
          </button>
        )}
      </div>

      <div className="kpi-grid mb-8">
        <div className="card kpi-card">
          <div className="text-sm text-muted font-semibold">TOTAL ASSETS</div>
          <div className="text-2xl font-bold">{totalAssets}</div>
        </div>
        <div className="card kpi-card">
          <div className="text-sm text-muted font-semibold" style={{ color: 'var(--color-success)' }}>OPERATIONAL</div>
          <div className="text-2xl font-bold">{operational}</div>
        </div>
        <div className="card kpi-card">
          <div className="text-sm text-muted font-semibold" style={{ color: 'var(--color-warning)' }}>MAINTENANCE DUE</div>
          <div className="text-2xl font-bold">{maintenanceDue}</div>
        </div>
        <div className="card kpi-card">
          <div className="text-sm text-muted font-semibold" style={{ color: 'var(--color-primary)' }}>UNDER MAINTENANCE</div>
          <div className="text-2xl font-bold">{underMaintenance}</div>
        </div>
        <div className="card kpi-card">
          <div className="text-sm text-muted font-semibold" style={{ color: 'var(--color-critical)' }}>DAMAGED</div>
          <div className="text-2xl font-bold">{damaged}</div>
        </div>
        <div className="card kpi-card">
          <div className="text-sm text-muted font-semibold">RETIRED</div>
          <div className="text-2xl font-bold">{retired}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="card-header" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search assets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <Settings2 size={48} />
            <h3 className="text-lg font-semibold mb-2">No assets registered.</h3>
            <p className="mb-4">No assets match your criteria.</p>
          </div>
        ) : (
          <div className="pb-4" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)' }}>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Asset</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Type</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Location</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Condition</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Link to={`/assets/${a.id}`} className="font-semibold text-primary">{a.asset_code}</Link>
                      <div className="text-sm text-muted">{a.name}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>{a.asset_type.replace(/_/g, ' ')}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{a.location}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className="text-sm font-semibold">{a.condition}</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className="badge" style={{ 
                        backgroundColor: a.status === 'OPERATIONAL' ? 'rgba(16, 185, 129, 0.1)' : a.status === 'MAINTENANCE_DUE' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(100, 116, 139, 0.1)', 
                        color: a.status === 'OPERATIONAL' ? 'var(--color-success)' : a.status === 'MAINTENANCE_DUE' ? 'var(--color-warning)' : 'var(--color-muted)',
                        padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 
                      }}>
                        {a.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
