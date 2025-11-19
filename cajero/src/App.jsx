import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { OrderProvider } from './services/OrderContext'
import OrderPage from './pages/OrderPage'
import HistoryPage from './pages/HistoryPage'
import SyncStatus from './components/SyncStatus'
import './App.css'

function App() {
  return (
    <OrderProvider>
      <Router>
        <div className="app">
          <header className="app-header">
            <h1>Cajero - Carrito Comidas</h1>
            <SyncStatus />
          </header>
          
          <div className="app-main">
            <nav className="app-nav">
              <button className="nav-button active">
                Nuevo Pedido
              </button>
              <button className="nav-button">
                Historial
              </button>
            </nav>
            
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<OrderPage />} />
                <Route path="/history" element={<HistoryPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </OrderProvider>
  )
}

export default App