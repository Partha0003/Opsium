import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getRouteData } from '../utils/dataLoader'
import './PageStyles.css'

function Comparison({ data, selectedRoute, selectedDate, selectedFlight, onRouteChange, onDateChange, onFlightChange }) {
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
      metric: 'Committed\nUtilization',
      forecastOnly: metrics.forecastOnly.avgUtilization,
      opsiumStrategy: metrics.opsiumStrategy.avgUtilization
    },
    {
      metric: 'Operational\nRisk Exposure',
      forecastOnly: metrics.forecastOnly.avgDelays,
      opsiumStrategy: metrics.opsiumStrategy.avgDelays
    },
    {
      metric: 'Intentional\nBuffer Capacity',
      forecastOnly: metrics.forecastOnly.avgVoidCapacity,
      opsiumStrategy: metrics.opsiumStrategy.avgVoidCapacity
    }
  ] : []

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Comparison</h1>
        <p className="page-subtitle">
          Strategy-aware planning vs forecast-driven commitment
        </p>
      </div>

      <div className="selector-group">
        <div className="selector">
          <label>Route</label>
          <select value={selectedRoute} onChange={(e) => onRouteChange(e.target.value)}>
            {data ? [...new Set(data.forecastedDemand.map(d => d.route))].map(route => (
              <option key={route} value={route}>{route}</option>
            )) : null}
          </select>
        </div>
        <div className="selector">
          <label>Date</label>
          <select value={selectedDate} onChange={(e) => onDateChange(e.target.value)}>
            {data ? [...new Set(data.forecastedDemand.map(d => d.time_period))].sort().map(date => (
              <option key={date} value={date}>{date}</option>
            )) : null}
          </select>
        </div>
        <div className="selector">
          <label>Flight</label>
          <select value={selectedFlight} onChange={(e) => onFlightChange(e.target.value)}>
            {data ? data.flightCapacity.map(f => (
              <option key={f.flight_id} value={f.flight_id}>{f.flight_id}</option>
            )) : null}
          </select>
        </div>
      </div>

      <div className="banner">
        <div className="banner-title">Strategy-Aware Capacity Optimization Comparison</div>
        <div className="banner-text">
          This comparison shows how Opsium's strategy-driven planning converts forecasts into operationally safe and cost-aware capacity commitments, instead of treating forecasts as absolute truth.
        </div>
      </div>

      {metrics && (
        <div className="comparison-grid">
          <div className="comparison-card">
            <div className="comparison-card-header">
              Forecast-Driven Commitment (Baseline)
              <span className="warning-badge-inline">⚠ High exposure to forecast error</span>
            </div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Service Reliability</span>
              <span className="comparison-metric-value">
                {metrics.forecastOnly.serviceReliability.toFixed(1)}%
              </span>
            </div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Committed Utilization</span>
              <span className="comparison-metric-value">
                {metrics.forecastOnly.avgUtilization.toFixed(1)}%
              </span>
            </div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Operational Risk Exposure</span>
              <span className="comparison-metric-value">
                {metrics.forecastOnly.avgDelays.toFixed(1)}%
              </span>
            </div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Intentional Buffer Capacity</span>
              <span className="comparison-metric-value">
                {metrics.forecastOnly.avgVoidCapacity.toFixed(1)}
              </span>
            </div>
            <div className="comparison-description">
              <p>
                This approach commits capacity equal to forecasted demand, assuming forecasts are fully reliable and operational conditions are stable. It does not account for demand volatility, delay risk, cost exposure, or real-time flexibility.
              </p>
            </div>
          </div>

          <div className="comparison-card" style={{ borderColor: '#e95b1c', borderWidth: '3px' }}>
            <div className="comparison-card-header" style={{ color: '#e95b1c' }}>
              Opsium Strategy — Risk-Aware Commitment
              <span className="success-badge-inline">✅ Controlled risk · Operationally realistic</span>
              <span className="info-tooltip-inline" title="Lower utilization does not indicate inefficiency. It reflects deliberate buffer allocation to protect service reliability and manage uncertainty.">ℹ️</span>
            </div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Service Reliability</span>
              <span className="comparison-metric-value" style={{ color: '#e95b1c' }}>
                {metrics.opsiumStrategy.serviceReliability.toFixed(1)}%
              </span>
            </div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Committed Utilization</span>
              <span className="comparison-metric-value" style={{ color: '#e95b1c' }}>
                {metrics.opsiumStrategy.avgUtilization.toFixed(1)}%
              </span>
            </div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Operational Risk Exposure</span>
              <span className="comparison-metric-value" style={{ color: '#e95b1c' }}>
                {metrics.opsiumStrategy.avgDelays.toFixed(1)}%
              </span>
            </div>
            <div className="comparison-metric">
              <span className="comparison-metric-label">Intentional Buffer Capacity</span>
              <span className="comparison-metric-value" style={{ color: '#e95b1c' }}>
                {metrics.opsiumStrategy.avgVoidCapacity.toFixed(1)}
              </span>
            </div>
            <div className="comparison-description">
              <p>
                Opsium applies a 4-Factor Decision Lens to adjust how much of the forecast is operationally trusted. Capacity commitments are deliberately scaled based on demand stability, cost exposure, delay risk, and real-time flexibility.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="chart-container">
        <h3 className="chart-title">Strategy Comparison Metrics</h3>
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
              name="Forecast-Driven Commitment"
              opacity={0.7}
            />
            <Bar 
              dataKey="opsiumStrategy" 
              fill="#e95b1c" 
              name="Opsium Strategy — Risk-Aware"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="decision-quality-section">
        <h2 className="section-title">🧠 Decision Quality Indicators</h2>
        <div className="decision-quality-grid">
          <div className="decision-quality-item">
            <span className="quality-checkmark">✅</span>
            <div className="quality-text">
              <strong>Forecast Uncertainty Absorbed</strong>
              <p>Capacity buffers protect against demand volatility and forecast errors</p>
            </div>
          </div>
          <div className="decision-quality-item">
            <span className="quality-checkmark">✅</span>
            <div className="quality-text">
              <strong>Service Reliability Protected</strong>
              <p>Conservative commitments on high-risk routes prevent service failures</p>
            </div>
          </div>
          <div className="decision-quality-item">
            <span className="quality-checkmark">✅</span>
            <div className="quality-text">
              <strong>Late-Stage Flexibility Preserved</strong>
              <p>Intentional buffers enable dynamic adjustments based on real-time signals</p>
            </div>
          </div>
          <div className="decision-quality-item">
            <span className="quality-checkmark">✅</span>
            <div className="quality-text">
              <strong>Cost Risk Explicitly Managed</strong>
              <p>Route-specific strategies balance fixed cost exposure with utilization goals</p>
            </div>
          </div>
        </div>
        <div className="quality-summary-line">
          <strong>Opsium optimizes decisions, not just metrics.</strong>
        </div>
      </div>

      {metrics && (
        <div className="strategic-analysis">
          <h2 className="section-title">Strategic Decision Framework</h2>
          <div className="metric-grid">
            <div className="strategic-card">
              <div className="strategic-card-title">Risk Handling</div>
              <div className="strategic-card-content">
                Opsium reduces over-commitment on volatile routes, preventing costly service failures when forecasts deviate.
              </div>
            </div>
            <div className="strategic-card">
              <div className="strategic-card-title">Operational Control</div>
              <div className="strategic-card-content">
                Capacity buffers enable late-stage adjustments based on real-time demand signals.
              </div>
            </div>
            <div className="strategic-card">
              <div className="strategic-card-title">Strategic Trade-Off</div>
              <div className="strategic-card-content">
                Lower utilization is accepted where reliability and cost control are more critical than fill rate.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="strategy-summary-banner">
        <div className="strategy-summary-text">
          <strong>Forecast-only optimizes for expected demand. Opsium optimizes for what happens when expectations are wrong.</strong>
        </div>
      </div>
    </div>
  )
}

export default Comparison

