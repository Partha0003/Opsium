import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart, ReferenceLine } from 'recharts'
import { getRouteData, getDateData } from '../utils/dataLoader'
import './PageStyles.css'

function Execution({ data, selectedRoute, selectedDate }) {
  const routeData = getRouteData(data, selectedRoute)
  const dateData = getDateData(routeData, selectedDate)
  const executionData = routeData?.execution || []
  const weeklyPlanData = routeData?.weeklyPlan || []
  
  // Prepare chart data
  const chartData = executionData.slice(0, 30).map(item => {
    const plan = weeklyPlanData.find(p => p.date === item.date)
    return {
      date: item.date?.substring(5) || '',
      committedCapacity: plan?.committed_capacity || 0,
      actualNetWeight: item.actual_net_weight || 0,
      loadFactor: item.load_factor || 0,
      voidCapacity: item.void_capacity || 0
    }
  })

  const currentExecution = dateData?.execution
  const currentPlan = dateData?.weeklyPlan

  // Calculate reliability metrics
  const avgLoadFactor = executionData.length > 0
    ? executionData.reduce((sum, d) => sum + (d.load_factor || 0), 0) / executionData.length
    : 0

  const onTimeRate = executionData.length > 0
    ? (executionData.filter(d => (d.load_factor || 0) > 25).length / executionData.length) * 100
    : 0

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Execution</h1>
        <p className="page-subtitle">
          Actual outcomes of strategy-driven planning
        </p>
      </div>

      {currentExecution && currentPlan && (
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Committed Capacity ({selectedDate})</div>
            <div className="metric-value">{currentPlan.committed_capacity?.toFixed(1) || 'N/A'}</div>
            <div className="metric-description">Planned commitment</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Actual Net Weight ({selectedDate})</div>
            <div className="metric-value">{currentExecution.actual_net_weight?.toFixed(1) || 'N/A'}</div>
            <div className="metric-description">Realized load</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Load Factor ({selectedDate})</div>
            <div className="metric-value">{currentExecution.load_factor?.toFixed(1) || 'N/A'}%</div>
            <div className="metric-description">Utilization efficiency</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Void Capacity ({selectedDate})</div>
            <div className="metric-value">{currentExecution.void_capacity?.toFixed(1) || 'N/A'}</div>
            <div className="metric-description">Unused capacity</div>
          </div>
        </div>
      )}

      <div className="metric-grid" style={{ marginTop: '24px' }}>
        <div className="metric-card">
          <div className="metric-label">Average Load Factor</div>
          <div className="metric-value">{avgLoadFactor.toFixed(1)}%</div>
          <div className="metric-description">30-day average utilization</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Service Reliability</div>
          <div className="metric-value">{onTimeRate.toFixed(1)}%</div>
          <div className="metric-description">Flights meeting minimum load threshold</div>
        </div>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">Committed Capacity vs Actual Net Weight (30-Day View)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#666"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e0e0e0',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="committedCapacity" 
              stroke="#2e276c" 
              strokeWidth={2}
              name="Committed Capacity"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="actualNetWeight" 
              stroke="#e95b1c" 
              strokeWidth={2}
              name="Actual Net Weight"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">Load Factor Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#666"
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
              label={{ value: 'Load Factor %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e0e0e0',
                borderRadius: '6px'
              }}
              formatter={(value) => `${value.toFixed(1)}%`}
            />
            <Legend />
            <Bar 
              dataKey="loadFactor" 
              fill="#2e276c" 
              name="Load Factor"
            />
            <ReferenceLine 
              y={avgLoadFactor} 
              stroke="#e95b1c" 
              strokeDasharray="5 5"
              label={`Average: ${avgLoadFactor.toFixed(1)}%`}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="info-section">
        <h2 className="section-title">Execution Outcomes</h2>
        <div className="info-text">
          <p>
            The execution results demonstrate how strategy-driven capacity planning performs:
          </p>
          <ul className="feature-list">
            <li><strong>Load Factor:</strong> {avgLoadFactor.toFixed(1)}% average utilization shows 
            {' '}efficient capacity use while maintaining service reliability</li>
            <li><strong>Service Reliability:</strong> {onTimeRate.toFixed(1)}% of flights meet minimum 
            {' '}load thresholds, indicating consistent service delivery</li>
            <li><strong>Void Capacity:</strong> Strategic under-commitment creates buffer capacity that 
            {' '}can be utilized dynamically or represents acceptable trade-off for reliability</li>
            <li><strong>Alignment:</strong> Actual net weight vs committed capacity shows how well 
            {' '}strategic decisions matched realized demand</li>
          </ul>
        </div>
      </div>

      {currentExecution && currentPlan && (
        <div className="performance-analysis">
          <h2 className="section-title">Performance Analysis ({selectedDate})</h2>
          <div className="info-text">
            <p>
              On {selectedDate}, the strategy committed {currentPlan.committed_capacity?.toFixed(1)} 
              {' '}units of capacity. Actual net weight was {currentExecution.actual_net_weight?.toFixed(1)} 
              {' '}units, resulting in a load factor of {currentExecution.load_factor?.toFixed(1)}%.
            </p>
            {currentExecution.actual_net_weight < currentPlan.committed_capacity ? (
              <p>
                The actual load was below commitment, leaving {currentExecution.void_capacity?.toFixed(1)} 
                {' '}units of void capacity. This may represent:
              </p>
            ) : (
              <p>
                The actual load matched or exceeded commitment, demonstrating effective capacity planning.
              </p>
            )}
            <ul className="feature-list">
              <li>Strategic buffer for uncertainty</li>
              <li>Service reliability protection</li>
              <li>Acceptable trade-off for operational flexibility</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Execution

