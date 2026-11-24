import { createContext, useCallback, useMemo, useState, useEffect } from 'react';
import { EXPENSES_KEY } from '../storage/keys';
import { leerGastos, guardarJSON } from '../storage/localPersistence';

export const ExpensesContext = createContext(null);

function fechaLocal() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

// US #4: hidratación síncrona, sin cambiar la API de US #1 y US #2.
export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState(() => leerGastos());
  // La lectura terminó durante la inicialización de useState.
  const isLoaded = true;

  useEffect(() => {
    if (!isLoaded) return;
    guardarJSON(EXPENSES_KEY, expenses);
  }, [expenses, isLoaded]);

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
