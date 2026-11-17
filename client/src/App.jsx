import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SymptomChecker from './pages/SymptomChecker';
import HistoryPage from './pages/HistoryPage';
import HealthTipsPage from './pages/HealthTipsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        {/* Push content below the fixed navbar */}
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/check" element={<SymptomChecker />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/health-tips" element={<HealthTipsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
