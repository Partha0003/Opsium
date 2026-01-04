import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getRouteData } from '../utils/dataLoader'
import './PageStyles.css'

function Comparison({ data, selectedRoute }) {
  const routeData = getRouteData(data, selectedRoute)
  const planningSummary = routeData?.planningSummary || []
  
  // Calculate metrics for Forecast-Only vs Opsium Strategy
  const calculateMetrics = () => {
    if (planningSummary.length === 0) return null

    // Forecast-Only approach: commit capacity = forecasted demand
    const forecastOnly = {
      totalDelays: 0,
      avgUtilization: 0,
      totalCostExposure: 0,
      serviceReliability: 0,
      totalVoidCapacity: 0
    }

    // Opsium Strategy: use actual committed capacity
    const opsiumStrategy = {
      totalDelays: 0,
      avgUtilization: 0,
      totalCostExposure: 0,
      serviceReliability: 0,
      totalVoidCapacity: 0
    }

    planningSummary.forEach(item => {
      const forecasted = item.forecasted_demand || 0
      const committed = item.committed_capacity || 0
      const actual = item.actual_net_weight || 0
      const voidCap = item.void_capacity || 0
      const loadFactor = item.load_factor || 0

      // Forecast-Only: assume we commit exactly to forecast
      const forecastOnlyLoadFactor = forecasted > 0 
        ? (actual / forecasted) * 100 
        : 0
      const forecastOnlyVoid = Math.max(0, forecasted - actual)

      // Delays: if actual exceeds committed/forecasted
      if (actual > forecasted) forecastOnly.totalDelays++
      if (actual > committed) opsiumStrategy.totalDelays++

      forecastOnly.avgUtilization += forecastOnlyLoadFactor
      forecastOnly.totalVoidCapacity += forecastOnlyVoid

      opsiumStrategy.avgUtilization += loadFactor
      opsiumStrategy.totalVoidCapacity += voidCap

      // Service reliability: load factor > 25%
      if (forecastOnlyLoadFactor > 25) forecastOnly.serviceReliability++
      if (loadFactor > 25) opsiumStrategy.serviceReliability++
    })

    const count = planningSummary.length

    return {
      forecastOnly: {
        avgDelays: (forecastOnly.totalDelays / count) * 100,
        avgUtilization: forecastOnly.avgUtilization / count,
        serviceReliability: (forecastOnly.serviceReliability / count) * 100,
        avgVoidCapacity: forecastOnly.totalVoidCapacity / count
      },
      opsiumStrategy: {
        avgDelays: (opsiumStrategy.totalDelays / count) * 100,
        avgUtilization: opsiumStrategy.avgUtilization / count,
        serviceReliability: (opsiumStrategy.serviceReliability / count) * 100,
        avgVoidCapacity: opsiumStrategy.totalVoidCapacity / count
      }
    }
  }

  const metrics = calculateMetrics()

  const comparisonData = metrics ? [
    {
      metric: 'Service\nReliability',
      forecastOnly: metrics.forecastOnly.serviceReliability,
      opsiumStrategy: metrics.opsiumStrategy.serviceReliability
    },
    {
      metric: 'Avg\nUtilization',
      forecastOnly: metrics.forecastOnly.avgUtilization,
      opsiumStrategy: metrics.opsiumStrategy.avgUtilization
    },
    {
      metric: 'Delay\nRate',
      forecastOnly: metrics.forecastOnly.avgDelays,
      opsiumStrategy: metrics.opsiumStrategy.avgDelays
    },
    {
      metric: 'Void\nCapacity',
      forecastOnly: metrics.forecastOnly.avgVoidCapacity,
      opsiumStrategy: metrics.opsiumStrategy.avgVoidCapacity
    }
  ] : []

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Comparison</h1>
        <p className="page-subtitle">
          Forecast-Only vs Opsium Strategy Performance
        </p>
      </div>

      <div className="banner">
        <div className="banner-title">Side-by-Side Performance Analysis</div>
        <div className="banner-text">
          This comparison demonstrates the operational impact of applying the 4-Factor Decision Lens 
          versus treating forecasts as absolute truth. The metrics show how strategy-driven planning 
          improves service reliability, optimizes utilization, and reduces operational risk.
        </div>
      </div>

      {metrics && (
        <div className="comparison-grid">
          <div className="comparison-card">
            <div className="comparison-card-header">Forecast-Only Approach</div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Service Reliability</span>
              <span className="comparison-metric-value">
                {metrics.forecastOnly.serviceReliability.toFixed(1)}%
              </span>
            </div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Average Utilization</span>
              <span className="comparison-metric-value">
                {metrics.forecastOnly.avgUtilization.toFixed(1)}%
              </span>
            </div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Delay Rate</span>
              <span className="comparison-metric-value">
                {metrics.forecastOnly.avgDelays.toFixed(1)}%
              </span>
            </div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Average Void Capacity</span>
              <span className="comparison-metric-value">
                {metrics.forecastOnly.avgVoidCapacity.toFixed(1)}
              </span>
            </div>
            <div className="comparison-description">
              <p>
                <strong>Assumption:</strong> Commit capacity exactly equal to forecasted demand.
                This approach treats forecasts as absolute truth without considering operational context.
              </p>
            </div>
          </div>

          <div className="comparison-card" style={{ borderColor: '#e95b1c', borderWidth: '3px' }}>
            <div className="comparison-card-header" style={{ color: '#e95b1c' }}>
              Opsium Strategy
            </div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Service Reliability</span>
              <span className="comparison-metric-value" style={{ color: '#e95b1c' }}>
                {metrics.opsiumStrategy.serviceReliability.toFixed(1)}%
              </span>
            </div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Average Utilization</span>
              <span className="comparison-metric-value" style={{ color: '#e95b1c' }}>
                {metrics.opsiumStrategy.avgUtilization.toFixed(1)}%
              </span>
            </div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Delay Rate</span>
              <span className="comparison-metric-value" style={{ color: '#e95b1c' }}>
                {metrics.opsiumStrategy.avgDelays.toFixed(1)}%
              </span>
            </div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Average Void Capacity</span>
              <span className="comparison-metric-value" style={{ color: '#e95b1c' }}>
                {metrics.opsiumStrategy.avgVoidCapacity.toFixed(1)}
              </span>
            </div>
            <div className="comparison-description">
              <p>
                <strong>Approach:</strong> Apply 4-Factor Decision Lens to adjust operational trust 
                in forecasts. Capacity commitments are strategy-driven based on demand stability, 
                cost exposure, delay risk, and real-time flexibility.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="chart-container">
        <h3 className="chart-title">Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="metric" 
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
            <Bar 
              dataKey="forecastOnly" 
              fill="#8884d8" 
              name="Forecast-Only"
              opacity={0.7}
            />
            <Bar 
              dataKey="opsiumStrategy" 
              fill="#e95b1c" 
              name="Opsium Strategy"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {metrics && (
        <div className="improvement-analysis">
          <h2 className="section-title">Improvement Analysis</h2>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Service Reliability Improvement</div>
              <div className="metric-value">
                {((metrics.opsiumStrategy.serviceReliability - metrics.forecastOnly.serviceReliability) / metrics.forecastOnly.serviceReliability * 100).toFixed(1)}%
              </div>
              <div className="metric-description">
                {metrics.opsiumStrategy.serviceReliability > metrics.forecastOnly.serviceReliability 
                  ? 'Opsium Strategy improves reliability'
                  : 'Both approaches similar'}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Utilization Difference</div>
              <div className="metric-value">
                {(metrics.opsiumStrategy.avgUtilization - metrics.forecastOnly.avgUtilization).toFixed(1)}%
              </div>
              <div className="metric-description">
                {metrics.opsiumStrategy.avgUtilization > metrics.forecastOnly.avgUtilization 
                  ? 'Opsium Strategy achieves higher utilization'
                  : 'Forecast-Only achieves higher utilization'}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Delay Rate Reduction</div>
              <div className="metric-value">
                {(metrics.forecastOnly.avgDelays - metrics.opsiumStrategy.avgDelays).toFixed(1)}%
              </div>
              <div className="metric-description">
                {metrics.opsiumStrategy.avgDelays < metrics.forecastOnly.avgDelays 
                  ? 'Opsium Strategy reduces delays'
                  : 'Both approaches similar'}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Void Capacity Reduction</div>
              <div className="metric-value">
                {(metrics.forecastOnly.avgVoidCapacity - metrics.opsiumStrategy.avgVoidCapacity).toFixed(1)}
              </div>
              <div className="metric-description">
                {metrics.opsiumStrategy.avgVoidCapacity < metrics.forecastOnly.avgVoidCapacity 
                  ? 'Opsium Strategy reduces void capacity'
                  : 'Forecast-Only has less void capacity'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="info-section">
        <h2 className="section-title">Key Insights</h2>
        <div className="info-text">
          <p>
            The comparison reveals that strategy-driven capacity planning:
          </p>
          <ul className="feature-list">
            <li><strong>Maintains or improves service reliability</strong> by considering delay risk 
            and operational constraints</li>
            <li><strong>Optimizes utilization</strong> by adjusting commitments based on demand 
            stability and cost exposure</li>
            <li><strong>Reduces operational risk</strong> by applying appropriate strategies for 
            each route's unique characteristics</li>
            <li><strong>Balances multiple objectives</strong> rather than optimizing for a single 
            metric</li>
          </ul>
          <p>
            <strong>This demonstrates why two routes with identical forecasts require different 
            capacity decisions.</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Comparison

