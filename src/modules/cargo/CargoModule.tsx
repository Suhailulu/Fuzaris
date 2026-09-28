import { Routes, Route } from 'react-router-dom';
import { CargoList } from '../../pages/Cargo';
import { CargoDetail } from '../../pages/CargoDetail';

export default function CargoModule() {
  return (
    <div className="animate-fade-in" style={{ padding: 'var(--space-2xl)' }}>
      <Routes>
        <Route index element={<CargoList />} />
        <Route path=":id" element={<CargoDetail />} />
      </Routes>
    </div>
  );
}
