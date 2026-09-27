import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import type { Asset, AssetMaintenance, MaintenanceType, MaintenanceStatus } from '../lib/types';

export function AssetDetail() {
  const { id } = useParams<{ id: string }>();
  const { organization, user } = useAuth();
  
  const [asset, setAsset] = useState<Asset | null>(null);
  const [records, setRecords] = useState<AssetMaintenance[]>([]);
  const [showMaintForm, setShowMaintForm] = useState(false);
  const [maintData, setMaintData] = useState({ 
    maintenance_type: 'PREVENTIVE' as MaintenanceType, description: '', scheduled_date: '', status: 'SCHEDULED' as MaintenanceStatus 
  });
  const [error, setError] = useState('');

  const loadData = async () => {
    if (organization && id) {
      setAsset(await api.getAsset(organization.id, id) || null);
      setRecords(await api.getAssetMaintenanceRecords(organization.id, id));
    }
  };

  useEffect(() => {
    loadData();
  }, [organization, id]);

  const handleMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user || !organization || !asset || !id) return;
    
    try {
      await api.createMaintenanceRecord(organization.id, user, {
        ...maintData,
        asset_id: id,
        cost: 0,
        completed_date: maintData.status === 'COMPLETED' ? new Date().toISOString() : undefined
      });
      setShowMaintForm(false);
      setMaintData({ maintenance_type: 'PREVENTIVE', description: '', scheduled_date: '', status: 'SCHEDULED' });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Error processing maintenance');
    }
  };

  if (!asset) {
    return <div className="p-8 text-center text-muted">Asset not found.</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/assets" className="text-sm text-primary hover:underline flex items-center gap-1 mb-2">
          ← Back to Assets
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{asset.asset_code}</h1>
            <p className="text-muted text-lg">{asset.name}</p>
          </div>
          <span className="badge" style={{ 
            backgroundColor: asset.status === 'OPERATIONAL' ? 'rgba(16, 185, 129, 0.1)' : asset.status === 'MAINTENANCE_DUE' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(100, 116, 139, 0.1)', 
            color: asset.status === 'OPERATIONAL' ? 'var(--color-success)' : asset.status === 'MAINTENANCE_DUE' ? 'var(--color-warning)' : 'var(--color-muted)',
            padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 600 
          }}>
            {asset.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
        
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <div className="card">
            <h2 className="card-title mb-4">Specifications & Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted">Type</div>
                <div className="font-medium">{asset.asset_type.replace(/_/g, ' ')}</div>
              </div>
              <div>
                <div className="text-sm text-muted">Condition</div>
                <div className="font-medium">{asset.condition}</div>
              </div>
              <div>
                <div className="text-sm text-muted">Serial Number</div>
                <div className="font-medium">{asset.serial_number || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-muted">Model / Manufacturer</div>
                <div className="font-medium">{asset.model || 'N/A'} / {asset.manufacturer || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-muted">Location</div>
                <div className="font-medium">{asset.location}</div>
              </div>
              <div>
                <div className="text-sm text-muted">Assigned Expedition</div>
                <div className="font-medium">{asset.assigned_expedition_id || 'None'}</div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm">{asset.description || 'No description provided.'}</p>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="card-title">Maintenance History</h2>
              {user?.role !== 'VIEWER' && (
                <button className="btn btn-primary btn-sm" onClick={() => setShowMaintForm(!showMaintForm)}>
                  Schedule Maintenance
                </button>
              )}
            </div>

            {showMaintForm && (
              <div className="mb-6 p-4 rounded bg-gray-50 border border-gray-200">
                <h3 className="font-semibold mb-4">New Maintenance Record</h3>
                {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
                <form onSubmit={handleMaintenance}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="form-group">
                      <label className="form-label">Type</label>
                      <select className="form-input" value={maintData.maintenance_type} onChange={e => setMaintData({...maintData, maintenance_type: e.target.value as MaintenanceType})}>
                        <option value="PREVENTIVE">Preventive</option>
                        <option value="CORRECTIVE">Corrective</option>
                        <option value="INSPECTION">Inspection</option>
                        <option value="EMERGENCY">Emergency</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select className="form-input" value={maintData.status} onChange={e => setMaintData({...maintData, status: e.target.value as MaintenanceStatus})}>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                    <div className="form-group col-span-2">
                      <label className="form-label">Scheduled Date</label>
                      <input required type="date" className="form-input" value={maintData.scheduled_date} onChange={e => setMaintData({...maintData, scheduled_date: e.target.value})} />
                    </div>
                    <div className="form-group col-span-2">
                      <label className="form-label">Description</label>
                      <input required className="form-input" value={maintData.description} onChange={e => setMaintData({...maintData, description: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" className="btn btn-outline" onClick={() => setShowMaintForm(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Record</button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {records.length === 0 ? (
                <div className="text-sm text-muted">No maintenance records found.</div>
              ) : (
                records.map(r => (
                  <div key={r.id} className="py-3 border-b last:border-0 border-gray-100">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-semibold text-sm">{r.maintenance_type}</div>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: r.status === 'COMPLETED' ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.05)'}}>
                        {r.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm">{r.description}</div>
                    <div className="flex gap-4 mt-2 text-xs text-muted">
                      <span>Scheduled: {new Date(r.scheduled_date).toLocaleDateString()}</span>
                      {r.completed_date && <span>Completed: {new Date(r.completed_date).toLocaleDateString()}</span>}
                      <span>By: {r.performed_by}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <div className="card">
            <h2 className="card-title mb-4">Maintenance Schedule</h2>
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-xs text-muted mb-1">Last Maintenance</div>
                <div className="font-medium">{asset.last_maintenance_date ? new Date(asset.last_maintenance_date).toLocaleDateString() : 'Never'}</div>
              </div>
              <div>
                <div className="text-xs text-muted mb-1">Next Maintenance</div>
                <div className="font-medium" style={{ color: asset.status === 'MAINTENANCE_DUE' ? 'var(--color-warning)' : 'inherit' }}>
                  {asset.next_maintenance_date ? new Date(asset.next_maintenance_date).toLocaleDateString() : 'Not scheduled'}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted mb-1">Operating Hours</div>
                <div className="font-medium">{asset.operating_hours.toLocaleString()} hrs</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
