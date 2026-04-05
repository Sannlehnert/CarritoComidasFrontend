import React from 'react'
import { useOrder } from '../services/OrderContext'

const SyncStatus = () => {
  const { connectionStatus } = useOrder()
  return (
    <div className={`sync-status ${connectionStatus}`}>
      <span>{connectionStatus === 'connected' ? 'Online' : 'Offline'}</span>
    </div>
  )
}

export default SyncStatus