import React from 'react'
import ProductGrid from '../components/ProductGrid'
import OrderSummary from '../components/OrderSummary'
import './OrderPage.css'

const OrderPage = () => {
  return (
    <div className="order-page">
      <div className="order-layout">
        <ProductGrid />
        <OrderSummary />
      </div>
    </div>
  )
}

export default OrderPage