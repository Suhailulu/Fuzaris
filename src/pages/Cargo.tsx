import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import type { Cargo } from '../lib/types';
import { Link } from 'react-router-dom';
import { Package, Plus, Search } from 'lucide-react';

export function CargoList() {
  const { organization, user } = useAuth();
  const [cargoList, setCargoList] = useState<Cargo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    cargo_code: '', name: '', description: '', category: 'GENERAL' as any, quantity: 1, unit: 'pcs',
    weight: 0, volume: 0, priority: 'MEDIUM' as any, origin: '', destination: '', current_location: '', expected_arrival: '', status: 'PLANNED' as any, expedition_id: ''
  });
  const [error, setError] = useState('');
  const [expeditions, setExpeditions] = useState<any[]>([]);

  
  useEffect(() => { const loadAsync = async () => {
    if (organization) {
      setCargoList(await api.getCargoList(organization.id));
      setExpeditions(await api.getExpeditions(organization.id));
    }
  }; loadAsync(); }, [organization]);

  const filtered = cargoList.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.cargo_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user || !organization) return;
    if (formData.quantity <= 0) return setError('Quantity must be greater than zero.');
    if (formData.weight < 0) return setError('Weight cannot be negative.');
    if (formData.volume < 0) return setError('Volume cannot be negative.');
    try {
      // Auto-generate sequential Cargo Code (CG-001, CG-002, etc.)
      const nums = cargoList
        .map(c => c.cargo_code ? parseInt(c.cargo_code.replace('CG-', '')) : 0)
        .filter(n => !isNaN(n));
      const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;
      const generatedCode = `CG-${String(nextNum).padStart(3, '0')}`;

      const finalData: any = { ...formData, cargo_code: generatedCode };
      if (!finalData.expedition_id) {
        delete finalData.expedition_id;
      }
      
      await api.createCargo(organization.id, user, finalData);
      setShowCreate(false);
      setCargoList(await api.getCargoList(organization.id));
      // Reset form
      setFormData({
        cargo_code: '', name: '', description: '', category: 'GENERAL' as any, quantity: 1, unit: 'pcs',
        weight: 0, volume: 0, priority: 'MEDIUM' as any, origin: '', destination: '', current_location: '', expected_arrival: '', status: 'PLANNED' as any, expedition_id: ''
      });
    } catch (err: any) {
      setError(err.message || 'Error creating cargo');
    }
  };

  if (showCreate) {
    return (
      <div className="card" style={{ maxWidth: '800px' }}>
        <h2 className="text-xl font-bold mb-6">Add Cargo</h2>
        {error && <div className="mb-4 text-sm" style={{ padding: '0.75rem', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-critical)' }}>{error}</div>}
        <form onSubmit={handleCreate}>
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group"><label className="form-label">Name</label><input required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Food Rations" /></div>
            <div className="form-group"><label className="form-label">Category</label><select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}><option value="FOOD">Food</option><option value="FUEL">Fuel</option><option value="MEDICAL">Medical</option><option value="SCIENTIFIC">Scientific</option><option value="MECHANICAL">Mechanical</option><option value="GENERAL">General</option></select></div>
            <div className="form-group"><label className="form-label">Expedition</label><select className="form-input" value={formData.expedition_id} onChange={e => setFormData({...formData, expedition_id: e.target.value})}><option value="">None</option>{expeditions.map(e => <option key={e.id} value={e.id}>{e.expedition_code} - {e.name}</option>)}</select></div>

            <div className="form-group"><label className="form-label">Quantity</label><input required type="number" min="1" className="form-input" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} /></div>
            <div className="form-group"><label className="form-label">Unit</label><input required className="form-input" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="boxes" /></div>
            <div className="form-group"><label className="form-label">Weight (kg)</label><input required type="number" min="0" step="0.1" className="form-input" value={formData.weight} onChange={e => setFormData({...formData, weight: parseFloat(e.target.value) || 0})} /></div>
            <div className="form-group"><label className="form-label">Volume (m³)</label><input required type="number" min="0" step="0.1" className="form-input" value={formData.volume} onChange={e => setFormData({...formData, volume: parseFloat(e.target.value) || 0})} /></div>

            <div className="form-group"><label className="form-label">Origin</label><input required className="form-input" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Destination</label><input required className="form-input" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Current Location</label><input required className="form-input" value={formData.current_location} onChange={e => setFormData({...formData, current_location: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Expected Arrival</label><input required type="date" className="form-input" value={formData.expected_arrival} onChange={e => setFormData({...formData, expected_arrival: e.target.value})} /></div>
            
            <div className="form-group"><label className="form-label">Priority</label><select className="form-input" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as any})}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select></div>
            <div className="form-group"><label className="form-label">Status</label><select className="form-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}><option value="PLANNED">Planned</option><option value="PACKED">Packed</option><option value="LOADED">Loaded</option><option value="IN_TRANSIT">In Transit</option><option value="ARRIVED">Arrived</option><option value="VERIFIED">Verified</option><option value="DELAYED">Delayed</option></select></div>
          </div>
          <div className="form-group mt-2">
            <label className="form-label">Description</label>
            <textarea className="form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3}></textarea>
          </div>
          <div className="flex gap-4 mt-6 justify-end">
            <button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Cargo</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Cargo</h1>
          <p className="text-muted">Track expedition cargo from preparation to delivery.</p>
        </div>
        {user?.role !== 'VIEWER' && (
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={18} className="mr-2" /> Add Cargo
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
              placeholder="Search cargo..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <select className="form-input" style={{ width: 'auto' }}>
            <option value="">All Categories</option>
            <option value="MEDICAL">Medical</option>
            <option value="FOOD">Food</option>
            <option value="FUEL">Fuel</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)' }}>
              <th style={{ padding: '1rem' }}>Cargo ID</th>
              <th style={{ padding: '1rem' }}>Cargo</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Quantity</th>
              <th style={{ padding: '1rem' }}>Weight</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center' }}>
                  <div className="empty-state">
                    <Package size={48} />
                    <h3 className="text-lg font-semibold mt-4">No cargo found.</h3>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }} className="font-semibold">{item.cargo_code}</td>
                  <td style={{ padding: '1rem' }}>{item.name}</td>
                  <td style={{ padding: '1rem' }}>{item.category}</td>
                  <td style={{ padding: '1rem' }}>{item.quantity} {item.unit}</td>
                  <td style={{ padding: '1rem' }}>{item.weight} kg</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      backgroundColor: item.status === 'IN_TRANSIT' ? 'rgba(0, 168, 232, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                      color: item.status === 'IN_TRANSIT' ? 'var(--color-secondary)' : 'var(--color-text-muted)'
                    }}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link to={`/cargo/${item.id}`} className="btn btn-outline text-sm py-1 px-3">View</Link>
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
