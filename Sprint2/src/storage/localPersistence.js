import { INITIAL_EXPENSES } from '../data/initialExpenses.js';
import { EXPENSES_KEY, SETTINGS_KEY } from './keys.js';

const DEFAULT_SETTINGS = { notifications: true, darkMode: false };

// localStorage es síncrono: se puede hidratar antes del primer render.
export function leerGastos() {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    if (raw === null) return INITIAL_EXPENSES.map((gasto) => ({ ...gasto }));
    const gastos = JSON.parse(raw);
    if (!Array.isArray(gastos) || !gastos.every((gasto) =>
      gasto && (typeof gasto.id === 'string' || typeof gasto.id === 'number') &&
      typeof gasto.descripcion === 'string' &&
      typeof gasto.monto === 'number' && Number.isFinite(gasto.monto) && gasto.monto > 0 &&
      typeof gasto.categoria === 'string' && typeof gasto.fecha === 'string' &&
      (gasto.notas == null || typeof gasto.notas === 'string')
    )) throw new Error('Formato de gastos inválido');
    return gastos; // [] también es válido: no restaurar ejemplos eliminados.
  } catch (error) {
    console.warn('No se pudieron leer los gastos:', error);
    return [];
  }
}

export function leerAjustes() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw === null) return { ...DEFAULT_SETTINGS };
    const ajustes = JSON.parse(raw);
    if (!ajustes || typeof ajustes !== 'object' || Array.isArray(ajustes)) {
      throw new Error('Formato de ajustes inválido');
    }
    return {
      notifications: typeof ajustes.notifications === 'boolean' ? ajustes.notifications : DEFAULT_SETTINGS.notifications,
      darkMode: typeof ajustes.darkMode === 'boolean' ? ajustes.darkMode : DEFAULT_SETTINGS.darkMode,
    };
  } catch (error) {
    console.warn('No se pudieron leer los ajustes:', error);
    return { ...DEFAULT_SETTINGS };
  }
}

export function guardarJSON(clave, datos) {
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
  } catch (error) {
    // El navegador puede bloquear el almacenamiento o agotar su cuota.
    // La app sigue funcionando en memoria.
    console.warn('No se pudieron guardar los datos:', error);
  }
}
