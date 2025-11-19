import React, { useState, useEffect } from 'react';
import { useOrder } from '../services/OrderContext';

const OrderCard = ({ order, isNew = false }) => {
  const { updateOrderStatus } = useOrder();
  const [highlight, setHighlight] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setHighlight(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const getStatusConfig = (status) => {
    const configs = {
      pendiente: { 
        label: 'Pendiente', 
        next: 'en_preparacion',
        buttonText: 'Aceptar'
      },
      en_preparacion: { 
        label: 'En Preparación', 
        next: 'listo',
        buttonText: 'Marcar Listo'
      },
      listo: { 
        label: 'Listo', 
        next: 'entregado',
        buttonText: 'Entregar'
      },
      entregado: { 
        label: 'Entregado', 
        next: null,
        buttonText: 'Entregado'
      }
    };
    return configs[status] || configs.pendiente;
  };

  const getElapsedTime = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins === 1) return 'Hace 1 min';
    return `Hace ${diffMins} mins`;
  };

  const statusConfig = getStatusConfig(order.estado);

  const handleStatusUpdate = () => {
    if (statusConfig.next) {
      updateOrderStatus(order.id, statusConfig.next);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`order-card ${order.estado} ${highlight ? 'new-order-highlight' : ''}`}>
      <div className="order-header">
        <div className="order-info">
          <div className="order-id">Orden #{order.id || order.temp_id?.slice(-8)}</div>
          <div className="order-time">{formatTime(order.created_at)} • {getElapsedTime(order.created_at)}</div>
        </div>
        <div className="order-client">{order.cliente}</div>
      </div>

      <div className="order-items">
        {order.items.map((item, index) => (
          <div key={index} className="order-item">
            <div className="item-quantity">x{item.cantidad}</div>
            <div className="item-name">{item.nombre_item}</div>
            {item.observacion && (
              <div className="item-observation">{item.observacion}</div>
            )}
            <div className="item-price">${item.precio * item.cantidad}</div>
          </div>
        ))}
      </div>

      {order.notas && (
        <div className="order-notes">
          <strong>Notas:</strong>
          <div className="order-notes-content">{order.notas}</div>
        </div>
      )}

      <div className="order-footer">
        <div className="order-total">${order.total}</div>
        <button
          className={`status-button ${order.estado}`}
          onClick={handleStatusUpdate}
          disabled={!statusConfig.next}
        >
          {statusConfig.buttonText}
        </button>
      </div>
    </div>
  );
};

export default OrderCard;