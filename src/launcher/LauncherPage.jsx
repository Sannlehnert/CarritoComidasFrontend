import React, { useState } from 'react'

const LauncherPage = () => {
  const [loading, setLoading] = useState(false)

  const openWindow = (path) => {
    setLoading(true)
    const url = `${window.location.origin}${path}`
    window.open(url, '_blank')
    setTimeout(() => setLoading(false), 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-slate-50 p-4">
      <div className="max-w-sm w-full bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl ring-1 ring-white/50 border border-gray-100">
        <div className="text-center space-y-6">
          <img src="/images/Logo.png" alt="Logo" className="mx-auto w-24 h-24 object-contain" />
          <div>
            <h1 className="font-title text-2xl font-bold text-gray-900 mb-2">Comandas Digital</h1>
            <p className="text-gray-600 text-sm">Seleccioná tu estación</p>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => openWindow('/cajero')} 
              disabled={loading}
              className="w-full h-14 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cajero
            </button>
            <button 
              onClick={() => openWindow('/cocina')} 
              disabled={loading}
              className="w-full h-14 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cocina
            </button>
          </div>
          {loading && (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 font-medium">Abriendo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LauncherPage