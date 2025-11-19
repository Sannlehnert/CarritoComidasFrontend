import React from 'react'
import { useOrder } from '../services/OrderContext'

const HistoryPage = () => {
  const { sentOrders } = useOrder()

  return (
    <div className="history-page">
      <h2>Historial de Pedidos</h2>
      <div className="orders-list">
        {sentOrders.map((order, index) => (
          <div key={order.temp_id || index} className="history-order">
            <div className="order-header">
              <span className="order-id">#{order.temp_id?.slice(-8) || 'N/A'}</span>
              <span className="order-time">
                {new Date(order.created_at).toLocaleTimeString()}
              </span>
            </div>
            <div className="order-client">{order.cliente}</div>
            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="history-item">
                  <span>{item.nombre_item} x{item.cantidad}</span>
                  {item.observacion && (
                    <span className="item-obs">({item.observacion})</span>
                  )}
                  <span>${item.precio * item.cantidad}</span>
                </div>
              ))}
            </div>
            {order.notas && (
              <div className="order-notes">
                <strong>Notas:</strong> {order.notas}
              </div>
            )}
            <div className="order-total">Total: ${order.total}</div>
          </div>
        ))}
        {sentOrders.length === 0 && (
          <div className="empty-history">
            <p>No hay pedidos en el historial</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage