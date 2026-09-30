import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import type { Personnel, Expedition, LocationRecord } from '../lib/types';
import { Link } from 'react-router-dom';
import { Users, Plus, Search } from 'lucide-react';

export function PersonnelList() {
  const { organization, user } = useAuth();
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreate, setShowCreate] = useState(false);
  
  const [formData, setFormData] = useState({
    personnel_code: '', full_name: '', role: 'Scientist', department: 'Science', designation: '',
    expedition_id: '', current_location: '', status: 'AVAILABLE' as any,
    phone: '', email: '', emergency_contact_name: '', emergency_contact_phone: ''
  });
  const [error, setError] = useState('');

  const loadData = async () => {
    if (organization) {
      setPersonnel(await api.getPersonnel(organization.id));
      setExpeditions(await api.getExpeditions(organization.id));
      setLocations(await api.getLocations(organization.id));
    }
  };

  useEffect(() => {
    loadData();
  }, [organization]);

  const filtered = personnel.filter(p => {
    const matchesSearch = p.personnel_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user || !organization) return;
    const finalData = { ...formData };
    if (!finalData.personnel_code) {
      finalData.personnel_code = `PER-${Math.floor(Math.random() * 90000 + 10000)}`;
    }
    
    try {
      await api.createPersonnel(organization.id, user, finalData as any);
      setShowCreate(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Error creating personnel');
    }
  };

  if (showCreate) {
    return (
      <div className="card" style={{ maxWidth: '800px' }}>
        <h2 className="text-xl font-bold mb-6">Add Personnel</h2>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
        <form onSubmit={handleCreate}>
          <div className="grid gap-6">
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-4 text-primary">Identity</h3>
              <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group"><label className="form-label">Full Name</label><input required className="form-input" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Role</label><input required className="form-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Department</label><input required className="form-input" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Designation</label><input className="form-input" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} /></div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold mb-4 text-primary">Assignment</h3>
              <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select required className="form-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                    <option value="AVAILABLE">Available</option>
                    <option value="DEPLOYED">Deployed</option>
                    <option value="ON_STATION">On Station</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="ON_LEAVE">On Leave</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Current Location</label>
                  <select required className="form-input" value={formData.current_location} onChange={e => setFormData({...formData, current_location: e.target.value})}>
                    <option value="">-- Select Location --</option>
                    {locations.map(l => (
                      <option key={l.id} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">Expedition (Optional)</label>
                  <select className="form-input" value={formData.expedition_id} onChange={e => setFormData({...formData, expedition_id: e.target.value})}>
                    <option value="">-- None --</option>
                    {expeditions.map(exp => (
                      <option key={exp.id} value={exp.id}>{exp.expedition_code} - {exp.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-primary">Contact</h3>
              <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group"><label className="form-label">Phone</label><input type="tel" className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Emergency Contact Name</label><input className="form-input" value={formData.emergency_contact_name} onChange={e => setFormData({...formData, emergency_contact_name: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Emergency Contact Phone</label><input type="tel" className="form-input" value={formData.emergency_contact_phone} onChange={e => setFormData({...formData, emergency_contact_phone: e.target.value})} /></div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-6 justify-end">
            <button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Personnel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Personnel</h1>
          <p className="text-muted">Monitor expedition personnel, assignments and movements.</p>
        </div>
        {user?.role !== 'VIEWER' && (
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={18} className="mr-2" /> Add Personnel
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="card-header flex justify-between items-center" style={{ padding: '1.5rem' }}>
          <div className="flex gap-4 items-center">
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search personnel..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="form-input w-48" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="DEPLOYED">Deployed</option>
              <option value="ON_STATION">On Station</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="EMERGENCY">Emergency</option>
            </select>
          </div>
          <div className="text-sm text-muted">Total: {filtered.length} personnel</div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3 className="text-lg font-semibold mb-2">No personnel found.</h3>
            <p className="mb-4">No personnel match your criteria.</p>
          </div>
        ) : (
          <div className="pb-4" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)' }}>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Personnel</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Location</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Expedition</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Link to={`/personnel/${p.id}`} className="font-semibold text-primary">{p.full_name}</Link>
                      <div className="text-xs text-muted">{p.personnel_code}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div className="text-sm">{p.role}</div>
                      <div className="text-xs text-muted">{p.department}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{p.current_location}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div className="text-sm">{p.expedition_id ? expeditions.find(e => e.id === p.expedition_id)?.expedition_code : 'None'}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className="badge" style={{ 
                        backgroundColor: p.status === 'AVAILABLE' ? 'rgba(16, 185, 129, 0.1)' : p.status === 'EMERGENCY' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
                        color: p.status === 'AVAILABLE' ? 'var(--color-success)' : p.status === 'EMERGENCY' ? 'var(--color-critical)' : 'var(--color-primary)',
                        padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 
                      }}>
                        {p.status.replace(/_/g, ' ')}
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
