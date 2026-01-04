import React from 'react'
import './PageStyles.css'

function Overview({ data, selectedRoute, selectedDate, selectedFlight, onRouteChange, onDateChange, onFlightChange }) {
  const routes = data ? [...new Set(data.forecastedDemand.map(d => d.route))] : []
  const dates = data ? [...new Set(data.forecastedDemand.map(d => d.time_period))].sort() : []
  const flights = data ? data.flightCapacity.map(f => f.flight_id) : []

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Overview</h1>
        <p className="page-subtitle">
          Understanding why forecast accuracy does not equal decision correctness
        </p>
      </div>

      <div className="selector-group">
        <div className="selector">
          <label>Route</label>
          <select value={selectedRoute} onChange={(e) => onRouteChange(e.target.value)}>
            {routes.map(route => (
              <option key={route} value={route}>{route}</option>
            ))}
          </select>
        </div>
        <div className="selector">
          <label>Date</label>
          <select value={selectedDate} onChange={(e) => onDateChange(e.target.value)}>
            {dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
        <div className="selector">
          <label>Flight</label>
          <select value={selectedFlight} onChange={(e) => onFlightChange(e.target.value)}>
            {flights.map(flight => (
              <option key={flight} value={flight}>{flight}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="banner">
        <div className="banner-title">The Planning Gap</div>
        <div className="banner-text">
          Current FedEx planning treats forecasts as absolute truth, applying one-size-fits-all 
          utilization targets across all routes. This approach ignores critical operational factors: 
          cost exposure varies by route, delay risk is asymmetric, and real-time flexibility is 
          inconsistent. The result? White-tail capacity, load factor mismatch, service delays, 
          and margin erosion.
        </div>
      </div>

      <div className="info-section">
        <h2 className="section-title">The Core Problem</h2>
        <div className="info-text">
          <p>
            <strong>Two routes with identical demand forecasts may require opposite capacity decisions.</strong>
          </p>
          <p>
            This application demonstrates how Opsium transforms demand forecasts into operationally 
            sound capacity decisions by applying a 4-Factor Decision Lens that considers:
          </p>
          <ul className="feature-list">
            <li><strong>Demand Stability:</strong> How predictable is the demand pattern?</li>
            <li><strong>Cost Exposure:</strong> What is the fixed vs variable cost structure?</li>
            <li><strong>Delay Risk:</strong> What is the probability of service disruption?</li>
            <li><strong>Real-Time Flexibility:</strong> Can capacity be adjusted dynamically?</li>
          </ul>
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-label">Selected Route</div>
          <div className="metric-value">{selectedRoute}</div>
          <div className="metric-description">Current route under analysis</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Selected Date</div>
          <div className="metric-value">{selectedDate}</div>
          <div className="metric-description">Planning period</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Selected Flight</div>
          <div className="metric-value">{selectedFlight}</div>
          <div className="metric-description">Flight identifier</div>
        </div>
      </div>

      <div className="info-section">
        <h2 className="section-title">How to Navigate</h2>
        <div className="info-text">
          <p>
            Use the navigation menu above to explore each layer of the planning process:
          </p>
          <ol className="feature-list">
            <li><strong>Business Plan:</strong> Long-term static planning assumptions</li>
            <li><strong>Forecast:</strong> Explainable demand forecasting with confidence indicators</li>
            <li><strong>Decision Engine:</strong> The 4-Factor Decision Lens (core innovation)</li>
            <li><strong>Weekly Plan:</strong> Strategy-driven capacity commitments</li>
            <li><strong>Execution:</strong> Actual outcomes and performance</li>
            <li><strong>Comparison:</strong> Forecast-Only vs Opsium Strategy</li>
            <li><strong>Impact:</strong> Business value and scalability</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default Overview

