import { LayoutDashboard, Settings, GraduationCap } from 'lucide-react';

export default function Navbar({ activeView, onChangeView }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="brand-icon">
            <GraduationCap size={18} />
          </div>
          <span>Exam Dashboard</span>
        </div>

        <div className="navbar-tabs">
          <button
            className={`nav-tab ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onChangeView('dashboard')}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>
          <button
            className={`nav-tab ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => onChangeView('settings')}
          >
            <Settings size={16} />
            Ayarlar
          </button>
        </div>
      </div>
    </nav>
  );
}
