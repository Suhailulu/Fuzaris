import Dexie, { Table } from 'dexie';
import type { 
  Expedition, Personnel, Cargo, CargoMovement, InventoryItem, 
  InventoryTransaction, Asset, AssetMaintenance, Alert, EmergencyEvent
} from '../types';

export interface SyncOperation {
  id: string;
  table: string;
  record_id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  created_at: string;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
  retry_count: number;
  error_message?: string;
}

export class PolarOfflineDB extends Dexie {
  expeditions!: Table<Expedition, string>;
  personnel!: Table<Personnel, string>;
  cargo!: Table<Cargo, string>;
  cargo_movements!: Table<CargoMovement, string>;
  inventory!: Table<InventoryItem, string>;
  inventory_transactions!: Table<InventoryTransaction, string>;
  assets!: Table<Asset, string>;
  asset_maintenance!: Table<AssetMaintenance, string>;
  alerts!: Table<Alert, string>;
  emergencies!: Table<EmergencyEvent, string>;
  sync_queue!: Table<SyncOperation, string>;

  constructor() {
    super('PolarOfflineDB');
    this.version(1).stores({
      expeditions: 'id, organization_id, status',
      personnel: 'id, organization_id, status',
      cargo: 'id, organization_id, status, current_location',
      cargo_movements: 'id, organization_id, cargo_id',
      inventory: 'id, organization_id, status',
      inventory_transactions: 'id, organization_id, inventory_item_id',
      assets: 'id, organization_id, status',
      asset_maintenance: 'id, organization_id, asset_id',
      alerts: 'id, organization_id, status, severity',
      emergencies: 'id, organization_id, status',
      sync_queue: 'id, status, table, record_id'
    });
  }
}

export const db = new PolarOfflineDB();
