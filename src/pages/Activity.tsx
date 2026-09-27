import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import { Activity, Package, Users, AlertTriangle, ArrowRightLeft } from 'lucide-react';


interface UnifiedEvent {
  id: string;
  timestamp: string;
  entity: string;
  description: string;
  user: string;
  type: 'EXPEDITION' | 'CARGO' | 'INVENTORY' | 'ALERT' | 'PERSONNEL';
}

export function ActivityFeed() {
  const { organization } = useAuth();
  const [events, setEvents] = useState<UnifiedEvent[]>([]);

  useEffect(() => { const loadAsync = async () => {
    if (organization) {
      const unified: UnifiedEvent[] = [];

      for (const exp of await api.getExpeditions(organization.id)) {
        for (const h of await api.getExpeditionHistory(organization.id, exp.id)) {
          unified.push({
            id: h.id,
            timestamp: h.changed_at,
            entity: `Expedition ${exp.expedition_code}`,
            description: h.previous_status === 'NONE' ? `Created as ${h.new_status}` : `Changed from ${h.previous_status} to ${h.new_status}`,
            user: h.changed_by,
            type: 'EXPEDITION'
          });
        }
      }

      for (const c of await api.getCargoList(organization.id)) {
        for (const h of await api.getCargoStatusHistory(organization.id, c.id)) {
          unified.push({
            id: h.id,
            timestamp: h.changed_at,
            entity: `Cargo ${c.cargo_code}`,
            description: h.previous_status === 'NONE' ? `Created as ${h.new_status}` : `Changed from ${h.previous_status} to ${h.new_status}`,
            user: h.changed_by,
            type: 'CARGO'
          });
        }
      }

      for (const item of await api.getInventoryItems(organization.id)) {
        for (const t of await api.getInventoryTransactions(organization.id, item.id)) {
          unified.push({
            id: t.id,
            timestamp: t.created_at,
            entity: `Inventory ${item.item_code}`,
            description: `${t.transaction_type.replace('_', ' ')}: ${t.quantity} ${item.unit} (${t.previous_quantity} → ${t.new_quantity})`,
            user: t.performed_by,
            type: 'INVENTORY'
          });
        }
      }

      for (const a of await api.getAlerts(organization.id)) {
        for (const h of await api.getAlertHistory(organization.id, a.id)) {
          unified.push({
            id: h.id,
            timestamp: h.created_at,
            entity: `Alert ${a.alert_code}`,
            description: h.previous_status ? `Changed from ${h.previous_status} to ${h.new_status}` : `Generated with status ${h.new_status}`,
            user: h.changed_by,
            type: 'ALERT'
          });
        }
      }

      unified.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setEvents(unified);
    }
  }; loadAsync(); }, [organization]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'EXPEDITION': return <Activity size={16} className="text-blue-500" />;
      case 'CARGO': return <Package size={16} className="text-amber-500" />;
      case 'INVENTORY': return <ArrowRightLeft size={16} className="text-emerald-500" />;
      case 'ALERT': return <AlertTriangle size={16} className="text-red-500" />;
      case 'PERSONNEL': return <Users size={16} className="text-purple-500" />;
      default: return <Activity size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Activity Feed</h1>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold mb-4">Recent Operations</h2>
        
        <div className="space-y-6">
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted">
              No recent activity found.
            </div>
          ) : (
            events.map(event => (
              <div key={event.id} className="flex gap-4">
                <div className="mt-1 bg-surface-hover p-2 rounded-full h-fit">
                  {getIcon(event.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{event.entity}</span>
                    <span className="text-xs text-muted">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted">{event.description}</p>
                  <p className="text-xs text-muted mt-1">User ID: {event.user}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
