import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Expeditions } from './pages/Expeditions';
import { ExpeditionDetail } from './pages/ExpeditionDetail';
import { CargoList } from './pages/Cargo';
import { CargoDetail } from './pages/CargoDetail';
import { Inventory } from './pages/Inventory';
import { InventoryDetail } from './pages/InventoryDetail';
import { Assets } from './pages/Assets';
import { AssetDetail } from './pages/AssetDetail';
import { PersonnelList } from './pages/Personnel';
import { PersonnelDetail } from './pages/PersonnelDetail';
import { OperationsMap } from './pages/OperationsMap';
import { Alerts } from './pages/Alerts';
import { AlertDetail } from './pages/AlertDetail';
import { Reports } from './pages/Reports';
import { ActivityFeed } from './pages/Activity';
import { AuthProvider } from './lib/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            
            {/* Phase 2 Routes */}
            <Route path="expeditions" element={<Expeditions />} />
            <Route path="expeditions/:id" element={<ExpeditionDetail />} />
            <Route path="cargo" element={<CargoList />} />
            <Route path="cargo/:id" element={<CargoDetail />} />
            
            {/* Phase 3 Routes */}
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/:id" element={<InventoryDetail />} />
            <Route path="assets" element={<Assets />} />
            <Route path="assets/:id" element={<AssetDetail />} />
            
            {/* Phase 4 Routes */}
            <Route path="personnel" element={<PersonnelList />} />
            <Route path="personnel/:id" element={<PersonnelDetail />} />
            <Route path="operations-map" element={<OperationsMap />} />
            
            {/* Phase 5 Routes */}
            <Route path="alerts" element={<Alerts />} />
            <Route path="alerts/:id" element={<AlertDetail />} />

            {/* Phase 6 Routes */}
            <Route path="reports" element={<Reports />} />
            <Route path="activity" element={<ActivityFeed />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
