import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import type { Cargo, CargoMovement, CargoStatusHistory, Expedition } from '../lib/types';
import { Package } from 'lucide-react';

export function CargoDetail() {
  const { id } = useParams<{ id: string }>();
  const { organization } = useAuth();
  
  const [cargo, setCargo] = useState<Cargo | null>(null);
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [movements, setMovements] = useState<CargoMovement[]>([]);
  const [history, setHistory] = useState<CargoStatusHistory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Cargo>>({});
  const { user } = useAuth();
  
  useEffect(() => { const loadAsync = async () => {
    if (organization && id) {
      const c = await api.getCargo(organization.id, id);
      if (c) {
        setCargo(c);
        if (c.expedition_id) {
          setExpedition(await api.getExpedition(organization.id, c.expedition_id) || null);
        }
        setMovements(await api.getCargoMovements(organization.id, id));
        setHistory(await api.getCargoStatusHistory(organization.id, id));
      }
    }
  }; loadAsync(); }, [organization, id]);

  if (!cargo) return <div className="p-8">Loading...</div>;

  const handleEditClick = () => {
    setEditForm({
      status: cargo.status,
      current_location: cargo.current_location,
      expected_arrival: cargo.expected_arrival
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!organization || !user) return;
    try {
      const updated = await api.updateCargo(organization.id, user, cargo.id, editForm);
      setCargo(updated);
      setHistory(await api.getCargoStatusHistory(organization.id, cargo.id));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update cargo');
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{cargo.cargo_code}</h1>
            <span className="badge" style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
              {cargo.status.replace('_', ' ')}
            </span>
            <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-critical)', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
              {cargo.priority}
            </span>
          </div>
          <p className="text-lg text-muted">{cargo.name}</p>
        </div>
        {user?.role !== 'VIEWER' && (
          <button className="btn btn-outline" onClick={handleEditClick} disabled={isEditing}>Edit Cargo</button>
        )}
      </div>

      {isEditing && (
        <div className="card mb-6 bg-surface-hover">
          <h3 className="font-bold mb-4">Quick Update</h3>
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value as any})}>
                <option value="PLANNED">Planned</option>
                <option value="PACKED">Packed</option>
                <option value="LOADED">Loaded</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="ARRIVED">Arrived</option>
                <option value="VERIFIED">Verified</option>
                <option value="DELAYED">Delayed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Current Location</label>
              <input className="form-input" value={editForm.current_location || ''} onChange={e => setEditForm({...editForm, current_location: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">ETA</label>
              <input type="date" className="form-input" value={editForm.expected_arrival ? editForm.expected_arrival.substring(0, 10) : ''} onChange={e => setEditForm({...editForm, expected_arrival: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button className="btn btn-outline btn-sm" onClick={() => setIsEditing(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="space-y-6 flex flex-col gap-6">
          <div className="card">
            <h2 className="card-title mb-4">Tracking Overview</h2>
            <div className="flex items-center justify-between mt-8 mb-4">
              <div className="text-center" style={{ flex: 1 }}>
                <div className="font-semibold">{cargo.origin}</div>
                <div className="text-xs text-muted">Origin</div>
              </div>
              <div style={{ flex: 2, height: '2px', background: 'var(--color-border)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-10px', left: cargo.status === 'ARRIVED' ? '100%' : cargo.status === 'IN_TRANSIT' ? '50%' : '0%', transform: 'translateX(-50%)', background: 'var(--color-bg-surface)', padding: '0 4px', transition: 'left 0.5s' }}>
                  <Package size={20} className="text-primary" />
                </div>
              </div>
              <div className="text-center" style={{ flex: 1 }}>
                <div className="font-semibold">{cargo.destination}</div>
                <div className="text-xs text-muted">Destination</div>
              </div>
            </div>
            <div className="text-center text-sm font-semibold mt-6 pt-4 border-t">
              Current Location: <span className="text-primary">{cargo.current_location}</span>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="card">
              <h3 className="font-semibold mb-4">Cargo Details</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted">Category</span>
                  <span className="font-semibold">{cargo.category}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted">Quantity</span>
                  <span className="font-semibold">{cargo.quantity} {cargo.unit}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted">Weight</span>
                  <span className="font-semibold">{cargo.weight} kg</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted">Volume</span>
                  <span className="font-semibold">{cargo.volume} m³</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="font-semibold mb-4">Schedule & Association</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted">ETA</span>
                  <span className="font-semibold">{new Date(cargo.expected_arrival).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col border-b pb-2 mt-2">
                  <span className="text-muted mb-1">Assigned Expedition</span>
                  {expedition ? (
                    <Link to={`/expeditions/${expedition.id}`} className="font-semibold" style={{ color: 'var(--color-secondary)' }}>
                      {expedition.expedition_code}
                    </Link>
                  ) : (
                    <span className="font-semibold text-muted">Unassigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 flex flex-col gap-6">
          <div className="card">
            <h3 className="font-semibold mb-4">Status History</h3>
            <div className="pl-4 border-l-2 border-gray-200 ml-2">
              {history.map(h => (
                <div key={h.id} className="relative mb-4">
                  <div style={{ position: 'absolute', left: '-21px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                  <div className="text-xs text-muted">{new Date(h.changed_at).toLocaleString()}</div>
                  <div className="text-sm font-semibold">{h.new_status.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Movement History</h3>
            <div className="pl-4 border-l-2 border-gray-200 ml-2">
              {movements.map(m => (
                <div key={m.id} className="relative mb-4">
                  <div style={{ position: 'absolute', left: '-21px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-secondary)' }} />
                  <div className="text-xs text-muted">{new Date(m.moved_at).toLocaleString()}</div>
                  <div className="text-sm">Moved to <span className="font-semibold">{m.to_location}</span></div>
                </div>
              ))}
              {movements.length === 0 && <div className="text-sm text-muted">No movements recorded yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
