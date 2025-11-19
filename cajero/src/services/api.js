import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class OrderService {
  constructor() {
    this.dispatch = null
  }

  init(dispatch) {
    this.dispatch = dispatch
  }

  async submitOrder(order) {
    try {
      this.dispatch({ type: 'SET_SYNC_STATUS', payload: 'pending' })

      const response = await axios.post(`${API_BASE_URL}/ordenes`, order, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      this.dispatch({ type: 'SET_SYNC_STATUS', payload: 'connected' })
      this.dispatch({ type: 'REMOVE_PENDING_ORDER', payload: order.temp_id })

      return response.data
    } catch (error) {
      this.dispatch({ type: 'SET_SYNC_STATUS', payload: 'offline' })

      // Guardar en IndexedDB para sincronización posterior
      const { db } = await import('../db/indexedDB.js')
      await db.savePendingOrder(order)

      throw error
    }
  }

  async syncPendingOrders() {
    try {
      const { db } = await import('../db/indexedDB.js')
      const pendingOrders = await db.getPendingOrders()

      for (const order of pendingOrders) {
        try {
          await this.submitOrder(order)
          await db.deletePendingOrder(order.temp_id)
        } catch (error) {
          console.error('Error syncing order:', error)
        }
      }
    } catch (error) {
      console.error('Error syncing pending orders:', error)
    }
  }
}

export const orderService = new OrderService()
