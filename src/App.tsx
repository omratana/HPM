import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Employees from './views/Employees';
import Documents from './views/Documents';
import Leave from './views/Leave';
import { AppView } from './types';
import { HRProvider } from './HRContext';

function MainApp() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <Employees />;
      case 'documents':
        return <Documents />;
      case 'leave':
        return <Leave />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default function App() {
  return (
    <HRProvider>
      <MainApp />
    </HRProvider>
  );
}
