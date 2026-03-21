import React from 'react'
import { OrderProvider } from './services/OrderContext'
import KitchenDisplay from './pages/KitchenDisplay'
import './App.css'

function App() {
  return (
    <OrderProvider>
      <div className="app kiosk-mode">
        <header className="app-header">
          <img src="/images/Logo.png" alt="Smash House" height="35" />
          <h1 style={{marginLeft: '10px'}}>Smash House - Cocina</h1>
        </header>
        <KitchenDisplay />
      </div>
    </OrderProvider>
  )
}

export default App

