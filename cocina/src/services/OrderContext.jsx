import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { orderService } from './api';
import { socketService } from './socket';

const OrderContext = createContext();

const initialState = {
  orders: [],
  filter: 'all',
  soundEnabled: true,
  connectionStatus: 'connecting'
};

function orderReducer(state, action) {
  switch (action.type) {
    case 'SET_ORDERS':
      const orders = Array.isArray(action.payload) ? action.payload : [];
      return { ...state, orders };

    case 'ADD_ORDER':
      if (!action.payload || typeof action.payload !== 'object') {
        return state;
      }
      
      const exists = state.orders.find(order => 
        order.id === action.payload.id || order.temp_id === action.payload.temp_id
      );
      if (exists) return state;
      
      return {
        ...state,
        orders: [action.payload, ...state.orders]
      };

    case 'UPDATE_ORDER':
      if (!action.payload || !action.payload.id) {
        return state;
      }
      
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? { ...order, ...action.payload } : order
        )
      };

    case 'SET_FILTER':
      return { ...state, filter: action.payload };

    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };

    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };

    default:
      return state;
  }
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);

  // Inicializar el sistema de audio
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        
        // Crear un sonido simple (beep)
        const duration = 0.2;
        const sampleRate = audioContextRef.current.sampleRate;
        const frameCount = duration * sampleRate;
        const buffer = audioContextRef.current.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < frameCount; i++) {
          channelData[i] = Math.sin(2 * Math.PI * 800 * i / sampleRate) * Math.exp(-i / (0.1 * sampleRate));
        }
        
        audioBufferRef.current = buffer;
      } catch (error) {
        console.log('Audio no disponible:', error);
      }
    };

    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    console.log('🔄 Inicializando servicios de cocina...');
    
    socketService.init(dispatch);
    orderService.init(dispatch);
    orderService.loadOrders();

    const checkInitialConnection = () => {
      if (socketService.socket && socketService.socket.connected) {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
      } else {
        setTimeout(() => {
          if (state.connectionStatus === 'connecting') {
            dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' });
          }
        }, 3000);
      }
    };

    checkInitialConnection();
  }, []);

  const playNotificationSound = () => {
    if (!state.soundEnabled || !audioContextRef.current || !audioBufferRef.current) {
      return;
    }

    try {
      // Recrear el contexto de audio si está suspendido (requerido por algunos navegadores)
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = 0.1;
      
      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      source.start();
      
      // Limpiar después de tocar
      setTimeout(() => {
        source.disconnect();
        gainNode.disconnect();
      }, 500);
      
    } catch (error) {
      console.log('Error reproduciendo sonido:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const toggleSound = () => {
    dispatch({ type: 'TOGGLE_SOUND' });
  };

  const value = {
    ...state,
    updateOrderStatus,
    setFilter,
    toggleSound,
    playNotificationSound
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};