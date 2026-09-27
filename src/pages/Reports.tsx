import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import { FileText, Download } from 'lucide-react';
import type { Expedition, Cargo, InventoryItem, Asset, Alert } from '../lib/types';

export function Reports() {
  const { organization } = useAuth();
  
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [cargo, setCargo] = useState<Cargo[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => { const loadAsync = async () => {
    if (organization) {
      setExpeditions(await api.getExpeditions(organization.id));
      setCargo(await api.getCargoList(organization.id));
      setInventory(await api.getInventoryItems(organization.id));
      setAssets(await api.getAssets(organization.id));
      setAlerts(await api.getAlerts(organization.id));
    }
  }; loadAsync(); }, [organization]);

  const exportCSV = (filename: string, headers: string[], rows: any[][]) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExpeditions = () => {
    const headers = ['Expedition Code', 'Name', 'Status', 'Origin', 'Destination', 'Start Date', 'End Date'];
    const rows = expeditions.map(e => [e.expedition_code, `"${e.name}"`, e.status, `"${e.origin}"`, `"${e.destination}"`, e.start_date, e.expected_arrival]);
    exportCSV('expedition_report.csv', headers, rows);
  };

  const handleExportLogistics = () => {
    const headers = ['Cargo Code', 'Name', 'Category', 'Status', 'Priority', 'Expedition ID'];
    const rows = cargo.map(c => [c.cargo_code, `"${c.name}"`, c.category, c.status, c.priority, c.expedition_id || 'N/A']);
    exportCSV('logistics_report.csv', headers, rows);
  };

  const handleExportResources = () => {
    const headers = ['Item Code', 'Name', 'Category', 'Quantity', 'Status', 'Station'];
    const rows = inventory.map(i => [i.item_code, `"${i.name}"`, i.category, i.quantity, i.status, `"${i.station}"`]);
    exportCSV('resource_readiness_report.csv', headers, rows);
  };

  const handleExportRisk = () => {
    const headers = ['Alert Code', 'Title', 'Severity', 'Status', 'Risk Score', 'Source'];
    const rows = alerts.map(a => [a.alert_code, `"${a.title}"`, a.severity, a.status, a.risk_score, `${a.source_entity_type}:${a.source_entity_id}`]);
    exportCSV('risk_incident_report.csv', headers, rows);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Reports</h1>
        <p className="text-muted">Export operational data and intelligence reports.</p>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        
        <div className="card flex flex-col justify-between">
          <div>
            <h2 className="card-title mb-2 flex items-center gap-2"><FileText size={20} className="text-primary"/> Expedition Report</h2>
            <p className="text-sm text-muted mb-4">Summary of all active, planned, and completed expeditions including dates and routing.</p>
            <ul className="text-sm space-y-1 mb-6 text-muted">
              <li>Total Expeditions: {expeditions.length}</li>
              <li>Active: {expeditions.filter(e => e.status === 'ACTIVE').length}</li>
            </ul>
          </div>
          <button className="btn btn-outline w-full flex justify-center gap-2" onClick={handleExportExpeditions}>
            <Download size={16}/> Export CSV
          </button>
        </div>

        <div className="card flex flex-col justify-between">
          <div>
            <h2 className="card-title mb-2 flex items-center gap-2"><FileText size={20} className="text-primary"/> Logistics Report</h2>
            <p className="text-sm text-muted mb-4">Complete breakdown of cargo manifest, transit statuses, and critical logistics movements.</p>
            <ul className="text-sm space-y-1 mb-6 text-muted">
              <li>Total Cargo: {cargo.length}</li>
              <li>In Transit: {cargo.filter(c => c.status === 'IN_TRANSIT').length}</li>
              <li>Delayed: {cargo.filter(c => c.status === 'DELAYED').length}</li>
            </ul>
          </div>
          <button className="btn btn-outline w-full flex justify-center gap-2" onClick={handleExportLogistics}>
            <Download size={16}/> Export CSV
          </button>
        </div>

        <div className="card flex flex-col justify-between">
          <div>
            <h2 className="card-title mb-2 flex items-center gap-2"><FileText size={20} className="text-primary"/> Resource Readiness</h2>
            <p className="text-sm text-muted mb-4">Inventory health, critical shortages, and asset maintenance statuses across all stations.</p>
            <ul className="text-sm space-y-1 mb-6 text-muted">
              <li>Tracked Inventory: {inventory.length} items</li>
              <li>Critical Stock: {inventory.filter(i => i.status === 'CRITICAL' || i.status === 'OUT_OF_STOCK').length} items</li>
              <li>Tracked Assets: {assets.length} assets</li>
            </ul>
          </div>
          <button className="btn btn-outline w-full flex justify-center gap-2" onClick={handleExportResources}>
            <Download size={16}/> Export CSV
          </button>
        </div>

        <div className="card flex flex-col justify-between">
          <div>
            <h2 className="card-title mb-2 flex items-center gap-2"><FileText size={20} className="text-primary"/> Risk & Incident Report</h2>
            <p className="text-sm text-muted mb-4">Historical and active alerts, risk scores, emergency events, and system recommendations.</p>
            <ul className="text-sm space-y-1 mb-6 text-muted">
              <li>Total Alerts: {alerts.length}</li>
              <li>Critical Alerts: {alerts.filter(a => a.severity === 'CRITICAL').length}</li>
            </ul>
          </div>
          <button className="btn btn-outline w-full flex justify-center gap-2" onClick={handleExportRisk}>
            <Download size={16}/> Export CSV
          </button>
        </div>

      </div>
    </div>
  );
}
