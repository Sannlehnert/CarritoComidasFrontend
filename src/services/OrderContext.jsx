import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { simulator } from './simulator'

const OrderContext = createContext()

const initialState = {
  // Cajero
  currentOrder: {
    items: [],
    cliente: 'Mostrador 1',
    notas: '',
    total: 0
  },
  // Cocina
  orders: [],
  filter: 'pendiente',
  connectionStatus: 'connected'
}

function reducer(state, action) {
  switch (action.type) {
    // ========== CAJERO ==========
    case 'ADD_ITEM': {
      const existing = state.currentOrder.items.find(
        i => i.nombre_item === action.payload.nombre_item && i.observacion === action.payload.observacion
      )
      if (existing) {
        return {
          ...state,
          currentOrder: {
            ...state.currentOrder,
            items: state.currentOrder.items.map(i =>
              i.nombre_item === action.payload.nombre_item && i.observacion === action.payload.observacion
                ? { ...i, cantidad: i.cantidad + 1 }
                : i
            ),
            total: state.currentOrder.total + action.payload.precio
          }
        }
      }
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: [...state.currentOrder.items, { ...action.payload, cantidad: 1 }],
          total: state.currentOrder.total + action.payload.precio
        }
      }
    }
    case 'REMOVE_ITEM': {
      const existing = state.currentOrder.items.find(
        i => i.nombre_item === action.payload.nombre_item && i.observacion === action.payload.observacion
      )
      if (!existing) return state
      if (existing.cantidad > 1) {
        return {
          ...state,
          currentOrder: {
            ...state.currentOrder,
            items: state.currentOrder.items.map(i =>
              i.nombre_item === action.payload.nombre_item && i.observacion === action.payload.observacion
                ? { ...i, cantidad: i.cantidad - 1 }
                : i
            ),
            total: state.currentOrder.total - action.payload.precio
          }
        }
      }
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: state.currentOrder.items.filter(
            i => !(i.nombre_item === action.payload.nombre_item && i.observacion === action.payload.observacion)
          ),
          total: state.currentOrder.total - action.payload.precio
        }
      }
    }
    case 'UPDATE_NOTAS':
      return { ...state, currentOrder: { ...state.currentOrder, notas: action.payload } }
    case 'UPDATE_CLIENTE':
      return { ...state, currentOrder: { ...state.currentOrder, cliente: action.payload } }
    case 'CLEAR_ORDER':
      return { ...state, currentOrder: { items: [], cliente: 'Mostrador 1', notas: '', total: 0 } }

    // ========== COCINA ==========
    case 'SET_ORDERS':
      return { ...state, orders: action.payload }
    case 'ADD_ORDER':
      if (state.orders.some(o => o.temp_id === action.payload.temp_id)) return state
      return { ...state, orders: [action.payload, ...state.orders] }
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.temp_id === action.payload.temp_id ? { ...o, ...action.payload } : o
        )
      }
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(o => o.temp_id !== action.payload)
      }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload }
    default:
      return state
  }
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    simulator.seedSampleData()

    const loadOrders = async () => {
      const orders = await simulator.getOrders()
      dispatch({ type: 'SET_ORDERS', payload: orders })
    }
    loadOrders()

    const channel = new BroadcastChannel('carrito-orders')
    channel.onmessage = (event) => {
      const { event: evt, data } = event.data
      if (evt === 'nueva-orden') {
        dispatch({ type: 'ADD_ORDER', payload: data })
        window.dispatchEvent(new CustomEvent('new-kitchen-order'))
      } else if (evt === 'orden-actualizada') {
        dispatch({ type: 'UPDATE_ORDER', payload: data })
      } else if (evt === 'orden-eliminada') {
        dispatch({ type: 'DELETE_ORDER', payload: data.temp_id })
      }
    }

    const interval = setInterval(async () => {
      const orders = await simulator.getOrders()
      dispatch({ type: 'SET_ORDERS', payload: orders })
    }, 5000)

    return () => {
      channel.close()
      clearInterval(interval)
    }
  }, [])

  // Acciones Cajero
  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item })
  const removeItem = (item) => dispatch({ type: 'REMOVE_ITEM', payload: item })
  const updateNotas = (notas) => dispatch({ type: 'UPDATE_NOTAS', payload: notas })
  const updateCliente = (cliente) => dispatch({ type: 'UPDATE_CLIENTE', payload: cliente })
  const clearOrder = () => dispatch({ type: 'CLEAR_ORDER' })

  const submitOrder = async () => {
    if (state.currentOrder.items.length === 0) return
    const order = {
      ...state.currentOrder,
      temp_id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      estado: 'pendiente'
    }
    await simulator.saveOrder(order)
    dispatch({ type: 'CLEAR_ORDER' })
  }

  // Acciones Cocina
  const updateOrderStatus = async (temp_id, newStatus) => {
    const updated = await simulator.updateOrder(temp_id, { estado: newStatus })
    if (updated) {
      dispatch({ type: 'UPDATE_ORDER', payload: updated })
    }
  }

  const deleteOrder = async (temp_id) => {
    await simulator.deleteOrder(temp_id)
    dispatch({ type: 'DELETE_ORDER', payload: temp_id })
    // Broadcast para que otras pestañas también lo eliminen
    const channel = new BroadcastChannel('carrito-orders')
    channel.postMessage({ event: 'orden-eliminada', data: { temp_id } })
    channel.close()
  }

  const setFilter = (filter) => dispatch({ type: 'SET_FILTER', payload: filter })

  const value = {
    // Cajero
    currentOrder: state.currentOrder,
    addItem,
    removeItem,
    updateNotas,
    updateCliente,
    clearOrder,
    submitOrder,
    // Cocina
    orders: state.orders,
    filter: state.filter,
    setFilter,
    updateOrderStatus,
    deleteOrder,
    connectionStatus: state.connectionStatus
  }

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) throw new Error('useOrder must be used within OrderProvider')
  return context
}