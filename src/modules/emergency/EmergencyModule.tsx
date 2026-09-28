import { Routes, Route } from 'react-router-dom';
import { Alerts } from '../../pages/Alerts';
import { AlertDetail } from '../../pages/AlertDetail';
import { OperationsMap } from '../../pages/OperationsMap';

export default function EmergencyModule() {
  return (
    <div className="animate-fade-in" style={{ padding: 'var(--space-2xl)' }}>
      <Routes>
        <Route index element={<Alerts />} />
        <Route path="map" element={<OperationsMap />} />
        <Route path=":id" element={<AlertDetail />} />
      </Routes>
    </div>
  );
}
