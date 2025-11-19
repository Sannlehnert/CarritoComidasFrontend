import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

class SocketService {
  constructor() {
    this.socket = null
    this.dispatch = null
    this.isConnected = false
  }

  init(dispatch) {
    this.dispatch = dispatch
    this.connect()
  }

  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      this.isConnected = true
      this.dispatch?.({ type: 'SET_SYNC_STATUS', payload: 'connected' })
      console.log('Socket connected')
    })

    this.socket.on('disconnect', () => {
      this.isConnected = false
      this.dispatch?.({ type: 'SET_SYNC_STATUS', payload: 'pending' })
      console.log('Socket disconnected')
    })

    this.socket.on('orden-actualizada', (data) => {
      // Escuchar actualizaciones de estado de las órdenes
      console.log('Orden actualizada:', data)
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      this.dispatch?.({ type: 'SET_SYNC_STATUS', payload: 'offline' })
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data)
    } else {
      console.warn('Socket not connected, cannot emit event:', event)
    }
  }
}

export const socketService = new SocketService()