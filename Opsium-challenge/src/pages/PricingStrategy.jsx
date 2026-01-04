import React from 'react'
import { getPricingDataByDate } from '../utils/dataLoader'
import './PageStyles.css'

function PricingStrategy({ data, selectedRoute, selectedDate, selectedFlight, onRouteChange, onDateChange, onFlightChange }) {
  const pricingData = getPricingDataByDate(data, selectedRoute, selectedDate)

  const getStrategyClass = (strategy) => {
    if (strategy?.includes('Maximize')) return 'strategy-maximize'
    if (strategy?.includes('Buffer')) return 'strategy-buffer'
    if (strategy?.includes('Conservative')) return 'strategy-conservative'
    return 'strategy-balanced'
  }

  const getPricingBadgeClass = (pricing) => {
    if (pricing?.includes('Premium') || pricing?.includes('Priority')) return 'pricing-premium'
    if (pricing?.includes('Discount') || pricing?.includes('Spot')) return 'pricing-discount'
    if (pricing?.includes('Flexible') || pricing?.includes('Conditional')) return 'pricing-flexible'
    return 'pricing-standard'
  }

  // Get pricing explanation based on pricing recommendation
  const getPricingExplanation = (pricingRec, utilizationStrategy, planningComment) => {
    if (!pricingRec) return 'No pricing recommendation available.'
    
    if (pricingRec.includes('Premium') || pricingRec.includes('Priority')) {
      return `${pricingRec} is recommended because demand confidence is high, capacity is tight, and service reliability must be protected. This pricing strategy aligns with the ${utilizationStrategy} capacity approach to maximize revenue while maintaining operational excellence.`
    } else if (pricingRec.includes('Discount') || pricingRec.includes('Spot')) {
      return `${pricingRec} is recommended to improve utilization and attract price-sensitive demand. This approach balances the ${utilizationStrategy} capacity strategy by filling available capacity while managing risk exposure.`
    } else if (pricingRec.includes('Flexible') || pricingRec.includes('Conditional')) {
      return `${pricingRec} is recommended to adapt to uncertainty and balance risk with revenue. This strategy complements the ${utilizationStrategy} approach by allowing dynamic adjustments based on real-time demand signals.`
    }
    return `${pricingRec} is recommended based on current demand signals and capacity constraints.`
  }

  // Get pros and cons based on pricing recommendation
  const getProsAndCons = (pricingRec) => {
    if (!pricingRec) return { pros: [], cons: [] }
    
    if (pricingRec.includes('Premium') || pricingRec.includes('Priority')) {
      return {
        pros: [
          'Protects margins on constrained routes',
          'Ensures service reliability and quality',
          'Maximizes revenue per unit of capacity',
          'Maintains premium brand positioning'
        ],
        cons: [
          'Higher cost for customers may reduce demand',
          'Risk of demand deflection to competitors',
          'Potential underutilization if demand is price-sensitive',
          'Less accessible to price-sensitive market segments'
        ]
      }
    } else if (pricingRec.includes('Discount') || pricingRec.includes('Spot')) {
      return {
        pros: [
          'Improves capacity utilization',
          'Attracts price-sensitive customers',
          'Reduces void capacity and waste',
          'Increases market share and volume'
        ],
        cons: [
          'Lower margins per unit',
          'Risk of overbooking if demand spikes unexpectedly',
          'Potential revenue cannibalization from premium segments',
          'May attract low-value customers'
        ]
      }
    } else if (pricingRec.includes('Flexible') || pricingRec.includes('Conditional')) {
      return {
        pros: [
          'Adapts to uncertainty and volatility',
          'Balances risk and revenue optimization',
          'Allows dynamic response to demand changes',
          'Optimizes utilization across scenarios'
        ],
        cons: [
          'Requires real-time monitoring and adjustment',
          'Increased operational complexity',
          'Potential customer confusion from variable pricing',
          'Higher system and process overhead'
        ]
      }
    }
    
    return { pros: [], cons: [] }
  }

  // Get business impact indicators (qualitative)
  const getBusinessImpact = (pricingRec, utilizationStrategy, loadFactor, voidCapacity) => {
    if (!pricingRec) return null
    
    const loadFactorPercent = (loadFactor || 0) * 100
    const hasHighVoid = voidCapacity > 500
    
    if (pricingRec.includes('Premium') || pricingRec.includes('Priority')) {
      return {
        revenue: 'High',
        capacityEfficiency: loadFactorPercent > 50 ? 'Medium' : 'Low',
        serviceReliability: 'High',
        customerExperience: 'High'
      }
    } else if (pricingRec.includes('Discount') || pricingRec.includes('Spot')) {
      return {
        revenue: 'Medium',
        capacityEfficiency: 'High',
        serviceReliability: hasHighVoid ? 'Medium' : 'High',
        customerExperience: 'Medium'
      }
    } else if (pricingRec.includes('Flexible') || pricingRec.includes('Conditional')) {
      return {
        revenue: 'Medium',
        capacityEfficiency: 'Medium',
        serviceReliability: 'Medium',
        customerExperience: 'Medium'
      }
    }
    
    return {
      revenue: 'Medium',
      capacityEfficiency: 'Medium',
      serviceReliability: 'Medium',
      customerExperience: 'Medium'
    }
  }

  const prosAndCons = pricingData ? getProsAndCons(pricingData.pricing_recommendation) : { pros: [], cons: [] }
  const businessImpact = pricingData ? getBusinessImpact(
    pricingData.pricing_recommendation,
    pricingData.utilization_strategy,
    pricingData.load_factor,
    pricingData.void_capacity
  ) : null

  const getImpactClass = (level) => {
    if (level === 'High') return 'impact-high'
    if (level === 'Medium') return 'impact-medium'
    return 'impact-low'
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Pricing Strategy & Trade-off Analysis</h1>
        <p className="page-subtitle">
          Understanding why pricing recommendations are made and their business implications
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

      {pricingData ? (
        <>
          {/* Header Section — Context */}
          <div className="pricing-context-section">
            <div className="metric-grid">
              <div className="metric-card">
                <div className="metric-label">Selected Route</div>
                <div className="metric-value">{selectedRoute}</div>
                <div className="metric-description">Route under analysis</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Date / Time Window</div>
                <div className="metric-value">{selectedDate}</div>
                <div className="metric-description">Planning period</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Utilization Strategy</div>
                <div className="metric-value">
                  <span className={`strategy-badge ${getStrategyClass(pricingData.utilization_strategy)}`}>
                    {pricingData.utilization_strategy || 'N/A'}
                  </span>
                </div>
                <div className="metric-description">Capacity decision framework output</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Pricing Recommendation</div>
                <div className="metric-value">
                  <span className={`pricing-badge ${getPricingBadgeClass(pricingData.pricing_recommendation)}`}>
                    {pricingData.pricing_recommendation || 'N/A'}
                  </span>
                </div>
                <div className="metric-description">Strategic pricing decision</div>
              </div>
            </div>
          </div>

          {/* Pricing Strategy Explanation Card */}
          <div className="pricing-explanation-card">
            <h2 className="section-title">Pricing Strategy Explanation</h2>
            <div className="info-text">
              <p>
                {getPricingExplanation(
                  pricingData.pricing_recommendation,
                  pricingData.utilization_strategy,
                  pricingData.planning_comment
                )}
              </p>
            </div>
          </div>

          {/* Pros & Cons Comparison Panel */}
          <div className="pros-cons-section">
            <h2 className="section-title">Benefits & Trade-offs</h2>
            <div className="pros-cons-panel">
              <div className="pros-column">
                <h3 className="pros-cons-header">Benefits</h3>
                <ul className="pros-cons-list">
                  {prosAndCons.pros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div className="cons-column">
                <h3 className="pros-cons-header">Trade-offs / Risks</h3>
                <ul className="pros-cons-list cons-list">
                  {prosAndCons.cons.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Business Impact Summary Cards */}
          {businessImpact && (
            <div className="business-impact-section">
              <h2 className="section-title">Business Impact Summary</h2>
              <div className="metric-grid">
                <div className="impact-card">
                  <div className="metric-label">Revenue Impact</div>
                  <div className={`impact-badge ${getImpactClass(businessImpact.revenue)}`}>
                    {businessImpact.revenue}
                  </div>
                  <div className="metric-description">
                    Expected revenue impact from pricing strategy
                  </div>
                </div>
                <div className="impact-card">
                  <div className="metric-label">Capacity Efficiency Impact</div>
                  <div className={`impact-badge ${getImpactClass(businessImpact.capacityEfficiency)}`}>
                    {businessImpact.capacityEfficiency}
                  </div>
                  <div className="metric-description">
                    Impact on utilization and void capacity
                  </div>
                </div>
                <div className="impact-card">
                  <div className="metric-label">Service Reliability Impact</div>
                  <div className={`impact-badge ${getImpactClass(businessImpact.serviceReliability)}`}>
                    {businessImpact.serviceReliability}
                  </div>
                  <div className="metric-description">
                    Impact on service quality and reliability
                  </div>
                </div>
                <div className="impact-card">
                  <div className="metric-label">Customer Experience Impact</div>
                  <div className={`impact-badge ${getImpactClass(businessImpact.customerExperience)}`}>
                    {businessImpact.customerExperience}
                  </div>
                  <div className="metric-description">
                    Impact on customer satisfaction and retention
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Design Philosophy Section */}
          <div className="design-philosophy-section">
            <h2 className="section-title">Design Philosophy</h2>
            <div className="banner">
              <div className="banner-text">
                <strong>Pricing decisions are not optimized in isolation</strong> — they are derived from demand confidence, operational constraints, and service risk. Each pricing recommendation reflects a strategic trade-off between revenue maximization, capacity utilization, and service reliability, aligned with the underlying capacity strategy.
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="warning-box">
          <strong>No pricing data available</strong>
          <p>Please select a route and date to view pricing strategy analysis.</p>
        </div>
      )}
    </div>
  )
}

export default PricingStrategy

