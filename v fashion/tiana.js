// ============================================
//  TIANA - AGENTE DE IA
// ============================================

const TIANA_NOMBRE = "Tiana";

// Base de conocimiento de Tiana
const tianaBrain = {

  // Saludos
  saludos: ["hola", "buenas", "hey", "buenos días", "buenas tardes", "buenas noches", "ey"],

  // Respuestas de saludo
  respuestasSaludo: [
    "¡Hola! 👋 Soy Tiana, tu asistente personal de moda. ¿En qué puedo ayudarte hoy?",
    "¡Hey! 😊 Soy Tiana. Estoy aquí para ayudarte a encontrar el buzo perfecto. ¿Qué buscas?",
    "¡Buenas! Soy Tiana tu asistente IA. ¿Buscas algo especial hoy? 🧥"
  ],

  // Palabras clave y sus respuestas
  respuestas: [
    {
      palabras: ["talla", "tallas", "medida", "medidas", "tamaño", "size"],
      respuesta: `📏 **Guía de Tallas:**\n
• **XS** → Contorno pecho: 80-84cm
• **S** → Contorno pecho: 85-89cm
• **M** → Contorno pecho: 90-94cm
• **L** → Contorno pecho: 95-99cm
• **XL** → Contorno pecho: 100-104cm
• **XXL** → Contorno pecho: 105-110cm

Si estás entre dos tallas, te recomiendo la más grande para mayor comodidad 😊`
    },
    {
      palabras: ["color", "colores", "disponible", "disponibles", "hay"],
      respuesta: "🎨 Cada buzo tiene sus propios colores disponibles. Al hacer clic en cualquier producto verás los colores exactos con circulitos de muestra. ¡También puedes filtrar por categoría para encontrar tu favorito! 🌈"
    },
    {
      palabras: ["material", "tela", "algodón", "poliéster", "calidad", "fabric"],
      respuesta: "🧵 Trabajamos con materiales premium:\n\n• **Algodón orgánico** - Suave y transpirable\n• **Poliéster técnico** - Deportivo y resistente\n• **Sherpa sintético** - Máximo abrigo\n• **Mezcla elastano** - Mayor comodidad y stretch\n\nCada producto tiene el detalle exacto del material en su descripción 💪"
    },
    {
      palabras: ["precio", "precios", "costo", "cuánto", "cuanto", "vale", "cuesta"],
      respuesta: "💰 Nuestros precios van desde **$8.990** hasta **$15.500**. Todos incluyen envío gratuito en compras superiores a $20.000. ¿Tienes un presupuesto específico en mente? Te ayudo a encontrar la mejor opción 😊"
    },
    {
      palabras: ["envío", "envio", "despacho", "entrega", "llega", "demora"],
      respuesta: "🚚 **Información de Envíos:**\n\n• **Envío estándar:** 3-5 días hábiles\n• **Envío express:** 24-48 horas\n• **Envío gratis** en compras +$20.000\n• Hacemos seguimiento en tiempo real 📦\n\n¿Necesitas tu buzo con urgencia?"
    },
    {
      palabras: ["cambio", "cambios", "devolucion", "devolución", "devolver", "cambiar"],
      respuesta: "🔄 **Política de Cambios:**\n\n✅ Tienes **30 días** para cambios\n✅ El producto debe estar sin uso\n✅ Con etiqueta original\n✅ Cambio gratuito por talla incorrecta\n\nNos importa que estés 100% satisfecho/a 😊"
    },
    {
      palabras: ["pago", "pagos", "tarjeta", "transferencia", "efectivo", "mercadopago", "webpay"],
      respuesta: "💳 **Medios de Pago:**\n\n• Tarjetas de crédito/débito (Visa, Mastercard, AmEx)\n• WebPay / Redcompra\n• MercadoPago\n• Transferencia bancaria\n• Efectivo (solo tienda física)\n\n¡Todas las transacciones son 100% seguras! 🔒"
    },
    {
      palabras: ["descuento", "descuentos", "oferta", "ofertas", "promocion", "promo", "cupón"],
      respuesta: "🎁 **Promociones actuales:**\n\n🔥 2x1 en buzos seleccionados\n💜 10% OFF en tu primera compra con código: **TIANA10**\n🌟 Envío gratis en compras +$20.000\n\n¿Quieres que te avise cuando haya nuevas promos? 🛎️"
    },
    {
      palabras: ["hombre", "masculino", "caballero", "para él"],
      respuesta: "👨 Para hombre tenemos buzos deportivos y urbanos increíbles. Te recomiendo ver el **Buzo Sport Pro** y el **Buzo Street Culture**. ¡Haz clic en cualquier producto para ver todos los detalles en 3D! 💪"
    },
    {
      palabras: ["mujer", "femenino", "dama", "para ella"],
      respuesta: "👩 Para mujer tenemos opciones geniales. El **Buzo Soft Oversize** y el **Buzo Vintage Wash** son los favoritos de la temporada. ¡Los puedes ver en 3D con sus colores disponibles! 🌸"
    },
    {
      palabras: ["invierno", "frío", "frio", "abrigo", "calor", "polar"],
      respuesta: "🧥 Para el frío extremo te recomiendo el **Buzo Polar Sherpa** con interior de sherpa sintético premium. ¡Es el más abrigado de nuestra colección! También el Buzo Urban Classic es excelente para temperaturas intermedias ❄️"
    },
    {
      palabras: ["sport", "deporte", "deportivo", "gym", "ejercicio", "entrenamiento"],
      respuesta: "🏋️ Para deportes nuestro **Buzo Sport Pro** es perfecto. Tiene tejido técnico transpirable, secado rápido y es 100% anti-sudor. Ideal para el gym, running o cualquier actividad física 💪🔥"
    },
    {
      palabras: ["gracias", "thank", "thanks", "genial", "perfecto", "excelente"],
      respuesta: "¡De nada! 😊 Fue un placer ayudarte. Si necesitas algo más, aquí estaré. ¡Que disfrutes tu compra! 🛍️💜"
    },
    {
      palabras: ["quién eres", "quien eres", "qué eres", "que eres", "eres una ia", "eres un bot"],
      respuesta: "🤖 ¡Hola! Soy **Tiana**, la asistente de inteligencia artificial de BuzoStore. Fui creada para ayudarte a encontrar el buzo perfecto, resolver tus dudas sobre tallas, materiales, envíos y mucho más. ¡Pregúntame lo que quieras! 💜"
    }
  ],

  // Respuesta por defecto
  respuestaDefault: [
    "Hmm, no estoy segura de entender bien. ¿Puedes reformular tu pregunta? 😊 Puedo ayudarte con tallas, colores, materiales, envíos y más.",
    "No tengo esa información exacta, pero puedo ayudarte con tallas, precios, envíos y materiales. ¿Qué necesitas saber? 🧥",
    "¡Buena pregunta! Aunque no tengo esa respuesta, puedo orientarte sobre nuestros productos. ¿Te ayudo a encontrar el buzo ideal? 💜"
  ]
};

// ============================================
//  MOTOR DE RESPUESTAS DE TIANA
// ============================================

function tianaResponder(mensaje) {
  const mensajeLower = mensaje.toLowerCase().trim();

  // Detectar saludos
  for (const saludo of tianaBrain.saludos) {
    if (mensajeLower.includes(saludo)) {
      return tianaBrain.respuestasSaludo[
        Math.floor(Math.random() * tianaBrain.respuestasSaludo.length)
      ];
    }
  }

  // Buscar en la base de conocimiento
  for (const item of tianaBrain.respuestas) {
    for (const palabra of item.palabras) {
      if (mensajeLower.includes(palabra)) {
        return item.respuesta;
      }
    }
  }

  // Buscar productos específicos por nombre
  const productoEncontrado = productosDB.find(p =>
    mensajeLower.includes(p.nombre.toLowerCase()) ||
    p.nombre.toLowerCase().split(' ').some(palabra =>
      mensajeLower.includes(palabra) && palabra.length > 3
    )
  );

  if (productoEncontrado) {
    return `🧥 **${productoEncontrado.nombre}**\n\n💰 Precio: $${productoEncontrado.precio.toLocaleString()}\n\n📝 ${productoEncontrado.descripcion}\n\n🧵 ${productoEncontrado.material}\n\n📏 Tallas: ${productoEncontrado.tallas.join(' · ')}\n\n¡Haz clic en el producto para verlo en 3D! ✨`;
  }

  // Respuesta por defecto
  return tianaBrain.respuestaDefault[
    Math.floor(Math.random() * tianaBrain.respuestaDefault.length)
  ];
}

// ============================================
//  UI DEL CHAT DE TIANA
// ============================================

function inicializarTiana() {
  const burbuja = document.getElementById('tiana-burbuja');
  const chat = document.getElementById('tiana-chat');
  const cerrarChat = document.getElementById('tiana-cerrar-chat');
  const enviarBtn = document.getElementById('tiana-enviar');
  const input = document.getElementById('tiana-input');
  const mensajes = document.getElementById('tiana-mensajes');

  // Abrir / cerrar chat
  burbuja.addEventListener('click', () => {
    chat.classList.toggle('activo');
    if (chat.classList.contains('activo') && mensajes.children.length === 0) {
      setTimeout(() => {
        agregarMensajeTiana("¡Hola! 👋 Soy **Tiana**, tu asistente de moda IA. ¿En qué puedo ayudarte hoy? Puedo orientarte sobre tallas, materiales, colores, envíos y mucho más. 💜");
      }, 400);
    }
  });

  cerrarChat.addEventListener('click', () => {
    chat.classList.remove('activo');
  });

  // Enviar mensaje
  enviarBtn.addEventListener('click', enviarMensaje);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarMensaje();
  });

  function enviarMensaje() {
    const texto = input.value.trim();
    if (!texto) return;

    // Mostrar mensaje del usuario
    agregarMensajeUsuario(texto);
    input.value = '';

    // Simular escritura de Tiana
    mostrarTyping();
    setTimeout(() => {
      quitarTyping();
      const respuesta = tianaResponder(texto);
      agregarMensajeTiana(respuesta);
    }, 900 + Math.random() * 600);
  }

  function agregarMensajeTiana(texto) {
    const div = document.createElement('div');
    div.className = 'mensaje-tiana';
    // Convertir **texto** en negrita
    div.innerHTML = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    mensajes.appendChild(div);
    mensajes.scrollTop = mensajes.scrollHeight;
  }

  function agregarMensajeUsuario(texto) {
    const div = document.createElement('div');
    div.className = 'mensaje-usuario';
    div.textContent = texto;
    mensajes.appendChild(div);
    mensajes.scrollTop = mensajes.scrollHeight;
  }

  function mostrarTyping() {
    const div = document.createElement('div');
    div.className = 'mensaje-tiana typing-indicator';
    div.id = 'typing';
    div.innerHTML = `
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    `;
    mensajes.appendChild(div);
    mensajes.scrollTop = mensajes.scrollHeight;
  }

  function quitarTyping() {
    const typing = document.getElementById('typing');
    if (typing) typing.remove();
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarTiana);