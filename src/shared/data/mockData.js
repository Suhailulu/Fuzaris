// ============================================================
// SHARED MOCK DATA STORE
// All modules reference common IDs for cross-module connectivity
// ============================================================

// ---- EXPEDITIONS ----
export const expeditions = [
  {
    id: 'EXP-001',
    name: 'Arctic Frontier Alpha',
    startDate: '2026-09-15',
    endDate: '2026-12-20',
    location: 'Svalbard Archipelago, 78°N',
    status: 'active',
    description: 'Primary research expedition to study glacial retreat patterns and polar biodiversity in the Svalbard region.',
    objectives: ['Glacial core sampling', 'Wildlife survey', 'Weather station deployment'],
    personnelCount: 28,
    cargoCount: 142,
    assetCount: 35,
    inventoryLevel: 87,
    emergencyCount: 2,
    commander: 'Dr. Elena Vasquez',
    basecamp: 'Station Polaris',
  },
  {
    id: 'EXP-002',
    name: 'Antarctic Deep Survey',
    startDate: '2026-10-01',
    endDate: '2027-03-15',
    location: 'Ross Ice Shelf, Antarctica',
    status: 'planning',
    description: 'Deep ice survey mission to map sub-glacial lakes and assess ice shelf stability.',
    objectives: ['Sub-glacial mapping', 'Ice thickness measurement', 'Seismic monitoring'],
    personnelCount: 35,
    cargoCount: 210,
    assetCount: 42,
    inventoryLevel: 92,
    emergencyCount: 0,
    commander: 'Cmdr. James Thornton',
    basecamp: 'McMurdo Forward Base',
  },
  {
    id: 'EXP-003',
    name: 'Nordic Ice Traverse',
    startDate: '2026-08-01',
    endDate: '2026-11-30',
    location: 'Greenland Ice Sheet',
    status: 'active',
    description: 'Cross-ice traverse expedition for climate research and equipment testing.',
    objectives: ['Ice traverse route mapping', 'Equipment endurance testing', 'Climate data collection'],
    personnelCount: 18,
    cargoCount: 95,
    assetCount: 22,
    inventoryLevel: 74,
    emergencyCount: 1,
    commander: 'Dr. Ingrid Svensson',
    basecamp: 'Camp Aurora',
  },
  {
    id: 'EXP-004',
    name: 'Polar Sentinel Watch',
    startDate: '2026-11-01',
    endDate: '2027-04-30',
    location: 'North Pole Drift Station',
    status: 'planning',
    description: 'Long-duration monitoring mission at a drift station near the geographic North Pole.',
    objectives: ['Ice drift monitoring', 'Ocean current measurement', 'Aurora observation'],
    personnelCount: 12,
    cargoCount: 68,
    assetCount: 15,
    inventoryLevel: 95,
    emergencyCount: 0,
    commander: 'Lt. Mikhail Petrov',
    basecamp: 'Drift Platform Omega',
  },
  {
    id: 'EXP-005',
    name: 'South Pole Relay',
    startDate: '2026-07-15',
    endDate: '2026-10-15',
    location: 'Amundsen-Scott Station',
    status: 'completed',
    description: 'Supply relay and infrastructure upgrade mission at the South Pole station.',
    objectives: ['Supply delivery', 'Communication upgrade', 'Solar array installation'],
    personnelCount: 22,
    cargoCount: 180,
    assetCount: 28,
    inventoryLevel: 100,
    emergencyCount: 0,
    commander: 'Capt. Sarah Mitchell',
    basecamp: 'Amundsen-Scott Station',
  },
];

// ---- PERSONNEL ----
export const personnel = [
  { id: 'P-001', name: 'Dr. Elena Vasquez', role: 'Expedition Commander', expeditionId: 'EXP-001', team: 'Command', status: 'active', location: 'Checkpoint Alpha', lastCheckIn: '2026-09-27T08:30:00Z', specialization: 'Glaciology', clearance: 'Level 5', contact: 'vasquez@polar-ops.org', avatar: null },
  { id: 'P-002', name: 'Sgt. Marcus Reed', role: 'Security Lead', expeditionId: 'EXP-001', team: 'Security', status: 'active', location: 'Base Camp Polaris', lastCheckIn: '2026-09-27T09:15:00Z', specialization: 'Arctic Security', clearance: 'Level 4', contact: 'reed@polar-ops.org', avatar: null },
  { id: 'P-003', name: 'Dr. Yuki Tanaka', role: 'Medical Officer', expeditionId: 'EXP-001', team: 'Medical', status: 'active', location: 'Medical Bay', lastCheckIn: '2026-09-27T07:45:00Z', specialization: 'Emergency Medicine', clearance: 'Level 4', contact: 'tanaka@polar-ops.org', avatar: null },
  { id: 'P-004', name: 'Erik Johansson', role: 'Logistics Coordinator', expeditionId: 'EXP-001', team: 'Logistics', status: 'active', location: 'Supply Depot', lastCheckIn: '2026-09-27T08:00:00Z', specialization: 'Supply Chain', clearance: 'Level 3', contact: 'johansson@polar-ops.org', avatar: null },
  { id: 'P-005', name: 'Dr. Amara Osei', role: 'Research Scientist', expeditionId: 'EXP-001', team: 'Science', status: 'in-field', location: 'Sampling Site Delta', lastCheckIn: '2026-09-27T06:30:00Z', specialization: 'Marine Biology', clearance: 'Level 3', contact: 'osei@polar-ops.org', avatar: null },
  { id: 'P-006', name: 'Pavel Kozlov', role: 'Pilot', expeditionId: 'EXP-001', team: 'Transport', status: 'active', location: 'Helipad', lastCheckIn: '2026-09-27T09:00:00Z', specialization: 'Arctic Aviation', clearance: 'Level 4', contact: 'kozlov@polar-ops.org', avatar: null },
  { id: 'P-007', name: 'Lisa Chen', role: 'Communications Officer', expeditionId: 'EXP-001', team: 'Command', status: 'active', location: 'Comms Center', lastCheckIn: '2026-09-27T09:30:00Z', specialization: 'Satellite Communications', clearance: 'Level 4', contact: 'chen@polar-ops.org', avatar: null },
  { id: 'P-008', name: 'Hans Mueller', role: 'Engineer', expeditionId: 'EXP-001', team: 'Engineering', status: 'active', location: 'Generator Room', lastCheckIn: '2026-09-27T08:15:00Z', specialization: 'Mechanical Engineering', clearance: 'Level 3', contact: 'mueller@polar-ops.org', avatar: null },
  { id: 'P-009', name: 'Cmdr. James Thornton', role: 'Expedition Commander', expeditionId: 'EXP-002', team: 'Command', status: 'standby', location: 'HQ - Planning Room', lastCheckIn: '2026-09-27T10:00:00Z', specialization: 'Naval Operations', clearance: 'Level 5', contact: 'thornton@polar-ops.org', avatar: null },
  { id: 'P-010', name: 'Dr. Ingrid Svensson', role: 'Expedition Commander', expeditionId: 'EXP-003', team: 'Command', status: 'active', location: 'Camp Aurora', lastCheckIn: '2026-09-27T07:00:00Z', specialization: 'Climate Science', clearance: 'Level 5', contact: 'svensson@polar-ops.org', avatar: null },
  { id: 'P-011', name: 'Tom Bradley', role: 'Field Technician', expeditionId: 'EXP-003', team: 'Engineering', status: 'in-field', location: 'Waypoint 7', lastCheckIn: '2026-09-27T05:30:00Z', specialization: 'Equipment Maintenance', clearance: 'Level 2', contact: 'bradley@polar-ops.org', avatar: null },
  { id: 'P-012', name: 'Natasha Ivanova', role: 'Meteorologist', expeditionId: 'EXP-001', team: 'Science', status: 'active', location: 'Weather Station', lastCheckIn: '2026-09-27T08:45:00Z', specialization: 'Polar Meteorology', clearance: 'Level 3', contact: 'ivanova@polar-ops.org', avatar: null },
];

// ---- CARGO ----
export const cargo = [
  { id: 'C-001', name: 'Scientific Equipment Crate A', expeditionId: 'EXP-001', type: 'Equipment', weight: '450 kg', status: 'delivered', origin: 'Tromsø, Norway', destination: 'Station Polaris', currentLocation: 'Station Polaris', priority: 'high', trackingTimeline: [
    { date: '2026-09-10', event: 'Dispatched from Tromsø warehouse', location: 'Tromsø, Norway' },
    { date: '2026-09-12', event: 'Loaded onto MV Arctic Pioneer', location: 'Tromsø Port' },
    { date: '2026-09-14', event: 'In transit - North Sea', location: 'North Sea' },
    { date: '2026-09-15', event: 'Arrived at Longyearbyen dock', location: 'Longyearbyen, Svalbard' },
    { date: '2026-09-16', event: 'Transferred to helicopter', location: 'Longyearbyen Heliport' },
    { date: '2026-09-16', event: 'Delivered to Station Polaris', location: 'Station Polaris' },
  ]},
  { id: 'C-002', name: 'Fuel Supply — Diesel 2000L', expeditionId: 'EXP-001', type: 'Fuel', weight: '1700 kg', status: 'in-transit', origin: 'Hammerfest, Norway', destination: 'Station Polaris', currentLocation: 'Barents Sea', priority: 'critical', trackingTimeline: [
    { date: '2026-09-22', event: 'Dispatched from Hammerfest depot', location: 'Hammerfest, Norway' },
    { date: '2026-09-23', event: 'Loaded onto fuel tanker', location: 'Hammerfest Port' },
    { date: '2026-09-25', event: 'In transit — Barents Sea', location: 'Barents Sea' },
  ]},
  { id: 'C-003', name: 'Food Supplies — Week 6-8', expeditionId: 'EXP-001', type: 'Provisions', weight: '800 kg', status: 'in-transit', origin: 'Oslo, Norway', destination: 'Station Polaris', currentLocation: 'Norwegian Sea', priority: 'high', trackingTimeline: [
    { date: '2026-09-20', event: 'Packed at Oslo logistics center', location: 'Oslo, Norway' },
    { date: '2026-09-21', event: 'Shipped via coastal route', location: 'Oslo Port' },
    { date: '2026-09-24', event: 'Passing Norwegian Sea', location: 'Norwegian Sea' },
  ]},
  { id: 'C-004', name: 'Medical Supply Kit B', expeditionId: 'EXP-001', type: 'Medical', weight: '120 kg', status: 'delivered', origin: 'Stockholm, Sweden', destination: 'Station Polaris', currentLocation: 'Station Polaris - Medical Bay', priority: 'critical', trackingTimeline: [
    { date: '2026-09-08', event: 'Dispatched from Stockholm', location: 'Stockholm, Sweden' },
    { date: '2026-09-11', event: 'Arrived via air freight', location: 'Longyearbyen Airport' },
    { date: '2026-09-12', event: 'Delivered to Medical Bay', location: 'Station Polaris' },
  ]},
  { id: 'C-005', name: 'Communication Relay Equipment', expeditionId: 'EXP-001', type: 'Equipment', weight: '350 kg', status: 'pending', origin: 'Helsinki, Finland', destination: 'Station Polaris', currentLocation: 'Helsinki Warehouse', priority: 'medium', trackingTimeline: [
    { date: '2026-09-25', event: 'Awaiting dispatch clearance', location: 'Helsinki, Finland' },
  ]},
  { id: 'C-006', name: 'Ice Core Drilling Rig Parts', expeditionId: 'EXP-003', type: 'Equipment', weight: '2200 kg', status: 'in-transit', origin: 'Reykjavik, Iceland', destination: 'Camp Aurora', currentLocation: 'Denmark Strait', priority: 'high', trackingTimeline: [
    { date: '2026-09-18', event: 'Loaded at Reykjavik port', location: 'Reykjavik, Iceland' },
    { date: '2026-09-20', event: 'Passing Denmark Strait', location: 'Denmark Strait' },
  ]},
  { id: 'C-007', name: 'Winter Gear — Personnel Kit', expeditionId: 'EXP-002', type: 'Clothing', weight: '500 kg', status: 'pending', origin: 'Christchurch, NZ', destination: 'McMurdo Forward Base', currentLocation: 'Christchurch Depot', priority: 'medium', trackingTimeline: [
    { date: '2026-09-26', event: 'Packed and ready for dispatch', location: 'Christchurch, NZ' },
  ]},
  { id: 'C-008', name: 'Solar Panel Array Pack', expeditionId: 'EXP-001', type: 'Equipment', weight: '680 kg', status: 'delivered', origin: 'Berlin, Germany', destination: 'Station Polaris', currentLocation: 'Station Polaris - Storage', priority: 'medium', trackingTimeline: [
    { date: '2026-09-05', event: 'Shipped from Berlin', location: 'Berlin, Germany' },
    { date: '2026-09-13', event: 'Delivered', location: 'Station Polaris' },
  ]},
];

// ---- INVENTORY ----
export const inventory = [
  { id: 'INV-001', name: 'Diesel Fuel', category: 'Fuel', expeditionId: 'EXP-001', quantity: 4500, unit: 'Liters', minThreshold: 2000, status: 'adequate', location: 'Fuel Depot A', lastUpdated: '2026-09-27' },
  { id: 'INV-002', name: 'Emergency Rations', category: 'Provisions', expeditionId: 'EXP-001', quantity: 320, unit: 'Packs', minThreshold: 100, status: 'adequate', location: 'Storage Bay 2', lastUpdated: '2026-09-26' },
  { id: 'INV-003', name: 'Medical Supplies', category: 'Medical', expeditionId: 'EXP-001', quantity: 85, unit: 'Kits', minThreshold: 30, status: 'adequate', location: 'Medical Bay', lastUpdated: '2026-09-27' },
  { id: 'INV-004', name: 'Ammunition — Flare', category: 'Safety', expeditionId: 'EXP-001', quantity: 48, unit: 'Rounds', minThreshold: 50, status: 'low', location: 'Armory', lastUpdated: '2026-09-25' },
  { id: 'INV-005', name: 'Batteries — Cold Weather', category: 'Electronics', expeditionId: 'EXP-001', quantity: 200, unit: 'Units', minThreshold: 80, status: 'adequate', location: 'Electronics Store', lastUpdated: '2026-09-26' },
  { id: 'INV-006', name: 'Rope — Climbing Grade', category: 'Equipment', expeditionId: 'EXP-001', quantity: 15, unit: 'Coils (50m)', minThreshold: 10, status: 'adequate', location: 'Equipment Bay', lastUpdated: '2026-09-24' },
  { id: 'INV-007', name: 'Water Purification Tablets', category: 'Provisions', expeditionId: 'EXP-003', quantity: 500, unit: 'Tablets', minThreshold: 200, status: 'adequate', location: 'Supply Tent', lastUpdated: '2026-09-26' },
  { id: 'INV-008', name: 'Satellite Phone Credits', category: 'Communications', expeditionId: 'EXP-001', quantity: 12, unit: 'Hours', minThreshold: 20, status: 'critical', location: 'Comms Center', lastUpdated: '2026-09-27' },
  { id: 'INV-009', name: 'Heating Oil', category: 'Fuel', expeditionId: 'EXP-003', quantity: 1800, unit: 'Liters', minThreshold: 1000, status: 'adequate', location: 'Camp Aurora Depot', lastUpdated: '2026-09-25' },
  { id: 'INV-010', name: 'First Aid Kits', category: 'Medical', expeditionId: 'EXP-002', quantity: 45, unit: 'Kits', minThreshold: 15, status: 'adequate', location: 'McMurdo Medical', lastUpdated: '2026-09-27' },
];

// ---- ASSETS ----
export const assets = [
  { id: 'AST-001', name: 'Snowcat SC-200', type: 'Vehicle', expeditionId: 'EXP-001', status: 'operational', location: 'Vehicle Bay', assignedTo: 'P-004', lastMaintenance: '2026-09-20', nextMaintenance: '2026-10-20', condition: 'good' },
  { id: 'AST-002', name: 'Bell 412 Helicopter', type: 'Aircraft', expeditionId: 'EXP-001', status: 'operational', location: 'Helipad', assignedTo: 'P-006', lastMaintenance: '2026-09-15', nextMaintenance: '2026-10-15', condition: 'excellent' },
  { id: 'AST-003', name: 'Ice Core Drill MK-IV', type: 'Equipment', expeditionId: 'EXP-001', status: 'operational', location: 'Drill Site Alpha', assignedTo: 'P-005', lastMaintenance: '2026-09-18', nextMaintenance: '2026-10-18', condition: 'good' },
  { id: 'AST-004', name: 'Satellite Uplink Terminal', type: 'Communications', expeditionId: 'EXP-001', status: 'operational', location: 'Comms Center', assignedTo: 'P-007', lastMaintenance: '2026-09-22', nextMaintenance: '2026-11-22', condition: 'excellent' },
  { id: 'AST-005', name: 'Emergency Sled — Rescue', type: 'Vehicle', expeditionId: 'EXP-001', status: 'standby', location: 'Vehicle Bay', assignedTo: null, lastMaintenance: '2026-09-10', nextMaintenance: '2026-10-10', condition: 'good' },
  { id: 'AST-006', name: 'Portable Weather Station', type: 'Equipment', expeditionId: 'EXP-001', status: 'deployed', location: 'Weather Station', assignedTo: 'P-012', lastMaintenance: '2026-09-12', nextMaintenance: '2026-10-12', condition: 'fair' },
  { id: 'AST-007', name: 'Zodiac Inflatable Boat', type: 'Vehicle', expeditionId: 'EXP-001', status: 'operational', location: 'Dock', assignedTo: null, lastMaintenance: '2026-09-08', nextMaintenance: '2026-10-08', condition: 'good' },
  { id: 'AST-008', name: 'Generator — 50kW Diesel', type: 'Power', expeditionId: 'EXP-001', status: 'operational', location: 'Generator Room', assignedTo: 'P-008', lastMaintenance: '2026-09-25', nextMaintenance: '2026-10-25', condition: 'good' },
  { id: 'AST-009', name: 'Tracked ATV — Explorer', type: 'Vehicle', expeditionId: 'EXP-003', status: 'operational', location: 'Camp Aurora', assignedTo: 'P-011', lastMaintenance: '2026-09-14', nextMaintenance: '2026-10-14', condition: 'fair' },
  { id: 'AST-010', name: 'ROV Submersible — Deep Ice', type: 'Equipment', expeditionId: 'EXP-002', status: 'standby', location: 'McMurdo Lab', assignedTo: null, lastMaintenance: '2026-09-20', nextMaintenance: '2026-11-20', condition: 'excellent' },
  { id: 'AST-021', name: 'Rescue Vehicle RV-3', type: 'Vehicle', expeditionId: 'EXP-001', status: 'standby', location: 'Near Checkpoint B', assignedTo: null, lastMaintenance: '2026-09-19', nextMaintenance: '2026-10-19', condition: 'good' },
];

// ---- EMERGENCIES ----
export const emergencies = [
  {
    id: 'EM-001',
    expeditionId: 'EXP-001',
    title: 'Personnel Medical Emergency',
    type: 'medical',
    severity: 'high',
    status: 'active',
    reportedAt: '2026-09-27T06:15:00Z',
    location: 'Checkpoint B',
    description: 'Dr. Osei reported frostbite symptoms during field sampling. Immediate medical attention and evacuation required.',
    personnelInvolved: ['P-005'],
    nearbyAssets: ['AST-021', 'AST-002'],
    relatedInventory: ['INV-003'],
    responders: ['P-003', 'P-006'],
    updates: [
      { time: '2026-09-27T06:15:00Z', message: 'Emergency reported by Dr. Osei via satellite phone' },
      { time: '2026-09-27T06:30:00Z', message: 'Medical team dispatched — Dr. Tanaka en route via helicopter' },
      { time: '2026-09-27T07:00:00Z', message: 'Helicopter arriving at Checkpoint B' },
      { time: '2026-09-27T07:15:00Z', message: 'Patient stabilized, preparing for evacuation to Medical Bay' },
    ],
  },
  {
    id: 'EM-002',
    expeditionId: 'EXP-001',
    title: 'Equipment Malfunction — Generator',
    type: 'equipment',
    severity: 'medium',
    status: 'resolved',
    reportedAt: '2026-09-25T14:00:00Z',
    location: 'Generator Room',
    description: 'Backup generator exhibited irregular voltage output. Primary generator remained operational.',
    personnelInvolved: ['P-008'],
    nearbyAssets: ['AST-008'],
    relatedInventory: [],
    responders: ['P-008'],
    updates: [
      { time: '2026-09-25T14:00:00Z', message: 'Irregular voltage detected by monitoring system' },
      { time: '2026-09-25T14:30:00Z', message: 'Hans Mueller investigating — primary generator unaffected' },
      { time: '2026-09-25T16:00:00Z', message: 'Faulty voltage regulator identified and replaced' },
      { time: '2026-09-25T17:00:00Z', message: 'Backup generator restored to full operation' },
    ],
  },
  {
    id: 'EM-003',
    expeditionId: 'EXP-003',
    title: 'Weather Alert — Blizzard Warning',
    type: 'weather',
    severity: 'high',
    status: 'monitoring',
    reportedAt: '2026-09-27T04:00:00Z',
    location: 'Camp Aurora - 50km radius',
    description: 'Severe blizzard warning issued for Greenland Ice Sheet. All field operations suspended. Personnel recalled to Camp Aurora.',
    personnelInvolved: ['P-010', 'P-011'],
    nearbyAssets: ['AST-009'],
    relatedInventory: ['INV-009'],
    responders: ['P-010'],
    updates: [
      { time: '2026-09-27T04:00:00Z', message: 'Weather service issued blizzard warning for region' },
      { time: '2026-09-27T04:30:00Z', message: 'All field operations suspended by Commander Svensson' },
      { time: '2026-09-27T05:00:00Z', message: 'Tom Bradley recalled from Waypoint 7 — ETA 2 hours' },
      { time: '2026-09-27T07:30:00Z', message: 'All personnel confirmed at Camp Aurora. Monitoring weather.' },
    ],
  },
];

// ---- TEAMS ----
export const teams = [
  { id: 'T-001', name: 'Command', expeditionId: 'EXP-001', lead: 'P-001', members: ['P-001', 'P-007'] },
  { id: 'T-002', name: 'Security', expeditionId: 'EXP-001', lead: 'P-002', members: ['P-002'] },
  { id: 'T-003', name: 'Medical', expeditionId: 'EXP-001', lead: 'P-003', members: ['P-003'] },
  { id: 'T-004', name: 'Logistics', expeditionId: 'EXP-001', lead: 'P-004', members: ['P-004'] },
  { id: 'T-005', name: 'Science', expeditionId: 'EXP-001', lead: 'P-005', members: ['P-005', 'P-012'] },
  { id: 'T-006', name: 'Transport', expeditionId: 'EXP-001', lead: 'P-006', members: ['P-006'] },
  { id: 'T-007', name: 'Engineering', expeditionId: 'EXP-001', lead: 'P-008', members: ['P-008'] },
];

// ---- ALERTS ----
export const alerts = [
  { id: 'ALR-001', type: 'emergency', message: 'Medical emergency at Checkpoint B — Evacuation in progress', time: '2026-09-27T06:15:00Z', expeditionId: 'EXP-001', read: false },
  { id: 'ALR-002', type: 'weather', message: 'Blizzard warning issued for Greenland Ice Sheet region', time: '2026-09-27T04:00:00Z', expeditionId: 'EXP-003', read: false },
  { id: 'ALR-003', type: 'inventory', message: 'Low stock alert: Flare ammunition below threshold', time: '2026-09-26T18:00:00Z', expeditionId: 'EXP-001', read: true },
  { id: 'ALR-004', type: 'inventory', message: 'Critical: Satellite phone credits running low', time: '2026-09-27T08:00:00Z', expeditionId: 'EXP-001', read: false },
  { id: 'ALR-005', type: 'cargo', message: 'Fuel supply C-002 delayed — revised ETA 2 days', time: '2026-09-26T12:00:00Z', expeditionId: 'EXP-001', read: true },
  { id: 'ALR-006', type: 'maintenance', message: 'Scheduled maintenance due for Emergency Sled AST-005', time: '2026-09-27T09:00:00Z', expeditionId: 'EXP-001', read: false },
];

// ---- HELPER FUNCTIONS ----
export const getExpeditionById = (id) => expeditions.find(e => e.id === id);
export const getPersonnelByExpedition = (expId) => personnel.filter(p => p.expeditionId === expId);
export const getCargoByExpedition = (expId) => cargo.filter(c => c.expeditionId === expId);
export const getInventoryByExpedition = (expId) => inventory.filter(i => i.expeditionId === expId);
export const getAssetsByExpedition = (expId) => assets.filter(a => a.expeditionId === expId);
export const getEmergenciesByExpedition = (expId) => emergencies.filter(e => e.expeditionId === expId);
export const getPersonnelById = (id) => personnel.find(p => p.id === id);
export const getCargoById = (id) => cargo.find(c => c.id === id);
export const getInventoryById = (id) => inventory.find(i => i.id === id);
export const getAssetById = (id) => assets.find(a => a.id === id);
export const getEmergencyById = (id) => emergencies.find(e => e.id === id);
export const getAlertsByExpedition = (expId) => alerts.filter(a => a.expeditionId === expId);
export const getUnreadAlerts = () => alerts.filter(a => !a.read);
