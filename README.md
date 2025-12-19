# Opsium Project: FedEx Demand Forecasting and Capacity Optimization

## Overview

This project addresses a logistics competition challenge by developing an end-to-end solution for demand forecasting and capacity optimization in a FedEx-like operational context. In the absence of an official dataset, we engineered domain-informed synthetic datasets that simulate real-world logistics, demand signals, and operational constraints. Our approach prioritizes explainability, business realism, and actionable decision-making over black-box accuracy, enabling FedEx to leverage digital technologies for optimized capacity planning, cost control, and enhanced customer experience.

The project is implemented in a Jupyter Notebook (`Opsium_Notebook.ipynb`) and utilizes three custom synthetic datasets stored in the `data/` directory. Our methodology combines regression-based demand forecasting with rule-based capacity optimization logic to deliver interpretable, decision-focused analytics.

## Table of Contents

- [Dataset Creation Methodology](#dataset-creation-methodology)
- [Modeling Approach](#modeling-approach)
- [End-to-End Flow](#end-to-end-flow)
- [Key Design Principles](#key-design-principles)
- [Synthetic Dataset Design – Overview & Justification](#synthetic-dataset-design--overview--justification)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Contributors](#contributors)

## Dataset Creation Methodology

### Why Synthetic Data?

No official dataset was provided for this challenge. To address this, we designed domain-informed synthetic datasets that closely mimic real-world logistics, demand, and operational behavior while allowing controlled experimentation and explainability.

### Dataset 1: Customer SKU Demand Signals (`customer_sku_demand_signals.csv`)

**Purpose:**  
Capture factors that influence customer-level demand.

**How it was created:**  
- Generated customer–SKU–route combinations across monthly time periods  
- Assigned a stable `base_demand` to represent organic demand  
- Introduced controlled variability using business signals  

**Key Features & Logic:**  
- `promotion_flag`, `discount_percentage` → Introduced short-term demand uplift and volatility  
- `sentiment_score`, `review_volume` → Modeled digital perception and confidence in demand  
- `sustainable_sku_flag`, `eco_preference_index` → Represented long-term demand shifts driven by sustainability  
- `regulation_impact_score` → Modeled regulatory pressure influencing demand behavior  

All signals were generated within realistic ranges and designed to interact logically with demand rather than randomly.

### Dataset 2: Forecasted Demand Output (`forecasted_demand_output.csv`)

**Purpose:**  
Store model-generated demand forecasts used as direct input to capacity planning.

**How it was created:**  
- Applied a regression-based forecasting approach  
- Combined:  
  - Historical base demand  
  - Promotion & discount effects  
  - Sentiment strength and review confidence  
  - Sustainability and regulatory alignment  

The result is time-bound, signal-aware forecasted demand at SKU and route levels.

### Dataset 3: Tricolor Flight Capacity Data (`tricolor_flight_capacity.csv`)

**Purpose:**  
Represent FedEx operational constraints and decision variables.

**How it was created:**  
- Defined major Tricolor routes  
- Assigned realistic operational parameters:  
  - `fixed_cost` (aircraft, crew, lease)  
  - `variable_cost_per_unit` (fuel, handling)  
  - `real_time_update_flag` (digital readiness)  
  - `delay_risk_score` (operational reliability)  
  - `capacity` (maximum flight load)  

This dataset enables capacity optimization and pricing decisions driven by forecasted demand.

## Modeling Approach

### Demand Forecasting (Segment 1)

**Model Type:** Regression-based forecasting (signal-aware)  

**Inputs:**  
- Historical demand + promotions + sentiment + sustainability + regulation  

**Output:**  
- Forecasted demand by SKU, route, and time period  

**Goal:**  
- Explain why demand changes, not just how much  

### Capacity Optimization Logic (Segment 2)

No black-box optimization was used. Instead, we applied rule-based, explainable decision logic:  

- Compare forecasted demand vs capacity  
- Adjust decisions using:  
  - Fixed vs variable cost trade-offs  
  - Delay risk constraints  
  - Real-time update flexibility  

Generate recommendations for:  
- Capacity scaling  
- Pricing controls  
- Buffer allocation  
- Risk mitigation  

## End-to-End Flow

```
Customer & External Signals
(Promotions • Sentiment • Sustainability)
        ↓
Demand Forecasting (Segment 1)
(SKU- & Route-Level Forecast)
        ↓
Forecasted Demand Output
(Time-Bound, Explainable)
        ↓
Capacity Optimization (Segment 2)
(Cost • Risk • Digital Readiness)
        ↓
Actionable Decisions
(Optimized Capacity • Cost Control • Better CX)
```

## Key Design Principles

- **Explainability over black-box accuracy**  
- **Business realism in synthetic data**  
- **Clear linkage between forecast and operations**  
- **Decision-focused analytics**  

## Project Structure

```
Opsium/
├── Opsium_Notebook.ipynb          # Main Jupyter Notebook with analysis and modeling
├── data/
│   ├── customer_sku_demand_signals.csv    # Dataset 1
│   ├── forecasted_demand_output.csv       # Dataset 2
│   └── tricolor_flight_capacity.csv       # Dataset 3
└── notebooks/                           # Additional notebooks (if any)
```

## Usage

1. Open `Opsium_Notebook.ipynb` in Jupyter or VS Code.
2. Ensure the `data/` folder contains the required CSV files.
3. Run the notebook cells sequentially to reproduce the analysis, forecasting, and optimization steps.
4. Outputs include forecasted demand, capacity recommendations, and business insights.

## Dependencies

- Python 3.x
- Jupyter Notebook
- Pandas
- NumPy
- Scikit-learn (for regression modeling)
- Matplotlib/Seaborn (for visualizations, if used)

Install via: `pip install pandas numpy scikit-learn matplotlib seaborn`

## Contributors

- [Your Name/Team Name] - Project Lead and Developer

For questions or collaborations, please reach out via GitHub Issues.