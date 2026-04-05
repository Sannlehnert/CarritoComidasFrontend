import React from 'react'
import { useOrder } from '../services/OrderContext'

const OrderCard = ({ order }) => {
  const { updateOrderStatus, deleteOrder } = useOrder()

  const getNextStatus = (estado) => {
    switch (estado) {
      case 'pendiente': return { next: 'en_preparacion', label: 'Aceptar', color: 'bg-primary' }
      case 'en_preparacion': return { next: 'listo', label: 'Marcar Listo', color: 'bg-warning' }
      case 'listo': return { next: 'entregado', label: 'Entregar', color: 'bg-success' }
      default: return { next: null, label: 'Entregado', color: 'bg-gray-400' }
    }
  }

  const handleAction = async () => {
    const { next } = getNextStatus(order.estado)
    if (next === 'entregado') {
      // Si es "Entregar", borramos el pedido directamente
      await deleteOrder(order.temp_id)
    } else if (next) {
      // Actualizamos estado normalmente
      await updateOrderStatus(order.temp_id, next)
    }
  }

  const { label, color } = getNextStatus(order.estado)
  const elapsed = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000)
  const timeAgo = elapsed < 1 ? 'Ahora' : `Hace ${elapsed}min`

  // Función para obtener la imagen del producto (búsqueda simple por nombre)
  const getProductImage = (nombre) => {
    const images = {
      'Hamburguesa Clásica': '/images/HamburguesaClasica.png',
      'Hamburguesa Especial': '/images/HamburguesaEspecial.png',
      'Hamburguesa Doble': '/images/HamburguesaDoble.png',
      'Hamburguesa Veggie': '/images/HamburguesaVeggie.png',
      'Papas Fritas': '/images/PapasFritas.png',
      'Papas Cheddar': '/images/PapasCheddar.png',
      'Aros de Cebolla': '/images/ArosCebolla.png',
      'Ensalada Mixta': '/images/Ensalada.png',
      'Gaseosa': '/images/Coca.png',
      'Agua Mineral': '/images/Agua.png',
      'Cerveza Artesanal': '/images/Cerveza.png',
      'Jugo Natural': '/images/Jugo.png',
      'Combo Clásico': '/images/ComboClasico.png',
      'Combo Especial': '/images/ComboEspecial.png',
      'Combo Familiar': '/images/ComboFamiliar.png'
    }
    return images[nombre] || '/logo.png'
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div>
          <div className="font-bold text-base">#{order.temp_id?.slice(-8)}</div>
          <div className="text-xs opacity-90">{timeAgo} - {order.cliente}</div>
        </div>
        <div className="font-bold text-lg">${order.total?.toLocaleString()}</div>
      </div>

      <div className="p-4 max-h-[220px] overflow-y-auto">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
            <img 
              src={getProductImage(item.nombre_item)} 
              alt={item.nombre_item}
              className="w-12 h-12 object-contain rounded-md bg-gray-50 p-1"
              onError={(e) => e.target.src = '/logo.png'}
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary">{item.cantidad}</span>
                <span className="text-gray-800">{item.nombre_item}</span>
                <span className="font-semibold text-success">${(item.precio * item.cantidad).toLocaleString()}</span>
              </div>
              {item.observacion && <div className="text-xs text-gray-500 italic mt-1">{item.observacion}</div>}
            </div>
          </div>
        ))}
      </div>

      {order.notas && (
        <div className="bg-gray-50 p-3 mx-3 rounded-md text-sm">
          <strong>📝 Nota:</strong> {order.notas}
        </div>
      )}

      <div className="p-4 border-t border-gray-200 text-right">
        <button
          className={`px-5 py-2 rounded-lg font-semibold text-white ${color} disabled:opacity-60 disabled:cursor-not-allowed transition-all`}
          onClick={handleAction}
          disabled={order.estado === 'entregado'}
        >
          {label}
        </button>
      </div>
    </div>
  )
}

export default OrderCard