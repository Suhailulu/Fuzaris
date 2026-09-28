import { Routes, Route } from 'react-router-dom';
import { Expeditions } from '../../pages/Expeditions';
import { ExpeditionDetail } from '../../pages/ExpeditionDetail';

export default function ExpeditionModule() {
  return (
    <div className="animate-fade-in" style={{ padding: 'var(--space-2xl)' }}>
      <Routes>
        <Route index element={<Expeditions />} />
        <Route path=":id" element={<ExpeditionDetail />} />
      </Routes>
    </div>
  );
}
