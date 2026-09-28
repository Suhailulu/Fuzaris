import { Routes, Route } from 'react-router-dom';
import { Inventory } from '../../pages/Inventory';
import { Assets } from '../../pages/Assets';
import { InventoryDetail } from '../../pages/InventoryDetail';
import { AssetDetail } from '../../pages/AssetDetail';

export default function InventoryModule() {
  return (
    <div className="animate-fade-in" style={{ padding: 'var(--space-2xl)' }}>
      <Routes>
        <Route index element={<Inventory />} />
        <Route path=":id" element={<InventoryDetail />} />
        <Route path="assets" element={<Assets />} />
        <Route path="assets/:id" element={<AssetDetail />} />
      </Routes>
    </div>
  );
}
