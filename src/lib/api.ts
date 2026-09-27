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
    const { data, error } = await supabase.from('expeditions').select('*').eq('organization_id', orgId);
    if (error) throw error;
    return data || [];
  },
  
  getExpedition: async (orgId: string, id: string): Promise<Expedition | undefined> => {
    const { data, error } = await supabase.from('expeditions').select('*').eq('organization_id', orgId).eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  },
  
  createExpedition: async (orgId: string, user: User, data: Omit<Expedition, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<Expedition> => {
    const { data: newExp, error } = await supabase.from('expeditions').insert({
      ...data,
      organization_id: orgId,
      created_by: user.id
    }).select().single();
    if (error) throw error;
    await api.addExpeditionStatusHistory(orgId, user, newExp.id, 'NONE', newExp.status, 'Created expedition');
    return newExp;
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
    const { data, error } = await supabase.from('cargo').select('*').eq('organization_id', orgId);
    if (error) throw error;
    return data || [];
  },

  getCargo: async (orgId: string, id: string): Promise<Cargo | undefined> => {
    const { data, error } = await supabase.from('cargo').select('*').eq('organization_id', orgId).eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  },

  createCargo: async (orgId: string, user: User, data: Omit<Cargo, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<Cargo> => {
    const { data: newCargo, error } = await supabase.from('cargo').insert({
      ...data,
      organization_id: orgId,
      created_by: user.id
    }).select().single();
    if (error) throw error;
    await api.addCargoStatusHistory(orgId, user, newCargo.id, 'NONE', newCargo.status, 'Cargo created');
    return newCargo;
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
    const { data, error } = await supabase.from('inventory_items').select('*').eq('organization_id', orgId);
    if (error) throw error;
    return data || [];
  },

  getInventoryItem: async (orgId: string, id: string): Promise<InventoryItem | undefined> => {
    const { data, error } = await supabase.from('inventory_items').select('*').eq('organization_id', orgId).eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  },

  createInventoryItem: async (orgId: string, user: User, data: Omit<InventoryItem, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<InventoryItem> => {
    const { data: newItem, error } = await supabase.from('inventory_items').insert({
      ...data,
      organization_id: orgId,
      created_by: user.id
    }).select().single();
    if (error) throw error;
    return newItem;
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
    const { data, error } = await supabase.from('assets').select('*').eq('organization_id', orgId);
    if (error) throw error;
    return data || [];
  },

  getAsset: async (orgId: string, id: string): Promise<Asset | undefined> => {
    const { data, error } = await supabase.from('assets').select('*').eq('organization_id', orgId).eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  },

  createAsset: async (orgId: string, user: User, data: Omit<Asset, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<Asset> => {
    const { data: newAsset, error } = await supabase.from('assets').insert({
      ...data,
      organization_id: orgId,
      created_by: user.id
    }).select().single();
    if (error) throw error;
    return newAsset;
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
    const { data, error } = await supabase.from('personnel').select('*').eq('organization_id', orgId);
    if (error) throw error;
    return data || [];
  },

  getPersonnelById: async (orgId: string, id: string): Promise<Personnel | undefined> => {
    const { data, error } = await supabase.from('personnel').select('*').eq('organization_id', orgId).eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  },

  createPersonnel: async (orgId: string, user: User, data: Omit<Personnel, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<Personnel> => {
    const { data: newPers, error } = await supabase.from('personnel').insert({
      ...data,
      organization_id: orgId,
      created_by: user.id
    }).select().single();
    if (error) throw error;
    return newPers;
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
    const { data, error } = await supabase.from('alerts').select('*').eq('organization_id', orgId);
    if (error) throw error;
    return data || [];
  },

  getAlertById: async (orgId: string, id: string): Promise<Alert | undefined> => {
    const { data, error } = await supabase.from('alerts').select('*').eq('organization_id', orgId).eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  },

  createAlert: async (orgId: string, user: User, data: Omit<Alert, 'id' | 'organization_id' | 'created_by' | 'created_at' | 'updated_at' | 'acknowledged_at' | 'resolved_at'>): Promise<Alert> => {
    const { data: newAlert, error } = await supabase.from('alerts').insert({
      ...data,
      organization_id: orgId,
      created_by: user.id
    }).select().single();
    if (error) throw error;
    return newAlert;
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
    const { data, error } = await supabase.from('emergency_events').select('*').eq('organization_id', orgId);
    if (error) throw error;
    return data || [];
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

  evaluateRisks: async (orgId: string, user: User) => {}
};
