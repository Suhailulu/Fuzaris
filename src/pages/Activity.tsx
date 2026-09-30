import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
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

      const limit = 30;

      try {
        const [expRes, cargoRes, invRes, alertRes] = await Promise.all([
          supabase.from('expedition_status_history').select('*, expeditions(expedition_code)').eq('organization_id', organization.id).order('changed_at', { ascending: false }).limit(limit),
          supabase.from('cargo_status_history').select('*, cargo(cargo_code)').eq('organization_id', organization.id).order('changed_at', { ascending: false }).limit(limit),
          supabase.from('inventory_transactions').select('*, inventory_items(item_code, unit)').eq('organization_id', organization.id).order('created_at', { ascending: false }).limit(limit),
          supabase.from('alert_history').select('*, alerts(alert_code)').eq('organization_id', organization.id).order('created_at', { ascending: false }).limit(limit)
        ]);

        if (expRes.data) {
          for (const h of expRes.data) {
            unified.push({
              id: h.id, timestamp: h.changed_at,
              entity: `Expedition ${h.expeditions?.expedition_code || 'Unknown'}`,
              description: h.previous_status === 'NONE' ? `Created as ${h.new_status}` : `Changed from ${h.previous_status} to ${h.new_status}`,
              user: h.changed_by, type: 'EXPEDITION'
            });
          }
        }

        if (cargoRes.data) {
          for (const h of cargoRes.data) {
            unified.push({
              id: h.id, timestamp: h.changed_at,
              entity: `Cargo ${h.cargo?.cargo_code || 'Unknown'}`,
              description: h.previous_status === 'NONE' ? `Created as ${h.new_status}` : `Changed from ${h.previous_status} to ${h.new_status}`,
              user: h.changed_by, type: 'CARGO'
            });
          }
        }

        if (invRes.data) {
          for (const t of invRes.data) {
            unified.push({
              id: t.id, timestamp: t.created_at,
              entity: `Inventory ${t.inventory_items?.item_code || 'Unknown'}`,
              description: `${t.transaction_type.replace('_', ' ')}: ${t.quantity} ${t.inventory_items?.unit || ''} (${t.previous_quantity} → ${t.new_quantity})`,
              user: t.performed_by, type: 'INVENTORY'
            });
          }
        }

        if (alertRes.data) {
          for (const h of alertRes.data) {
            unified.push({
              id: h.id, timestamp: h.created_at || h.changed_at || new Date().toISOString(),
              entity: `Alert ${h.alerts?.alert_code || 'Unknown'}`,
              description: h.previous_status ? `Changed from ${h.previous_status} to ${h.new_status}` : `Generated with status ${h.new_status}`,
              user: h.changed_by, type: 'ALERT'
            });
          }
        }
      } catch (err) {
        console.error('Error fetching activity feed:', err);
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
        
        <div className="space-y-0">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent activity found.
            </div>
          ) : (
            events.map(event => (
              <div key={event.id} className="flex gap-4 items-start py-4 border-b border-gray-100 last:border-0">
                <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                  {getIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">{event.entity}</h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-md">
                      {new Date(event.timestamp).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                  <div className="flex items-center text-xs text-gray-400 font-mono">
                    <Users size={12} className="mr-1" />
                    <span className="truncate">{event.user}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
