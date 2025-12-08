import React, { useState } from 'react';
import { 
  processDataArray, 
  processDataObject, 
  transformData, 
  filterData 
} from '../utils/dataProcessor';
import { 
  handleArrayProcessing, 
  handleObjectProcessing, 
  applyDataTransformation, 
  applyFiltering 
} from '../utils/dataTransform';
import './DataProcessor.css';

function DataProcessor() {
  const [inputData, setInputData] = useState('');
  const [processType, setProcessType] = useState('array');
  const [transformType, setTransformType] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({
    field: '',
    operator: 'equals',
    value: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [useNewProcessor, setUseNewProcessor] = useState(false);

  const handleProcess = () => {
    setError(null);
    setResult(null);

    try {
      const parsed = JSON.parse(inputData);
      let processed;

      if (useNewProcessor) {
        if (processType === 'array') {
          processed = handleArrayProcessing(parsed);
        } else if (processType === 'object') {
          processed = handleObjectProcessing(parsed);
        } else {
          setError('Invalid process type');
          return;
        }
      } else {
        if (processType === 'array') {
          processed = processDataArray(parsed);
        } else if (processType === 'object') {
          processed = processDataObject(parsed);
        } else {
          setError('Invalid process type');
          return;
        }
      }

      if (processed.error) {
        setError(processed.error);
        return;
      }

      let finalResult = processed.data;

      if (transformType) {
        if (useNewProcessor) {
          finalResult = applyDataTransformation(finalResult, transformType);
        } else {
          finalResult = transformData(finalResult, transformType);
        }
      }

      if (filterCriteria.field && filterCriteria.value) {
        if (useNewProcessor) {
          finalResult = applyFiltering(finalResult, filterCriteria);
        } else {
          finalResult = filterData(finalResult, filterCriteria);
        }
      }

      setResult(finalResult);
    } catch (err) {
      setError('Invalid JSON format: ' + err.message);
    }
  };

  return (
    <div className="data-processor">
      <h1>Data Processor</h1>
      
      <div className="processor-form">
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={useNewProcessor}
              onChange={(e) => setUseNewProcessor(e.target.checked)}
            />
            Use New Processor
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="process-type">Process Type</label>
          <select
            id="process-type"
            value={processType}
            onChange={(e) => setProcessType(e.target.value)}
          >
            <option value="array">Array</option>
            <option value="object">Object</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="input-data">Input Data (JSON)</label>
          <textarea
            id="input-data"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder='{"key": "value"} or [{"id": 1}, {"id": 2}]'
            rows={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="transform-type">Transform Type (Optional)</label>
          <select
            id="transform-type"
            value={transformType}
            onChange={(e) => setTransformType(e.target.value)}
          >
            <option value="">None</option>
            <option value="uppercase">Uppercase</option>
            <option value="lowercase">Lowercase</option>
            <option value="reverse">Reverse</option>
          </select>
        </div>

        <div className="filter-section">
          <h3>Filter (Optional)</h3>
          <div className="filter-inputs">
            <input
              type="text"
              placeholder="Field name"
              value={filterCriteria.field}
              onChange={(e) => setFilterCriteria({ ...filterCriteria, field: e.target.value })}
            />
            <select
              value={filterCriteria.operator}
              onChange={(e) => setFilterCriteria({ ...filterCriteria, operator: e.target.value })}
            >
              <option value="equals">Equals</option>
              <option value="contains">Contains</option>
              <option value="greaterThan">Greater Than</option>
              <option value="lessThan">Less Than</option>
            </select>
            <input
              type="text"
              placeholder="Value"
              value={filterCriteria.value}
              onChange={(e) => setFilterCriteria({ ...filterCriteria, value: e.target.value })}
            />
          </div>
        </div>

        <button 
          onClick={handleProcess}
          className="btn btn-primary"
          disabled={!inputData}
        >
          Process Data
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="result-container">
          <h2>Processed Result</h2>
          <div className="result-data">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataProcessor;
