import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

class SocketService {
  constructor() {
    this.socket = null
    this.dispatch = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 10
  }

  init(dispatch) {
    this.dispatch = dispatch
    this.connect()
  }

  connect() {
    try {
      console.log('🔄 Conectando a Socket.IO...', SOCKET_URL)
      
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      })

      this.socket.on('connect', () => {
        console.log('✅ CONECTADO - Socket.IO funcionando correctamente')
        this.reconnectAttempts = 0
        this.dispatch?.({ type: 'SET_CONNECTION_STATUS', payload: 'connected' })
        
        // Unirse a la sala de cocina
        this.socket.emit('join-kitchen')
        console.log('👨‍🍳 Unido a la sala de cocina')
      })

      this.socket.on('disconnect', (reason) => {
        console.log('❌ DESCONECTADO - Razón:', reason)
        this.dispatch?.({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' })
        
        if (reason === 'io server disconnect') {
          // El servidor desconectó, necesitamos reconectar manualmente
          this.socket.connect()
        }
      })

      this.socket.on('nueva-orden', (order) => {
        console.log('📦 NUEVA ORDEN RECIBIDA:', order)
        this.dispatch?.({ type: 'ADD_ORDER', payload: order })
        
        // Reproducir sonido de notificación
        if (this.dispatch) {
          const event = new CustomEvent('playNotificationSound')
          window.dispatchEvent(event)
        }
      })

      this.socket.on('orden-actualizada', (data) => {
        console.log('🔄 ORDEN ACTUALIZADA:', data)
        this.dispatch?.({ 
          type: 'UPDATE_ORDER', 
          payload: data 
        })
      })

      this.socket.on('connect_error', (error) => {
        console.error('❌ ERROR DE CONEXIÓN:', error.message)
        this.reconnectAttempts++
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.dispatch?.({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' })
        } else {
          this.dispatch?.({ type: 'SET_CONNECTION_STATUS', payload: 'connecting' })
        }
      })

      this.socket.on('reconnect_attempt', (attempt) => {
        console.log(`🔄 Reintento de conexión ${attempt}/${this.maxReconnectAttempts}`)
        this.dispatch?.({ type: 'SET_CONNECTION_STATUS', payload: 'connecting' })
      })

      this.socket.on('reconnect', (attempt) => {
        console.log('✅ RECONECTADO después de', attempt, 'intentos')
        this.dispatch?.({ type: 'SET_CONNECTION_STATUS', payload: 'connected' })
      })

      this.socket.on('reconnect_failed', () => {
        console.error('❌ FALLO LA RECONEXIÓN después de todos los intentos')
        this.dispatch?.({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' })
      })

    } catch (error) {
      console.error('❌ ERROR CRÍTICO inicializando socket:', error)
      this.dispatch?.({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' })
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  // Método para verificar el estado actual
  getStatus() {
    return this.socket ? this.socket.connected : false
  }
}

export const socketService = new SocketService()