import { Link } from 'react-router-dom';
import { LayoutDashboard, LogOut, Settings, Bell, Activity, Sun, Moon, X } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  setIsAuthenticated: (val: boolean) => void;
  theme: string;
  setTheme: (theme: string) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function Navbar({ setIsAuthenticated, theme, setTheme, isOpen, setIsOpen }: NavbarProps) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="navbar-overlay" onClick={() => setIsOpen(false)}></div>}
      
      <aside className={`navbar ${isOpen ? 'open' : ''}`}>
        <div className="navbar-header">
          <div className="logo">
            <Activity size={28} className="logo-icon" />
            <span>FiscalTech</span>
          </div>
          <button className="mobile-close-btn" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
      
      <div className="navbar-menu">
        <div className="menu-group">
          <p className="menu-label">Main</p>
          <Link to="/dashboard" className="menu-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="#" className="menu-item">
            <Bell size={20} />
            <span>Alerts</span>
          </Link>
        </div>

        <div className="menu-group">
          <p className="menu-label">System</p>
          <button onClick={toggleTheme} className="menu-item theme-toggle">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <Link to="#" className="menu-item">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <button onClick={handleLogout} className="menu-item logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
