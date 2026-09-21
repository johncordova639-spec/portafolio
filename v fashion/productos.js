// ============================================
//  BASE DE DATOS DE PRODUCTOS
// ============================================

const productosDB = [
  {
    id: 1,
    nombre: "Buzo Urban Classic",
    precio: 8990,
    categoria: "unisex",
    imagen: "img/buzo1.jpg",
    descripcion: "Buzo de estilo urbano, perfecto para el día a día. Diseño minimalista con acabados premium.",
    material: "80% Algodón orgánico · 20% Poliéster reciclado. Tela suave al tacto, resistente y duradera.",
    colores: ["#1a1a1a", "#ffffff", "#6c63ff", "#3b82f6", "#ef4444"],
    nombresColores: ["Negro", "Blanco", "Violeta", "Azul", "Rojo"],
    tallas: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: 2,
    nombre: "Buzo Sport Pro",
    precio: 10990,
    categoria: "hombre",
    imagen: "img/buzo2.jpg",
    descripcion: "Diseñado para el rendimiento deportivo. Tejido transpirable y elástico para máxima comodidad.",
    material: "100% Poliéster técnico de alta performance. Anti-sudor y secado rápido.",
    colores: ["#0f172a", "#1e40af", "#166534", "#7f1d1d"],
    nombresColores: ["Negro Oscuro", "Azul Navy", "Verde", "Bordo"],
    tallas: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 3,
    nombre: "Buzo Soft Oversize",
    precio: 9500,
    categoria: "mujer",
    imagen: "img/buzo3.jpg",
    descripcion: "Estilo oversized tendencia, perfecto para looks casuales y cómodos.",
    material: "90% Algodón peinado · 10% Elastano. Ultra suave y cómodo.",
    colores: ["#fce7f3", "#ddd6fe", "#bfdbfe", "#d1fae5", "#ffffff"],
    nombresColores: ["Rosa", "Lila", "Celeste", "Menta", "Blanco"],
    tallas: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 4,
    nombre: "Buzo Street Culture",
    precio: 12000,
    categoria: "unisex",
    imagen: "img/buzo4.jpg",
    descripcion: "Edición limitada con diseño exclusivo. Cultura urbana en su máxima expresión.",
    material: "70% Algodón · 30% Poliéster. Estampado de alta durabilidad sin decoloración.",
    colores: ["#1a1a1a", "#f59e0b", "#ffffff"],
    nombresColores: ["Negro", "Amarillo", "Blanco"],
    tallas: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 5,
    nombre: "Buzo Polar Sherpa",
    precio: 15500,
    categoria: "unisex",
    imagen: "img/buzo5.jpg",
    descripcion: "Máximo abrigo con interior sherpa. Ideal para los días más fríos del invierno.",
    material: "Exterior: 100% Poliéster. Interior: Sherpa sintético premium. Cálido y resistente.",
    colores: ["#78350f", "#1e3a5f", "#374151", "#1a1a1a"],
    nombresColores: ["Café", "Azul Marino", "Gris Oscuro", "Negro"],
    tallas: ["S", "M", "L", "XL", "XXL", "XXXL"]
  },
  {
    id: 6,
    nombre: "Buzo Vintage Wash",
    precio: 11200,
    categoria: "mujer",
    imagen: "img/buzo6.jpg",
    descripcion: "Acabado desteñido intencionado para un look retro y único. Cada pieza es irrepetible.",
    material: "100% Algodón con lavado especial acid-wash. Textura única y personalidad propia.",
    colores: ["#6b7280", "#d97706", "#be185d", "#0369a1"],
    nombresColores: ["Gris", "Naranja", "Rosa Fuerte", "Azul"],
    tallas: ["XS", "S", "M", "L", "XL"]
  }
];

// ============================================
//  CARRITO DE COMPRAS - ESTADO GLOBAL
// ============================================

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(producto, talla, color) {
  const item = {
    id: Date.now(),
    productoId: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    imagen: producto.imagen,
    talla: talla,
    color: color
  };
  carrito.push(item);
  guardarCarrito();
  actualizarContadorCarrito();
  mostrarNotificacion(`✅ ${producto.nombre} agregado al carrito`);
}

function actualizarContadorCarrito() {
  const contador = document.getElementById('cant-carrito');
  if (contador) {
    contador.textContent = carrito.length;
    contador.style.animation = 'none';
    setTimeout(() => contador.style.animation = '', 10);
  }
}

function mostrarNotificacion(mensaje) {
  const notif = document.createElement('div');
  notif.className = 'notificacion';
  notif.textContent = mensaje;
  notif.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #6c63ff, #8b5cf6);
    color: white;
    padding: 0.8rem 2rem;
    border-radius: 50px;
    font-weight: 600;
    z-index: 9999;
    animation: fadeInUp 0.4s ease;
    box-shadow: 0 8px 25px rgba(108,99,255,0.4);
  `;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// ============================================
//  AGREGAR PRODUCTO NUEVO DESDE FORMULARIO
// ============================================

function agregarProductoNuevo(datos) {
  const nuevoProducto = {
    id: productosDB.length + 1,
    nombre: datos.nombre,
    precio: parseFloat(datos.precio),
    categoria: datos.categoria,
    imagen: datos.imagen,
    descripcion: datos.descripcion,
    material: datos.material,
    colores: datos.colores,
    nombresColores: datos.nombresColores,
    tallas: datos.tallas
  };
  productosDB.push(nuevoProducto);
  return nuevoProducto;
}