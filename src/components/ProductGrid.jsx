import React, { useState } from 'react'
import { useOrder } from '../services/OrderContext'

const menuItems = [
  { id: 1, nombre_item: 'Hamburguesa Clásica', precio: 9500, categoria: 'hamburguesas', icon: '/images/HamburguesaClasica.png' },
  { id: 2, nombre_item: 'Hamburguesa Especial', precio: 12000, categoria: 'hamburguesas', icon: '/images/HamburguesaEspecial.png' },
  { id: 3, nombre_item: 'Hamburguesa Doble', precio: 14500, categoria: 'hamburguesas', icon: '/images/HamburguesaDoble.png' },
  { id: 4, nombre_item: 'Hamburguesa Veggie', precio: 11000, categoria: 'hamburguesas', icon: '/images/HamburguesaVeggie.png' },
  { id: 5, nombre_item: 'Papas Fritas', precio: 6500, categoria: 'acompañamientos', icon: '/images/PapasFritas.png' },
  { id: 6, nombre_item: 'Papas Cheddar', precio: 8000, categoria: 'acompañamientos', icon: '/images/PapasCheddar.png' },
  { id: 7, nombre_item: 'Aros de Cebolla', precio: 7500, categoria: 'acompañamientos', icon: '/images/ArosCebolla.png' },
  { id: 8, nombre_item: 'Ensalada Mixta', precio: 5500, categoria: 'acompañamientos', icon: '/images/Ensalada.png' },
  { id: 9, nombre_item: 'Gaseosa', precio: 4800, categoria: 'bebidas', icon: '/images/Coca.png' },
  { id: 10, nombre_item: 'Agua Mineral', precio: 3200, categoria: 'bebidas', icon: '/images/Agua.png' },
  { id: 11, nombre_item: 'Cerveza Artesanal', precio: 7500, categoria: 'bebidas', icon: '/images/Cerveza.png' },
  { id: 12, nombre_item: 'Jugo Natural', precio: 4000, categoria: 'bebidas', icon: '/images/Jugo.png' },
  { id: 13, nombre_item: 'Combo Clásico', precio: 17500, categoria: 'combos', icon: '/images/ComboClasico.png' },
  { id: 14, nombre_item: 'Combo Especial', precio: 22500, categoria: 'combos', icon: '/images/ComboEspecial.png' },
  { id: 15, nombre_item: 'Combo Familiar', precio: 38000, categoria: 'combos', icon: '/images/ComboFamiliar.png' }
]

const categorias = {
  hamburguesas: 'Hamburguesas',
  acompañamientos: 'Acompañamientos',
  bebidas: 'Bebidas',
  combos: 'Combos'
}

const ProductGrid = () => {
  const { addItem } = useOrder()
  const [activeCategory, setActiveCategory] = useState('hamburguesas')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'todos' || item.categoria === activeCategory
    const matchesSearch = item.nombre_item.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="bg-white overflow-y-auto p-4 md:p-5 border-r border-gray-200">
      <div className="mb-5">
        <h2 className="font-title text-lg font-semibold text-gray-900 mb-4">Menú</h2>
        <input
          type="text"
          placeholder="Buscar producto..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
        {Object.entries(categorias).map(([key, label]) => (
          <button
            key={key}
            className={`px-3 py-2 whitespace-nowrap rounded-lg border transition-all ${
              activeCategory === key
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setActiveCategory(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg p-4 text-center cursor-pointer transition-all hover:border-primary hover:-translate-y-0.5"
            onClick={() => addItem({ nombre_item: item.nombre_item, precio: item.precio, observacion: '' })}
          >
            <img 
              src={item.icon} 
              alt={item.nombre_item} 
              className="w-20 h-20 object-contain mx-auto mb-3 rounded-lg shadow-sm"
              onError={(e) => { e.target.src = '/images/Logo.png' }} // fallback
            />
            <div className="font-medium text-gray-900 mb-2">{item.nombre_item}</div>
            <div className="font-semibold text-success">${item.precio.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductGrid