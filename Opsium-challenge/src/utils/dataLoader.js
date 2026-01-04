import Papa from 'papaparse'

const CSV_FILES = {
  customerDemand: '/customer_sku_demand_signals.csv',
  forecastedDemand: '/forecasted_demand_output.csv',
  flightCapacity: '/flight_capacity_master.csv',
  businessPlan: '/business_plan_capacity.csv',
  weeklyPlan: '/weekly_plan_capacity.csv',
  execution: '/execution_actuals.csv',
  planningSummary: '/planning_vs_execution_summary.csv'
}

function loadCSV(filePath) {
  return fetch(filePath)
    .then(response => response.text())
    .then(text => {
      return new Promise((resolve, reject) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            resolve(results.data)
          },
          error: (error) => {
            reject(error)
          }
        })
      })
    })
}

export async function loadAllData() {
  try {
    const [
      customerDemand,
      forecastedDemand,
      flightCapacity,
      businessPlan,
      weeklyPlan,
      execution,
      planningSummary
    ] = await Promise.all([
      loadCSV(CSV_FILES.customerDemand),
      loadCSV(CSV_FILES.forecastedDemand),
      loadCSV(CSV_FILES.flightCapacity),
      loadCSV(CSV_FILES.businessPlan),
      loadCSV(CSV_FILES.weeklyPlan),
      loadCSV(CSV_FILES.execution),
      loadCSV(CSV_FILES.planningSummary)
    ])

    // Process numeric fields
    const processNumeric = (data, fields) => {
      return data.map(row => {
        const processed = { ...row }
        fields.forEach(field => {
          if (processed[field] !== undefined && processed[field] !== '') {
            processed[field] = parseFloat(processed[field])
          }
        })
        return processed
      })
    }

    return {
      customerDemand: processNumeric(customerDemand, [
        'base_demand', 'discount_percentage', 'sentiment_score', 
        'review_volume', 'regulation_impact_score', 'eco_preference_index'
      ]),
      forecastedDemand: processNumeric(forecastedDemand, [
        'base_demand', 'forecasted_demand', 'forecast_confidence'
      ]),
      flightCapacity: processNumeric(flightCapacity, [
        'max_capacity', 'fixed_cost', 'variable_cost_per_unit', 'delay_risk_score'
      ]),
      businessPlan: processNumeric(businessPlan, [
        'planned_capacity', 'planned_net_weight'
      ]),
      weeklyPlan: processNumeric(weeklyPlan, [
        'committed_capacity', 'max_capacity'
      ]),
      execution: processNumeric(execution, [
        'actual_net_weight', 'load_factor', 'void_capacity'
      ]),
      planningSummary: processNumeric(planningSummary, [
        'forecasted_demand', 'committed_capacity', 'actual_net_weight', 
        'void_capacity', 'load_factor'
      ])
    }
  } catch (error) {
    console.error('Error loading data:', error)
    throw error
  }
}

export function getRouteData(data, route) {
  if (!data) return null
  
  return {
    forecastedDemand: data.forecastedDemand.filter(d => d.route === route),
    businessPlan: data.businessPlan.filter(d => d.route === route),
    weeklyPlan: data.weeklyPlan.filter(d => d.route === route),
    execution: data.execution.filter(d => d.route === route),
    planningSummary: data.planningSummary.filter(d => d.route === route)
  }
}

export function getDateData(routeData, date) {
  if (!routeData) return null
  
  return {
    forecasted: routeData.forecastedDemand.find(d => d.time_period === date),
    businessPlan: routeData.businessPlan.find(d => d.date === date),
    weeklyPlan: routeData.weeklyPlan.find(d => d.date === date),
    execution: routeData.execution.find(d => d.date === date),
    planningSummary: routeData.planningSummary.find(d => d.date === date)
  }
}

export function getFlightData(data, flightId) {
  if (!data) return null
  return data.flightCapacity.find(f => f.flight_id === flightId)
}

export function calculateDemandStability(forecastedData) {
  if (!forecastedData || forecastedData.length < 2) return 0.5
  
  const values = forecastedData.map(d => d.forecasted_demand || 0)
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  const stdDev = Math.sqrt(variance)
  const cv = mean > 0 ? stdDev / mean : 1
  
  // Lower CV = higher stability
  return Math.max(0, Math.min(1, 1 - cv))
}

export function calculateCostExposure(flightData) {
  if (!flightData) return 0.5
  
  // Higher fixed cost relative to variable = higher exposure
  const totalAtCapacity = flightData.fixed_cost + (flightData.variable_cost_per_unit * flightData.max_capacity)
  const fixedRatio = flightData.fixed_cost / totalAtCapacity
  
  return fixedRatio
}

export function getDelayRisk(flightData) {
  if (!flightData) return 0.5
  return flightData.delay_risk_score || 0
}

export function getFlexibility(flightData) {
  if (!flightData) return 0.5
  return flightData.real_time_update_flag === 1 ? 0.9 : 0.3
}

export function determineStrategy(factors) {
  const { demandStability, costExposure, delayRisk, flexibility } = factors
  
  // Decision logic based on 4 factors
  if (demandStability > 0.7 && costExposure < 0.5 && delayRisk < 0.3) {
    return 'Maximize Utilization'
  } else if (flexibility > 0.7 && delayRisk < 0.4) {
    return 'Dynamic Buffer'
  } else if (delayRisk > 0.5 || costExposure > 0.7) {
    return 'Conservative Loading'
  } else {
    return 'Balanced Allocation'
  }
}

