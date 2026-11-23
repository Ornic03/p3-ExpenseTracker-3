import { useContext } from 'react';
import { ExpensesContext } from '../context/ExpensesContext';

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (context === null) {
    throw new Error('useExpenses debe utilizarse dentro de ExpensesProvider');
  }
  return context;
}
