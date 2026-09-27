import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import type { Personnel, PersonnelMovement, PersonnelMovementType, LocationRecord, Expedition } from '../lib/types';
import { MapPin } from 'lucide-react';

export function PersonnelDetail() {
  const { id } = useParams<{ id: string }>();
  const { organization, user } = useAuth();
  
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [movements, setMovements] = useState<PersonnelMovement[]>([]);
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  
  const [showMoveForm, setShowMoveForm] = useState(false);
  const [moveData, setMoveData] = useState({
    movement_type: 'STATION_TRANSFER' as PersonnelMovementType,
    to_location: '', notes: '', status: 'IN_TRANSIT' as any
  });
  const [error, setError] = useState('');

  const loadData = async () => {
    if (organization && id) {
      setPersonnel(await api.getPersonnelById(organization.id, id) || null);
      setMovements(await api.getPersonnelMovements(organization.id, id));
      setLocations(await api.getLocations(organization.id));
      setExpeditions(await api.getExpeditions(organization.id));
    }
  };

  useEffect(() => {
    loadData();
  }, [organization, id]);

  const handleMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user || !organization || !personnel || !id) return;
    
    try {
      await api.createPersonnelMovement(organization.id, user, id, {
        from_location: personnel.current_location,
        to_location: moveData.to_location,
        movement_type: moveData.movement_type,
        status: moveData.status,
        notes: moveData.notes,
        departure_time: moveData.status === 'IN_TRANSIT' ? new Date().toISOString() : undefined,
        arrival_time: moveData.status === 'COMPLETED' ? new Date().toISOString() : undefined,
      });
      setShowMoveForm(false);
      setMoveData({ movement_type: 'STATION_TRANSFER', to_location: '', notes: '', status: 'IN_TRANSIT' });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Error processing movement');
    }
  };

  const completeMovement = async (movementId: string) => {
    if (!user || !organization) return;
    try {
      await api.updatePersonnelMovementStatus(organization.id, user, movementId, 'COMPLETED');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Error updating status');
    }
  };

  if (!personnel) return <div className="p-8 text-center text-muted">Personnel not found.</div>;

  return (
    <div>
      <div className="mb-6">
        <Link to="/personnel" className="text-sm text-primary hover:underline flex items-center gap-1 mb-2">
          ← Back to Personnel
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{personnel.full_name}</h1>
            <p className="text-muted text-lg">{personnel.personnel_code} • {personnel.role}</p>
          </div>
          <span className="badge" style={{ 
            backgroundColor: personnel.status === 'AVAILABLE' ? 'rgba(16, 185, 129, 0.1)' : personnel.status === 'EMERGENCY' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
            color: personnel.status === 'AVAILABLE' ? 'var(--color-success)' : personnel.status === 'EMERGENCY' ? 'var(--color-critical)' : 'var(--color-primary)',
            padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 600 
          }}>
            {personnel.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="flex flex-col gap-6">
          <div className="card">
            <h2 className="card-title mb-4">Personnel Overview</h2>
            <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4">
              <div><div className="text-sm text-muted">Department</div><div className="font-medium">{personnel.department}</div></div>
              <div><div className="text-sm text-muted">Designation</div><div className="font-medium">{personnel.designation || 'N/A'}</div></div>
              <div><div className="text-sm text-muted">Current Location</div><div className="font-bold flex items-center gap-1 text-primary"><MapPin size={16}/> {personnel.current_location}</div></div>
              <div><div className="text-sm text-muted">Expedition</div><div className="font-medium">{personnel.expedition_id ? expeditions.find(e => e.id === personnel.expedition_id)?.expedition_code : 'None'}</div></div>
            </div>

            <h3 className="font-semibold mb-3">Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="text-sm text-muted">Phone</div><div className="font-medium">{personnel.phone || 'N/A'}</div></div>
              <div><div className="text-sm text-muted">Email</div><div className="font-medium">{personnel.email || 'N/A'}</div></div>
            </div>

            {(user?.role === 'ADMIN' || user?.role === 'EXPEDITION_MANAGER') && (
              <div className="mt-4 pt-4 border-t border-red-100">
                <h3 className="font-semibold text-red-700 mb-3">Emergency Contact (Authorized Only)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><div className="text-sm text-muted">Name</div><div className="font-medium">{personnel.emergency_contact_name || 'N/A'}</div></div>
                  <div><div className="text-sm text-muted">Phone</div><div className="font-medium">{personnel.emergency_contact_phone || 'N/A'}</div></div>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="card-title">Movement History</h2>
              {user?.role !== 'VIEWER' && (
                <button className="btn btn-primary btn-sm" onClick={() => setShowMoveForm(!showMoveForm)}>
                  Record Movement
                </button>
              )}
            </div>

            {showMoveForm && (
              <div className="mb-6 p-4 rounded bg-gray-50 border border-gray-200">
                <h3 className="font-semibold mb-4">New Movement</h3>
                {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
                <form onSubmit={handleMovement}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="form-group">
                      <label className="form-label">Destination</label>
                      <select required className="form-input" value={moveData.to_location} onChange={e => setMoveData({...moveData, to_location: e.target.value})}>
                        <option value="">-- Select Destination --</option>
                        {locations.filter(l => l.name !== personnel.current_location).map(l => (
                          <option key={l.id} value={l.name}>{l.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Movement Type</label>
                      <select required className="form-input" value={moveData.movement_type} onChange={e => setMoveData({...moveData, movement_type: e.target.value as any})}>
                        <option value="STATION_TRANSFER">Station Transfer</option>
                        <option value="FIELD_DEPLOYMENT">Field Deployment</option>
                        <option value="RETURN">Return</option>
                        <option value="TRANSIT">Transit</option>
                        <option value="EVACUATION">Evacuation</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select required className="form-input" value={moveData.status} onChange={e => setMoveData({...moveData, status: e.target.value as any})}>
                        <option value="IN_TRANSIT">In Transit</option>
                        <option value="COMPLETED">Completed (Arrived)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Notes</label>
                      <input className="form-input" value={moveData.notes} onChange={e => setMoveData({...moveData, notes: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" className="btn btn-outline" onClick={() => setShowMoveForm(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Process</button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {movements.length === 0 ? (
                <div className="text-sm text-muted">No movement history.</div>
              ) : (
                movements.map(m => (
                  <div key={m.id} className="py-3 border-b last:border-0 border-gray-100 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-2">
                        {m.from_location} → {m.to_location}
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: m.status === 'COMPLETED' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: m.status === 'COMPLETED' ? 'var(--color-success)' : 'var(--color-warning)'}}>
                          {m.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-muted mt-1">{m.movement_type.replace('_', ' ')}</div>
                      <div className="flex gap-4 mt-1 text-xs text-muted">
                        <span>{new Date(m.created_at).toLocaleDateString()}</span>
                        <span>Recorded by: {m.recorded_by}</span>
                      </div>
                    </div>
                    {m.status === 'IN_TRANSIT' && user?.role !== 'VIEWER' && (
                      <button onClick={() => completeMovement(m.id)} className="btn btn-primary btn-sm">Mark Arrived</button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card">
            <h2 className="card-title mb-4">Assignment Actions</h2>
            <p className="text-sm text-muted mb-4">Change deployment status or assign to a different expedition.</p>
            <button className="btn btn-outline w-full mb-2" disabled={user?.role === 'VIEWER'}>Change Status</button>
            <button className="btn btn-outline w-full" disabled={user?.role === 'VIEWER'}>Reassign Expedition</button>
          </div>
        </div>
      </div>
    </div>
  );
}
