const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

class OrderService {
  constructor() {
    this.dispatch = null
  }

  init(dispatch) {
    this.dispatch = dispatch
  }

  async loadOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/ordenes?estado=pendiente`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('📦 Datos recibidos del backend:', data)
      
      // Asegurarnos de que siempre trabajamos con un array
      let orders = []
      
      if (Array.isArray(data)) {
        // Si la respuesta es directamente un array
        orders = data
      } else if (data.ordenes && Array.isArray(data.ordenes)) {
        // Si la respuesta tiene propiedad 'ordenes'
        orders = data.ordenes
      } else if (data.data && Array.isArray(data.data)) {
        // Si la respuesta tiene propiedad 'data'
        orders = data.data
      } else {
        console.warn('⚠️ Formato de respuesta inesperado:', data)
        orders = []
      }
      
      console.log(`✅ ${orders.length} órdenes cargadas`)
      this.dispatch({ type: 'SET_ORDERS', payload: orders })
      
    } catch (error) {
      console.error('❌ Error loading orders:', error)
      // Asegurar que siempre dispatch un array vacío en caso de error
      this.dispatch({ type: 'SET_ORDERS', payload: [] })
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/ordenes/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: status })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedOrder = await response.json()
      this.dispatch({ type: 'UPDATE_ORDER', payload: updatedOrder })
      
      return updatedOrder
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  }
}

export const orderService = new OrderService()