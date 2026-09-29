import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import type { Alert, AlertSeverity, EmergencyEvent } from '../lib/types';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldAlert, Activity, Search } from 'lucide-react';

export function Alerts() {
  const { organization, user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [emergencies, setEmergencies] = useState<EmergencyEvent[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('OPEN');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportData, setReportData] = useState({
    title: '', description: '', alert_type: 'SYSTEM' as any, severity: 'HIGH' as any
  });
  const [reportError, setReportError] = useState('');
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyEvent | null>(null);
  
  const loadData = async () => {
    if (organization) {
      setAlerts(await api.getAlerts(organization.id));
      setEmergencies(await api.getEmergencyEvents(organization.id));
    }
  };

  useEffect(() => {
    loadData();
  }, [organization]);

  const handleReportEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization || !user) return;
    try {
      await api.createAlert(organization.id, user, {
        alert_code: `ALT-MAN-${Math.floor(Math.random() * 1000)}`,
        title: reportData.title,
        description: reportData.description,
        alert_type: reportData.alert_type,
        severity: reportData.severity,
        status: 'OPEN',
        risk_score: reportData.severity === 'CRITICAL' ? 95 : 75,
      });
      setShowReportForm(false);
      setReportData({ title: '', description: '', alert_type: 'SYSTEM', severity: 'HIGH' });
      loadData();
    } catch (err: any) {
      setReportError(err.message || 'Error creating alert');
    }
  };

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.alert_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL': return { bg: 'rgba(239,68,68,0.1)', text: 'var(--color-critical)' };
      case 'HIGH': return { bg: 'rgba(249,115,22,0.1)', text: '#ea580c' }; // orange
      case 'MEDIUM': return { bg: 'rgba(245,158,11,0.1)', text: 'var(--color-warning)' };
      case 'LOW': return { bg: 'rgba(59,130,246,0.1)', text: 'var(--color-primary)' };
      case 'INFO': return { bg: 'rgba(100,116,139,0.1)', text: 'var(--color-muted)' };
      default: return { bg: 'rgba(100,116,139,0.1)', text: 'var(--color-muted)' };
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Alerts & Emergency</h1>
          <p className="text-muted">Monitor operational risks, emergency events and response actions.</p>
        </div>
        {user?.role !== 'VIEWER' && (
          <button 
            className="btn btn-primary" 
            style={{ backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
            onClick={() => setShowReportForm(!showReportForm)}
          >
            <ShieldAlert size={18} className="mr-2" /> Report Emergency
          </button>
        )}
      </div>

      {showReportForm && (
        <div className="card mb-8 border-l-4" style={{ borderLeftColor: 'var(--color-danger)' }}>
          <h2 className="card-title mb-4">Report New Emergency / Alert</h2>
          {reportError && <div className="mb-4 text-sm text-red-600">{reportError}</div>}
          <form onSubmit={handleReportEmergency}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="form-group col-span-2">
                <label className="form-label">Title</label>
                <input required className="form-input" placeholder="e.g., Fire in Generator Room 2" value={reportData.title} onChange={e => setReportData({...reportData, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select required className="form-input" value={reportData.alert_type} onChange={e => setReportData({...reportData, alert_type: e.target.value as any})}>
                  <option value="SYSTEM">System Failure</option>
                  <option value="WEATHER">Weather Event</option>
                  <option value="MEDICAL">Medical Emergency</option>
                  <option value="FIRE">Fire</option>
                  <option value="SECURITY">Security Breach</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Severity</label>
                <select required className="form-input" value={reportData.severity} onChange={e => setReportData({...reportData, severity: e.target.value as any})}>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
              <div className="form-group col-span-2">
                <label className="form-label">Description</label>
                <textarea required className="form-input" rows={3} value={reportData.description} onChange={e => setReportData({...reportData, description: e.target.value})}></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-outline" onClick={() => setShowReportForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>Submit Alert</button>
            </div>
          </form>
        </div>
      )}

      {emergencies.filter(e => e.status !== 'RESOLVED' && e.status !== 'CANCELLED').length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-critical)' }}>
            <Activity size={20} /> Active Emergencies
          </h2>
          <div className="grid gap-4">
            {emergencies.filter(e => e.status !== 'RESOLVED' && e.status !== 'CANCELLED').map(em => (
              <div key={em.id} className="card border-l-4" style={{ borderLeftColor: 'var(--color-critical)', padding: '1rem 1.5rem' }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{em.event_code}: {em.title}</h3>
                    <p className="text-sm text-muted">{em.description}</p>
                    <div className="flex gap-4 mt-2 text-xs font-semibold">
                      <span style={{ color: 'var(--color-critical)' }}>{em.status.replace('_', ' ')}</span>
                      <span>Type: {em.event_type}</span>
                      {em.location_id && <span>Location: {em.location_id}</span>}
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => setSelectedEmergency(em)}>View Emergency</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedEmergency && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ maxWidth: '48rem', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '2px solid var(--color-danger)' }}>
            <div style={{ backgroundColor: 'var(--color-danger)', color: 'white', margin: '-1.5rem -1.5rem 1.5rem -1.5rem', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="font-bold flex items-center gap-2">
                <AlertTriangle size={20} /> CRITICAL INCIDENT COMMAND
              </div>
              <button className="hover:text-gray-200" style={{ fontSize: '1.25rem', lineHeight: 1 }} onClick={() => setSelectedEmergency(null)}>✕</button>
            </div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold">{selectedEmergency.title}</h2>
                  <span className="badge" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-critical)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                    {selectedEmergency.severity}
                  </span>
                </div>
                <div className="text-muted">{selectedEmergency.event_code} • {selectedEmergency.event_type}</div>
              </div>
              <Link to="/emergency/map" className="btn btn-outline btn-sm">
                View on Operations Map
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded border border-gray-200">
              <div><div className="text-sm text-muted">Status</div><div className="font-semibold text-red-600">{selectedEmergency.status.replace('_', ' ')}</div></div>
              <div><div className="text-sm text-muted">Reported</div><div className="font-medium">{new Date(selectedEmergency.started_at || selectedEmergency.created_at).toLocaleString()}</div></div>
              <div><div className="text-sm text-muted">Location</div><div className="font-medium">{selectedEmergency.location_id || 'Not Specified'}</div></div>
              <div><div className="text-sm text-muted">Incident Commander</div><div className="font-medium">{selectedEmergency.assigned_to || 'Unassigned Command'}</div></div>
            </div>
            
            <h3 className="font-semibold mb-2">Emergency Details</h3>
            <p className="text-sm mb-6 pb-6 border-b border-gray-200">{selectedEmergency.description}</p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold mb-3 text-red-600 flex items-center gap-2"><ShieldAlert size={16} /> Immediate Protocols</h3>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2 p-2 bg-red-50 rounded border border-red-100 cursor-pointer">
                    <input type="checkbox" className="rounded text-red-600" /> Secure incident perimeter
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-red-50 rounded border border-red-100 cursor-pointer">
                    <input type="checkbox" className="rounded text-red-600" /> Dispatch first responders
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-red-50 rounded border border-red-100 cursor-pointer">
                    <input type="checkbox" className="rounded text-red-600" /> Notify regional headquarters
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-red-50 rounded border border-red-100 cursor-pointer">
                    <input type="checkbox" className="rounded text-red-600" /> Lock down affected assets
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-blue-600 flex items-center gap-2"><Activity size={16} /> Resource Dispatch</h3>
                <div className="card p-3 border-blue-200 bg-blue-50">
                  <div className="text-sm font-semibold mb-1">Recommended Action</div>
                  <div className="text-xs mb-3 text-muted">Based on proximity and incident type:</div>
                  <div className="text-sm mb-3">
                    <strong>MEDEVAC Helicopter (Asset: HELI-09)</strong> is 45km away. ETA: 12 minutes.
                  </div>
                  <button className="btn btn-primary btn-sm w-full" onClick={() => alert('Dispatch command sent to HELI-09')}>
                    Dispatch Immediate Rescue
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button className="btn btn-outline" onClick={() => setSelectedEmergency(null)}>Cancel Action</button>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                onClick={async () => {
                  if (organization) {
                    await api.updateEmergencyStatus(organization.id, selectedEmergency.id, 'RESOLVED');
                    setSelectedEmergency(null);
                    loadData();
                  }
                }}
              >
                Mark Incident as Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div className="card-header flex justify-between items-center" style={{ padding: '1.5rem' }}>
          <div className="flex gap-4 items-center flex-1">
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search alerts..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select className="form-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="ACKNOWLEDGED">Acknowledged</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="DISMISSED">Dismissed</option>
              </select>
              <select className="form-input" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                <option value="INFO">Info</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-muted">Total: {filteredAlerts.length} alerts</div>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="empty-state">
            <AlertTriangle size={48} />
            <h3 className="text-lg font-semibold mb-2">No alerts found.</h3>
            <p className="mb-4">No operational alerts match your criteria.</p>
          </div>
        ) : (
          <div className="pb-4" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)' }}>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Alert</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Type</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Severity</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Related Entity</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Assigned To</th>
                  <th style={{ padding: '0.75rem 1.5rem' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map(a => {
                  const colors = getSeverityColor(a.severity);
                  return (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <Link to={`/alerts/${a.id}`} className="font-semibold text-primary">{a.title}</Link>
                        <div className="text-xs text-muted mt-1">{a.alert_code}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div className="text-sm font-medium">{a.alert_type.replace(/_/g, ' ')}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span className="badge" style={{ backgroundColor: colors.bg, color: colors.text, padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {a.severity}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {a.source_entity_type && (
                          <div className="text-sm">
                            <span className="text-muted capitalize">{a.source_entity_type}:</span> {a.source_entity_id}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div className="text-sm font-semibold">{a.status.replace('_', ' ')}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div className="text-sm">{a.assigned_to || 'Unassigned'}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div className="text-sm">{new Date(a.created_at).toLocaleString()}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
