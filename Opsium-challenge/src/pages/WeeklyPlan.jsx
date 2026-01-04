import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { getRouteData, getDateData } from '../utils/dataLoader'
import './PageStyles.css'

function WeeklyPlan({ data, selectedRoute, selectedDate }) {
  const routeData = getRouteData(data, selectedRoute)
  const dateData = getDateData(routeData, selectedDate)
  const weeklyPlanData = routeData?.weeklyPlan || []
  const forecastData = routeData?.forecastedDemand || []
  
  // Prepare chart data
  const chartData = weeklyPlanData.slice(0, 30).map(item => {
    const forecast = forecastData.find(f => f.time_period === item.date)
    return {
      date: item.date?.substring(5) || '',
      forecastedDemand: forecast?.forecasted_demand || 0,
      committedCapacity: item.committed_capacity || 0,
      maxCapacity: item.max_capacity || 0
    }
  })

  const currentPlan = dateData?.weeklyPlan
  const currentForecast = dateData?.forecasted

  const getStrategyClass = (strategy) => {
    if (strategy?.includes('Maximize')) return 'strategy-maximize'
    if (strategy?.includes('Buffer')) return 'strategy-buffer'
    if (strategy?.includes('Conservative')) return 'strategy-conservative'
    return 'strategy-balanced'
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Weekly Plan</h1>
        <p className="page-subtitle">
          Strategy-driven capacity commitments
        </p>
      </div>

      {currentPlan && currentForecast && (
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Forecasted Demand ({selectedDate})</div>
            <div className="metric-value">{currentForecast.forecasted_demand?.toFixed(1) || 'N/A'}</div>
            <div className="metric-description">Input from forecast layer</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Committed Capacity ({selectedDate})</div>
            <div className="metric-value">{currentPlan.committed_capacity?.toFixed(1) || 'N/A'}</div>
            <div className="metric-description">Strategy-driven commitment</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Utilization Strategy</div>
            <div className="metric-value">
              <span className={`strategy-badge ${getStrategyClass(currentPlan.utilization_strategy)}`}>
                {currentPlan.utilization_strategy || 'N/A'}
              </span>
            </div>
            <div className="metric-description">Decision Engine recommendation</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Capacity Buffer</div>
            <div className="metric-value">
              {currentForecast.forecasted_demand > 0
                ? ((1 - (currentPlan.committed_capacity / currentForecast.forecasted_demand)) * 100).toFixed(1)
                : '0'
              }%
            </div>
            <div className="metric-description">
              {currentPlan.committed_capacity < currentForecast.forecasted_demand
                ? 'Intentional under-commitment'
                : 'Over-commitment for utilization'
              }
            </div>
          </div>
        </div>
      )}

      <div className="chart-container">
        <h3 className="chart-title">Committed Capacity vs Forecasted Demand (30-Day View)</h3>
        <ResponsiveContainer width="100%" height={400}>
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
              dataKey="forecastedDemand" 
              fill="#8884d8" 
              name="Forecasted Demand"
              opacity={0.7}
            />
            <Bar 
              dataKey="committedCapacity" 
              fill="#e95b1c" 
              name="Committed Capacity"
            />
            <ReferenceLine 
              y={currentForecast?.forecasted_demand || 0} 
              stroke="#2e276c" 
              strokeDasharray="5 5"
              label="Current Forecast"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {currentPlan && (
        <div className="strategy-explanation">
          <h2 className="section-title">Strategy Explanation: {currentPlan.utilization_strategy}</h2>
          <div className="info-text">
            {currentPlan.utilization_strategy === 'Maximize Utilization' && (
              <p>
                This strategy commits capacity close to or above forecasted demand because:
                <ul className="feature-list">
                  <li>Demand stability is high, reducing uncertainty</li>
                  <li>Cost exposure favors maximizing utilization</li>
                  <li>Delay risk is low, allowing aggressive loading</li>
                  <li>Real-time flexibility enables dynamic adjustments if needed</li>
                </ul>
              </p>
            )}
            {currentPlan.utilization_strategy === 'Dynamic Buffer' && (
              <p>
                This strategy maintains a buffer below forecasted demand because:
                <ul className="feature-list">
                  <li>Real-time flexibility allows capacity adjustments as demand materializes</li>
                  <li>Initial conservative commitment reduces risk exposure</li>
                  <li>Buffer can be released dynamically based on actual demand signals</li>
                  <li>Optimizes balance between utilization and flexibility</li>
                </ul>
              </p>
            )}
            {currentPlan.utilization_strategy === 'Conservative Loading' && (
              <p>
                This strategy intentionally under-commits capacity because:
                <ul className="feature-list">
                  <li>High delay risk requires service reliability protection</li>
                  <li>Demand volatility creates uncertainty</li>
                  <li>Limited real-time flexibility prevents dynamic adjustments</li>
                  <li>Conservative approach prioritizes service quality over utilization</li>
                </ul>
              </p>
            )}
            {currentPlan.utilization_strategy === 'Balanced Allocation' && (
              <p>
                This strategy balances capacity commitment with forecasted demand because:
                <ul className="feature-list">
                  <li>Moderate levels across all factors</li>
                  <li>Standard approach when no single factor dominates</li>
                  <li>Provides reasonable utilization with acceptable risk</li>
                  <li>Suitable for routes with mixed operational characteristics</li>
                </ul>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="info-section">
        <h2 className="section-title">Why Capacity Differs from Forecast</h2>
        <div className="info-text">
          <p>
            Notice that committed capacity ({currentPlan?.committed_capacity?.toFixed(1) || 'N/A'}) 
            {' '}differs from forecasted demand ({currentForecast?.forecasted_demand?.toFixed(1) || 'N/A'}). 
            This is intentional and strategy-driven:
          </p>
          <ul className="feature-list">
            <li><strong>Under-commitment</strong> creates a buffer for uncertainty, delay risk, or flexibility needs</li>
            <li><strong>Over-commitment</strong> maximizes utilization when stability and cost factors favor it</li>
            <li><strong>Alignment</strong> occurs when all factors support matching forecast exactly</li>
          </ul>
          <p>
            The Execution page shows how these strategic decisions perform in practice.
          </p>
        </div>
      </div>
    </div>
  )
}

export default WeeklyPlan

