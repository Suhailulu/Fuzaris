export type ExpeditionStatus = 'PLANNING' | 'ACTIVE' | 'DELAYED' | 'COMPLETED' | 'CANCELLED';
export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TransportMode = 'SHIP' | 'AIRCRAFT' | 'LAND' | 'MIXED';

export interface Expedition {
  id: string;
  organization_id: string;
  expedition_code: string;
  name: string;
  description: string;
  origin: string;
  destination: string;
  start_date: string;
  expected_arrival: string;
  end_date?: string;
  mission_commander: string;
  transport_mode: TransportMode;
  priority: Priority;
  status: ExpeditionStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ExpeditionStatusHistory {
  id: string;
  organization_id: string;
  expedition_id: string;
  previous_status: string;
  new_status: string;
  changed_by: string;
  changed_at: string;
  notes?: string;
}

export type CargoCategory = 'FOOD' | 'FUEL' | 'MEDICAL' | 'SCIENTIFIC' | 'MECHANICAL' | 'ELECTRICAL' | 'COMMUNICATION' | 'EMERGENCY' | 'GENERAL';
export type CargoStatus = 'PLANNED' | 'PACKED' | 'LOADED' | 'IN_TRANSIT' | 'ARRIVED' | 'VERIFIED' | 'DELAYED';
export type MovementType = 'LOADED' | 'TRANSFERRED' | 'DEPARTED' | 'ARRIVED' | 'VERIFIED';

export interface Cargo {
  id: string;
  organization_id: string;
  cargo_code: string;
  name: string;
  description: string;
  category: CargoCategory;
  quantity: number;
  unit: string;
  weight: number;
  volume: number;
  priority: Priority;
  origin: string;
  destination: string;
  current_location: string;
  expected_arrival: string;
  actual_arrival?: string;
  status: CargoStatus;
  expedition_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CargoMovement {
  id: string;
  organization_id: string;
  cargo_id: string;
  from_location: string;
  to_location: string;
  movement_type: MovementType;
  status: CargoStatus;
  moved_by: string;
  moved_at: string;
  notes?: string;
}

export interface CargoStatusHistory {
  id: string;
  organization_id: string;
  cargo_id: string;
  previous_status: string;
  new_status: string;
  changed_by: string;
  changed_at: string;
  notes?: string;
}

// Phase 3 Additions
export type InventoryCategory = 'FOOD' | 'FUEL' | 'MEDICAL' | 'WATER' | 'SCIENTIFIC' | 'MECHANICAL' | 'ELECTRICAL' | 'CLOTHING' | 'EMERGENCY' | 'COMMUNICATION' | 'GENERAL';
export type InventoryStatus = 'HEALTHY' | 'LOW' | 'CRITICAL' | 'OUT_OF_STOCK';

export interface InventoryItem {
  id: string;
  organization_id: string;
  item_code: string;
  name: string;
  description: string;
  category: InventoryCategory;
  quantity: number;
  unit: string;
  minimum_threshold: number;
  critical_threshold: number;
  storage_location: string;
  station: string;
  batch_number?: string;
  expiry_date?: string;
  supplier?: string;
  status: InventoryStatus;
  assigned_expedition_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type TransactionType = 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'CONSUMPTION' | 'RESERVATION';

export interface InventoryTransaction {
  id: string;
  organization_id: string;
  inventory_item_id: string;
  transaction_type: TransactionType;
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  location: string;
  reference_type?: string;
  reference_id?: string;
  reason?: string;
  performed_by: string;
  created_at: string;
}

export type AssetType = 'VEHICLE' | 'SNOW_VEHICLE' | 'GENERATOR' | 'CRANE' | 'SCIENTIFIC_EQUIPMENT' | 'COMMUNICATION_EQUIPMENT' | 'RESCUE_EQUIPMENT' | 'MACHINERY' | 'ELECTRICAL' | 'OTHER';
export type AssetCondition = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
export type AssetStatus = 'OPERATIONAL' | 'MAINTENANCE_DUE' | 'UNDER_MAINTENANCE' | 'DAMAGED' | 'RETIRED';

export interface Asset {
  id: string;
  organization_id: string;
  asset_code: string;
  name: string;
  description: string;
  asset_type: AssetType;
  serial_number: string;
  model: string;
  manufacturer: string;
  location: string;
  assigned_expedition_id?: string;
  condition: AssetCondition;
  status: AssetStatus;
  operating_hours: number;
  acquisition_date: string;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type MaintenanceType = 'PREVENTIVE' | 'CORRECTIVE' | 'INSPECTION' | 'EMERGENCY';
export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface AssetMaintenance {
  id: string;
  organization_id: string;
  asset_id: string;
  maintenance_type: MaintenanceType;
  description: string;
  scheduled_date: string;
  completed_date?: string;
  technician?: string;
  cost?: number;
  status: MaintenanceStatus;
  notes?: string;
  performed_by: string;
  created_at: string;
  updated_at: string;
}

// --- PHASE 4 TYPES ---

export type PersonnelStatus = 'AVAILABLE' | 'DEPLOYED' | 'ON_STATION' | 'IN_TRANSIT' | 'ON_LEAVE' | 'EMERGENCY';

export interface Personnel {
  id: string;
  organization_id: string;
  personnel_code: string;
  full_name: string;
  role: string;
  department: string;
  designation: string;
  expedition_id?: string;
  current_location: string;
  status: PersonnelStatus;
  phone?: string;
  email?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type PersonnelMovementType = 'STATION_TRANSFER' | 'FIELD_DEPLOYMENT' | 'RETURN' | 'EVACUATION' | 'TRANSIT';
export type PersonnelMovementStatus = 'PLANNED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';

export interface PersonnelMovement {
  id: string;
  organization_id: string;
  personnel_id: string;
  from_location: string;
  to_location: string;
  movement_type: PersonnelMovementType;
  status: PersonnelMovementStatus;
  departure_time?: string;
  arrival_time?: string;
  expedition_id?: string;
  notes?: string;
  recorded_by: string;
  created_at: string;
}

export type LocationType = 'PORT' | 'STATION' | 'BASE_CAMP' | 'FIELD_CAMP' | 'WAREHOUSE' | 'RESEARCH_SITE' | 'TRANSIT_HUB' | 'OTHER';

export interface LocationRecord {
  id: string;
  organization_id: string;
  location_code: string;
  name: string;
  location_type: LocationType;
  description?: string;
  latitude: number;
  longitude: number;
  parent_location_id?: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

// --- PHASE 5 TYPES ---

export type AlertType = 'CARGO_DELAY' | 'LOW_INVENTORY' | 'ASSET_FAILURE' | 'MAINTENANCE' | 'PERSONNEL' | 'ROUTE' | 'WEATHER' | 'EMERGENCY' | 'SYSTEM';
export type AlertSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED';

export interface Alert {
  id: string;
  organization_id: string;
  alert_code: string;
  title: string;
  description: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  source_entity_type?: 'cargo' | 'inventory' | 'asset' | 'personnel' | 'expedition' | 'location' | 'emergency';
  source_entity_id?: string;
  location_id?: string; // name or id
  expedition_id?: string;
  assigned_to?: string;
  risk_score: number;
  risk_reasons?: string[];
  created_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
  created_by: string;
  updated_at: string;
}

export interface AlertHistory {
  id: string;
  organization_id: string;
  alert_id: string;
  previous_status?: AlertStatus;
  new_status: AlertStatus;
  changed_by: string;
  notes?: string;
  created_at: string;
}

export type EmergencyEventType = 'MEDICAL' | 'PERSONNEL' | 'EQUIPMENT' | 'SUPPLY' | 'TRANSPORT' | 'ENVIRONMENTAL' | 'COMMUNICATION' | 'OTHER';
export type EmergencyStatus = 'REPORTED' | 'ACKNOWLEDGED' | 'RESPONSE_ACTIVE' | 'CONTAINED' | 'RESOLVED' | 'CANCELLED';

export interface EmergencyEvent {
  id: string;
  organization_id: string;
  event_code: string;
  title: string;
  description: string;
  event_type: EmergencyEventType;
  severity: AlertSeverity;
  status: EmergencyStatus;
  location_id?: string;
  expedition_id?: string;
  reported_by: string;
  assigned_to?: string;
  started_at?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  id: string;
  organization_id: string;
  alert_id: string;
  title: string;
  description: string;
  priority: AlertSeverity;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  created_at: string;
  completed_at?: string;
  created_by: string;
}

export interface ResponseTask {
  id: string;
  organization_id: string;
  alert_id?: string;
  emergency_event_id?: string;
  title: string;
  description?: string;
  assigned_to?: string;
  priority: AlertSeverity;
  status: 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';
  due_at?: string;
  created_at: string;
  completed_at?: string;
}

export interface Notification {
  id: string;
  organization_id: string;
  user_id?: string; // optional for global broadcast
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL';
  related_entity_type?: string;
  related_entity_id?: string;
  read: boolean;
  created_at: string;
}
