import React, { useState } from 'react'
import { useOrder } from '../services/OrderContext'

const categories = {
  all: 'Todos',
hamburguesas: <img src="/images/HamburguesaClasica.png" className="category-icon" alt="Hamburguesa" />,
acompañamientos: <img src="/images/PapasFritas.png" className="category-icon" alt="Papas" />,
bebidas: <img src="/images/Coca.png" className="category-icon" alt="Bebidas" />,
combos: <img src="/images/ComboClasico.png" className="category-icon" alt="Combos" />
}

const menuItems = [
  // 🍔 Hamburguesas
{ id: 1, nombre_item: 'Hamburguesa Clásica', precio: 9500, categoria: 'hamburguesas', icon: '/images/HamburguesaClasica.png' },
{ id: 2, nombre_item: 'Hamburguesa Especial', precio: 12000, categoria: 'hamburguesas', icon: '/images/HamburguesaEspecial.png' },
{ id: 3, nombre_item: 'Hamburguesa Doble', precio: 14500, categoria: 'hamburguesas', icon: '/images/HamburguesaDoble.png' },
{ id: 4, nombre_item: 'Hamburguesa Veggie', precio: 11000, categoria: 'hamburguesas', icon: '/images/HamburguesaVeggie.png' },
  
  // 🍟 Acompañamientos
{ id: 5, nombre_item: 'Papas Fritas', precio: 6500, categoria: 'acompañamientos', icon: '/images/PapasFritas.png' },
{ id: 6, nombre_item: 'Papas Cheddar', precio: 8000, categoria: 'acompañamientos', icon: '/images/PapasCheddar.png' },
{ id: 7, nombre_item: 'Aros de Cebolla', precio: 7500, categoria: 'acompañamientos', icon: '/images/ArosCebolla.png' },
{ id: 8, nombre_item: 'Ensalada Mixta', precio: 5500, categoria: 'acompañamientos', icon: '/images/Ensalada.png' },
  
  // 🥤 Bebidas
{ id: 9, nombre_item: 'Gaseosa', precio: 4800, categoria: 'bebidas', icon: '/images/Coca.png' },

{ id: 10, nombre_item: 'Agua Mineral', precio: 3200, categoria: 'bebidas', icon: '/images/Agua.png' },
{ id: 11, nombre_item: 'Cerveza Artesanal', precio: 7500, categoria: 'bebidas', icon: '/images/Cerveza.png' },
{ id: 12, nombre_item: 'Jugo Natural', precio: 4000, categoria: 'bebidas', icon: '/images/Jugo.png' },
  
  // 📦 Combos
{ id: 13, nombre_item: 'Combo Clásico', precio: 17500, categoria: 'combos', icon: '/images/ComboClasico.png' },
{ id: 14, nombre_item: 'Combo Especial', precio: 22500, categoria: 'combos', icon: '/images/ComboEspecial.png' },
{ id: 15, nombre_item: 'Combo Familiar', precio: 38000, categoria: 'combos', icon: '/images/ComboFamiliar.png' }
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

            <img src={item.icon} alt={item.nombre_item.split(' ')[0]} className="product-icon" />

            <div className="product-name">{item.nombre_item}</div>
            <div className="product-price">${item.precio.toLocaleString()}</div>
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
