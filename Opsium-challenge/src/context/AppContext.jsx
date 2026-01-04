import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppProvider({ children, initialData }) {
  const [selectedRoute, setSelectedRoute] = useState('DEL-FRA')
  const [selectedDate, setSelectedDate] = useState('2026-01-01')
  const [selectedFlight, setSelectedFlight] = useState('FX366')
  const [data, setData] = useState(initialData)

  return (
    <AppContext.Provider value={{
      data,
      setData,
      selectedRoute,
      setSelectedRoute,
      selectedDate,
      setSelectedDate,
      selectedFlight,
      setSelectedFlight
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

