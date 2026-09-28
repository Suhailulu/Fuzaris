import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import type { Expedition, Cargo, ExpeditionStatusHistory, Asset, InventoryItem, Personnel, Alert } from '../lib/types';
import { Package, Settings2, Users, Box, AlertTriangle } from 'lucide-react';

export function ExpeditionDetail() {
  const { id } = useParams<{ id: string }>();
  const { organization } = useAuth();
  
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [cargoList, setCargoList] = useState<Cargo[]>([]);
  const [history, setHistory] = useState<ExpeditionStatusHistory[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  useEffect(() => { const loadAsync = async () => {
    if (organization && id) {
      const exp = await api.getExpedition(organization.id, id);
      if (exp) {
        setExpedition(exp);
        setCargoList((await api.getCargoList(organization.id)).filter(c => c.expedition_id === id));
        setHistory(await api.getExpeditionHistory(organization.id, id));
        setAssets((await api.getAssets(organization.id)).filter(a => a.assigned_expedition_id === id));
        setInventory((await api.getInventoryItems(organization.id)).filter(i => i.assigned_expedition_id === id));
        setPersonnel((await api.getPersonnel(organization.id)).filter(p => p.expedition_id === id));
        setAlerts((await api.getAlerts(organization.id)).filter(a => a.expedition_id === id));
      }
    }
  }; loadAsync(); }, [organization, id]);

  if (!expedition) return <div className="p-8">Loading...</div>;

  const totalCargoWeight = cargoList.reduce((sum, c) => sum + c.weight, 0);
  const cargoInTransit = cargoList.filter(c => c.status === 'IN_TRANSIT').length;
  const delayedCargo = cargoList.filter(c => c.status === 'DELAYED').length;
  const openAlerts = alerts.filter(a => a.status === 'OPEN' || a.status === 'ACKNOWLEDGED' || a.status === 'IN_PROGRESS');

  const handleStatusChange = async (newStatus: string) => {
    if (!organization || !user || !expedition) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await api.updateExpedition(organization.id, user, expedition.id, { status: newStatus as any });
      setExpedition(updated);
      setHistory(await api.getExpeditionHistory(organization.id, expedition.id));
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{expedition.expedition_code}</h1>
            <span className="badge" style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
              {expedition.status}
            </span>
            <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
              {expedition.priority}
            </span>
          </div>
          <p className="text-lg text-muted">{expedition.name}</p>
        </div>
        
        {user?.role === 'Expedition Manager' || user?.role === 'ADMIN' ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-muted">Update Phase:</span>
            <select 
              className="form-input py-1.5 h-auto text-sm" 
              value={expedition.status}
              onChange={e => handleStatusChange(e.target.value)}
              disabled={isUpdatingStatus}
              style={{ minWidth: '160px' }}
            >
              <option value="PLANNING">Planning</option>
              <option value="PREPARATION">Preparation</option>
              <option value="DEPLOYED">Deployed</option>
              <option value="ON_STATION">On Station</option>
              <option value="DEMOBILIZING">Demobilizing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        ) : (
          <button className="btn btn-outline">Edit Expedition</button>
        )}
      </div>

      <div className="flex gap-4 mb-6" style={{ borderBottom: '1px solid var(--color-border)', overflowX: 'auto' }}>
        {['Overview', 'Cargo', 'Inventory', 'Assets', 'Personnel', 'Timeline', 'Alerts & Risk'].map(tab => (
          <button 
            key={tab}
            className="pb-2 font-semibold whitespace-nowrap"
            style={{ 
              color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
              marginBottom: '-1px'
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab === 'Alerts & Risk' && openAlerts.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 rounded-full px-2 py-0.5 text-xs">{openAlerts.length}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="grid gap-6">
          <div className="kpi-grid">
            <div className="card text-center">
              <Package className="mx-auto mb-2 text-secondary" size={24} />
              <div className="text-sm text-muted font-semibold">Cargo Items</div>
              <div className="text-2xl font-bold">{cargoList.length}</div>
            </div>
            <div className="card text-center">
              <Box className="mx-auto mb-2 text-primary" size={24} />
              <div className="text-sm text-muted font-semibold">Inventory Associated</div>
              <div className="text-2xl font-bold">{inventory.length}</div>
            </div>
            <div className="card text-center">
              <Settings2 className="mx-auto mb-2 text-accent" size={24} />
              <div className="text-sm text-muted font-semibold">Assigned Assets</div>
              <div className="text-2xl font-bold">{assets.length}</div>
            </div>
            <div className="card text-center">
              <Users className="mx-auto mb-2 text-primary" size={24} />
              <div className="text-sm text-muted font-semibold">Assigned Personnel</div>
              <div className="text-2xl font-bold">{personnel.length}</div>
            </div>
            <div className="card text-center">
              <AlertTriangle className="mx-auto mb-2 text-red-500" size={24} />
              <div className="text-sm text-muted font-semibold">Open Alerts</div>
              <div className="text-2xl font-bold text-red-600">{openAlerts.length}</div>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div className="card">
              <h2 className="card-title mb-4">Route & Schedule</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-muted">Origin</div>
                  <div className="font-semibold">{expedition.origin}</div>
                </div>
                <div>
                  <div className="text-sm text-muted">Destination</div>
                  <div className="font-semibold">{expedition.destination}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted">Planned Start</div>
                  <div className="font-semibold">{new Date(expedition.start_date).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted">Expected Arrival</div>
                  <div className="font-semibold">{new Date(expedition.expected_arrival).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="card bg-gray-50 border border-gray-200">
              <h2 className="card-title mb-4 text-sm uppercase">Quick Stats</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>Cargo Weight</span> <strong>{totalCargoWeight} kg</strong></li>
                <li className="flex justify-between"><span>Cargo In Transit</span> <strong>{cargoInTransit}</strong></li>
                <li className="flex justify-between"><span>Delayed Cargo</span> <strong className="text-warning">{delayedCargo}</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Cargo' && (
        <div className="card p-0 overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)' }}>
                <th style={{ padding: '1rem' }}>Code</th>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Weight</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {cargoList.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}><Link to={`/cargo/${c.id}`} className="font-semibold" style={{ color: 'var(--color-secondary)' }}>{c.cargo_code}</Link></td>
                  <td style={{ padding: '1rem' }}>{c.name}</td>
                  <td style={{ padding: '1rem' }}>{c.category}</td>
                  <td style={{ padding: '1rem' }}>{c.weight} kg</td>
                  <td style={{ padding: '1rem' }}><span className="font-semibold text-sm">{c.status}</span></td>
                </tr>
              ))}
              {cargoList.length === 0 && (
                <tr><td colSpan={5} className="text-center p-8 text-muted">No cargo assigned.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Inventory' && (
        <div className="card p-0 overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)' }}>
                <th style={{ padding: '1rem' }}>Item</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Qty</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(inv => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <Link to={`/inventory/${inv.id}`} className="font-semibold text-primary">{inv.name}</Link>
                    <div className="text-xs text-muted">{inv.item_code}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{inv.category}</td>
                  <td style={{ padding: '1rem' }}>{inv.quantity} {inv.unit}</td>
                  <td style={{ padding: '1rem' }}><span className="font-semibold text-sm">{inv.status}</span></td>
                </tr>
              ))}
              {inventory.length === 0 && (
                <tr><td colSpan={4} className="text-center p-8 text-muted">No inventory assigned.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Assets' && (
        <div className="card p-0 overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)' }}>
                <th style={{ padding: '1rem' }}>Asset</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Condition</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <Link to={`/assets/${a.id}`} className="font-semibold text-primary">{a.name}</Link>
                    <div className="text-xs text-muted">{a.asset_code}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{a.asset_type.replace('_', ' ')}</td>
                  <td style={{ padding: '1rem' }}>{a.condition}</td>
                  <td style={{ padding: '1rem' }}><span className="font-semibold text-sm">{a.status.replace('_', ' ')}</span></td>
                </tr>
              ))}
              {assets.length === 0 && (
                <tr><td colSpan={4} className="text-center p-8 text-muted">No assets assigned.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Personnel' && (
        <div className="card p-0 overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem' }}>Location</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {personnel.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <Link to={`/personnel/${p.id}`} className="font-semibold text-primary">{p.full_name}</Link>
                    <div className="text-xs text-muted">{p.personnel_code}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{p.role}</td>
                  <td style={{ padding: '1rem' }}>{p.current_location}</td>
                  <td style={{ padding: '1rem' }}><span className="font-semibold text-sm">{p.status.replace('_', ' ')}</span></td>
                </tr>
              ))}
              {personnel.length === 0 && (
                <tr><td colSpan={4} className="text-center p-8 text-muted">No personnel assigned.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Alerts & Risk' && (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {alerts.map(a => (
            <div key={a.id} className="card border-l-4" style={{ borderLeftColor: a.severity === 'CRITICAL' ? 'var(--color-critical)' : (a.severity === 'HIGH' ? '#ea580c' : 'var(--color-warning)'), padding: '1rem 1.5rem' }}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm uppercase" style={{ color: a.severity === 'CRITICAL' ? 'var(--color-critical)' : 'inherit' }}>{a.severity}</h3>
                <div className="text-xs font-bold px-2 py-1 bg-red-100 text-red-800 rounded">Risk: {a.risk_score}</div>
              </div>
              <div className="font-semibold mb-1">{a.title}</div>
              <div className="text-xs text-muted mb-3">{a.status.replace('_', ' ')}</div>
              <Link to={`/alerts/${a.id}`} className="btn btn-outline btn-sm w-full">View Alert</Link>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="col-span-full p-8 text-center text-muted">No operational alerts for this expedition.</div>
          )}
        </div>
      )}

      {activeTab === 'Timeline' && (
        <div className="card">
          <h2 className="card-title mb-6">Status History</h2>
          <div className="pl-4 border-l-2 border-gray-200 ml-4 space-y-6">
            {history.map((h) => (
              <div key={h.id} className="relative" style={{ marginBottom: '1.5rem' }}>
                <div style={{ position: 'absolute', left: '-21px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                <div className="text-sm text-muted">{new Date(h.changed_at).toLocaleString()}</div>
                <div className="font-semibold">{h.previous_status === 'NONE' ? 'Created' : `Changed from ${h.previous_status} to ${h.new_status}`}</div>
                {h.notes && <div className="text-sm mt-1">{h.notes}</div>}
              </div>
            ))}
            {history.length === 0 && <div className="text-sm text-muted">No timeline events found.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
