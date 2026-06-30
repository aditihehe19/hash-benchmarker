import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Home';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Benchmark from './pages/Benchmark';
import Results from './pages/Results';
import Analytics from './pages/Analytics';
import SecurityAnalysis from './pages/SecurityAnalysis';
import Recommendation from './pages/SecurityRecommendations';
import Hardware from './pages/Hardware';
import AttackCost from './pages/AttackCostEstimator';
import ExportReport from './pages/ExportReport';

function App() {
  return (
    <Routes>
      {/* Immersive Cybersecurity Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Main SaaS Application Panel */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="benchmark" element={<Benchmark />} />
        <Route path="results" element={<Results />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="security" element={<SecurityAnalysis />} />
        <Route path="recommendation" element={<Recommendation />} />
        <Route path="hardware" element={<Hardware />} />
        <Route path="attack-cost" element={<AttackCost />} />
        <Route path="export" element={<ExportReport />} />
      </Route>
    </Routes>
  );
}

export default App;
