import { createContext, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { EXPENSES_KEY } from '../storage/keys';
import { INITIAL_EXPENSES } from '../data/initialExpenses';

export const ExpensesContext = createContext(null);

function fechaLocal() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

// US #3: la interfaz sigue usando el mismo Context de US #1 y US #2.
export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const canPersist = useRef(false);
  const pendingWrite = useRef(Promise.resolve());

  // Hidratación: nunca se guarda el estado inicial antes de terminar la lectura.
  useEffect(() => {
    let active = true;
    async function hydrate() {
      try {
        const raw = await AsyncStorage.getItem(EXPENSES_KEY);
        const loaded = raw === null
          ? INITIAL_EXPENSES.map((gasto) => ({ ...gasto }))
          : JSON.parse(raw);
        if (!Array.isArray(loaded)) throw new Error('Los gastos guardados no son un arreglo');
        if (active) {
          setExpenses(loaded); // Un arreglo [] guardado es válido: no se repueblan los ejemplos.
          canPersist.current = true;
        }
      } catch (error) {
        // Si falla la lectura, no sobrescribir posibles datos existentes.
        console.warn('No se pudieron cargar los gastos:', error);
      } finally {
        if (active) setIsLoaded(true);
      }
    }
    hydrate();
    return () => { active = false; };
  }, []);

  // Persistencia: serializar escrituras para mantener el orden de los cambios.
  useEffect(() => {
    if (!isLoaded || !canPersist.current) return;
    async function persist() {
      try {
        await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
      } catch (error) {
        console.warn('No se pudieron guardar los gastos:', error);
      }
    }
    pendingWrite.current = pendingWrite.current.then(persist);
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

  if (!isLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Cargando gastos…</Text>
      </View>
    );
  }

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },
  loadingText: { marginTop: 12, color: '#4B5563' },
});
