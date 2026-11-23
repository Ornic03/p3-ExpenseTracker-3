// Datos iniciales de ejemplo. En la US #1 solo se cargan en memoria.
// El mismo modelo se usa en React Native y en la PWA.
export const INITIAL_EXPENSES = [
  {
    id: '1',
    descripcion: 'Supermercado',
    monto: 25000,
    categoria: 'Comida',
    fecha: '2026-10-20',
    notas: 'Compra semanal de alimentos y artículos para el hogar.',
  },
  {
    id: '2',
    descripcion: 'Combustible',
    monto: 18000,
    categoria: 'Transporte',
    fecha: '2026-10-22',
    notas: 'Carga de combustible del vehículo.',
  },
  {
    id: '3',
    descripcion: 'Internet',
    monto: 32000,
    categoria: 'Servicios',
    fecha: '2026-10-24',
    notas: 'Pago del servicio mensual de Internet.',
  },
];
