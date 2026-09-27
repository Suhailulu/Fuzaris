import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import type { Alert, AlertHistory, Recommendation, ResponseTask } from '../lib/types';
import { CheckCircle, Clock, ShieldAlert, CheckSquare } from 'lucide-react';

export function AlertDetail() {
  const { id } = useParams<{ id: string }>();
  const { organization, user } = useAuth();
  
  const [alert, setAlert] = useState<Alert | null>(null);
  const [history, setHistory] = useState<AlertHistory[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [tasks, setTasks] = useState<ResponseTask[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [resolveNotes, setResolveNotes] = useState('');

  const loadData = async () => {
    if (organization && id) {
      const a = await api.getAlertById(organization.id, id);
      setAlert(a || null);
      if (a) {
        setHistory(await api.getAlertHistory(organization.id, id));
        setRecommendations(await api.getRecommendations(organization.id, id));
        setTasks(await api.getResponseTasks(organization.id, id));
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [organization, id]);

  const handleUpdateStatus = async (status: Alert['status'], notes?: string) => {
    if (!organization || !user || !id) return;
    try {
      await api.updateAlertStatus(organization.id, user, id, status, notes);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization || !user || !id || !newTaskTitle.trim() || !alert) return;
    
    await api.createResponseTask(organization.id, user, {
      alert_id: id,
      title: newTaskTitle.trim(),
      priority: alert.severity,
      status: 'TODO'
    });
    setNewTaskTitle('');
    loadData();
  };

  const handleTaskStatus = async (taskId: string, status: ResponseTask['status']) => {
    if (!organization) return;
    await api.updateResponseTaskStatus(organization.id, taskId, status);
    loadData();
  };

  if (loading) return <div className="p-8 text-center text-muted">Loading alert...</div>;
  if (!alert) return <div className="p-8 text-center text-muted">Alert not found.</div>;

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <Link to="/alerts" className="text-sm text-primary hover:underline flex items-center gap-1 mb-2">
            ← Back to Alerts
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{alert.title}</h1>
            <span className="badge" style={{ backgroundColor: alert.severity === 'CRITICAL' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: alert.severity === 'CRITICAL' ? 'var(--color-critical)' : 'var(--color-warning)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
              {alert.severity}
            </span>
          </div>
          <p className="text-muted text-lg mt-1">{alert.alert_code}</p>
        </div>
        <div className="flex gap-2">
          {alert.status === 'OPEN' && (
            <button className="btn btn-outline" onClick={() => handleUpdateStatus('ACKNOWLEDGED')}>Acknowledge</button>
          )}
          {alert.status === 'ACKNOWLEDGED' && (
            <button className="btn btn-primary" onClick={() => handleUpdateStatus('IN_PROGRESS')}>Start Response</button>
          )}
          {alert.status === 'IN_PROGRESS' && (
            <button className="btn btn-primary" style={{ backgroundColor: 'var(--color-success)' }} onClick={() => handleUpdateStatus('RESOLVED', resolveNotes || 'Condition resolved.')}>Resolve Alert</button>
          )}
        </div>
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

      <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="flex flex-col gap-6">
          <div className="card">
            <h2 className="card-title mb-4 flex items-center gap-2 border-b pb-4"><ShieldAlert size={20} /> Alert Summary</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div><div className="text-sm text-muted">Status</div><div className="font-semibold text-lg">{alert.status.replace('_', ' ')}</div></div>
              <div><div className="text-sm text-muted">Created</div><div className="font-medium">{new Date(alert.created_at).toLocaleString()}</div></div>
              <div>
                <div className="text-sm text-muted">Source Entity</div>
                <div className="font-medium capitalize text-primary cursor-pointer hover:underline">
                  {alert.source_entity_type}: {alert.source_entity_id}
                </div>
              </div>
              <div><div className="text-sm text-muted">Location</div><div className="font-medium">{alert.location_id || 'Global'}</div></div>
            </div>
            
            <h3 className="font-semibold mb-2">Problem Description</h3>
            <p className="text-sm mb-6">{alert.description}</p>

            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <h3 className="font-semibold mb-4 flex justify-between items-center">
                Risk Engine Analysis
                <div className="text-right">
                  <div className="text-xs text-muted uppercase">Risk Score</div>
                  <div className="text-xl font-bold" style={{ color: alert.risk_score >= 80 ? 'var(--color-critical)' : 'var(--color-warning)' }}>
                    {alert.risk_score} / 100
                  </div>
                </div>
              </h3>
              
              <div className="mb-4">
                <div className="text-sm font-semibold mb-2">Why?</div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {alert.risk_reasons?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title mb-4 flex items-center gap-2 border-b pb-4"><CheckSquare size={20} /> Recommended Actions</h2>
            <div className="space-y-3">
              {recommendations.length === 0 ? (
                <div className="text-sm text-muted">No specific recommendations provided by the intelligence engine.</div>
              ) : (
                recommendations.map(r => (
                  <div key={r.id} className="p-3 border rounded flex justify-between items-center bg-gray-50">
                    <span className="text-sm font-medium">{r.title}</span>
                    <button className="btn btn-outline btn-sm text-xs" onClick={() => setNewTaskTitle(r.title)}>Create Task</button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="card-title flex items-center gap-2"><CheckCircle size={20} /> Response Tasks</h2>
            </div>
            
            <form onSubmit={handleCreateTask} className="mb-4 flex gap-2">
              <input 
                type="text" 
                className="form-input flex-1" 
                placeholder="New response task..." 
                value={newTaskTitle} 
                onChange={(e) => setNewTaskTitle(e.target.value)} 
                disabled={alert.status === 'RESOLVED' || alert.status === 'DISMISSED'}
              />
              <button type="submit" className="btn btn-primary" disabled={!newTaskTitle.trim() || alert.status === 'RESOLVED' || alert.status === 'DISMISSED'}>Add</button>
            </form>

            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-sm text-muted text-center py-4">No response tasks created yet.</div>
              ) : (
                tasks.map(t => (
                  <div key={t.id} className="flex items-center gap-3 p-3 border rounded">
                    <input 
                      type="checkbox" 
                      checked={t.status === 'COMPLETED'} 
                      onChange={(e) => handleTaskStatus(t.id, e.target.checked ? 'COMPLETED' : 'TODO')}
                      disabled={alert.status === 'RESOLVED' || alert.status === 'DISMISSED'}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${t.status === 'COMPLETED' ? 'line-through text-muted' : ''}`}>{t.title}</div>
                      <div className="text-xs text-muted">Priority: {t.priority}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card">
            <h2 className="card-title mb-4 flex items-center gap-2 border-b pb-4"><Clock size={20} /> Alert History</h2>
            <div className="space-y-4">
              {history.map((h) => (
                <div key={h.id} className="relative pl-4 border-l-2 border-gray-200">
                  <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1"></div>
                  <div className="text-sm font-semibold">{h.new_status.replace('_', ' ')}</div>
                  <div className="text-xs text-muted mb-1">{new Date(h.created_at).toLocaleString()}</div>
                  <div className="text-xs">by {h.changed_by}</div>
                  {h.notes && <div className="text-sm mt-1 p-2 bg-gray-50 rounded border">{h.notes}</div>}
                </div>
              ))}
            </div>
          </div>
          
          {alert.status === 'IN_PROGRESS' && (
            <div className="card">
              <h2 className="card-title mb-4 border-b pb-4">Resolve</h2>
              <textarea 
                className="form-input w-full mb-4" 
                rows={3} 
                placeholder="Resolution notes..."
                value={resolveNotes}
                onChange={(e) => setResolveNotes(e.target.value)}
              ></textarea>
              <button 
                className="btn btn-primary w-full" 
                style={{ backgroundColor: 'var(--color-success)' }}
                onClick={() => handleUpdateStatus('RESOLVED', resolveNotes || 'Condition resolved.')}
              >
                Mark as Resolved
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
