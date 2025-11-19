import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { orderService } from './api'
import { db } from '../db/indexedDB'
import { socketService } from './socket'

const OrderContext = createContext()

const initialState = {
  currentOrder: {
    items: [],
    cliente: 'Mostrador 1',
    notas: '',
    total: 0
  },
  pendingOrders: [],
  sentOrders: [],
  syncStatus: 'connected' // connected, pending, offline
}

function orderReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.currentOrder.items.find(
        item => item.nombre_item === action.payload.nombre_item && 
                item.observacion === action.payload.observacion
      )
      
      if (existingItem) {
        return {
          ...state,
          currentOrder: {
            ...state.currentOrder,
            items: state.currentOrder.items.map(item =>
              item.nombre_item === action.payload.nombre_item && 
              item.observacion === action.payload.observacion
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
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

    case 'REMOVE_ITEM':
      const itemToRemove = state.currentOrder.items.find(
        item => item.nombre_item === action.payload.nombre_item && 
                item.observacion === action.payload.observacion
      )

      if (itemToRemove.cantidad > 1) {
        return {
          ...state,
          currentOrder: {
            ...state.currentOrder,
            items: state.currentOrder.items.map(item =>
              item.nombre_item === action.payload.nombre_item && 
              item.observacion === action.payload.observacion
                ? { ...item, cantidad: item.cantidad - 1 }
                : item
            ),
            total: state.currentOrder.total - action.payload.precio
          }
        }
      }

      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: state.currentOrder.items.filter(item =>
            !(item.nombre_item === action.payload.nombre_item && 
              item.observacion === action.payload.observacion)
          ),
          total: state.currentOrder.total - action.payload.precio
        }
      }

    case 'UPDATE_NOTAS':
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          notas: action.payload
        }
      }

    case 'UPDATE_CLIENTE':
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          cliente: action.payload
        }
      }

    case 'CLEAR_ORDER':
      return {
        ...state,
        currentOrder: {
          items: [],
          cliente: 'Mostrador 1',
          notas: '',
          total: 0
        }
      }

    case 'SET_SYNC_STATUS':
      return {
        ...state,
        syncStatus: action.payload
      }

    case 'ADD_PENDING_ORDER':
      return {
        ...state,
        pendingOrders: [...state.pendingOrders, action.payload]
      }

    case 'REMOVE_PENDING_ORDER':
      return {
        ...state,
        pendingOrders: state.pendingOrders.filter(order => order.temp_id !== action.payload)
      }

    case 'ADD_SENT_ORDER':
      return {
        ...state,
        sentOrders: [action.payload, ...state.sentOrders.slice(0, 49)] // Mantener últimas 50
      }

    default:
      return state
  }
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialState)

  useEffect(() => {
    // Inicializar servicios
    socketService.init(dispatch)
    orderService.init(dispatch)

    // Cargar órdenes pendientes al iniciar
    const loadPendingOrders = async () => {
      const orders = await db.getPendingOrders()
      orders.forEach(order => {
        dispatch({ type: 'ADD_PENDING_ORDER', payload: order })
      })
    }

    loadPendingOrders()
  }, [])

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (item) => {
    dispatch({ type: 'REMOVE_ITEM', payload: item })
  }

  const updateNotas = (notas) => {
    dispatch({ type: 'UPDATE_NOTAS', payload: notas })
  }

  const updateCliente = (cliente) => {
    dispatch({ type: 'UPDATE_CLIENTE', payload: cliente })
  }

  const clearOrder = () => {
    dispatch({ type: 'CLEAR_ORDER' })
  }

  const submitOrder = async () => {
    if (state.currentOrder.items.length === 0) return

    const order = {
      ...state.currentOrder,
      temp_id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    }

    try {
      dispatch({ type: 'ADD_PENDING_ORDER', payload: order })
      await orderService.submitOrder(order)
      dispatch({ type: 'CLEAR_ORDER' })
      dispatch({ type: 'ADD_SENT_ORDER', payload: order })
    } catch (error) {
      console.error('Error submitting order:', error)
    }
  }

  const value = {
    ...state,
    addItem,
    removeItem,
    updateNotas,
    updateCliente,
    clearOrder,
    submitOrder
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}