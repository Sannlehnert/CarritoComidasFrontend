const DB_NAME = 'CarritoOrdersDB'
const DB_VERSION = 1
const STORE_NAME = 'orders'

let db = null

export const initDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }
    request.onupgradeneeded = (event) => {
      db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'temp_id' })
        store.createIndex('estado', 'estado')
        store.createIndex('created_at', 'created_at')
      }
    }
  })
}

export const getOrders = async (filterEstado = null) => {
  if (!db) await initDB()
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => {
      let orders = request.result
      if (filterEstado) orders = orders.filter(o => o.estado === filterEstado)
      resolve(orders)
    }
  })
}

export const saveOrder = async (order) => {
  if (!db) await initDB()
  const newOrder = {
    ...order,
    id: order.id || crypto.randomUUID(),
    estado: order.estado || 'pendiente',
    updated_at: new Date().toISOString()
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.put(newOrder)
    request.onsuccess = () => resolve(newOrder)
    request.onerror = () => reject(request.error)
  })
}

export const updateOrder = async (temp_id, updates) => {
  if (!db) await initDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const getRequest = store.get(temp_id)
    getRequest.onsuccess = () => {
      const order = getRequest.result
      if (!order) return resolve(null)
      const updated = { ...order, ...updates, updated_at: new Date().toISOString() }
      const putRequest = store.put(updated)
      putRequest.onsuccess = () => resolve(updated)
      putRequest.onerror = () => reject(putRequest.error)
    }
    getRequest.onerror = () => reject(getRequest.error)
  })
}

export const deleteOrder = async (temp_id) => {
  if (!db) await initDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.delete(temp_id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}