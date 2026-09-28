import { useState, useEffect } from 'react';
import { Map, Package, Users, Settings2, AlertTriangle, Box, Activity, Clock } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import type { Alert, EmergencyEvent } from '../lib/types';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { organization, user } = useAuth();
  
  // Operations KPIs
  const [activeExpeditions, setActiveExpeditions] = useState(0);
  const [cargoInTransit, setCargoInTransit] = useState(0);
  const [delayedCargo, setDelayedCargo] = useState(0);

  // Resources KPIs
  const [lowInventory, setLowInventory] = useState(0);
  const [criticalInventory, setCriticalInventory] = useState(0);
  const [maintenanceAssets, setMaintenanceAssets] = useState(0);

  // Personnel KPIs
  const [personnelDeployed, setPersonnelDeployed] = useState(0);
  const [personnelOnStation, setPersonnelOnStation] = useState(0);
  const [personnelInTransit, setPersonnelInTransit] = useState(0);
  const [personnelInEmergency, setPersonnelInEmergency] = useState(0);

  // Risk KPIs
  const [criticalAlertsCount, setCriticalAlertsCount] = useState(0);

  // Lists for overview
  const [criticalAlertsList, setCriticalAlertsList] = useState<Alert[]>([]);
  const [activeEmergenciesList, setActiveEmergenciesList] = useState<EmergencyEvent[]>([]);
  
  // Distribution Stats
  const [cargoDistribution, setCargoDistribution] = useState<Record<string, number>>({});
  const [inventoryHealth, setInventoryHealth] = useState<Record<string, number>>({});
  const [assetStatus, setAssetStatus] = useState<Record<string, number>>({});

  useEffect(() => { const loadAsync = async () => {
    if (organization && user) {
      // 0. Trigger Rule-Based Risk Engine
      try {
        await api.evaluateRisks(organization.id, user);
      } catch (err) {
        console.error('Risk evaluation engine failed:', err);
      }

      // 1. Expeditions
      const exps = await api.getExpeditions(organization.id);
      setActiveExpeditions(exps.filter(e => e.status !== 'COMPLETED' && e.status !== 'CANCELLED').length);

      // 2. Cargo
      const allCargo = await api.getCargoList(organization.id);
      setCargoInTransit(allCargo.filter(c => c.status === 'IN_TRANSIT').length);
      setDelayedCargo(allCargo.filter(c => c.status === 'DELAYED').length);
      
      const cargoDist: Record<string, number> = {};
      allCargo.forEach(c => {
        cargoDist[c.status] = (cargoDist[c.status] || 0) + 1;
      });
      setCargoDistribution(cargoDist);

      // 3. Resources (Inventory & Assets)
      const allInventory = await api.getInventoryItems(organization.id);
      setLowInventory(allInventory.filter(i => i.status === 'LOW').length);
      setCriticalInventory(allInventory.filter(i => i.status === 'CRITICAL' || i.status === 'OUT_OF_STOCK').length);
      
      const invDist: Record<string, number> = {};
      allInventory.forEach(i => {
        invDist[i.status] = (invDist[i.status] || 0) + 1;
      });
      setInventoryHealth(invDist);

      const allAssets = await api.getAssets(organization.id);
      setMaintenanceAssets(allAssets.filter(a => a.status === 'MAINTENANCE_DUE' || a.status === 'DAMAGED').length);
      
      const assetDist: Record<string, number> = {};
      allAssets.forEach(a => {
        assetDist[a.status] = (assetDist[a.status] || 0) + 1;
      });
      setAssetStatus(assetDist);

      // 4. Personnel
      const allPersonnel = await api.getPersonnel(organization.id);
      setPersonnelDeployed(allPersonnel.filter(p => p.status === 'DEPLOYED').length);
      setPersonnelOnStation(allPersonnel.filter(p => p.status === 'ON_STATION').length);
      setPersonnelInTransit(allPersonnel.filter(p => p.status === 'IN_TRANSIT').length);
      setPersonnelInEmergency(allPersonnel.filter(p => p.status === 'EMERGENCY').length); 

      // 5. Risk & Alerts
      const allAlerts = await api.getAlerts(organization.id);
      
      const criticals = allAlerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED' && a.status !== 'DISMISSED');
      setCriticalAlertsCount(criticals.length);
      setCriticalAlertsList(criticals);
      
      const allEmergencies = await api.getEmergencyEvents(organization.id);
      const activeEmg = allEmergencies.filter(e => e.status !== 'RESOLVED' && e.status !== 'CANCELLED');
      setActiveEmergenciesList(activeEmg);
    }
  }; loadAsync(); }, [organization]);

  const KPICard = ({ title, value, icon, link, colorCls = 'kpi-icon-primary', bgColor = '' }: any) => (
    <Link to={link} className="card kpi-card hover:shadow-md transition-shadow" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className={`kpi-icon-wrap ${colorCls}`} style={bgColor ? { backgroundColor: bgColor.bg, color: bgColor.text } : {}}>
        {icon}
      </div>
      <div>
        <div className="text-sm text-muted font-semibold uppercase">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </Link>
  );

  const isExpeditionManager = ['Expedition Manager', 'Personnel Officer', 'Emergency Response Officer', 'ADMIN'].includes(user?.role || '');
  const isStationOfficer = ['Logistics Officer', 'Inventory & Asset Officer', 'ADMIN'].includes(user?.role || '');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Mission Control</h1>
        <p className="text-muted">Unified operational overview of your polar expedition activities for {organization?.name}.</p>
      </div>

      {activeEmergenciesList.length > 0 && isExpeditionManager && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <Activity size={24} />
            </div>
            <div>
              <div className="font-bold text-red-900">Active Emergencies Detected</div>
              <div className="text-sm text-red-700">{activeEmergenciesList.length} emergency event(s) require immediate attention.</div>
            </div>
          </div>
          <Link to="/emergency" className="btn btn-primary" style={{ backgroundColor: 'var(--color-critical)' }}>View Emergencies</Link>
        </div>
      )}

      {/* Operations & Risk KPIs (Expedition Managers) */}
      {isExpeditionManager && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Map size={20}/> Operations & Risk</h2>
          <div className="kpi-grid">
            <KPICard title="Active Expeditions" value={activeExpeditions} icon={<Map size={24}/>} link="/expeditions" />
            <KPICard title="Cargo In Transit" value={cargoInTransit} icon={<Package size={24}/>} link="/cargo" colorCls="kpi-icon-secondary" />
            <KPICard title="Delayed Cargo" value={delayedCargo} icon={<Clock size={24}/>} link="/cargo" colorCls="kpi-icon-warning" />
            <KPICard title="Critical Alerts" value={criticalAlertsCount} icon={<AlertTriangle size={24}/>} link="/emergency" bgColor={{bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444'}} />
          </div>
        </div>
      )}

      {/* Resources & Assets KPIs (Station Officers) */}
      {isStationOfficer && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Box size={20}/> Resources & Facilities</h2>
          <div className="kpi-grid">
            <KPICard title="Critical Inventory" value={criticalInventory} icon={<AlertTriangle size={24}/>} link="/inventory" colorCls="kpi-icon-critical" />
            <KPICard title="Low Inventory" value={lowInventory} icon={<Box size={24}/>} link="/inventory" colorCls="kpi-icon-warning" />
            <KPICard title="Maint. Required" value={maintenanceAssets} icon={<Settings2 size={24}/>} link="/inventory" colorCls="kpi-icon-accent" />
            <KPICard title="Total Assets" value={Object.values(assetStatus).reduce((a,b)=>a+b,0)} icon={<Settings2 size={24}/>} link="/inventory" colorCls="kpi-icon-primary" />
          </div>
        </div>
      )}

      {criticalAlertsList.length > 0 && isExpeditionManager && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-critical)' }}>
            <AlertTriangle size={20} /> Critical Operational Alerts
          </h2>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {criticalAlertsList.map(alert => (
              <div key={alert.id} className="card border-l-4" style={{ borderLeftColor: 'var(--color-critical)', padding: '1rem 1.5rem' }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm text-critical uppercase">{alert.severity}</h3>
                  <div className="text-xs font-bold px-2 py-1 bg-red-100 text-red-800 rounded">Risk: {alert.risk_score}</div>
                </div>
                <div className="font-semibold mb-1">{alert.title}</div>
                <div className="text-xs text-muted mb-3">{alert.alert_code} • {alert.expedition_id ? 'Assigned Expedition' : 'General'}</div>
                <Link to={`/emergency/${alert.id}`} className="btn btn-outline btn-sm w-full">View Alert</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Operational Overview Distributions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity size={20}/> Detailed Breakdown</h2>
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          
          <div className="card">
            <h3 className="font-bold text-sm mb-4 border-b pb-2 uppercase text-muted">Cargo Status</h3>
            <div className="space-y-2">
              {Object.entries(cargoDistribution).map(([status, count]) => (
                <div key={status} className="flex justify-between text-sm">
                  <span className="capitalize">{status.replace(/_/g, ' ').toLowerCase()}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
              {Object.keys(cargoDistribution).length === 0 && <div className="text-sm text-muted">No cargo data</div>}
            </div>
          </div>

          {isStationOfficer && (
            <>
              <div className="card">
                <h3 className="font-bold text-sm mb-4 border-b pb-2 uppercase text-muted">Inventory Health</h3>
                <div className="space-y-2">
                  {Object.entries(inventoryHealth).map(([status, count]) => (
                    <div key={status} className="flex justify-between text-sm">
                      <span className="capitalize">{status.replace(/_/g, ' ').toLowerCase()}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                  {Object.keys(inventoryHealth).length === 0 && <div className="text-sm text-muted">No inventory data</div>}
                </div>
              </div>

              <div className="card">
                <h3 className="font-bold text-sm mb-4 border-b pb-2 uppercase text-muted">Asset Readiness</h3>
                <div className="space-y-2">
                  {Object.entries(assetStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between text-sm">
                      <span className="capitalize">{status.replace(/_/g, ' ').toLowerCase()}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                  {Object.keys(assetStatus).length === 0 && <div className="text-sm text-muted">No asset data</div>}
                </div>
              </div>
            </>
          )}

          {isExpeditionManager && (
            <div className="card">
              <h3 className="font-bold text-sm mb-4 border-b pb-2 uppercase text-muted">Personnel Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Deployed</span><span className="font-semibold">{personnelDeployed}</span></div>
                <div className="flex justify-between"><span>On Station</span><span className="font-semibold">{personnelOnStation}</span></div>
                <div className="flex justify-between"><span>In Transit</span><span className="font-semibold">{personnelInTransit}</span></div>
                <div className="flex justify-between"><span>Emergency</span><span className="font-semibold text-critical">{personnelInEmergency}</span></div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
