import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { OrderProvider } from './services/OrderContext'
import CashierPage from './pages/CashierPage'
import KitchenPage from './pages/KitchenPage'
import LauncherPage from './launcher/LauncherPage'

function App() {
  return (
    <OrderProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LauncherPage />} />
          <Route path="/cajero" element={<CashierPage />} />
          <Route path="/cocina" element={<KitchenPage />} />
        </Routes>
      </BrowserRouter>
    </OrderProvider>
  )
}

export default App