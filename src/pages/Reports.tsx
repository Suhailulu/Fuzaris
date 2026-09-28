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
  
  // Custom Query State
  const [queryEntity, setQueryEntity] = useState('cargo');
  const [queryStatus, setQueryStatus] = useState('');
  const [queryExpedition, setQueryExpedition] = useState('');
  const [queryResultsCount, setQueryResultsCount] = useState<number | null>(null);
  const [queryResults, setQueryResults] = useState<any[]>([]);

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

  const executeCustomQuery = () => {
    let results: any[] = [];
    if (queryEntity === 'cargo') {
      let filtered = cargo;
      if (queryStatus) filtered = filtered.filter(c => c.status === queryStatus);
      if (queryExpedition) filtered = filtered.filter(c => c.expedition_id === queryExpedition);
      results = filtered;
    } else if (queryEntity === 'inventory') {
      let filtered = inventory;
      if (queryStatus) {
        if (queryStatus === 'CRITICAL') {
           filtered = filtered.filter(i => i.status === 'CRITICAL' || i.status === 'OUT_OF_STOCK');
        } else {
           filtered = filtered.filter(i => i.status === queryStatus);
        }
      }
      if (queryExpedition) filtered = filtered.filter(i => i.assigned_expedition_id === queryExpedition);
      results = filtered;
    } else if (queryEntity === 'alerts') {
      let filtered = alerts;
      if (queryStatus) filtered = filtered.filter(a => a.status === queryStatus);
      if (queryExpedition) filtered = filtered.filter(a => a.expedition_id === queryExpedition);
      results = filtered;
    }
    setQueryResults(results);
    setQueryResultsCount(results.length);
  };

  const handleExportCustom = () => {
    if (queryResults.length === 0) return;
    
    if (queryEntity === 'cargo') {
      const headers = ['Cargo Code', 'Name', 'Category', 'Status', 'Expedition ID'];
      const rows = queryResults.map(c => [c.cargo_code, `"${c.name}"`, c.category, c.status, c.expedition_id || 'N/A']);
      exportCSV(`custom_cargo_report_${new Date().getTime()}.csv`, headers, rows);
    } else if (queryEntity === 'inventory') {
      const headers = ['Item Code', 'Name', 'Category', 'Quantity', 'Status', 'Station'];
      const rows = queryResults.map(i => [i.item_code, `"${i.name}"`, i.category, i.quantity, i.status, `"${i.station}"`]);
      exportCSV(`custom_inventory_report_${new Date().getTime()}.csv`, headers, rows);
    } else if (queryEntity === 'alerts') {
      const headers = ['Alert Code', 'Title', 'Severity', 'Status', 'Risk Score'];
      const rows = queryResults.map(a => [a.alert_code, `"${a.title}"`, a.severity, a.status, a.risk_score]);
      exportCSV(`custom_alerts_report_${new Date().getTime()}.csv`, headers, rows);
    }
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
              <li>Active: {expeditions.filter(e => e.status === 'DEPLOYED' || e.status === 'ON_STATION').length}</li>
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

      <div className="card mt-8">
        <h2 className="text-xl font-bold mb-6">Custom Query Builder</h2>
        <div className="grid gap-4 items-end" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          
          <div className="form-group mb-0">
            <label className="form-label">Data Entity</label>
            <select className="form-input" value={queryEntity} onChange={e => {setQueryEntity(e.target.value); setQueryResultsCount(null);}}>
              <option value="cargo">Cargo Manifest</option>
              <option value="inventory">Inventory & Resources</option>
              <option value="alerts">Emergency Alerts</option>
            </select>
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Filter by Status</label>
            <select className="form-input" value={queryStatus} onChange={e => setQueryStatus(e.target.value)}>
              <option value="">-- Any Status --</option>
              {queryEntity === 'cargo' && (
                <>
                  <option value="DELAYED">Delayed</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="PLANNED">Planned</option>
                </>
              )}
              {queryEntity === 'inventory' && (
                <>
                  <option value="CRITICAL">Critical / Out of Stock</option>
                  <option value="LOW">Low Stock</option>
                  <option value="HEALTHY">Healthy</option>
                </>
              )}
              {queryEntity === 'alerts' && (
                <>
                  <option value="OPEN">Open</option>
                  <option value="RESOLVED">Resolved</option>
                </>
              )}
            </select>
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Filter by Expedition</label>
            <select className="form-input" value={queryExpedition} onChange={e => setQueryExpedition(e.target.value)}>
              <option value="">-- All Expeditions --</option>
              {expeditions.map(e => (
                <option key={e.id} value={e.id}>{e.expedition_code}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={executeCustomQuery}>
              Run Query
            </button>
            {queryResultsCount !== null && (
              <button className="btn btn-outline flex items-center gap-2" onClick={handleExportCustom} disabled={queryResultsCount === 0}>
                <Download size={16} /> Export CSV
              </button>
            )}
          </div>
        </div>

        {queryResultsCount !== null && (
          <div className="mt-6">
            <div className="p-4 rounded bg-blue-50 border border-blue-100 flex items-center justify-between mb-4">
              <div className="text-blue-900 font-semibold">
                Found {queryResultsCount} matching records in {queryEntity}.
              </div>
            </div>
            
            {queryResultsCount > 0 && (
              <div className="table-container shadow-sm border border-gray-100 rounded-lg overflow-hidden">
                <table className="table w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {queryEntity === 'cargo' && (
                        <>
                          <th className="text-left p-3 text-sm font-semibold text-gray-600">Cargo Code</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-600">Name</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-600">Category</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
                        </>
                      )}
                      {queryEntity === 'inventory' && (
                        <>
                          <th className="text-left p-3 text-sm font-semibold text-gray-600">Item Code</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-600">Name</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-600">Quantity</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-600">Station</th>
                        </>
                      )}
                      {queryEntity === 'alerts' && (
                        <>
                          <th className="text-left p-3 text-sm font-semibold text-gray-600">Alert Code</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-600">Title</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-600">Severity</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResults.map((row, idx) => (
                      <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {queryEntity === 'cargo' && (
                          <>
                            <td className="p-3 font-semibold text-sm">{row.cargo_code}</td>
                            <td className="p-3 text-sm">{row.name}</td>
                            <td className="p-3 text-sm">{row.category}</td>
                            <td className="p-3 text-sm"><span className="badge">{row.status}</span></td>
                          </>
                        )}
                        {queryEntity === 'inventory' && (
                          <>
                            <td className="p-3 font-semibold text-sm">{row.item_code}</td>
                            <td className="p-3 text-sm">{row.name}</td>
                            <td className="p-3 text-sm">{row.quantity} {row.unit}</td>
                            <td className="p-3 text-sm"><span className="badge">{row.status}</span></td>
                            <td className="p-3 text-sm">{row.station}</td>
                          </>
                        )}
                        {queryEntity === 'alerts' && (
                          <>
                            <td className="p-3 font-semibold text-sm">{row.alert_code}</td>
                            <td className="p-3 text-sm">{row.title}</td>
                            <td className="p-3 text-sm">{row.severity}</td>
                            <td className="p-3 text-sm"><span className="badge">{row.status}</span></td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
