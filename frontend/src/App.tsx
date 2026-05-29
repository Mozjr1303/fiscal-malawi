import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Menu, Activity } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }
      }} />
      <div className="app-container">
        {isAuthenticated && (
          <>
            <Navbar 
              setIsAuthenticated={setIsAuthenticated} 
              theme={theme} 
              setTheme={setTheme} 
              isOpen={isNavbarOpen}
              setIsOpen={setIsNavbarOpen}
            />
            {/* Mobile Header */}
            <header className="mobile-header">
              <div className="logo">
                <Activity size={24} className="logo-icon" />
                <span>FiscalTech</span>
              </div>
              <button className="menu-toggle-btn" onClick={() => setIsNavbarOpen(true)}>
                <Menu size={24} />
              </button>
            </header>
          </>
        )}
        <main className={`main-content ${!isAuthenticated ? 'full-width' : ''} ${isNavbarOpen ? 'navbar-open' : ''}`}>
          <Routes>
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
            } />
            <Route path="/login" element={
              !isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />
            } />
            <Route path="/dashboard" element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
