import { supabase } from './supabase';
import type { 
  Expedition, Cargo, ExpeditionStatusHistory, CargoMovement, CargoStatusHistory, MovementType,
  InventoryItem, InventoryTransaction, Asset, AssetMaintenance, InventoryStatus, TransactionType,
  Personnel, PersonnelMovement, LocationRecord,
  Alert, AlertHistory, EmergencyEvent, Recommendation, ResponseTask
} from './types';
import type { User } from './AuthContext';

export const api = {
  // --- EXPEDITIONS ---
  getExpeditions: async (orgId: string): Promise<Expedition[]> => {
    if (!navigator.onLine) {
      const { db } = await import('./offline/db');
      return await db.expeditions.where('organization_id').equals(orgId).toArray();
    }
    const { data, error } = await supabase.from('expeditions').select('*').eq('organization_id', orgId);
    if (error) throw error;
    if (data) {
      const { db } = await import('./offline/db');
      await db.expeditions.bulkPut(data);
    }
    return data || [];
  },
  
  getExpedition: async (orgId: string, id: string): Promise<Expedition | undefined> => {
    if (!navigator.onLine) {
      const { db } = await import('./offline/db');
      return await db.expeditions.get(id);
    }
    const { data, error } = await supabase.from('expeditions').select('*').eq('organization_id', orgId).eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (data) {
      const { db } = await import('./offline/db');
      await db.expeditions.put(data);
    }
    return data || undefined;
  },
  
  createExpedition: async (orgId: string, user: User, data: Omit<Expedition, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<Expedition> => {
    const payload = {
      ...data,
      id: crypto.randomUUID(),
      organization_id: orgId,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Expedition;

    const { db } = await import('./offline/db');
    const { syncQueue } = await import('./offline/syncQueue');
    await db.expeditions.put(payload);
    await syncQueue.addOperation('expeditions', payload.id, 'CREATE', payload);

    if (navigator.onLine) {
      await api.addExpeditionStatusHistory(orgId, user, payload.id, 'NONE', payload.status, 'Created expedition');
    }
    return payload;
  },

  updateExpedition: async (orgId: string, user: User, id: string, data: Partial<Expedition>): Promise<Expedition> => {
    const existing = await api.getExpedition(orgId, id);
    if (!existing) throw new Error('Expedition not found');
    
    const { data: updated, error } = await supabase.from('expeditions').update(data).eq('id', id).select().single();
    if (error) throw error;
    
    if (data.status && data.status !== existing.status) {
      await api.addExpeditionStatusHistory(orgId, user, id, existing.status, data.status, 'Status updated');
    }
    return updated;
  },

  getExpeditionHistory: async (orgId: string, expeditionId: string): Promise<ExpeditionStatusHistory[]> => {
    const { data, error } = await supabase.from('expedition_status_history').select('*').eq('expedition_id', expeditionId);
    if (error) throw error;
    return data || [];
  },

  addExpeditionStatusHistory: async (orgId: string, user: User, expeditionId: string, prevStatus: string, newStatus: string, notes?: string) => {
    await supabase.from('expedition_status_history').insert({
      organization_id: orgId,
      expedition_id: expeditionId,
      previous_status: prevStatus,
      new_status: newStatus,
      changed_by: user.id,
      notes
    });
  },

  // --- CARGO ---
  getCargoList: async (orgId: string): Promise<Cargo[]> => {
    if (!navigator.onLine) {
      const { db } = await import('./offline/db');
      return await db.cargo.where('organization_id').equals(orgId).toArray();
    }
    const { data, error } = await supabase.from('cargo').select('*').eq('organization_id', orgId);
    if (error) throw error;
    if (data) {
      const { db } = await import('./offline/db');
      await db.cargo.bulkPut(data);
    }
    return data || [];
  },

  getCargo: async (orgId: string, id: string): Promise<Cargo | undefined> => {
    if (!navigator.onLine) {
      const { db } = await import('./offline/db');
      return await db.cargo.get(id);
    }
    const { data, error } = await supabase.from('cargo').select('*').eq('organization_id', orgId).eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (data) {
      const { db } = await import('./offline/db');
      await db.cargo.put(data);
    }
    return data || undefined;
  },

  createCargo: async (orgId: string, user: User, data: Omit<Cargo, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<Cargo> => {
    const payload = {
      ...data,
      id: crypto.randomUUID(),
      organization_id: orgId,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Cargo;

    const { db } = await import('./offline/db');
    const { syncQueue } = await import('./offline/syncQueue');
    await db.cargo.put(payload);
    await syncQueue.addOperation('cargo', payload.id, 'CREATE', payload);

    if (navigator.onLine) {
      await api.addCargoStatusHistory(orgId, user, payload.id, 'NONE', payload.status, 'Cargo created');
    }
    return payload;
  },

  updateCargo: async (orgId: string, user: User, id: string, data: Partial<Cargo>): Promise<Cargo> => {
    const existing = await api.getCargo(orgId, id);
    if (!existing) throw new Error('Cargo not found');
    
    const { data: updated, error } = await supabase.from('cargo').update(data).eq('id', id).select().single();
    if (error) throw error;
    
    if (data.status && data.status !== existing.status) {
      await api.addCargoStatusHistory(orgId, user, id, existing.status, data.status, 'Status updated');
    }
    return updated;
  },

  getCargoMovements: async (orgId: string, cargoId: string): Promise<CargoMovement[]> => {
    const { data, error } = await supabase.from('cargo_movements').select('*').eq('cargo_id', cargoId);
    if (error) throw error;
    return data || [];
  },

  addCargoMovement: async (orgId: string, user: User, cargoId: string, data: Omit<CargoMovement, 'id' | 'organization_id' | 'moved_by' | 'moved_at'>) => {
    await supabase.from('cargo_movements').insert({
      ...data,
      organization_id: orgId,
      cargo_id: cargoId,
      moved_by: user.id
    });
  },

  getCargoStatusHistory: async (orgId: string, cargoId: string): Promise<CargoStatusHistory[]> => {
    const { data, error } = await supabase.from('cargo_status_history').select('*').eq('cargo_id', cargoId);
    if (error) throw error;
    return data || [];
  },

  addCargoStatusHistory: async (orgId: string, user: User, cargoId: string, prevStatus: string, newStatus: string, notes?: string) => {
    await supabase.from('cargo_status_history').insert({
      organization_id: orgId,
      cargo_id: cargoId,
      previous_status: prevStatus,
      new_status: newStatus,
      changed_by: user.id,
      notes
    });
  },

  // --- INVENTORY ---
  getInventoryItems: async (orgId: string): Promise<InventoryItem[]> => {
    if (!navigator.onLine) {
      const { db } = await import('./offline/db');
      return await db.inventory.where('organization_id').equals(orgId).toArray();
    }
    const { data, error } = await supabase.from('inventory_items').select('*').eq('organization_id', orgId);
    if (error) throw error;
    if (data) {
      const { db } = await import('./offline/db');
      await db.inventory.bulkPut(data);
    }
    return data || [];
  },

  getInventoryItem: async (orgId: string, id: string): Promise<InventoryItem | undefined> => {
    if (!navigator.onLine) {
      const { db } = await import('./offline/db');
      return await db.inventory.get(id);
    }
    const { data, error } = await supabase.from('inventory_items').select('*').eq('organization_id', orgId).eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (data) {
      const { db } = await import('./offline/db');
      await db.inventory.put(data);
    }
    return data || undefined;
  },

  createInventoryItem: async (orgId: string, user: User, data: Omit<InventoryItem, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<InventoryItem> => {
    const payload = {
      ...data,
      id: crypto.randomUUID(),
      organization_id: orgId,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as InventoryItem;

    const { db } = await import('./offline/db');
    const { syncQueue } = await import('./offline/syncQueue');
    await db.inventory.put(payload);
    await syncQueue.addOperation('inventory_items', payload.id, 'CREATE', payload);

    return payload;
  },

  updateInventoryQuantity: async (orgId: string, user: User, id: string, change: number, type: string, reason: string, fromLoc: string, toLoc?: string): Promise<void> => {
    const item = await api.getInventoryItem(orgId, id);
    if (!item) throw new Error('Item not found');
    
    let newQty = item.quantity;
    if (type === 'STOCK_IN') newQty += change;
    else if (type === 'STOCK_OUT' || type === 'CONSUMPTION') newQty -= change;
    
    if (newQty < 0) throw new Error('Insufficient quantity');
    
    let status = item.status;
    if (newQty === 0) status = 'OUT_OF_STOCK';
    else if (newQty <= item.critical_threshold) status = 'CRITICAL';
    else if (newQty <= item.minimum_threshold) status = 'LOW';
    else status = 'HEALTHY';
    
    await supabase.from('inventory_items').update({ quantity: newQty, status }).eq('id', id);
    
    await supabase.from('inventory_transactions').insert({
      organization_id: orgId,
      inventory_item_id: id,
      transaction_type: type,
      quantity: change,
      previous_quantity: item.quantity,
      new_quantity: newQty,
      location: fromLoc,
      reason,
      performed_by: user.id
    });
  },

  getInventoryTransactions: async (orgId: string, itemId: string): Promise<InventoryTransaction[]> => {
    const { data, error } = await supabase.from('inventory_transactions').select('*').eq('inventory_item_id', itemId);
    if (error) throw error;
    return data || [];
  },

  // --- ASSETS ---
  getAssets: async (orgId: string): Promise<Asset[]> => {
    if (!navigator.onLine) {
      const { db } = await import('./offline/db');
      return await db.assets.where('organization_id').equals(orgId).toArray();
    }
    const { data, error } = await supabase.from('assets').select('*').eq('organization_id', orgId);
    if (error) throw error;
    if (data) {
      const { db } = await import('./offline/db');
      await db.assets.bulkPut(data);
    }
    return data || [];
  },

  getAsset: async (orgId: string, id: string): Promise<Asset | undefined> => {
    if (!navigator.onLine) {
      const { db } = await import('./offline/db');
      return await db.assets.get(id);
    }
    const { data, error } = await supabase.from('assets').select('*').eq('organization_id', orgId).eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (data) {
      const { db } = await import('./offline/db');
      await db.assets.put(data);
    }
    return data || undefined;
  },

  createAsset: async (orgId: string, user: User, data: Omit<Asset, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<Asset> => {
    const payload = {
      ...data,
      id: crypto.randomUUID(),
      organization_id: orgId,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Asset;

    const { db } = await import('./offline/db');
    const { syncQueue } = await import('./offline/syncQueue');
    await db.assets.put(payload);
    await syncQueue.addOperation('assets', payload.id, 'CREATE', payload);

    return payload;
  },

  updateAsset: async (orgId: string, id: string, data: Partial<Asset>): Promise<Asset> => {
    const { data: updated, error } = await supabase.from('assets').update(data).eq('id', id).select().single();
    if (error) throw error;
    return updated;
  },

  getAssetMaintenanceRecords: async (orgId: string, assetId: string): Promise<AssetMaintenance[]> => {
    const { data, error } = await supabase.from('asset_maintenance').select('*').eq('asset_id', assetId);
    if (error) throw error;
    return data || [];
  },

  createMaintenanceRecord: async (orgId: string, user: User, data: Omit<AssetMaintenance, 'id' | 'organization_id' | 'performed_by' | 'created_at' | 'updated_at'>): Promise<AssetMaintenance> => {
    const { data: newRec, error } = await supabase.from('asset_maintenance').insert({
      ...data,
      organization_id: orgId,
      performed_by: user.id
    }).select().single();
    if (error) throw error;
    return newRec;
  },

  // --- PERSONNEL ---
  getPersonnel: async (orgId: string): Promise<Personnel[]> => {
    if (!navigator.onLine) {
      const { db } = await import('./offline/db');
      return await db.personnel.where('organization_id').equals(orgId).toArray();
    }
    const { data, error } = await supabase.from('personnel').select('*').eq('organization_id', orgId);
    if (error) throw error;
    if (data) {
      const { db } = await import('./offline/db');
      await db.personnel.bulkPut(data);
    }
    return data || [];
  },

  getPersonnelById: async (orgId: string, id: string): Promise<Personnel | undefined> => {
    if (!navigator.onLine) {
      const { db } = await import('./offline/db');
      return await db.personnel.get(id);
    }
    const { data, error } = await supabase.from('personnel').select('*').eq('organization_id', orgId).eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (data) {
      const { db } = await import('./offline/db');
      await db.personnel.put(data);
    }
    return data || undefined;
  },

  createPersonnel: async (orgId: string, user: User, data: Omit<Personnel, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<Personnel> => {
    const payload = {
      ...data,
      id: crypto.randomUUID(),
      organization_id: orgId,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Personnel;

    const { db } = await import('./offline/db');
    const { syncQueue } = await import('./offline/syncQueue');
    
    // Save locally first
    await db.personnel.put(payload);
    
    // Queue for sync
    await syncQueue.addOperation('personnel', payload.id, 'CREATE', payload);

    return payload;
  },

  updatePersonnel: async (orgId: string, id: string, data: Partial<Personnel>): Promise<Personnel> => {
    const { data: updated, error } = await supabase.from('personnel').update(data).eq('id', id).eq('organization_id', orgId).select().single();
    if (error) throw error;
    return updated;
  },

  getPersonnelMovements: async (orgId: string, personnelId: string): Promise<PersonnelMovement[]> => {
    const { data, error } = await supabase.from('personnel_movements').select('*').eq('personnel_id', personnelId);
    if (error) throw error;
    return data || [];
  },

  createPersonnelMovement: async (orgId: string, user: User, personnelId: string, data: Omit<PersonnelMovement, 'id' | 'organization_id' | 'personnel_id' | 'recorded_by' | 'created_at'>): Promise<PersonnelMovement> => {
    const { data: newMov, error } = await supabase.from('personnel_movements').insert({
      ...data,
      organization_id: orgId,
      personnel_id: personnelId,
      recorded_by: user.id
    }).select().single();
    if (error) throw error;
    return newMov;
  },

  updatePersonnelMovementStatus: async (orgId: string, user: User, movementId: string, status: string) => {
    await supabase.from('personnel_movements').update({ status }).eq('id', movementId);
  },

  // --- LOCATIONS ---
  getLocations: async (orgId: string): Promise<LocationRecord[]> => {
    const { data, error } = await supabase.from('locations').select('*').eq('organization_id', orgId);
    if (error) throw error;
    return data || [];
  },

  createLocation: async (orgId: string, user: User, data: Omit<LocationRecord, 'id' | 'organization_id' | 'created_at' | 'updated_at'>): Promise<LocationRecord> => {
    const { data: newLoc, error } = await supabase.from('locations').insert({
      ...data,
      organization_id: orgId
    }).select().single();
    if (error) throw error;
    return newLoc;
  },

  // --- ALERTS & RISK ---
  getAlerts: async (orgId: string): Promise<Alert[]> => {
    if (!navigator.onLine) {
      const { db } = await import('./offline/db');
      return await db.alerts.where('organization_id').equals(orgId).toArray();
    }
    const { data, error } = await supabase.from('alerts').select('*').eq('organization_id', orgId);
    if (error) throw error;
    if (data) {
      const { db } = await import('./offline/db');
      await db.alerts.bulkPut(data);
    }
    return data || [];
  },

  getAlertById: async (orgId: string, id: string): Promise<Alert | undefined> => {
    if (!navigator.onLine) {
      const { db } = await import('./offline/db');
      return await db.alerts.get(id);
    }
    const { data, error } = await supabase.from('alerts').select('*').eq('organization_id', orgId).eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (data) {
      const { db } = await import('./offline/db');
      await db.alerts.put(data);
    }
    return data || undefined;
  },

  createAlert: async (orgId: string, user: User, data: Omit<Alert, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at' | 'acknowledged_at' | 'resolved_at'>): Promise<Alert> => {
    const payload = {
      ...data,
      id: crypto.randomUUID(),
      organization_id: orgId,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Alert;

    const { db } = await import('./offline/db');
    const { syncQueue } = await import('./offline/syncQueue');
    await db.alerts.put(payload);
    await syncQueue.addOperation('alerts', payload.id, 'CREATE', payload);

    return payload;
  },

  updateAlertStatus: async (orgId: string, user: User, id: string, status: string, notes?: string) => {
    const existing = await api.getAlertById(orgId, id);
    if (!existing) throw new Error('Alert not found');
    
    const updates: Partial<Alert> = { status: status as any };
    if (status === 'ACKNOWLEDGED') updates.acknowledged_at = new Date().toISOString();
    if (status === 'RESOLVED') updates.resolved_at = new Date().toISOString();
    
    await supabase.from('alerts').update(updates).eq('id', id);
    await supabase.from('alert_history').insert({
      organization_id: orgId,
      alert_id: id,
      previous_status: existing.status,
      new_status: status,
      changed_by: user.id
    });
  },

  getAlertHistory: async (orgId: string, alertId: string): Promise<AlertHistory[]> => {
    const { data, error } = await supabase.from('alert_history').select('*').eq('alert_id', alertId);
    if (error) throw error;
    return data || [];
  },

  getEmergencyEvents: async (orgId: string): Promise<EmergencyEvent[]> => {
    if (!navigator.onLine) {
      const { db } = await import('./offline/db');
      return await db.emergencies.where('organization_id').equals(orgId).toArray();
    }
    const { data, error } = await supabase.from('emergency_events').select('*').eq('organization_id', orgId);
    if (error) throw error;
    if (data) {
      const { db } = await import('./offline/db');
      await db.emergencies.bulkPut(data);
    }
    return data || [];
  },

  updateEmergencyStatus: async (orgId: string, id: string, status: string) => {
    const { error } = await supabase.from('emergency_events').update({ status }).eq('id', id).eq('organization_id', orgId);
    if (error) throw error;
  },

  getRecommendations: async (orgId: string, alertId: string): Promise<Recommendation[]> => {
    const { data, error } = await supabase.from('recommendations').select('*').eq('alert_id', alertId);
    if (error) throw error;
    return data || [];
  },

  getResponseTasks: async (orgId: string, alertId: string): Promise<ResponseTask[]> => {
    const { data, error } = await supabase.from('response_tasks').select('*').eq('alert_id', alertId);
    if (error) throw error;
    return data || [];
  },

  createResponseTask: async (orgId: string, user: User, data: Omit<ResponseTask, 'id' | 'organization_id' | 'created_at' | 'completed_at'>): Promise<ResponseTask> => {
    const { data: newTask, error } = await supabase.from('response_tasks').insert({
      ...data,
      organization_id: orgId
    }).select().single();
    if (error) throw error;
    return newTask;
  },

  updateResponseTaskStatus: async (orgId: string, taskId: string, status: string) => {
    const updates: any = { status };
    if (status === 'COMPLETED') updates.completed_at = new Date().toISOString();
    await supabase.from('response_tasks').update(updates).eq('id', taskId);
  },

  evaluateRisks: async (orgId: string, user: User) => {
    // 1. Check Cargo Delays
    const cargoList = await api.getCargoList(orgId);
    const delayedCargo = cargoList.filter(c => c.status === 'DELAYED');
    for (const cargo of delayedCargo) {
      await createAlertIfNotExists(orgId, user, {
        alert_code: `ALT-CG-${cargo.cargo_code}`,
        title: `Cargo Delayed: ${cargo.name}`,
        description: `Cargo ${cargo.cargo_code} is marked as DELAYED. This may impact expedition timeline.`,
        alert_type: 'CARGO_DELAY',
        severity: 'MEDIUM',
        source_entity_type: 'cargo',
        source_entity_id: cargo.id,
        risk_score: 55,
      });
    }

    // 2. Check Inventory Levels
    const inventory = await api.getInventoryItems(orgId);
    const criticalInventory = inventory.filter(i => i.status === 'CRITICAL' || i.status === 'OUT_OF_STOCK');
    for (const item of criticalInventory) {
      await createAlertIfNotExists(orgId, user, {
        alert_code: `ALT-INV-${item.item_code}`,
        title: `Critical Inventory Level: ${item.name}`,
        description: `Inventory for ${item.name} is ${item.status}. Remaining quantity: ${item.quantity} ${item.unit}. Minimum threshold is ${item.minimum_threshold}.`,
        alert_type: 'LOW_INVENTORY',
        severity: item.status === 'OUT_OF_STOCK' ? 'CRITICAL' : 'HIGH',
        source_entity_type: 'inventory',
        source_entity_id: item.id,
        risk_score: item.status === 'OUT_OF_STOCK' ? 90 : 75,
      });
    }

    // 3. Check Asset Status
    const assets = await api.getAssets(orgId);
    const maintenanceAssets = assets.filter(a => a.status === 'MAINTENANCE_DUE' || a.status === 'DAMAGED');
    for (const asset of maintenanceAssets) {
      await createAlertIfNotExists(orgId, user, {
        alert_code: `ALT-AST-${asset.asset_code}`,
        title: `Asset Requires Attention: ${asset.name}`,
        description: `Asset ${asset.asset_code} is currently ${asset.status}. Condition is ${asset.condition}.`,
        alert_type: asset.status === 'DAMAGED' ? 'ASSET_FAILURE' : 'MAINTENANCE',
        severity: asset.status === 'DAMAGED' ? 'HIGH' : 'MEDIUM',
        source_entity_type: 'asset',
        source_entity_id: asset.id,
        risk_score: asset.status === 'DAMAGED' ? 80 : 40,
      });
    }
    // 4. Environmental & Weather Risks (Simulation)
    const activeExpeditions = await api.getExpeditions(orgId);
    for (const exp of activeExpeditions.filter(e => e.status === 'DEPLOYED' || e.status === 'ON_STATION')) {
      // 10% chance to simulate a severe weather alert for active expeditions
      if (Math.random() < 0.1) {
        await createAlertIfNotExists(orgId, user, {
          alert_code: `ALT-WTH-${exp.expedition_code}`,
          title: `Severe Weather Warning: ${exp.name}`,
          description: `Temperature drop below -50°C and high winds detected near ${exp.destination}. Ensure all personnel are inside.`,
          alert_type: 'WEATHER',
          severity: 'CRITICAL',
          source_entity_type: 'expedition',
          source_entity_id: exp.id,
          expedition_id: exp.id,
          risk_score: 95,
        });
      }
    }
  }
};

async function createAlertIfNotExists(orgId: string, user: User, alertData: Partial<Alert>) {
  // Check if an open/acknowledged alert for this specific entity already exists
  const { data: existing } = await supabase.from('alerts')
    .select('id')
    .eq('organization_id', orgId)
    .eq('source_entity_id', alertData.source_entity_id!)
    .in('status', ['OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS']);
    
  if (existing && existing.length > 0) {
    return; // Alert already exists and is active
  }

  // Create new alert
  await api.createAlert(orgId, user, {
    ...alertData,
    status: 'OPEN',
  } as any);
}
