/**
 * Configuración armada a partir del CSV exportado desde Jira ("Jira (1).csv").
 *
 * Columnas mapeadas:
 * - id: proviene de la columna "Clave de incidencia".
 * - titulo: se toma del "Resumen" de cada fila.
 * - categoria: agrupación manual según el tema del resumen (catálogo, carrito, pagos, soporte, puntos).
 * - descripcion: texto curado desde la columna "Descripción" (se recorta cuando el CSV trae bloques ADF extensos).
 * - acciones: viñetas armadas con "Tipo de Incidencia", "Estado" y "Prioridad"; en el caso de puntos se resume también la regla de negocio descrita en la historia.
 */
const jiraPageConfig = [
  {
    id: 'UG1-13',
    titulo: 'Catálogo de productos',
    categoria: 'catalogo',
    descripcion:
      'Incluye todas las funcionalidades que permiten a los usuarios explorar el catálogo de productos gamer, ver detalles, buscar por nombre o filtrar por categoría, marca o precio.',
    acciones: ['Tipo de incidencia: Epic', 'Estado: Tareas por hacer', 'Prioridad: Medium'],
  },
  {
    id: 'UG1-14',
    titulo: 'Carrito y compras',
    categoria: 'carrito',
    descripcion:
      'Contiene todas las tareas relacionadas con la gestión del carrito de compras: agregar o quitar productos, visualizar el total y proceder al proceso de compra.',
    acciones: ['Tipo de incidencia: Epic', 'Estado: Tareas por hacer', 'Prioridad: Medium'],
  },
  {
    id: 'UG1-15',
    titulo: 'Pagos y pedidos',
    categoria: 'pagos',
    descripcion:
      'Agrupa las funciones que permiten realizar el pago de los productos, elegir métodos de pago, confirmar pedidos y consultar el historial de compras del usuario.',
    acciones: ['Tipo de incidencia: Epic', 'Estado: Tareas por hacer', 'Prioridad: Medium'],
  },
  {
    id: 'UG1-16',
    titulo: 'Soporte y contacto',
    categoria: 'soporte',
    descripcion:
      'Incluye todas las funcionalidades de atención al cliente y comunicación: contacto con soporte técnico, envío de mensajes, reseñas y notificaciones por correo.',
    acciones: ['Tipo de incidencia: Epic', 'Estado: Tareas por hacer', 'Prioridad: Medium'],
  },
  {
    id: 'UG1-38',
    titulo: 'Como [usuario de la pagina] quiero tener [un sistema de puntos en compras.]',
    categoria: 'puntos',
    descripcion:
      'Historia enfocada en fidelidad: otorgar puntos por los montos de compra, registrar el balance en el perfil y notificar al usuario cuando acumula beneficios.',
    acciones: [
      'Tipo de incidencia: Historia',
      'Estado: Tareas por hacer',
      'Prioridad: Medium',
      'Regla de negocio mencionada: 1 punto por cada $1000 gastados y registro de transacciones asociadas.',
    ],
  },
];

export default jiraPageConfig;
