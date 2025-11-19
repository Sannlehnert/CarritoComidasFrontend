import React from 'react'
import { OrderProvider } from './services/OrderContext'
import KitchenDisplay from './pages/KitchenDisplay'
import './App.css'

function App() {
  return (
    <OrderProvider>
      <div className="app kiosk-mode">
        <KitchenDisplay />
      </div>
    </OrderProvider>
  )
}

export default App