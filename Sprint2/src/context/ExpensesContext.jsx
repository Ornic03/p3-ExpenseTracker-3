import { createContext, useCallback, useMemo, useState } from 'react';
import { INITIAL_EXPENSES } from '../data/initialExpenses';

export const ExpensesContext = createContext(null);

function fechaLocal() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

// US #1: fuente única de datos de gastos, todavía SIN persistencia.
export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState(() => INITIAL_EXPENSES.map((gasto) => ({ ...gasto })));
  // US #1 no hidrata datos: están disponibles inmediatamente en memoria.
  // Las US #3 y #4 reemplazarán esto por la carga inicial correspondiente.
  const [isLoaded] = useState(true);

  const addExpense = useCallback((data) => {
    const descripcion = String(data.descripcion ?? data.nombre ?? '').trim();
    const monto = Number(data.monto);
    if (!descripcion || !Number.isFinite(monto) || monto <= 0) return null;

    const gasto = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      descripcion,
      monto,
      categoria: data.categoria || 'Otros',
      fecha: data.fecha || fechaLocal(),
      notas: data.notas || '',
    };
    setExpenses((actuales) => [gasto, ...actuales]);
    return gasto;
  }, []);

  const removeExpense = useCallback((id) => {
    setExpenses((actuales) => actuales.filter((gasto) => String(gasto.id) !== String(id)));
  }, []);

  const value = useMemo(
    () => ({ expenses, isLoaded, addExpense, removeExpense }),
    [expenses, isLoaded, addExpense, removeExpense]
  );

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}
