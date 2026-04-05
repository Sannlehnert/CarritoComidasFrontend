import React, { useEffect, useRef } from 'react'
import { useOrder } from '../services/OrderContext'
import OrderCard from '../components/OrderCard'

const KitchenPage = () => {
  const { orders, filter, setFilter, connectionStatus } = useOrder()
  const audioRef = useRef(null)

  useEffect(() => {
    const handleNewOrder = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('audio error', e))
      }
    }
    window.addEventListener('new-kitchen-order', handleNewOrder)
    return () => window.removeEventListener('new-kitchen-order', handleNewOrder)
  }, [])

  const filteredOrders = orders.filter(order => filter === 'all' || order.estado === filter)
  const counts = {
    all: orders.length,
    pendiente: orders.filter(o => o.estado === 'pendiente').length,
    en_preparacion: orders.filter(o => o.estado === 'en_preparacion').length,
    listo: orders.filter(o => o.estado === 'listo').length
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100 kiosk-mode">
      <header className="bg-white px-4 md:px-6 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src="/images/Logo.png" alt="Logo" className="h-10 w-auto object-contain" />
<h1 className="font-title text-xl font-bold text-primary">Cocina</h1>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-extrabold text-primary">{orders.length}</div>
            <div className="text-xs text-gray-600 uppercase">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-primary">{counts.pendiente}</div>
            <div className="text-xs text-gray-600 uppercase">Pendientes</div>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-lg text-sm ${connectionStatus === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
{connectionStatus === 'connected' ? 'Conectado' : 'Reconectando...'}
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex-shrink-0">
        <div className="flex gap-3 flex-wrap">
          {[
            { key: 'all', label: 'Todas' },
            { key: 'pendiente', label: 'Pendientes' },
            { key: 'en_preparacion', label: 'Preparando' },
            { key: 'listo', label: 'Listas' }
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-all ${
                filter === key
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setFilter(key)}
            >
              <span className="font-bold text-base">{counts[key]}</span>
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 auto-rows-max">
          {filteredOrders.map(order => (
            <OrderCard key={order.temp_id} order={order} />
          ))}
          {filteredOrders.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
<h3 className="font-title text-xl mb-2">No hay órdenes</h3>
              <p>Esperando nuevos pedidos...</p>
            </div>
          )}
        </div>
      </div>
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
    </div>
  )
}

export default KitchenPage