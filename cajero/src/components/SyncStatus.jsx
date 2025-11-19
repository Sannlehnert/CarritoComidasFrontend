import React from 'react'
import { useOrder } from '../services/OrderContext'

const SyncStatus = () => {
  const { syncStatus, pendingOrders } = useOrder()

  const getStatusConfig = () => {
    switch (syncStatus) {
      case 'connected':
        return {
          text: 'Conectado',
          class: 'connected',
          dotClass: 'connected'
        }
      case 'pending':
        return {
          text: `Pendiente (${pendingOrders.length})`,
          class: 'pending',
          dotClass: 'pending'
        }
      case 'offline':
        return {
          text: 'Sin conexión',
          class: 'offline',
          dotClass: 'offline'
        }
      default:
        return {
          text: 'Desconocido',
          class: 'offline',
          dotClass: 'offline'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`sync-status ${config.class}`}>
      <div className={`status-dot ${config.dotClass}`} />
      <span>{config.text}</span>
    </div>
  )
}

export default SyncStatus