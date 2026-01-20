# 🍔 Sistema de Pedidos – Frontend

Frontend del sistema de pedidos en tiempo real para un carrito de comidas.  
Permite tomar pedidos desde el mostrador y mostrarlos automáticamente en una pantalla de cocina (KDS).

El objetivo es **agilizar el flujo de pedidos**, evitar confusiones y mejorar los tiempos de preparación.

---

## 🧩 Qué incluye

### 🧾 Cajero
- Carga de pedidos (items, cantidades y observaciones)
- Cálculo automático del total
- Envío de pedidos al backend
- Soporte básico para modo offline (reintentos al reconectar)

### 👨‍🍳 Cocina
- Visualización de pedidos en tiempo real
- Estados del pedido: pendiente / en preparación / listo
- Actualización automática sin recargar la página
- Diseño pensado para tablets o pantallas en modo kiosk

---

## ⚡ Tecnologías usadas

- ⚛️ React + Vite
- 📡 Socket.IO Client
- 🌐 Fetch API
- 💾 IndexedDB (offline básico)
- 🎨 CSS simple (enfocado en usabilidad)

---

## 🔁 Comunicación en tiempo real

- El frontend se conecta al backend mediante **Socket.IO**
- Los pedidos nuevos y los cambios de estado se actualizan en tiempo real
- No hace falta refrescar la página

---

## 🚀 Cómo correr el proyecto

```bash
npm install
npm run dev
