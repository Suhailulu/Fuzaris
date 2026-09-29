import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import type { InventoryItem } from '../lib/types';
import { Link } from 'react-router-dom';
import { Archive, Plus, Search, ScanBarcode, RotateCcw } from 'lucide-react';

export function Inventory() {
  const { organization, user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    item_code: '', name: '', description: '', category: 'GENERAL' as any, quantity: 0, unit: 'pcs',
    minimum_threshold: 0, critical_threshold: 0, storage_location: '', station: '', batch_number: '', expiry_date: ''
  });
  const [error, setError] = useState('');

  const loadData = async () => {
    if (organization) {
      setItems(await api.getInventoryItems(organization.id));
    }
  };

  useEffect(() => {
    loadData();
  }, [organization]);

  const filtered = items.filter(i => 
    i.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = items.length;
  const lowStock = items.filter(i => i.status === 'LOW').length;
  const criticalStock = items.filter(i => i.status === 'CRITICAL').length;
  const outOfStock = items.filter(i => i.status === 'OUT_OF_STOCK').length;
  const expiringSoon = items.filter(i => i.expiry_date && (new Date(i.expiry_date).getTime() - Date.now()) < 30 * 24 * 60 * 60 * 1000).length;
  const totalQuantity = items.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user || !organization) return;
    if (formData.quantity < 0) return setError('Quantity cannot be negative');
    if (formData.minimum_threshold < 0) return setError('Min threshold cannot be negative');
    if (formData.critical_threshold < 0) return setError('Critical threshold cannot be negative');
    if (formData.critical_threshold > formData.minimum_threshold) return setError('Critical threshold cannot exceed min threshold');
    
    try {
      await api.createInventoryItem(organization.id, user, formData as any);
      setShowCreate(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Error creating item');
    }
  };

  if (showCreate) {
    return (
      <div className="card" style={{ maxWidth: '800px' }}>
        <h2 className="text-xl font-bold mb-6">Add Inventory Item</h2>
        {error && <div className="mb-4 text-sm" style={{ padding: '0.75rem', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-critical)' }}>{error}</div>}
        <form onSubmit={handleCreate}>
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group"><label className="form-label">Item Code</label><input required className="form-input" value={formData.item_code} onChange={e => setFormData({...formData, item_code: e.target.value.trim()})} /></div>
            <div className="form-group"><label className="form-label">Name</label><input required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Category</label><select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}><option value="FOOD">Food</option><option value="FUEL">Fuel</option><option value="MEDICAL">Medical</option><option value="GENERAL">General</option></select></div>
            <div className="form-group"><label className="form-label">Initial Quantity</label><input required type="number" min="0" className="form-input" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} /></div>
            <div className="form-group"><label className="form-label">Unit</label><input required className="form-input" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Minimum Threshold</label><input required type="number" min="0" className="form-input" value={formData.minimum_threshold} onChange={e => setFormData({...formData, minimum_threshold: parseInt(e.target.value) || 0})} /></div>
            <div className="form-group"><label className="form-label">Critical Threshold</label><input required type="number" min="0" className="form-input" value={formData.critical_threshold} onChange={e => setFormData({...formData, critical_threshold: parseInt(e.target.value) || 0})} /></div>
            <div className="form-group"><label className="form-label">Storage Location</label><input required className="form-input" value={formData.storage_location} onChange={e => setFormData({...formData, storage_location: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Station</label><input required className="form-input" value={formData.station} onChange={e => setFormData({...formData, station: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Expiry Date</label><input type="date" className="form-input" value={formData.expiry_date} onChange={e => setFormData({...formData, expiry_date: e.target.value})} /></div>
          </div>
          <div className="flex gap-4 mt-6 justify-end">
            <button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Item</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Inventory</h1>
          <p className="text-muted">Manage operational supplies and track stock thresholds.</p>
        </div>
        {user?.role !== 'VIEWER' && (
          <div className="flex gap-2">
            <button className="btn btn-outline" onClick={() => alert('Barcode scanner activated (simulated)')}>
              <ScanBarcode size={18} className="mr-2" /> Scan Item
            </button>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={18} className="mr-2" /> Add Item
            </button>
          </div>
        )}
      </div>

      <div className="kpi-grid mb-8">
        <div className="card kpi-card">
          <div className="text-sm text-muted font-semibold">TOTAL ITEMS</div>
          <div className="text-2xl font-bold">{totalItems}</div>
        </div>
        <div className="card kpi-card">
          <div className="text-sm text-muted font-semibold">TOTAL QUANTITY</div>
          <div className="text-2xl font-bold">{totalQuantity.toLocaleString()}</div>
        </div>
        <div className="card kpi-card">
          <div className="text-sm text-muted font-semibold" style={{ color: 'var(--color-warning)' }}>LOW STOCK</div>
          <div className="text-2xl font-bold">{lowStock}</div>
        </div>
        <div className="card kpi-card">
          <div className="text-sm text-muted font-semibold" style={{ color: 'var(--color-critical)' }}>CRITICAL STOCK</div>
          <div className="text-2xl font-bold">{criticalStock}</div>
        </div>
        <div className="card kpi-card">
          <div className="text-sm text-muted font-semibold" style={{ color: 'var(--color-critical)' }}>OUT OF STOCK</div>
          <div className="text-2xl font-bold">{outOfStock}</div>
        </div>
        <div className="card kpi-card">
          <div className="text-sm text-muted font-semibold" style={{ color: 'var(--color-primary)' }}>EXPIRING SOON</div>
          <div className="text-2xl font-bold">{expiringSoon}</div>
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
              placeholder="Search inventory..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <Archive size={48} />
            <h3 className="text-lg font-semibold mb-2">No inventory items.</h3>
            <p className="mb-4">No items match your criteria.</p>
          </div>
        ) : (
          <div className="pb-4" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)' }}>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Item</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Quantity</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Location</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(i => (
                  <tr key={i.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Link to={`/inventory/${i.id}`} className="font-semibold text-primary">{i.item_code}</Link>
                      <div className="text-sm text-muted">{i.name}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>{i.category}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{i.quantity} <span className="text-sm font-normal text-muted">{i.unit}</span></td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div className="text-sm">{i.station}</div>
                      <div className="text-xs text-muted">{i.storage_location}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div className="flex items-center gap-2">
                        <span className="badge" style={{ 
                          backgroundColor: i.status === 'HEALTHY' ? 'rgba(16, 185, 129, 0.1)' : i.status === 'LOW' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                          color: i.status === 'HEALTHY' ? 'var(--color-success)' : i.status === 'LOW' ? 'var(--color-warning)' : 'var(--color-critical)',
                          padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 
                        }}>
                          {i.status.replace(/_/g, ' ')}
                        </span>
                        {(i.status === 'LOW' || i.status === 'CRITICAL' || i.status === 'OUT_OF_STOCK') && !i.reorder_requested && (
                          <button className="btn btn-outline py-1 px-2 text-xs" style={{ minHeight: 'auto' }} onClick={() => alert(`Auto-restock triggered for ${i.name}`)}>
                            <RotateCcw size={12} className="mr-1" /> Restock
                          </button>
                        )}
                        {i.reorder_requested && (
                          <span className="text-xs text-muted font-semibold">Restock pending</span>
                        )}
                      </div>
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
