import React from 'react'
import { useOrder } from '../services/OrderContext'

const OrderSummary = () => {
  const { currentOrder, addItem, removeItem, updateNotas, updateCliente, clearOrder, submitOrder } = useOrder()

  const handleSubmit = () => {
    if (currentOrder.items.length === 0) {
      alert('Agregá al menos un ítem')
      return
    }
    if (window.confirm('¿Enviar pedido a cocina?')) {
      submitOrder()
    }
  }

  return (
    <div className="bg-white flex flex-col overflow-hidden">
      <div className="flex-1 p-4 md:p-5 overflow-y-auto">
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-200">
          <h2 className="font-title text-lg font-semibold text-gray-900">Pedido</h2>
          <button 
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-danger text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-danger hover:text-white hover:border-danger transition-all"
            onClick={clearOrder} 
            disabled={currentOrder.items.length === 0}
          >
            Limpiar
          </button>
        </div>

        <div className="mb-5">
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white"
            value={currentOrder.cliente}
            onChange={(e) => updateCliente(e.target.value)}
          >
            <option>Mostrador 1</option>
            <option>Mostrador 2</option>
            <option>Delivery</option>
            <option>Retiro en Local</option>
          </select>
        </div>

        <div className="max-h-[300px] overflow-y-auto bg-gray-50 rounded-lg border border-gray-200 p-3 mb-5">
          {currentOrder.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg mb-2 last:mb-0">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {item.cantidad}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.nombre_item}</div>
                {item.observacion && <div className="text-xs text-gray-500 italic">{item.observacion}</div>}
              </div>
              <div className="font-semibold text-success whitespace-nowrap">
                ${(item.precio * item.cantidad).toLocaleString()}
              </div>
              <div className="flex gap-2">
                <button 
                  className="w-7 h-7 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                  onClick={() => removeItem(item)} 
                  disabled={item.cantidad <= 1}
                >-</button>
                <button 
                  className="w-7 h-7 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center"
                  onClick={() => addItem(item)}
                >+</button>
                <button 
                  className="w-7 h-7 rounded bg-gray-200 text-gray-700 hover:bg-danger hover:text-white flex items-center justify-center"
                  onClick={() => { for (let i = 0; i < item.cantidad; i++) removeItem(item) }}
                >×</button>
              </div>
            </div>
          ))}
          {currentOrder.items.length === 0 && (
            <div className="text-center py-8 text-gray-400">No hay productos</div>
          )}
        </div>

        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg resize-y min-h-[80px] mb-5 focus:outline-none focus:border-primary"
          placeholder="Notas especiales..."
          value={currentOrder.notas}
          onChange={(e) => updateNotas(e.target.value)}
        />

        <div className="bg-gray-50 p-4 text-center rounded-lg border border-gray-200 mb-5">
          <div className="text-2xl font-bold text-success">${currentOrder.total.toLocaleString()}</div>
          <div className="text-sm text-gray-500 font-medium">Total</div>
        </div>

        <button 
          className="w-full py-4 bg-success text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all"
          onClick={handleSubmit} 
          disabled={currentOrder.items.length === 0}
        >
          Enviar a Cocina
        </button>
      </div>
    </div>
  )
}

export default OrderSummary