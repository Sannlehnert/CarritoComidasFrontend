import React from 'react'
import ProductGrid from '../components/ProductGrid'
import OrderSummary from '../components/OrderSummary'

const CashierPage = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header con logo */}
      <header className="bg-white px-4 md:px-6 py-3 border-b border-gray-200 flex items-center gap-3 shadow-sm flex-shrink-0">
        <img src="/images/Logo.png" alt="Logo" className="h-10 w-auto object-contain" />
        <h1 className="font-title text-xl font-bold text-primary">Cajero</h1>
      </header>
      {/* Contenido principal */}
      <div className="flex-1 flex overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] h-full w-full">
          <ProductGrid />
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}

export default CashierPage