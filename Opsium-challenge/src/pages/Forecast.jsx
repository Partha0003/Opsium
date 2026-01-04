import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts'
import { getRouteData } from '../utils/dataLoader'
import './PageStyles.css'

function Forecast({ data, selectedRoute, selectedDate }) {
  const routeData = getRouteData(data, selectedRoute)
  const forecastData = routeData?.forecastedDemand || []
  
  // Prepare chart data
  const chartData = forecastData.slice(0, 30).map(item => ({
    date: item.time_period?.substring(5) || '',
    baseDemand: item.base_demand || 0,
    forecastedDemand: item.forecasted_demand || 0,
    confidence: (item.forecast_confidence || 0) * 100
  }))

  const currentForecast = forecastData.find(d => d.time_period === selectedDate)
  const avgConfidence = forecastData.length > 0
    ? (forecastData.reduce((sum, d) => sum + (d.forecast_confidence || 0), 0) / forecastData.length) * 100
    : 0

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Forecast</h1>
        <p className="page-subtitle">
          Explainable demand forecasting with confidence indicators
        </p>
      </div>

      {currentForecast && (
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Base Demand ({selectedDate})</div>
            <div className="metric-value">{currentForecast.base_demand?.toFixed(1) || 'N/A'}</div>
            <div className="metric-description">Historical baseline</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Forecasted Demand ({selectedDate})</div>
            <div className="metric-value">{currentForecast.forecasted_demand?.toFixed(1) || 'N/A'}</div>
            <div className="metric-description">Predicted demand</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Forecast Confidence</div>
            <div className="metric-value">
              {((currentForecast.forecast_confidence || 0) * 100).toFixed(1)}%
            </div>
            <div className="metric-description">Model confidence level</div>
          </div>
        </div>
      )}

      <div className="chart-container">
        <h3 className="chart-title">Base Demand vs Forecasted Demand (30-Day View)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e95b1c" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#e95b1c" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            <Area 
              type="monotone" 
              dataKey="baseDemand" 
              stroke="#8884d8" 
              fillOpacity={1}
              fill="url(#colorBase)"
              name="Base Demand"
            />
            <Area 
              type="monotone" 
              dataKey="forecastedDemand" 
              stroke="#e95b1c" 
              fillOpacity={1}
              fill="url(#colorForecast)"
              name="Forecasted Demand"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">Forecast Confidence Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
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
              domain={[0, 100]}
              label={{ value: 'Confidence %', angle: -90, position: 'insideLeft' }}
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
            <Line 
              type="monotone" 
              dataKey="confidence" 
              stroke="#2e276c" 
              strokeWidth={2}
              name="Forecast Confidence"
              dot={false}
            />
            <ReferenceLine 
              y={avgConfidence} 
              stroke="#e95b1c" 
              strokeDasharray="5 5"
              label={`Average: ${avgConfidence.toFixed(1)}%`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="warning-box">
        <strong>⚠️ Critical Understanding</strong>
        <p>
          Forecast confidence does not equal operational safety. A forecast with 90% confidence 
          may still require conservative capacity planning if the route has high delay risk, 
          limited flexibility, or high fixed cost exposure. The Decision Engine (next page) 
          shows how Opsium adjusts operational trust in forecasts based on these factors.
        </p>
      </div>

      <div className="info-section">
        <h2 className="section-title">Forecast Intelligence</h2>
        <div className="info-text">
          <p>
            The forecasting model analyzes multiple demand signals including:
          </p>
          <ul className="feature-list">
            <li>Historical base demand patterns</li>
            <li>Promotional activity and discount impacts</li>
            <li>Customer sentiment and review volumes</li>
            <li>Regulatory and sustainability factors</li>
          </ul>
          <p>
            However, <strong>forecasts are inputs, not decisions.</strong> The same forecasted 
            demand can lead to different capacity commitments depending on operational context. 
            This is the core innovation of the Decision Engine.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Forecast

