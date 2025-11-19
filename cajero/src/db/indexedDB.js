import { openDB } from 'idb'

const DB_NAME = 'CajeroDB'
const DB_VERSION = 1
const STORE_ORDERS = 'pending_orders'

export const db = {
  async init() {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_ORDERS)) {
          const store = db.createObjectStore(STORE_ORDERS, {
            keyPath: 'temp_id'
          })
          store.createIndex('status', 'status')
          store.createIndex('created_at', 'created_at')
        }
      }
    })
  },

  async saveOrder(order) {
    const db = await this.init()
    const tx = db.transaction(STORE_ORDERS, 'readwrite')
    const store = tx.objectStore(STORE_ORDERS)
    
    const orderWithStatus = {
      ...order,
      status: 'pending_sync',
      updated_at: new Date().toISOString()
    }
    
    await store.put(orderWithStatus)
    await tx.done
    return orderWithStatus
  },

  async getPendingOrders() {
    const db = await this.init()
    const tx = db.transaction(STORE_ORDERS, 'readonly')
    const store = tx.objectStore(STORE_ORDERS)
    const index = store.index('status')
    
    return index.getAll('pending_sync')
  },

  async updateOrderStatus(temp_id, status) {
    const db = await this.init()
    const tx = db.transaction(STORE_ORDERS, 'readwrite')
    const store = tx.objectStore(STORE_ORDERS)
    
    const order = await store.get(temp_id)
    if (order) {
      order.status = status
      order.updated_at = new Date().toISOString()
      await store.put(order)
    }
    
    await tx.done
  },

  async deleteOrder(temp_id) {
    const db = await this.init()
    const tx = db.transaction(STORE_ORDERS, 'readwrite')
    const store = tx.objectStore(STORE_ORDERS)
    
    await store.delete(temp_id)
    await tx.done
  },

  async clearSyncedOrders() {
    const db = await this.init()
    const tx = db.transaction(STORE_ORDERS, 'readwrite')
    const store = tx.objectStore(STORE_ORDERS)
    const index = store.index('status')
    
    const syncedOrders = await index.getAll('synced')
    await Promise.all(syncedOrders.map(order => store.delete(order.temp_id)))
    
    await tx.done
  }
}