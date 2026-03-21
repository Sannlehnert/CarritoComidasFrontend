import React, { useEffect, useState } from 'react';
import { useOrder } from '../services/OrderContext';
import OrderCard from '../components/OrderCard';

const KitchenDisplay = () => {
  const { 
    orders, 
    filter, 
    soundEnabled, 
    connectionStatus,
    setFilter, 
    toggleSound,
    playNotificationSound 
  } = useOrder();

  const [newOrders, setNewOrders] = useState(new Set());
  const [showNotification, setShowNotification] = useState(false);

const safeOrders = Array.isArray(orders) ? orders : [];
console.log('🔍 DEBUG Orders:', safeOrders)


  useEffect(() => {
    const handleNotification = () => {
      playNotificationSound();
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    window.addEventListener('playNotificationSound', handleNotification);
    return () => {
      window.removeEventListener('playNotificationSound', handleNotification);
    };
  }, [playNotificationSound]);

  useEffect(() => {
    const newOrderIds = safeOrders
      .filter(order => order && !newOrders.has(order.id || order.temp_id))
      .map(order => order.id || order.temp_id);
    
    if (newOrderIds.length > 0) {
      setNewOrders(prev => new Set([...prev, ...newOrderIds]));
    }
  }, [safeOrders, newOrders]);

  const filteredOrders = safeOrders.filter(order => {
    if (!order || typeof order !== 'object') return false;
    if (filter === 'all') return true;
    return order.estado === filter;
  });

  const getOrderCount = (status) => {
    return safeOrders.filter(order => 
      order && order.estado === status
    ).length;
  };

  const statusFilters = [
    { key: 'all', label: 'Todas', count: safeOrders.length },
    { key: 'pendiente', label: 'Pendientes', count: getOrderCount('pendiente') },
    { key: 'en_preparacion', label: 'Preparando', count: getOrderCount('en_preparacion') },
    { key: 'listo', label: 'Listas', count: getOrderCount('listo') }
  ];

  return (
    <div className="kitchen-display kiosk-mode">
      <header className="kitchen-header">
        <h1>Cocina - Sistema de Pedidos</h1>
        
        <div className="header-stats">
          <div className="stat-item">
            <div className="stat-number">{safeOrders.length}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{getOrderCount('pendiente')}</div>
            <div className="stat-label">Pendientes</div>
          </div>
        </div>

        <div className={`connection-status ${connectionStatus === 'connected' ? '' : 'disconnected'}`}>
          <div className={`status-dot ${connectionStatus === 'connected' ? 'connected' : 'disconnected'}`} />
          <span>
            {connectionStatus === 'connected' && 'Conectado'}
            {connectionStatus === 'connecting' && 'Conectando...'}
            {connectionStatus === 'disconnected' && 'Sin conexión'}
          </span>
        </div>
      </header>

      <div className="kitchen-controls">
        <div className="filter-buttons">
          {statusFilters.map(({ key, label, count }) => (
            <button
              key={key}
              className={`filter-button ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
            >
              <span className="filter-count">{count}</span>
              <span className="filter-label">{label}</span>
            </button>
          ))}
        </div>
        
        <div className="control-actions">
          <button
            className={`sound-toggle ${!soundEnabled ? 'muted' : ''}`}
            onClick={toggleSound}
          >
            {soundEnabled ? 'Sonido ON' : 'Sonido OFF'}
          </button>
        </div>
      </div>

      {showNotification && (
        <div className="new-order-notification">
          ¡Nueva orden recibida!
        </div>
      )}


      <div className="orders-container" style={{height: '100%', overflow: 'hidden'}}>
        <div className="orders-grid" style={{height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch'}}>

          {filteredOrders.map(order => (
            <OrderCard 
              key={order.id || order.temp_id} 
              order={order}
              isNew={newOrders.has(order.id || order.temp_id)}
            />
          ))}
          
          {filteredOrders.length === 0 && (
            <div className="empty-state">
              <h3>
                {filter === 'all' 
                  ? 'No hay órdenes activas'
                  : `No hay órdenes ${filter}`
                }
              </h3>
              <p>
                {filter === 'all' 
                  ? 'Las órdenes aparecerán aquí automáticamente cuando lleguen nuevos pedidos.'
                  : `Las órdenes en estado "${filter}" aparecerán aquí.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenDisplay;