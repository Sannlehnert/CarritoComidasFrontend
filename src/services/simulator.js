import { getOrders, saveOrder, updateOrder, deleteOrder as deleteOrderDB } from './indexedDB'

class Simulator {
  async getOrders(filterEstado = null) {
    try {
      return await getOrders(filterEstado)
    } catch (e) {
      console.error('getOrders error:', e)
      return []
    }
  }

  async saveOrder(order) {
    try {
      const saved = await saveOrder(order)
      this._broadcast('nueva-orden', saved)
      return saved
    } catch (e) {
      console.error('saveOrder error:', e)
      return null
    }
  }

  async updateOrder(temp_id, updates) {
    try {
      const updated = await updateOrder(temp_id, updates)
      if (updated) this._broadcast('orden-actualizada', updated)
      return updated
    } catch (e) {
      console.error('updateOrder error:', e)
      return null
    }
  }

  async deleteOrder(temp_id) {
    try {
      await deleteOrderDB(temp_id)
      this._broadcast('orden-eliminada', { temp_id })
      return true
    } catch (e) {
      console.error('deleteOrder error:', e)
      return false
    }
  }

  _broadcast(event, data) {
    try {
      const channel = new BroadcastChannel('carrito-orders')
      channel.postMessage({ event, data, timestamp: Date.now() })
      // No cerramos el canal inmediatamente para permitir múltiples mensajes
    } catch (e) {}
  }

  async seedSampleData() {
    const orders = await this.getOrders()
    if (orders.length > 0) return
    const sample = {
      temp_id: crypto.randomUUID(),
      items: [{ nombre_item: 'Hamburguesa Clásica', cantidad: 2, precio: 9500, observacion: '' }],
      cliente: 'Mesa 5',
      notas: 'Sin cebolla',
      total: 19000,
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      estado: 'pendiente'
    }
    await this.saveOrder(sample)
    console.log('✅ Sample order seeded')
  }
}

export const simulator = new Simulator()