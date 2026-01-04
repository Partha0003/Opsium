# FedEx Capacity Planning Decision Intelligence Application

Enterprise-grade web application for the Opsium – FedEx Tricolor Challenge (Round-03 Finale).

## Overview

This application demonstrates how FedEx should convert demand forecasts into operationally sound capacity decisions, under real-world cost, risk, and flexibility constraints. It is a **decision-intelligence prototype**, not a dashboard.

### Core Principle
**Forecasts are inputs. Decisions are the product.**

## Key Innovation

**"Two routes with identical demand forecasts may require opposite capacity decisions."**

This is achieved using a 4-Factor Decision Lens:
1. Demand Stability
2. Cost Exposure (Fixed vs Variable)
3. Delay Risk
4. Real-Time Flexibility

## Technology Stack

- **React 18** - Frontend framework
- **React Router** - Navigation
- **Recharts** - Data visualization
- **PapaParse** - CSV data loading
- **Vite** - Build tool and dev server

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Build

```bash
npm run build
```

## Application Structure

### Pages

1. **Overview** - Problem statement and navigation guide
2. **Business Plan** - Long-term static planning assumptions
3. **Forecast** - Explainable demand forecasting with confidence
4. **Decision Engine** - 4-Factor Decision Lens (core innovation)
5. **Weekly Plan** - Strategy-driven capacity commitments
6. **Execution** - Actual outcomes and performance
7. **Comparison** - Forecast-Only vs Opsium Strategy
8. **Impact** - Business value and scalability

### Data Files

The application loads the following CSV files from the `public` directory:

- `customer_sku_demand_signals.csv`
- `forecasted_demand_output.csv`
- `flight_capacity_master.csv`
- `business_plan_capacity.csv`
- `weekly_plan_capacity.csv`
- `execution_actuals.csv`
- `planning_vs_execution_summary.csv`

## Design System

- **Primary Colors:**
  - Navy: `#2e276c`
  - Orange: `#e95b1c`
  - Slate/Gray: `#1a1a3e`, `#3d3578`
  - White: `#ffffff`

- **Theme:** Enterprise-grade styling inspired by internal FedEx tools

## Key Features

- Route, date, and flight selection
- Interactive data visualizations
- Strategy-driven capacity planning
- Performance comparison analysis
- Explainable decision logic

## License

Proprietary - FedEx Tricolor Challenge

