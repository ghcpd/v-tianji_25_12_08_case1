import React, { useState, useEffect } from 'react';
import { getAgentToolStatus, getAgentToolStatus2 } from '../utils/agentTools';
import { checkToolAvailability } from '../utils/requestHandler';
import './ToolManager.css';

function ToolManager() {
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const loadTools = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      
      try {
        const toolList = ['search', 'analyze', 'transform', 'validate', 'process'];
        const statusList = toolList.map(tool => {
          const status1 = getAgentToolStatus(tool);
          const status2 = getAgentToolStatus2(tool);
          const status3 = checkToolAvailability(tool);
          return {
            name: tool,
            status: status1.status,
            lastChecked: status1.lastChecked
          };
        });
        
        setTools(statusList);
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load tools');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTools();
    const timer = setInterval(loadTools, 30000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return <div className="loading-state">Loading tools...</div>;
  }

  if (errorMessage) {
    return <div className="error-state">Error: {errorMessage}</div>;
  }

  return (
    <div className="tool-manager">
      <h1>Tool Manager</h1>
      <div className="tools-grid">
        {tools.map(tool => (
          <div key={tool.name} className="tool-card">
            <h3>{tool.name}</h3>
            <p className={`status status-${tool.status}`}>{tool.status}</p>
            <p className="timestamp">Last checked: {new Date(tool.lastChecked).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToolManager;

