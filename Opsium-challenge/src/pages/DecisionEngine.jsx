import React from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts'
import { getRouteData, getFlightData, calculateDemandStability, calculateCostExposure, getDelayRisk, getFlexibility, determineStrategy } from '../utils/dataLoader'
import './PageStyles.css'

function DecisionEngine({ data, selectedRoute, selectedDate, selectedFlight }) {
  const routeData = getRouteData(data, selectedRoute)
  const flightData = getFlightData(data, selectedFlight)
  const forecastData = routeData?.forecastedDemand || []
  
  // Calculate 4-Factor Decision Lens
  const demandStability = calculateDemandStability(forecastData)
  const costExposure = calculateCostExposure(flightData)
  const delayRisk = getDelayRisk(flightData)
  const flexibility = getFlexibility(flightData)
  
  const factors = {
    demandStability,
    costExposure,
    delayRisk,
    flexibility
  }
  
  const strategy = determineStrategy(factors)
  
  const currentForecast = forecastData.find(d => d.time_period === selectedDate)
  
  // Prepare radar chart data
  const radarData = [
    {
      factor: 'Demand\nStability',
      value: demandStability * 100,
      fullMark: 100
    },
    {
      factor: 'Cost\nExposure',
      value: costExposure * 100,
      fullMark: 100
    },
    {
      factor: 'Delay\nRisk',
      value: delayRisk * 100,
      fullMark: 100
    },
    {
      factor: 'Real-Time\nFlexibility',
      value: flexibility * 100,
      fullMark: 100
    }
  ]

  const getStatusClass = (value) => {
    if (value >= 0.7) return 'status-high'
    if (value >= 0.4) return 'status-medium'
    return 'status-low'
  }

  const getStatusLabel = (value) => {
    if (value >= 0.7) return 'High'
    if (value >= 0.4) return 'Medium'
    return 'Low'
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Decision Engine</h1>
        <p className="page-subtitle">
          The 4-Factor Decision Lens: How Opsium changes decisions without changing forecasts
        </p>
      </div>

      <div className="banner">
        <div className="banner-title">Core Innovation</div>
        <div className="banner-text">
          <strong>We do not change the forecast. We change how much we trust it.</strong>
          <br /><br />
          The Decision Engine applies operational intelligence to the same forecasted demand, 
          evaluating four critical factors that determine capacity strategy. Two routes with 
          identical forecasts may receive opposite recommendations based on these factors.
        </div>
      </div>

      {currentForecast && (
        <div className="metric-card" style={{ marginBottom: '24px' }}>
          <div className="metric-label">Forecasted Demand (Unchanged)</div>
          <div className="metric-value">{currentForecast.forecasted_demand?.toFixed(1) || 'N/A'}</div>
          <div className="metric-description">
            This forecast value is not modified. The Decision Engine evaluates operational trust 
            based on the 4 factors below.
          </div>
        </div>
      )}

      <div className="chart-container">
        <h3 className="chart-title">4-Factor Decision Lens Visualization</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis 
              dataKey="factor" 
              tick={{ fontSize: 14, fill: '#666' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <Radar 
              name="Factor Score" 
              dataKey="value" 
              stroke="#2e276c" 
              fill="#2e276c" 
              fillOpacity={0.6}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="factors-grid">
        <div className="factor-card">
          <div className="factor-header">
            <div className="factor-name">1. Demand Stability</div>
            <div className={`factor-status ${getStatusClass(demandStability)}`}>
              {getStatusLabel(demandStability)}
            </div>
          </div>
          <div className="factor-value">{(demandStability * 100).toFixed(1)}%</div>
          <div className="factor-description">
            Measures the predictability of demand patterns. High stability means consistent 
            demand, allowing for more aggressive capacity commitments. Low stability requires 
            buffering to handle volatility.
          </div>
        </div>

        <div className="factor-card">
          <div className="factor-header">
            <div className="factor-name">2. Cost Exposure</div>
            <div className={`factor-status ${getStatusClass(costExposure)}`}>
              {getStatusLabel(costExposure)}
            </div>
          </div>
          <div className="factor-value">{(costExposure * 100).toFixed(1)}%</div>
          <div className="factor-description">
            Ratio of fixed costs to total costs. High exposure means significant fixed costs 
            that must be covered regardless of utilization. This drives strategies to maximize 
            capacity commitments.
          </div>
        </div>

        <div className="factor-card">
          <div className="factor-header">
            <div className="factor-name">3. Delay Risk</div>
            <div className={`factor-status ${getStatusClass(delayRisk)}`}>
              {getStatusLabel(delayRisk)}
            </div>
          </div>
          <div className="factor-value">{(delayRisk * 100).toFixed(1)}%</div>
          <div className="factor-description">
            Probability of service disruption or delay. High risk requires conservative 
            capacity planning to maintain service reliability. Low risk allows for more 
            aggressive utilization.
          </div>
        </div>

        <div className="factor-card">
          <div className="factor-header">
            <div className="factor-name">4. Real-Time Flexibility</div>
            <div className={`factor-status ${getStatusClass(flexibility)}`}>
              {getStatusLabel(flexibility)}
            </div>
          </div>
          <div className="factor-value">{(flexibility * 100).toFixed(1)}%</div>
          <div className="factor-description">
            Ability to adjust capacity dynamically based on real-time signals. High flexibility 
            enables dynamic buffering strategies. Low flexibility requires upfront conservative 
            commitments.
          </div>
        </div>
      </div>

      <div className="strategy-output">
        <h2 className="section-title">Recommended Strategy</h2>
        <div className="strategy-card">
          <div className="strategy-name">{strategy}</div>
          <div className="strategy-explanation">
            Based on the 4-Factor Decision Lens evaluation, this route requires a 
            <strong> {strategy}</strong> approach. This strategy optimizes the balance between 
            utilization, cost efficiency, and service reliability given the operational context.
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="section-title">How This Changes Decisions</h2>
        <div className="info-text">
          <p>
            The same forecasted demand of <strong>{currentForecast?.forecasted_demand?.toFixed(1) || 'N/A'}</strong> 
            {' '}units leads to a <strong>{strategy}</strong> capacity commitment because:
          </p>
          <ul className="feature-list">
            <li>Demand Stability: {getStatusLabel(demandStability)} ({(demandStability * 100).toFixed(1)}%)</li>
            <li>Cost Exposure: {getStatusLabel(costExposure)} ({(costExposure * 100).toFixed(1)}%)</li>
            <li>Delay Risk: {getStatusLabel(delayRisk)} ({(delayRisk * 100).toFixed(1)}%)</li>
            <li>Real-Time Flexibility: {getStatusLabel(flexibility)} ({(flexibility * 100).toFixed(1)}%)</li>
          </ul>
          <p>
            <strong>This is why two routes with identical forecasts may require opposite capacity decisions.</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

export default DecisionEngine

