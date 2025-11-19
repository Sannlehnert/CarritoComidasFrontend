import React from 'react'
import { useOrder } from '../services/OrderContext'

const menuItems = [
  { id: 1, nombre_item: 'Hamburguesa Clásica', precio: 1000, categoria: 'hamburguesas' },
  { id: 2, nombre_item: 'Hamburguesa Especial', precio: 1200, categoria: 'hamburguesas' },
  { id: 3, nombre_item: 'Hamburguesa Doble', precio: 1500, categoria: 'hamburguesas' },
  { id: 4, nombre_item: 'Papas Fritas', precio: 250, categoria: 'acompañamientos' },
  { id: 5, nombre_item: 'Papas Cheddar', precio: 350, categoria: 'acompañamientos' },
  { id: 6, nombre_item: 'Ensalada', precio: 300, categoria: 'acompañamientos' },
  { id: 7, nombre_item: 'Gaseosa 500ml', precio: 200, categoria: 'bebidas' },
  { id: 8, nombre_item: 'Agua Mineral', precio: 150, categoria: 'bebidas' },
  { id: 9, nombre_item: 'Cerveza', precio: 300, categoria: 'bebidas' }
]

const categorias = {
  hamburguesas: '🍔 Hamburguesas',
  acompañamientos: '🍟 Acompañamientos',
  bebidas: '🥤 Bebidas'
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
                <span className="item-price">${item.precio}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ItemList