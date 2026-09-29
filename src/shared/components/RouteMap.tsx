import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

// Fix leaflet default marker icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function RoutingMachine({ start, end }: { start: [number, number], end: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      show: false // Hide the routing instructions panel by default to save space
    }).addTo(map);

    return () => {
      try {
        map.removeControl(routingControl);
      } catch (e) {
        // ignore if control is already removed
      }
    };
  }, [map, start, end]);

  return null;
}

interface RouteMapProps {
  originCoords?: [number, number];
  destinationCoords?: [number, number];
  originName?: string;
  destinationName?: string;
}

export function RouteMap({ 
  originCoords = [-62.2, -58.9], // Mock coordinates for Antarctica
  destinationCoords = [-77.85, 166.67], // Mock coords
  originName = "Origin",
  destinationName = "Destination" 
}: RouteMapProps) {
  return (
    <div style={{ width: '100%', height: '500px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
      <MapContainer 
        center={originCoords} 
        zoom={3} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RoutingMachine start={originCoords} end={destinationCoords} />
        
        <Marker position={originCoords}>
          <Popup>{originName}</Popup>
        </Marker>
        
        <Marker position={destinationCoords}>
          <Popup>{destinationName}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
