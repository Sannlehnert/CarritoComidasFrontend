import React, { useState } from 'react'
import { useOrder } from '../services/OrderContext'

const categories = {
  all: 'Todos',
  hamburguesas: 'Hamburguesas',
  acompañamientos: 'Acompañamientos', 
  bebidas: 'Bebidas',
  combos: 'Combos'
}

const menuItems = [
  // Hamburguesas
  { id: 1, nombre_item: 'Hamburguesa Clásica', precio: 1200, categoria: 'hamburguesas', icon: '🍔' },
  { id: 2, nombre_item: 'Hamburguesa Especial', precio: 1500, categoria: 'hamburguesas', icon: '🍔' },
  { id: 3, nombre_item: 'Hamburguesa Doble', precio: 1800, categoria: 'hamburguesas', icon: '🍔' },
  { id: 4, nombre_item: 'Hamburguesa Veggie', precio: 1400, categoria: 'hamburguesas', icon: '🌱' },
  
  // Acompañamientos
  { id: 5, nombre_item: 'Papas Fritas', precio: 800, categoria: 'acompañamientos', icon: '🍟' },
  { id: 6, nombre_item: 'Papas Cheddar', precio: 1000, categoria: 'acompañamientos', icon: '🧀' },
  { id: 7, nombre_item: 'Aros de Cebolla', precio: 900, categoria: 'acompañamientos', icon: '🧅' },
  { id: 8, nombre_item: 'Ensalada Mixta', precio: 700, categoria: 'acompañamientos', icon: '🥗' },
  
  // Bebidas
  { id: 9, nombre_item: 'Coca Cola 500ml', precio: 600, categoria: 'bebidas', icon: '🥤' },
  { id: 10, nombre_item: 'Agua Mineral', precio: 400, categoria: 'bebidas', icon: '💧' },
  { id: 11, nombre_item: 'Cerveza Artesanal', precio: 900, categoria: 'bebidas', icon: '🍺' },
  { id: 12, nombre_item: 'Jugo Natural', precio: 500, categoria: 'bebidas', icon: '🧃' },
  
  // Combos
  { id: 13, nombre_item: 'Combo Clásico', precio: 2200, categoria: 'combos', icon: '📦' },
  { id: 14, nombre_item: 'Combo Especial', precio: 2800, categoria: 'combos', icon: '📦' },
  { id: 15, nombre_item: 'Combo Familiar', precio: 4500, categoria: 'combos', icon: '📦' }
]

const ProductGrid = () => {
  const { addItem } = useOrder()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.categoria === activeCategory
    const matchesSearch = item.nombre_item.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddItem = (item) => {
    addItem({
      nombre_item: item.nombre_item,
      precio: item.precio,
      observacion: ''
    })
  }

  return (
    <div className="products-section">
      <div className="products-header">
        <h2>Menú</h2>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Categorías */}
      <div className="categories-tabs">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            className={`category-tab ${activeCategory === key ? 'active' : ''}`}
            onClick={() => setActiveCategory(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid de Productos */}
      <div className="products-grid">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="product-card"
            onClick={() => handleAddItem(item)}
          >
            <div className="product-icon">{item.icon}</div>
            <div className="product-name">{item.nombre_item}</div>
            <div className="product-price">${item.precio}</div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-order">
          <div className="empty-order-icon">🔍</div>
          <h3>No se encontraron productos</h3>
          <p>Prueba con otros términos de búsqueda</p>
        </div>
      )}
    </div>
  )
}

export default ProductGrid