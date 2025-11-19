import React from 'react'
import { useOrder } from '../services/OrderContext'

const OrderSummary = () => {
  const { 
    currentOrder, 
    removeItem, 
    updateNotas, 
    updateCliente, 
    clearOrder, 
    submitOrder,
    addItem 
  } = useOrder()

  const handleSubmit = () => {
    if (currentOrder.items.length === 0) {
      alert('Agregá al menos un ítem al pedido')
      return
    }
    
    if (window.confirm('¿Enviar pedido a cocina?')) {
      submitOrder()
    }
  }

  const handleQuickAdd = (itemName, price) => {
    addItem({
      nombre_item: itemName,
      precio: price,
      observacion: ''
    })
  }

  return (
    <div className="summary-section">
      <div className="order-summary">
        {/* Header */}
        <div className="summary-header">
          <h2>Pedido Actual</h2>
          <button 
            className="clear-button"
            onClick={clearOrder}
            disabled={currentOrder.items.length === 0}
          >
            Limpiar
          </button>
        </div>

        {/* Información del Cliente */}
        <div className="customer-info">
          <div className="customer-field">
            <label>Tipo de Cliente</label>
            <select 
              value={currentOrder.cliente} 
              onChange={(e) => updateCliente(e.target.value)}
              className="customer-select"
            >
              <option value="Mostrador 1">Mostrador 1</option>
              <option value="Mostrador 2">Mostrador 2</option>
              <option value="Delivery">Delivery</option>
              <option value="Retiro">Retiro en Local</option>
            </select>
          </div>
        </div>

        {/* Lista de Items */}
        <div className="items-list">
          {currentOrder.items.map((item, index) => (
            <div key={index} className="order-item">
              <div className="item-quantity">{item.cantidad}</div>
              
              <div className="item-details">
                <div className="item-name">{item.nombre_item}</div>
                {item.observacion && (
                  <div className="item-observation">
                    {item.observacion}
                  </div>
                )}
              </div>

              <div className="item-price">${item.precio * item.cantidad}</div>

              <div className="item-actions">
                <button
                  className="quantity-btn"
                  onClick={() => removeItem(item)}
                  disabled={item.cantidad <= 1}
                >
                  -
                </button>
                <button
                  className="quantity-btn"
                  onClick={() => addItem(item)}
                >
                  +
                </button>
                <button
                  className="remove-btn"
                  onClick={() => {
                    for (let i = 0; i < item.cantidad; i++) {
                      removeItem(item)
                    }
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}

          {currentOrder.items.length === 0 && (
            <div className="empty-order">
              <div className="empty-order-icon">🛒</div>
              <h3>Pedido Vacío</h3>
              <p>Seleccioná productos del menú</p>
            </div>
          )}
        </div>

        {/* Notas */}
        <div className="notes-section">
          <label>
            Observaciones
            <textarea
              value={currentOrder.notas}
              onChange={(e) => updateNotas(e.target.value)}
              placeholder="Notas especiales..."
              className="notes-textarea"
            />
          </label>
        </div>

        {/* Total */}
        <div className="order-total">
          <div className="total-amount">${currentOrder.total}</div>
          <div className="total-label">Total</div>
        </div>

        {/* Acciones */}
        <div className="submit-section">
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={currentOrder.items.length === 0}
          >
            Enviar a Cocina
          </button>

          <div className="quick-actions">
            <button 
              className="quick-action"
              onClick={() => handleQuickAdd('Papas Extra', 400)}
            >
              🍟 Papas Extra
            </button>
            <button 
              className="quick-action"
              onClick={() => handleQuickAdd('Salsa Extra', 200)}
            >
              🧂 Salsas Extra
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary