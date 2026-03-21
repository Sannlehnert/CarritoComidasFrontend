import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { OrderProvider } from './services/OrderContext'
import OrderPage from './pages/OrderPage'
import HistoryPage from './pages/HistoryPage'
import SyncStatus from './components/SyncStatus'
import './App.css'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeRoute, setActiveRoute] = useState('order')

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <OrderProvider>
      <Router>
        <div className="app">
          <header className="app-header">
            <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-2)'}}>
              <img src="/images/Logo.png" alt="Logo" height="35" />
              <h1>Cajero</h1>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
              <SyncStatus />
              <button 
                className={`hamburger-btn ${mobileMenuOpen ? 'active' : ''}`}
                onClick={toggleMobileMenu}
                aria-label="Menú"
              >
                <span className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
            </div>
          </header>
          
          <div className="app-main">
            <nav className={`app-nav ${mobileMenuOpen ? 'open' : ''}`}>
              <button 
                className={`nav-button ${activeRoute === 'order' ? 'active' : ''}`}
                onClick={() => {
                  setActiveRoute('order')
                  closeMobileMenu()
                }}
              >
                Nuevo Pedido
              </button>
              <button 
                className={`nav-button ${activeRoute === 'history' ? 'active' : ''}`}
                onClick={() => {
                  setActiveRoute('history')
                  closeMobileMenu()
                }}
              >
                Historial
              </button>
            </nav>
            
            <div className="flex-1" onClick={closeMobileMenu}>
              <Routes>
                <Route path="/" element={<OrderPage />} />
                <Route path="/history" element={<HistoryPage />} />
              </Routes>
            </div>
          </div>

          <nav className="mobile-nav">
            <button 
              className={`mobile-nav-button ${activeRoute === 'order' ? 'active' : ''}`}
              onClick={() => {
                setActiveRoute('order')
                closeMobileMenu()
              }}
            >
              <span style={{fontSize: '1.2rem'}}>📱</span>
              <span>Nuevo Pedido</span>
            </button>
            <button 
              className={`mobile-nav-button ${activeRoute === 'history' ? 'active' : ''}`}
              onClick={() => {
                setActiveRoute('history')
                closeMobileMenu()
              }}
            >
              <span style={{fontSize: '1.2rem'}}>📋</span>
              <span>Historial</span>
            </button>
          </nav>
        </div>
      </Router>
    </OrderProvider>
  )
}

export default App

