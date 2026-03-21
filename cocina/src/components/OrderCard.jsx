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

  const getStatusConfig = (status) => ({
    'pendiente': { next: 'en_preparacion', buttonText: 'Aceptar' },
    'en_preparacion': { next: 'listo', buttonText: 'Marcar Listo' },
    'listo': { next: 'entregado', buttonText: 'Entregar' },
    'entregado': { next: null, buttonText: 'Entregado' }
  }[status] || { next: null, buttonText: 'Entregado' });

  const statusConfig = getStatusConfig(order.estado);

  const handleStatusUpdate = () => {
    if (statusConfig.next && order.id) {
      updateOrderStatus(order.id, statusConfig.next);
    }
  };

  const getElapsedTime = (createdAt) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Ahora';
    return `Hace ${mins} min${mins > 1 ? 's' : ''}`;
  };


  const getImageSrc = (nombre) => {
    const clean = nombre.toLowerCase().replace(/\s+/g, '').replace(/[áéíóúñ]/g, c => 'aeioun'['aeioun'.indexOf(c)] || c);
    return `/images/${clean === 'papasextra' ? 'PapasFritas' : clean}.png`;
  };



  const getDescripcion = (nombre) => ({
    'Papas Extra': 'Porción extra de papas fritas clásicas doradas y crujientes.',
    'Hamburguesa Clásica': 'Patty simple de carne smash, queso cheddar, lechuga y tomate frescos.',
    'Hamburguesa Especial': 'Carne smash, doble queso cheddar, panceta crocante y huevo frito.',
    'Hamburguesa Doble': 'Dos patties, doble queso, cebolla caramelizada y pepinos.',
    'Hamburguesa Veggie': 'Medallón de legumbres y garbanzos, queso vegano, rúcula y palta.',
    'Papas Fritas': 'Bastones clásicos, dorados y crujientes con el punto justo de sal.',
    'Papas Cheddar': 'Papas fritas bañadas en nuestra salsa cheddar y panceta crispy.',
    'Aros de Cebolla': 'Anillos rebozados y fritos, servidos con dip de barbacoa.',
    'Ensalada Mixta': 'Mix de verdes de temporada, tomate cherry y cebolla morada.',
    'Coke': 'Coca-Cola clásica 500ml.',
    'Agua Mineral': 'Agua mineral con o sin gas 500ml.',
    'Cerveza Artesanal': 'Consulta nuestra variedad local de IPA o Golden.',
    'Jugo Natural': 'Jugo natural exprimido de temporada.',
    'Combo Clásico': 'Hamburguesa Clásica + Papas Chicas + Bebida a elección.',
    'Combo Especial': 'Hamburguesa Especial + Papas Cheddar + Bebida a elección.',
    'Combo Familiar': '2 Hamburguesas Clásicas + 1 Papas Chicas + 1 Aros + 1 Ensalada + 2 Coke.'
  }[nombre] || 'Producto sin descripción');


  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      background: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginBottom: '16px'
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
        <div>
          <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>Orden #{order.id || order.temp_id?.slice(-8)}</div>
          <div style={{fontSize: '0.9rem', color: '#6b7280'}}>
            {getElapsedTime(order.created_at)} - {order.cliente}
          </div>
        </div>
        <div style={{fontSize: '1.4rem', fontWeight: 'bold', color: '#F05A28'}}>
          ${parseFloat(order.total || 0).toLocaleString()}
        </div>
      </div>

      <div style={{maxHeight: '200px', overflow: 'auto'}}>
        {(order.items || []).map((item, i) => (
          <div key={i} style={{
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '12px', 
            padding: '12px 0',
            borderBottom: '1px solid #f3f4f6'
          }}>

            <img 
              src={getImageSrc(item.nombre_item)} 
              alt={item.nombre_item}
              style={{
                width: '72px', 
                height: '72px', 
                objectFit: 'contain',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                padding: '4px',
                border: '1px solid #f3f4f6'
              }}
              onError={(e) => e.target.src = '/images/Logo.png'}
            />

            <div style={{flex: 1}}>
              <div style={{fontWeight: '600', marginBottom: '4px'}}>{item.nombre_item} ×{item.cantidad}</div>
              <div style={{fontSize: '0.85rem', color: '#6b7280', fontStyle: 'italic', marginBottom: '4px'}}>
                {getDescripcion(item.nombre_item)}
              </div>
              {item.observacion && (
                <div style={{fontSize: '0.8rem', color: '#9ca3af', marginBottom: '8px'}}>Obs: {item.observacion}</div>
              )}
              <div style={{fontWeight: '700', color: '#059669', fontSize: '1rem'}}>
                ${(item.precio * item.cantidad).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        {(order.items || []).length === 0 && (
          <div style={{padding: '20px', color: '#9ca3af', textAlign: 'center'}}>
            Sin productos
          </div>
        )}
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', marginTop: '16px', borderTop: '1px solid #e5e7eb'}}>
        <div style={{fontWeight: '600'}}>Total pedido</div>
        <button
          style={{
            background: order.estado === 'pendiente' ? '#F05A28' : order.estado === 'en_preparacion' ? '#F59E0B' : order.estado === 'listo' ? '#10B981' : '#6B7280',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: statusConfig.next ? 'pointer' : 'not-allowed',
            opacity: statusConfig.next ? 1 : 0.6,
            minHeight: '44px'
          }}
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

