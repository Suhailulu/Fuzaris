import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import type { Personnel, Expedition, LocationRecord, Cargo, Asset, Alert } from '../lib/types';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers } from 'lucide-react';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix Leaflet's default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customMarkerIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.5);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

export function OperationsMap() {
  const { organization } = useAuth();
  
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [cargo, setCargo] = useState<Cargo[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  const [layers, setLayers] = useState({ locations: true, expeditions: true, cargo: true, assets: true, personnel: true, alerts: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => { const loadAsync = async () => {
    if (organization) {
      setLocations(await api.getLocations(organization.id));
      setExpeditions(await api.getExpeditions(organization.id));
      setCargo(await api.getCargoList(organization.id));
      setAssets(await api.getAssets(organization.id));
      setPersonnel(await api.getPersonnel(organization.id));
      setAlerts((await api.getAlerts(organization.id)).filter(a => a.status !== 'RESOLVED' && a.status !== 'DISMISSED'));
      setLoading(false);
    }
  }; loadAsync(); }, [organization]);

  const getLocationCoords = (locName: string): [number, number] | null => {
    const loc = locations.find(l => l.name === locName);
    if (loc && loc.latitude && loc.longitude) return [loc.latitude, loc.longitude];
    return null;
  };

  if (loading) return <div className="p-8">Loading map data...</div>;

  const center: [number, number] = locations.length > 0 ? [locations[0].latitude, locations[0].longitude] : [0, 0];

  return (
    <div className="h-full flex flex-col" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Operations Map</h1>
          <p className="text-muted">Live visualization of all expeditions, cargo, assets, and personnel.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-4" style={{ height: '600px' }}>
        
        {/* Filters Panel */}
        <div className="card w-64 shrink-0 overflow-y-auto" style={{ padding: '1.5rem' }}>
          <h3 className="font-bold flex items-center gap-2 mb-4"><Layers size={18} /> Map Layers</h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={layers.locations} onChange={e => setLayers({...layers, locations: e.target.checked})} />
              <div className="flex items-center gap-2"><div style={{ width:10, height:10, borderRadius:'50%', backgroundColor:'#475569' }}></div> Locations</div>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={layers.expeditions} onChange={e => setLayers({...layers, expeditions: e.target.checked})} />
              <div className="flex items-center gap-2"><div style={{ width:10, height:10, borderRadius:'50%', backgroundColor:'#3b82f6' }}></div> Expeditions (Routes)</div>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={layers.cargo} onChange={e => setLayers({...layers, cargo: e.target.checked})} />
              <div className="flex items-center gap-2"><div style={{ width:10, height:10, borderRadius:'50%', backgroundColor:'#f59e0b' }}></div> Cargo</div>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={layers.assets} onChange={e => setLayers({...layers, assets: e.target.checked})} />
              <div className="flex items-center gap-2"><div style={{ width:10, height:10, borderRadius:'50%', backgroundColor:'#8b5cf6' }}></div> Assets</div>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={layers.personnel} onChange={e => setLayers({...layers, personnel: e.target.checked})} />
              <div className="flex items-center gap-2"><div style={{ width:10, height:10, borderRadius:'50%', backgroundColor:'#10b981' }}></div> Personnel</div>
            </label>
            <label className="flex items-center gap-2 cursor-pointer mt-4 pt-4 border-t border-gray-200">
              <input type="checkbox" checked={layers.alerts} onChange={e => setLayers({...layers, alerts: e.target.checked})} />
              <div className="flex items-center gap-2"><div style={{ width:12, height:12, borderRadius:'50%', backgroundColor:'#ef4444', animation: 'pulse 2s infinite' }}></div> Active Alerts</div>
            </label>
          </div>
        </div>

        {/* Map Container */}
        <div className="card flex-1 p-0 overflow-hidden relative z-0">
          <MapContainer center={center} zoom={3} style={{ height: '100%', width: '100%', borderRadius: '8px' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render Locations */}
            {layers.locations && locations.map(loc => (
              <Marker key={`loc-${loc.id}`} position={[loc.latitude, loc.longitude]} icon={customMarkerIcon('#475569')}>
                <Popup>
                  <div className="font-bold">{loc.name}</div>
                  <div className="text-xs text-muted mb-2">{loc.location_type.replace('_', ' ')}</div>
                  <div className="text-xs">{loc.description}</div>
                </Popup>
              </Marker>
            ))}

            {/* Render Cargo */}
            {layers.cargo && cargo.map(c => {
              const coords = getLocationCoords(c.current_location);
              if (!coords) return null;
              return (
                <Marker key={`cargo-${c.id}`} position={[coords[0] + (Math.random() * 0.02 - 0.01), coords[1] + (Math.random() * 0.02 - 0.01)]} icon={customMarkerIcon('#f59e0b')}>
                  <Popup>
                    <div className="font-bold">{c.cargo_code}</div>
                    <div className="text-sm mb-2">{c.name}</div>
                    <div className="text-xs">Status: {c.status.replace('_', ' ')}</div>
                    <div className="text-xs">Priority: {c.priority}</div>
                    <div className="text-xs mb-2">Location: {c.current_location}</div>
                    <Link to={`/cargo/${c.id}`} className="text-xs text-primary hover:underline">View Details</Link>
                  </Popup>
                </Marker>
              );
            })}

            {/* Render Assets */}
            {layers.assets && assets.map(a => {
              const coords = getLocationCoords(a.location);
              if (!coords) return null;
              return (
                <Marker key={`asset-${a.id}`} position={[coords[0] + (Math.random() * 0.02 - 0.01), coords[1] + (Math.random() * 0.02 - 0.01)]} icon={customMarkerIcon('#8b5cf6')}>
                  <Popup>
                    <div className="font-bold">{a.asset_code}</div>
                    <div className="text-sm mb-2">{a.name}</div>
                    <div className="text-xs">Status: {a.status.replace('_', ' ')}</div>
                    <div className="text-xs">Condition: {a.condition}</div>
                    <div className="text-xs mb-2">Location: {a.location}</div>
                    <Link to={`/assets/${a.id}`} className="text-xs text-primary hover:underline">View Details</Link>
                  </Popup>
                </Marker>
              );
            })}

            {/* Render Personnel */}
            {layers.personnel && personnel.map(p => {
              const coords = getLocationCoords(p.current_location);
              if (!coords) return null;
              return (
                <Marker key={`personnel-${p.id}`} position={[coords[0] + (Math.random() * 0.02 - 0.01), coords[1] + (Math.random() * 0.02 - 0.01)]} icon={customMarkerIcon('#10b981')}>
                  <Popup>
                    <div className="font-bold">{p.personnel_code}</div>
                    <div className="text-sm mb-2">{p.full_name}</div>
                    <div className="text-xs">Role: {p.role}</div>
                    <div className="text-xs">Status: {p.status.replace('_', ' ')}</div>
                    <div className="text-xs mb-2">Location: {p.current_location}</div>
                    <Link to={`/personnel/${p.id}`} className="text-xs text-primary hover:underline">View Details</Link>
                  </Popup>
                </Marker>
              );
            })}

            {/* Render Expedition Routes */}
            {layers.expeditions && expeditions.map(exp => {
              const startCoords = getLocationCoords(exp.origin);
              const endCoords = getLocationCoords(exp.destination);
              if (startCoords && endCoords) {
                return (
                  <Polyline key={`exp-${exp.id}`} positions={[startCoords, endCoords]} color="#3b82f6" weight={3} opacity={0.7} dashArray="5, 10">
                    <Popup>
                      <div className="font-bold">{exp.expedition_code}</div>
                      <div className="text-xs mb-1">{exp.origin} → {exp.destination}</div>
                      <div className="text-xs">Status: {exp.status}</div>
                      <Link to={`/expeditions/${exp.id}`} className="text-xs text-primary hover:underline">View Details</Link>
                    </Popup>
                  </Polyline>
                );
              }
              return null;
            })}

            {/* Render Alerts */}
            {layers.alerts && alerts.map(a => {
              if (!a.location_id) return null;
              const coords = getLocationCoords(a.location_id);
              if (!coords) return null;
              
              const isCritical = a.severity === 'CRITICAL';
              const color = isCritical ? '#ef4444' : '#f59e0b';
              const iconHtml = `<div style="background-color:${color};width:${isCritical ? 18 : 14}px;height:${isCritical ? 18 : 14}px;border-radius:50%;border:2px solid white;box-shadow:0 0 8px ${color};${isCritical ? 'animation: pulse 1.5s infinite;' : ''}"></div>`;
              
              return (
                <Marker key={`alert-${a.id}`} position={coords} icon={L.divIcon({ className: 'custom-div-icon', html: iconHtml, iconSize: [isCritical ? 22 : 18, isCritical ? 22 : 18], iconAnchor: [isCritical ? 11 : 9, isCritical ? 11 : 9] })}>
                  <Popup>
                    <div className="font-bold text-red-600 mb-1">{a.title}</div>
                    <div className="text-xs mb-1">Severity: <span className="font-bold uppercase">{a.severity}</span></div>
                    <div className="text-xs mb-1">Risk Score: <strong>{a.risk_score}</strong></div>
                    <div className="text-xs mb-2">Status: {a.status}</div>
                    <Link to={`/alerts/${a.id}`} className="text-xs text-primary hover:underline font-semibold">View Alert</Link>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
