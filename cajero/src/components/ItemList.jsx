import React from 'react'
import { useOrder } from '../services/OrderContext'

const menuItems = [
  // Hamburguesas
  { id: 1, nombre_item: 'Hamburguesa Clásica', precio: 9500, categoria: 'hamburguesas' },
  { id: 2, nombre_item: 'Hamburguesa Especial', precio: 12000, categoria: 'hamburguesas' },
  { id: 3, nombre_item: 'Hamburguesa Doble', precio: 14500, categoria: 'hamburguesas' },
  { id: 4, nombre_item: 'Hamburguesa Veggie', precio: 11000, categoria: 'hamburguesas' },
  
  // Acompañamientos
  { id: 5, nombre_item: 'Papas Fritas', precio: 6500, categoria: 'acompañamientos' },
  { id: 6, nombre_item: 'Papas Cheddar', precio: 8000, categoria: 'acompañamientos' },
  { id: 7, nombre_item: 'Aros de Cebolla', precio: 7500, categoria: 'acompañamientos' },
  { id: 8, nombre_item: 'Ensalada Mixta', precio: 5500, categoria: 'acompañamientos' },
  
  // Bebidas
  { id: 9, nombre_item: 'Gaseosa', precio: 4800, categoria: 'bebidas' },
  { id: 10, nombre_item: 'Agua Mineral', precio: 3200, categoria: 'bebidas' },
  { id: 11, nombre_item: 'Cerveza Artesanal', precio: 7500, categoria: 'bebidas' },
  { id: 12, nombre_item: 'Jugo Natural', precio: 4000, categoria: 'bebidas' },
  
  // Combos
  { id: 13, nombre_item: 'Combo Clásico', precio: 17500, categoria: 'combos' },
  { id: 14, nombre_item: 'Combo Especial', precio: 22500, categoria: 'combos' },
  { id: 15, nombre_item: 'Combo Familiar', precio: 38000, categoria: 'combos' }
]

const categorias = {
  hamburguesas: 'Hamburguesas',
  acompañamientos: 'Acompañamientos',
  bebidas: 'Bebidas',
  combos: 'Combos'
}

const ItemList = () => {
  const { addItem } = useOrder()

  const itemsPorCategoria = menuItems.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = []
    }
    acc[item.categoria].push(item)
    return acc
  }, {})

  return (
    <div className="item-list">
      {Object.entries(itemsPorCategoria).map(([categoria, items]) => (
        <div key={categoria} className="category-section">
          <h3 className="category-title">{categorias[categoria]}</h3>
          <div className="items-grid">
            {items.map(item => (
              <button
                key={item.id}
                className="item-button"
                onClick={() => addItem({
                  nombre_item: item.nombre_item,
                  precio: item.precio,
                  observacion: ''
                })}
              >
                <span className="item-name">{item.nombre_item}</span>
                <span className="item-price">${item.precio.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ItemList