// =====================================================================
//  CONFIGURACIÓN DE CALMA KOMBUCHA
//  Edita solo este archivo para cambiar sabores, precios, planes,
//  número de WhatsApp y enlaces de pago. No hace falta tocar nada más.
//  Los valores marcados con "EJEMPLO" son provisionales: cámbialos.
// =====================================================================

window.CALMA_CONFIG = {
  marca: "Calma Kombucha",

  // Número de WhatsApp con prefijo de país, solo dígitos (EJEMPLO).
  // España: 34 + número. Ej.: "34600123456"
  whatsapp: "34600000000",

  email: "hola@calmakombucha.com", // EJEMPLO

  moneda: "EUR",
  locale: "es-ES",

  // Zona de reparto que se muestra en la web (EJEMPLO).
  zonaReparto: "tu ciudad y alrededores",

  // Pedido mínimo para envío a domicilio y coste de envío (EJEMPLO).
  pedidoMinimo: 12,
  costeEnvio: 3,
  envioGratisDesde: 30,

  // Sabores. "disponible: false" lo muestra como agotado.
  sabores: [
    {
      id: "original",
      nombre: "Original",
      descripcion: "Té verde y negro, fermentado lentamente. Suave, ligeramente ácida.",
      precio: 3.5,
      formato: "330 ml",
      color: "#E9C46A",
      disponible: true,
    },
    {
      id: "jengibre-limon",
      nombre: "Jengibre & Limón",
      descripcion: "Picante, cítrica y refrescante. La favorita para después de entrenar.",
      precio: 3.5,
      formato: "330 ml",
      color: "#F4A261",
      disponible: true,
    },
    {
      id: "frutos-rojos",
      nombre: "Frutos rojos",
      descripcion: "Fresa, frambuesa y arándano. Afrutada y con burbuja fina.",
      precio: 3.8,
      formato: "330 ml",
      color: "#C8553D",
      disponible: true,
    },
    {
      id: "hibisco-menta",
      nombre: "Hibisco & Menta",
      descripcion: "Floral y fresca, con un color rosado intenso.",
      precio: 3.8,
      formato: "330 ml",
      color: "#B5446E",
      disponible: true,
    },
  ],

  // Planes de suscripción.
  // "stripeLink": pega aquí el Payment Link de Stripe (suscripción recurrente).
  // Si lo dejas vacío, el botón abre WhatsApp con la solicitud de alta.
  planes: [
    {
      id: "semanal",
      nombre: "Semanal",
      botellas: 6,
      frecuencia: "cada semana",
      precio: 18, // por entrega (EJEMPLO)
      destacado: false,
      stripeLink: "",
    },
    {
      id: "quincenal",
      nombre: "Quincenal",
      botellas: 12,
      frecuencia: "cada 2 semanas",
      precio: 34, // por entrega (EJEMPLO)
      destacado: true,
      stripeLink: "",
    },
    {
      id: "mensual",
      nombre: "Mensual",
      botellas: 24,
      frecuencia: "cada mes",
      precio: 64, // por entrega (EJEMPLO)
      destacado: false,
      stripeLink: "",
    },
  ],

  // Enlace al portal de cliente de Stripe para gestionar/cancelar (opcional).
  stripePortal: "",
};
