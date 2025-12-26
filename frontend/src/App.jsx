import { useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';

// --- Components ---

const RiskGauge = ({ value }) => {
  const data = [
    { name: 'Risk', value: value },
    { name: 'Safety', value: 100 - value },
  ];
  const COLORS = ['#ef4444', '#e5e7eb'];

  return (
    <div style={{ width: '100%', height: 180, position: 'relative' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{
        position: 'absolute', bottom: 0, width: '100%', textAlign: 'center',
        paddingBottom: '10px', fontSize: '24px', fontWeight: 'bold', color: '#1f2937'
      }}>
        {value.toFixed(1)}%
      </div>
      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginTop: '-10px' }}>
        Churn Probability
      </div>
    </div>
  );
};

const ComparisonChart = ({ userData, benchmarks, metric, label }) => {
  if (!benchmarks) return null;

  const data = [
    { name: 'You', value: parseFloat(userData), fill: '#3b82f6' },
    { name: 'Avg Loyal', value: benchmarks[metric].loyal, fill: '#10b981' },
    { name: 'Avg Churn', value: benchmarks[metric].churn, fill: '#ef4444' },
  ];

  return (
    <div style={{ height: 200, width: '100%', marginTop: '20px' }}>
      <h4 style={{ textAlign: 'center', marginBottom: '10px', color: '#4b5563' }}>{label} Comparison</h4>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={70} style={{ fontSize: '12px' }} />
          <Tooltip cursor={{ fill: 'transparent' }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

function App() {
  const [formData, setFormData] = useState({
    tenure: '',
    MonthlyCharges: '',
    TotalCharges: '',
  });

  // What-If Simulation State
  const [simulatedData, setSimulatedData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiUrl, setApiUrl] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset simulation when actual input changes
    if (isSimulating) {
      setIsSimulating(false);
      setSimulatedData(null);
    }
  };

  const fetchPrediction = async (dataPayload) => {
    // Auto-fix URL
    let url = apiUrl.trim();
    if (!url.endsWith('/predict')) {
      url = url.endsWith('/') ? url + 'predict' : url + '/predict';
    }
    if (url === '' || url === '/predict') {
      url = 'http://localhost:5001/predict';
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(dataPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }
    return await response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSimulatedData(null);
    setIsSimulating(false);

    try {
      const data = await fetchPrediction(formData);
      setResult(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Connection Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Run a "What-If" simulation
  const handleSimulationChange = async (e) => {
    const { name, value } = e.target;
    const newData = { ...(simulatedData || formData), [name]: value };

    setSimulatedData(newData);
    setIsSimulating(true);

    // Debounce logic could go here, but for now we just fire (careful with rate limits)
    // Ideally we wait for mouse up.
  };

  const runSimulation = async () => {
    try {
      const simRes = await fetchPrediction(simulatedData);
      setResult(prev => ({ ...prev, ...simRes })); // Keep benchmarks, update score
    } catch (err) {
      console.error("Sim error", err);
    }
  };


  return (
    <div className="container">
      <header className="app-header">
        <h1>📊 Telco Insight AI</h1>
        <p>Advanced Customer Retention Analytics</p>
      </header>

      <main className="dashboard-grid">
        {/* Left Column: Input Panel */}
        <section className="card input-panel">
          <h2>Customer Profile</h2>

          <label style={{ display: 'block', marginBottom: '15px' }}>
            <strong>API Connection:</strong>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px', fontSize: '13px', background: '#f9fafb' }}
              placeholder="Leave empty for Localhost:5001"
            />
          </label>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tenure (Months)</label>
              <input type="number" name="tenure" value={formData.tenure} onChange={handleChange} required placeholder="24" />
            </div>

            <div className="form-group">
              <label>Monthly Charges ($)</label>
              <input type="number" step="0.01" name="MonthlyCharges" value={formData.MonthlyCharges} onChange={handleChange} required placeholder="65.50" />
            </div>

            <div className="form-group">
              <label>Total Charges ($)</label>
              <input type="number" step="0.01" name="TotalCharges" value={formData.TotalCharges} onChange={handleChange} required placeholder="1500.00" />
            </div>

            <button type="submit" disabled={loading} className="predict-btn">
              {loading ? 'Analyzing...' : 'Generate Risk Report'}
            </button>
          </form>
          {error && <div className="error-msg">{error}</div>}
        </section>

        {/* Right Column: Visualization Panel */}
        <section className="card viz-panel">
          {!result ? (
            <div className="placeholder-content">
              <h3>Waiting for Analysis</h3>
              <p>Enter data to generate AI insights.</p>
            </div>
          ) : (
            <div className="result-content">

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div className={`status-badge ${result.churn_prediction === 1 ? 'danger' : 'success'}`}>
                  {result.message}
                </div>
                {isSimulating && <span style={{ color: '#2563eb', fontWeight: 'bold' }}>⚡ Simulation Active</span>}
              </div>

              <div className="viz-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                {/* Gauge */}
                <div className="chart-box">
                  <h4>Churn Probability</h4>
                  <RiskGauge value={result.churn_probability * 100} />
                </div>

                {/* Simulator Controls */}
                <div className="simulator-box" style={{ background: '#f0f9ff', padding: '15px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <h4 style={{ color: '#1e40af', marginTop: 0 }}>💭 What-If Simulator</h4>
                  <p style={{ fontSize: '12px', marginBottom: '10px' }}>Adjust values to see how risk changes.</p>

                  <div className="sim-control">
                    <label>New Monthly Bill: <strong>${simulatedData?.MonthlyCharges || formData.MonthlyCharges}</strong></label>
                    <input
                      type="range" min="20" max="150"
                      name="MonthlyCharges"
                      value={simulatedData?.MonthlyCharges || formData.MonthlyCharges}
                      onChange={handleSimulationChange}
                      onMouseUp={runSimulation}
                      onTouchEnd={runSimulation}
                    />
                  </div>
                  <div className="sim-control">
                    <label>Extend Tenure: <strong>{simulatedData?.tenure || formData.tenure} Months</strong></label>
                    <input
                      type="range" min="1" max="72"
                      name="tenure"
                      value={simulatedData?.tenure || formData.tenure}
                      onChange={handleSimulationChange}
                      onMouseUp={runSimulation}
                      onTouchEnd={runSimulation}
                    />
                  </div>
                  {isSimulating && <small>Release slider to update.</small>}
                </div>
              </div>

              {/* Benchmarks */}
              {result.benchmarks && (
                <div className="benchmarks-section">
                  <ComparisonChart
                    userData={simulatedData?.MonthlyCharges || formData.MonthlyCharges}
                    benchmarks={result.benchmarks}
                    metric="monthly"
                    label="Monthly Charges"
                  />
                </div>
              )}

            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
