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
  
  const loadData = async () => {
    if (organization) {
      setAlerts(await api.getAlerts(organization.id));
      setEmergencies(await api.getEmergencyEvents(organization.id));
    }
  };

  useEffect(() => {
    loadData();
  }, [organization]);

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
          <button className="btn btn-primary" style={{ backgroundColor: 'var(--color-critical)' }}>
            <ShieldAlert size={18} className="mr-2" /> Report Emergency
          </button>
        )}
      </div>

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
                  <button className="btn btn-outline btn-sm">View Emergency</button>
                </div>
              </div>
            ))}
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
