import { useState } from 'react';
import { ExamProvider } from './context/ExamContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SettingsView from './components/Settings';

export default function App() {
  const [view, setView] = useState('dashboard');

  return (
    <ExamProvider>
      <Navbar activeView={view} onChangeView={setView} />
      {view === 'dashboard' ? (
        <Dashboard onNavigateSettings={() => setView('settings')} />
      ) : (
        <SettingsView />
      )}
    </ExamProvider>
  );
}
