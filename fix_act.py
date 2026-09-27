import sys

with open('src/pages/Activity.tsx', 'r') as f:
    content = f.read()

replacement = """  useEffect(() => { const loadAsync = async () => {
    if (organization) {
      const unified: UnifiedEvent[] = [];

      // 1. Expedition History
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

      // 2. Cargo History
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

      // 3. Inventory Transactions
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

      // 4. Alert History
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

      // Sort by timestamp desc
      unified.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setEvents(unified);
    }
  }; loadAsync(); }, [organization]);"""

import re
content = re.sub(r'  useEffect\(\(\) => \{\n    if \(organization\) \{\n      const unified: UnifiedEvent\[\] = \[\];[\s\S]*?  \}, \[organization\]\);', replacement, content)

with open('src/pages/Activity.tsx', 'w') as f:
    f.write(content)
