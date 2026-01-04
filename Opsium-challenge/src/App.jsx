import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { loadAllData } from './utils/dataLoader'
import { AppProvider, useApp } from './context/AppContext'
import Overview from './pages/Overview'
import BusinessPlan from './pages/BusinessPlan'
import Forecast from './pages/Forecast'
import DecisionEngine from './pages/DecisionEngine'
import WeeklyPlan from './pages/WeeklyPlan'
import Execution from './pages/Execution'
import Comparison from './pages/Comparison'
import Impact from './pages/Impact'
import './App.css'

function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Overview' },
    { path: '/business-plan', label: 'Business Plan' },
    { path: '/forecast', label: 'Forecast' },
    { path: '/decision-engine', label: 'Decision Engine' },
    { path: '/weekly-plan', label: 'Weekly Plan' },
    { path: '/execution', label: 'Execution' },
    { path: '/comparison', label: 'Comparison' },
    { path: '/impact', label: 'Impact' }
  ]

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-text">FedEx</span>
          <span className="logo-subtitle">Capacity Planning</span>
        </div>
        <div className="nav-links">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

function AppContent() {
  const { data, setData, selectedRoute, setSelectedRoute, selectedDate, setSelectedDate, selectedFlight, setSelectedFlight } = useApp()
  const [loading, setLoading] = useState(!data)

  useEffect(() => {
    if (!data) {
      loadAllData().then(loadedData => {
        setData(loadedData)
        setLoading(false)
      })
    }
  }, [data, setData])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading capacity planning data...</p>
      </div>
    )
  }

  return (
    <div className="app-content">
      <Routes>
        <Route path="/" element={
          <Overview 
            data={data}
            selectedRoute={selectedRoute}
            selectedDate={selectedDate}
            selectedFlight={selectedFlight}
            onRouteChange={setSelectedRoute}
            onDateChange={setSelectedDate}
            onFlightChange={setSelectedFlight}
          />
        } />
        <Route path="/business-plan" element={
          <BusinessPlan 
            data={data}
            selectedRoute={selectedRoute}
            selectedDate={selectedDate}
          />
        } />
        <Route path="/forecast" element={
          <Forecast 
            data={data}
            selectedRoute={selectedRoute}
            selectedDate={selectedDate}
          />
        } />
        <Route path="/decision-engine" element={
          <DecisionEngine 
            data={data}
            selectedRoute={selectedRoute}
            selectedDate={selectedDate}
            selectedFlight={selectedFlight}
          />
        } />
        <Route path="/weekly-plan" element={
          <WeeklyPlan 
            data={data}
            selectedRoute={selectedRoute}
            selectedDate={selectedDate}
          />
        } />
        <Route path="/execution" element={
          <Execution 
            data={data}
            selectedRoute={selectedRoute}
            selectedDate={selectedDate}
          />
        } />
        <Route path="/comparison" element={
          <Comparison 
            data={data}
            selectedRoute={selectedRoute}
          />
        } />
        <Route path="/impact" element={
          <Impact 
            data={data}
            selectedRoute={selectedRoute}
          />
        } />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Navigation />
          <AppContent />
        </div>
      </Router>
    </AppProvider>
  )
}

export default App

