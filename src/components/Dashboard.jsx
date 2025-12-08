import React, { useState, useEffect } from 'react';
import { getAgentToolStatus } from '../utils/agentTools';
import { checkToolAvailability } from '../utils/requestHandler';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalTools: 0,
    activeTools: 0,
    requestsToday: 0,
    successRate: 0
  });
  
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      const toolNames = ['search', 'analyze', 'transform', 'validate', 'process'];
      const toolStatuses = toolNames.map(name => ({
        name,
        ...getAgentToolStatus(name)
      }));
      
      setTools(toolStatuses);
      
      const activeCount = toolStatuses.filter(t => t.status === 'active').length;
      const mockRequests = Math.floor(Math.random() * 1000) + 100;
      const mockSuccessRate = Math.random() * 20 + 80;
      
      setStats({
        totalTools: toolNames.length,
        activeTools: activeCount,
        requestsToday: mockRequests,
        successRate: mockSuccessRate.toFixed(1)
      });
      
      setLoading(false);
    };
    
    const loadToolStatuses = () => {
      const toolList = ['search', 'analyze', 'transform', 'validate', 'process'];
      const statusList = toolList.map(tool => ({
        name: tool,
        ...checkToolAvailability(tool)
      }));
      return statusList;
    };
    
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tools</h3>
          <p className="stat-value">{stats.totalTools}</p>
        </div>
        <div className="stat-card">
          <h3>Active Tools</h3>
          <p className="stat-value">{stats.activeTools}</p>
        </div>
        <div className="stat-card">
          <h3>Requests Today</h3>
          <p className="stat-value">{stats.requestsToday}</p>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <p className="stat-value">{stats.successRate}%</p>
        </div>
      </div>

      <div className="tools-section">
        <h2>Tool Status</h2>
        <div className="tools-list">
          {tools.map(tool => (
            <div key={tool.name} className="tool-item">
              <span className="tool-name">{tool.name}</span>
              <span className={`tool-status tool-status-${tool.status}`}>
                {tool.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

