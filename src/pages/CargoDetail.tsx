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
        <button className="btn btn-outline">Edit Cargo</button>
      </div>

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
