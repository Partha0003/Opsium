# 📦 Opsium Project
## Explainable Demand Forecasting & Risk-Aware Capacity Optimization for FedEx Tricolor Network

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://python.org)
[![Pandas](https://img.shields.io/badge/Pandas-1.5%2B-green.svg)](https://pandas.pydata.org)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.0%2B-orange.svg)](https://scikit-learn.org)
[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-orange.svg)](https://jupyter.org)

> End-to-end explainable framework that converts demand signals into operationally trusted flight capacity decisions

## 📌 Overview

This project delivers an end-to-end, explainable framework that converts demand signals into operationally trusted flight capacity decisions for the FedEx Tricolor Challenge. Instead of optimizing demand forecasts in isolation, the solution focuses on bridging the gap between planning and execution—a key challenge in large logistics networks such as FedEx.

The framework ensures that demand forecasts are treated as **inputs, not capacity targets**, and that capacity allocation reflects cost exposure, delay risk, and operational flexibility. The solution prioritizes **interpretability, realism, and decision scalability** over black-box accuracy.

## 🎯 Problem Statement

Traditional forecast-driven planning often leads to:
- **White-tail capacity** from over-commitment
- **Load factor mismatch** between planned and actual utilization
- **Increased delay risk** on fragile routes
- **One-size-fits-all** utilization targets

### Objective
Design a framework that converts demand forecasts into risk-aware, cost-aware capacity decisions, reducing planning-execution gaps without adding flights.

## 🧠 Solution Overview

The solution is structured into two integrated segments:

### Segment 1 — Explainable Demand Forecasting (Round-02)
- **Signal-aware, regression-based forecasting**
- **Demand decomposed into:**
  - Base demand
  - Promotion-driven volatility
  - Sentiment and sustainability alignment
- **Forecasts include confidence and stability indicators**

### Segment 2 — Capacity Decision Framework (Round-03)
- **Rule-based, explainable capacity logic** (no black-box optimization)
- **Capacity decisions governed by a 4-Factor Decision Lens:**
  - Demand Stability
  - Cost Exposure (Fixed vs Variable)
  - Delay Risk
  - Real-Time Flexibility

### 🔑 Key Insight
**Two routes with identical demand forecasts may require opposite capacity decisions.**

## 🔁 End-to-End Flow

```
Customer & External Signals
(Promotions • Sentiment • Sustainability • Regulation)
                    ↓
Explainable Demand Forecasting (Segment 1)
(SKU- & Route-Level Forecast + Confidence)
                    ↓
Forecasted Demand as Planning Input
                    ↓
Capacity Decision Framework (Segment 2)
(Cost • Risk • Flexibility Lens)
                    ↓
Operational Decisions
(Utilization • Buffering • Conservative Loading)
```

## 📊 Synthetic Dataset Design

### Why Synthetic Data?
No official dataset was provided. To ensure realism and explainability, domain-informed synthetic datasets were created to reflect real-world logistics behavior while enabling controlled experimentation.

### Dataset 1 — Customer SKU Demand Signals
**File**: `customer_sku_demand_signals.csv`  
**Purpose**: Capture customer-level demand drivers and volatility

**Key Features**:
- `base_demand` — organic demand baseline
- `promotion_flag`, `discount_percentage` — short-term demand shocks
- `sentiment_score`, `review_volume` — digital perception signals
- `sustainable_sku_flag`, `eco_preference_index` — long-term demand stability
- `regulation_impact_score` — regulatory influence

### Dataset 2 — Forecasted Demand Output
**File**: `forecasted_demand_output.csv`  
**Purpose**: Store model-generated, time-bound demand forecasts used directly for capacity planning

**Outputs**:
- `forecasted_demand`
- `forecast_confidence`

### Dataset 3 — Tricolor Flight Capacity Metadata
**File**: `tricolor_flight_capacity.csv`  
**Purpose**: Represent FedEx-like operational constraints

**Key Features**:
- `max_capacity`
- `fixed_cost`
- `variable_cost_per_unit`
- `real_time_update_flag`
- `delay_risk_score`

### Dataset 4 — Round-03 Capacity Decisions (FINAL OUTPUT)
**File**: `round3_capacity_decisions.csv`  
**Purpose**: Contains route-level capacity strategy decisions generated using the 4-Factor Decision Lens

**Key Columns**:
- `route`
- `forecasted_demand`
- `max_capacity`
- `demand_stability`
- `cost_profile`
- `delay_risk_flag`
- `flexibility_flag`
- `utilization_strategy`
- `planning_comment`

**This file represents the final operational output of the project.**

## ⚙️ Modeling & Decision Logic

### Demand Forecasting (Segment 1)
- **Model**: Regression-based, interpretable
- **Goal**: Explain why demand changes, not just how much

### Capacity Decision Logic (Segment 2)

| Route Characteristics | Capacity Strategy |
|----------------------|-------------------|
| Stable demand + High fixed cost | Maximize utilization |
| Volatile demand + Real-time flexibility | Dynamic buffer |
| High delay risk | Conservative loading |
| Low cost + Flexible operations | Absorb uncertainty |

**We do not change demand forecasts — we change how much we trust them operationally.**

## 📈 Business Impact

- ✅ **Reduced white-tail capacity** through targeted utilization
- ✅ **Improved alignment** between planned and actual load factors
- ✅ **Lower delay risk** on fragile routes
- ✅ **Explicit trade-offs** between cost, risk, and reliability
- ✅ **Scalable framework** applicable across the Tricolor network

### Executive Insight
*For FedEx, the cost of being wrong on a high-risk route is higher than flying slightly empty — and this framework makes that trade-off explicit.*

## 📁 Project Structure

```
Opsium/
├── Opsium_Notebook.ipynb              # End-to-end notebook (Round-02 + Round-03)
├── data/
│   ├── customer_sku_demand_signals.csv
│   ├── forecasted_demand_output.csv
│   ├── tricolor_flight_capacity.csv
│   └── round3_capacity_decisions.csv  # Final Round-03 output
├── notebooks/                         # Optional supporting notebooks
└── README.md
```

## ▶️ Usage

1. **Open** `Opsium_Notebook.ipynb` in Jupyter or VS Code
2. **Ensure** all CSV files are present in the `data/` directory
3. **Run cells sequentially** to reproduce:
   - Demand forecasting
   - Capacity classification
   - Strategy visualizations

## 📦 Dependencies

- Python 3.x
- Pandas
- NumPy
- Scikit-learn
- Matplotlib

**Install via:**
```bash
pip install pandas numpy scikit-learn matplotlib
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Jupyter Notebook or JupyterLab

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Partha0003/Opsium.git
   cd Opsium
   ```

2. **Install dependencies**
   ```bash
   pip install pandas numpy scikit-learn matplotlib
   ```

3. **Launch Jupyter Notebook**
   ```bash
   jupyter notebook Opsium_Notebook.ipynb
   ```

## 🔬 Technical Implementation

### Methodology

#### 1. Demand Analysis
- **Forecast Validation**: Confidence interval analysis
- **Trend Identification**: Seasonal and promotional patterns
- **Risk Assessment**: Demand uncertainty quantification

#### 2. Capacity Optimization
- **Multi-Objective Framework**: Cost vs. service level balance
- **Constraint Handling**: Operational and regulatory limitations
- **Scenario Planning**: What-if analysis for different demand scenarios

#### 3. Decision Framework
- **Rule-Based Logic**: Explainable decision trees
- **4-Factor Decision Lens**: Systematic capacity evaluation
- **Hybrid Approach**: Combined analytical and heuristic methods

### Key Performance Indicators

#### Operational Metrics
- **Capacity Utilization**: Percentage of available capacity used
- **Cost Efficiency**: Cost per unit transported
- **Service Level**: On-time delivery performance
- **Forecast Accuracy**: Demand prediction precision

#### Optimization Metrics
- **Total Cost Minimization**: Overall operational cost reduction
- **Risk-Adjusted Returns**: Performance considering uncertainty
- **Resource Allocation Efficiency**: Optimal capacity distribution

## 🛠️ Advanced Features

### Risk Management Components
- **Demand Uncertainty**: Confidence-based capacity buffering
- **Capacity Constraints**: Dynamic constraint handling
- **Cost Volatility**: Multi-scenario cost optimization

## 🎯 Results & Performance

### Framework Achievements
- 🎯 **Explainable Decision Making**: Every capacity decision includes reasoning
- 📈 **Operational Alignment**: Reduced planning-execution gaps
- ⚡ **Scalable Implementation**: Framework applicable across route networks
- 🎪 **Risk-Aware Planning**: Explicit trade-offs between cost and reliability

### Key Insights
1. **Demand Patterns**: Stability matters more than absolute volume for capacity decisions
2. **Cost Optimization**: Fixed vs. variable cost structure drives utilization strategy
3. **Risk Factors**: High-risk routes require conservative capacity allocation
4. **Operational Efficiency**: Rule-based decisions outperform black-box optimization for explainability

## 🔍 Notebook Implementation

The comprehensive notebook covers both segments of the solution:

#### **Segment 1: Explainable Demand Forecasting**
1. **Data Loading & Signal Processing**
   - Import customer SKU demand signals
   - Feature engineering for demand drivers
   - Signal validation and preprocessing

2. **Demand Decomposition**
   - Base demand calculation
   - Promotion impact analysis
   - Sentiment and sustainability factors
   - Regulatory influence assessment

3. **Forecast Generation**
   - Regression-based demand prediction
   - Confidence interval calculation
   - Forecast stability metrics

#### **Segment 2: Capacity Decision Framework**
1. **Capacity Metadata Integration**
   - Flight capacity constraints
   - Cost structure analysis
   - Risk factor evaluation

2. **4-Factor Decision Lens Application**
   - Demand stability assessment
   - Cost exposure analysis
   - Delay risk evaluation
   - Flexibility scoring

3. **Strategy Generation**
   - Route-specific capacity decisions
   - Utilization strategy assignment
   - Planning commentary generation

4. **Results Validation**
   - Decision logic verification
   - Business impact assessment
   - Framework scalability analysis

## 🚀 Future Enhancements

### Planned Improvements
- [ ] **Real-time capacity adjustment** algorithms
- [ ] **Advanced ML integration** for pattern recognition
- [ ] **Multi-modal transportation** optimization
- [ ] **Dynamic pricing integration** with capacity decisions
- [ ] **Enhanced visualization** dashboard for planners

### Research Directions
- **Sustainability metrics** incorporation in decision framework
- **Customer satisfaction modeling** for service level optimization
- **Network-wide optimization** beyond individual routes
- **Predictive maintenance** integration with capacity planning


## 📚 References & Resources

- [FedEx Operations Research](https://www.fedex.com/en-us/about/policy/operations-research.html)
- [Supply Chain Optimization Best Practices](https://www.informs.org/Explore/Operations-Research-Analytics)
- [Logistics Analytics and Capacity Planning](https://www.supplychainbrain.com/topics/analytics)
- [Explainable AI in Operations Research](https://www.nature.com/articles/s42256-019-0048-x)


## Contributors


Team Name: OneAboveAll
Team Members:
Partha Sarathy G
Nithin bhargav G
N Piritha

Opsium – FedEx Tricolor Challenge Finalist

For questions or collaborations, please reach out via GitHub Issues.
