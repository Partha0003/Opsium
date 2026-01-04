import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getRouteData } from '../utils/dataLoader'
import './PageStyles.css'

function BusinessPlan({ data, selectedRoute, selectedDate }) {
  const routeData = getRouteData(data, selectedRoute)
  const businessPlanData = routeData?.businessPlan || []
  
  // Prepare chart data
  const chartData = businessPlanData.slice(0, 30).map(item => ({
    date: item.date?.substring(5) || '',
    plannedCapacity: item.planned_capacity || 0,
    plannedNetWeight: item.planned_net_weight || 0
  }))

  const currentPlan = businessPlanData.find(d => d.date === selectedDate)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Business Plan</h1>
        <p className="page-subtitle">
          Long-term, static planning assumptions
        </p>
      </div>

      <div className="banner">
        <div className="banner-title">Static Planning Limitations</div>
        <div className="banner-text">
          Business plans establish baseline capacity and expected net weight based on historical 
          patterns and strategic assumptions. However, these static plans fail under volatility 
          because they cannot adapt to real-time demand signals, cost variations, or operational 
          risks. This creates the foundation for the planning gap that Opsium addresses.
        </div>
      </div>

      {currentPlan && (
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Planned Capacity ({selectedDate})</div>
            <div className="metric-value">{currentPlan.planned_capacity?.toLocaleString() || 'N/A'}</div>
            <div className="metric-description">Baseline capacity allocation</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Planned Net Weight ({selectedDate})</div>
            <div className="metric-value">{currentPlan.planned_net_weight?.toLocaleString() || 'N/A'}</div>
            <div className="metric-description">Expected weight utilization</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Utilization Rate</div>
            <div className="metric-value">
              {currentPlan.planned_capacity > 0 
                ? ((currentPlan.planned_net_weight / currentPlan.planned_capacity) * 100).toFixed(1)
                : '0'
              }%
            </div>
            <div className="metric-description">Planned efficiency</div>
          </div>
        </div>
      )}

      <div className="chart-container">
        <h3 className="chart-title">Planned Capacity vs Planned Net Weight (30-Day View)</h3>
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
              dataKey="plannedCapacity" 
              stroke="#2e276c" 
              strokeWidth={2}
              name="Planned Capacity"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="plannedNetWeight" 
              stroke="#e95b1c" 
              strokeWidth={2}
              name="Planned Net Weight"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="info-section">
        <h2 className="section-title">Why Static Plans Fail</h2>
        <div className="info-text">
          <p>
            Business plans are essential for strategic alignment, but they operate on assumptions 
            that become outdated quickly:
          </p>
          <ul className="feature-list">
            <li>They assume stable demand patterns that don't account for volatility</li>
            <li>They apply uniform utilization targets across all routes</li>
            <li>They ignore route-specific cost structures and risk profiles</li>
            <li>They cannot adapt to real-time operational constraints</li>
          </ul>
          <p>
            <strong>This is why forecasts alone are insufficient.</strong> The next step is to 
            understand how demand forecasting adds intelligence, but also why forecast confidence 
            does not equal operational safety.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BusinessPlan

