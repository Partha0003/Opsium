import React from 'react'
import { getRouteData } from '../utils/dataLoader'
import './PageStyles.css'

function Impact({ data, selectedRoute }) {
  const routeData = getRouteData(data, selectedRoute)
  const planningSummary = routeData?.planningSummary || []
  
  // Calculate business impact metrics
  const calculateImpact = () => {
    if (planningSummary.length === 0) return null

    const totalDays = planningSummary.length
    const avgLoadFactor = planningSummary.reduce((sum, d) => sum + (d.load_factor || 0), 0) / totalDays
    const serviceReliability = (planningSummary.filter(d => (d.load_factor || 0) > 25).length / totalDays) * 100
    const avgVoidCapacity = planningSummary.reduce((sum, d) => sum + (d.void_capacity || 0), 0) / totalDays

    // Estimate cost savings (simplified)
    const estimatedCostPerUnit = 3.5 // Average variable cost
    const costSavings = avgVoidCapacity * estimatedCostPerUnit * totalDays * 0.1 // 10% efficiency gain

    return {
      avgLoadFactor,
      serviceReliability,
      avgVoidCapacity,
      costSavings,
      totalDays
    }
  }

  const impact = calculateImpact()

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Impact</h1>
        <p className="page-subtitle">
          Business value and scalability across routes
        </p>
      </div>

      <div className="banner" style={{ background: 'linear-gradient(135deg, #e95b1c 0%, #d14a0a 100%)' }}>
        <div className="banner-title" style={{ fontSize: '24px', marginBottom: '16px' }}>
          We don't optimize planes. We optimize decisions.
        </div>
        <div className="banner-text">
          The Opsium Decision Engine transforms how FedEx converts demand forecasts into 
          operationally sound capacity decisions. By applying the 4-Factor Decision Lens, 
          we enable route-specific strategies that balance utilization, cost efficiency, 
          and service reliability.
        </div>
      </div>

      {impact && (
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Average Load Factor</div>
            <div className="metric-value">{impact.avgLoadFactor.toFixed(1)}%</div>
            <div className="metric-description">
              Efficient capacity utilization across {impact.totalDays} days
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Service Reliability</div>
            <div className="metric-value">{impact.serviceReliability.toFixed(1)}%</div>
            <div className="metric-description">
              Flights meeting minimum service thresholds
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Operational Efficiency</div>
            <div className="metric-value">
              ${(impact.costSavings / 1000).toFixed(1)}K
            </div>
            <div className="metric-description">
              Estimated cost optimization potential
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Strategic Flexibility</div>
            <div className="metric-value">4</div>
            <div className="metric-description">
              Decision strategies available per route
            </div>
          </div>
        </div>
      )}

      <div className="info-section">
        <h2 className="section-title">Business Impact Summary</h2>
        <div className="info-text">
          <p>
            The Opsium Decision Engine delivers measurable business value:
          </p>
          <ul className="feature-list">
            <li><strong>Service Quality:</strong> {impact?.serviceReliability.toFixed(1)}% service 
            reliability ensures consistent customer experience while optimizing capacity</li>
            <li><strong>Cost Efficiency:</strong> Strategy-driven planning reduces white-tail 
            capacity and optimizes utilization, leading to estimated savings of 
            ${(impact?.costSavings / 1000).toFixed(1)}K per route over the analysis period</li>
            <li><strong>Operational Agility:</strong> The 4-Factor Decision Lens enables 
            route-specific strategies that adapt to unique operational contexts</li>
            <li><strong>Risk Mitigation:</strong> Conservative strategies protect service quality 
            on high-risk routes while maximizing utilization on stable routes</li>
          </ul>
        </div>
      </div>

      <div className="info-section">
        <h2 className="section-title">Scalability Across Routes</h2>
        <div className="info-text">
          <p>
            The Decision Engine is designed to scale across FedEx's entire network:
          </p>
          <ul className="feature-list">
            <li><strong>Route-Specific Intelligence:</strong> Each route receives a customized 
            capacity strategy based on its unique operational profile</li>
            <li><strong>Consistent Framework:</strong> The 4-Factor Decision Lens provides a 
            standardized evaluation framework that can be applied to any route</li>
            <li><strong>Real-Time Adaptation:</strong> Strategies can be updated as operational 
            conditions change, ensuring decisions remain optimal</li>
            <li><strong>Explainable Decisions:</strong> Every capacity commitment is traceable 
            to specific factor evaluations, enabling transparency and trust</li>
          </ul>
        </div>
      </div>

      <div className="info-section">
        <h2 className="section-title">The Core Innovation</h2>
        <div className="info-text">
          <p>
            <strong>Two routes with identical demand forecasts may require opposite capacity 
            decisions.</strong>
          </p>
          <p>
            This application has demonstrated how the Opsium Decision Engine:
          </p>
          <ol className="feature-list">
            <li><strong>Preserves forecast integrity:</strong> We do not modify demand forecasts</li>
            <li><strong>Adjusts operational trust:</strong> We evaluate how much to trust forecasts 
            based on operational context</li>
            <li><strong>Enables strategy-driven planning:</strong> We apply route-specific strategies 
            that optimize multiple objectives</li>
            <li><strong>Delivers measurable value:</strong> We improve service reliability, optimize 
            utilization, and reduce operational risk</li>
          </ol>
        </div>
      </div>

      <div className="banner" style={{ marginTop: '32px' }}>
        <div className="banner-title">Final Statement</div>
        <div className="banner-text" style={{ fontSize: '18px', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '16px' }}>
            <strong>We don't optimize planes. We optimize decisions.</strong>
          </p>
          <p>
            The Opsium Decision Engine transforms capacity planning from a forecast-following 
            exercise into a strategic decision-making process. By applying operational intelligence 
            through the 4-Factor Decision Lens, we enable FedEx to make better capacity commitments 
            that balance utilization, cost efficiency, and service reliability across every route 
            in the network.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Impact

