import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AgentTools from './components/AgentTools';
import DataProcessor from './components/DataProcessor';
import NotificationCenter from './components/NotificationCenter';
import ToolManager from './components/ToolManager';
import './App.css';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">Agent Tools Platform</div>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/agent-tools">Agent Tools</Link>
          <Link to="/data-processor">Data Processor</Link>
          <Link to="/notifications">Notifications</Link>
          <Link to="/tool-manager">Tool Manager</Link>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agent-tools" element={<AgentTools />} />
          <Route path="/data-processor" element={<DataProcessor />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/tool-manager" element={<ToolManager />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

