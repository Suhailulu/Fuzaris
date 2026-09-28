import { Routes, Route } from 'react-router-dom';
import { PersonnelList } from '../../pages/Personnel';
import { PersonnelDetail } from '../../pages/PersonnelDetail';

export default function PersonnelModule() {
  return (
    <div className="animate-fade-in" style={{ padding: 'var(--space-2xl)' }}>
      <Routes>
        <Route index element={<PersonnelList />} />
        <Route path=":id" element={<PersonnelDetail />} />
      </Routes>
    </div>
  );
}
