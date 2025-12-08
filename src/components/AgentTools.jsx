import React, { useState } from 'react';
import { 
  executeAgentTool, 
  processAgentRequest, 
  formatAgentResponse,
  validateAgentInput 
} from '../utils/agentTools';
import { 
  sendAgentRequest, 
  makeAgentCall, 
  normalizeResponseData 
} from '../utils/requestHandler';
import './AgentTools.css';

function AgentTools() {
  const [toolName, setToolName] = useState('search');
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useAlternative, setUseAlternative] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const validation = validateAgentInput(query);
      if (!validation.valid) {
        setError(validation.error);
        setLoading(false);
        return;
      }

      let response;
      if (useAlternative) {
        response = await sendAgentRequest(toolName, query, options);
      } else {
        response = await executeAgentTool(toolName, { query, options });
      }
      
      if (response.success) {
        const formatted = useAlternative 
          ? normalizeResponseData(response)
          : formatAgentResponse(response);
        setResult(formatted);
      } else {
        setError(response.error || 'Execution failed');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let response;
      if (useAlternative) {
        response = await makeAgentCall(toolName, query, options);
      } else {
        const requestData = {
          tool: toolName,
          params: { query, options }
        };
        response = await processAgentRequest(requestData);
      }
      
      if (response.success) {
        const formatted = useAlternative
          ? normalizeResponseData(response)
          : formatAgentResponse(response);
        setResult(formatted);
      } else {
        setError(response.error || 'Processing failed');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agent-tools">
      <h1>Agent Tools</h1>
      
      <div className="tools-form">
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={useAlternative}
              onChange={(e) => setUseAlternative(e.target.checked)}
            />
            Use Alternative API
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="tool-name">Tool Name</label>
          <select
            id="tool-name"
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
          >
            <option value="search">Search</option>
            <option value="analyze">Analyze</option>
            <option value="transform">Transform</option>
            <option value="validate">Validate</option>
            <option value="process">Process</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="query">Query</label>
          <input
            id="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query..."
          />
        </div>

        <div className="form-actions">
          <button 
            onClick={handleExecute}
            disabled={loading || !query}
            className="btn btn-primary"
          >
            {loading ? 'Executing...' : 'Execute Tool'}
          </button>
          <button 
            onClick={handleProcess}
            disabled={loading || !query}
            className="btn btn-secondary"
          >
            {loading ? 'Processing...' : 'Process Request'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="result-container">
          <h2>Result</h2>
          <div className="result-info">
            <p><strong>Type:</strong> {result.type}</p>
            {result.count !== undefined && (
              <p><strong>Count:</strong> {result.count}</p>
            )}
          </div>
          <div className="result-data">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentTools;

