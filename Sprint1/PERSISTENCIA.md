# Sprint 3 — User Stories #1 y #2

## Qué se implementó (US #1 + US #2)

- `ExpensesProvider` y `useExpenses()` en `src/context` y `src/hooks`.
- `expenses`, `isLoaded`, `addExpense(data)` y `removeExpense(id)` son compartidos por las pantallas.
- Datos iniciales comunes al proyecto PWA en `src/data/initialExpenses.js`.
- Categorías centralizadas en `src/data/categories.js`.
- El Provider se monta en `App.js`, por encima de la navegación.
- Inicio y listado muestran datos del Context; formulario valida nombre y monto positivo, convierte el monto a `Number` y llama a `addExpense(data)`.
- Detalle recibe **solo `id`**, consulta el gasto en el Context y confirma la eliminación con `Alert.alert()` antes de llamar a `removeExpense(id)` y volver al listado.
- Si se borran todos los gastos, Inicio y Listado muestran un mensaje de estado vacío; totales y cantidad de movimientos se actualizan desde `expenses`.

## Estado de la arquitectura por capas

**US #1 y US #2:** los gastos se conservan **solo en `useState`**; se pierden al cerrar o reiniciar la aplicación.
`isLoaded` es `true` de inmediato porque todavía no existe hidratación asíncrona.

**Pendiente de próximas US:** almacenamiento de ajustes con AsyncStorage, hidratación, Firestore, `onSnapshot()`, sincronización y pruebas offline con capturas. No se afirma que ya estén implementadas.

## Comparación con la PWA (US #1)

| Aspecto | React Native | PWA |
| --- | --- | --- |
| Provider | `App.js` | `main.jsx` |
| Hook | `src/hooks/useExpenses.js` | `src/hooks/useExpenses.js` |
| Gastos | `useState` (volátil) | `useState` (volátil) |
| Persistencia de ajustes futura | AsyncStorage | localStorage |
| Persistencia compartida futura | Firestore | Firestore |

## Pruebas de US #1 + US #2 para realizar

1. Abrir Inicio: total inicial `$75.000` y 3 movimientos.
2. Abrir Gastos: los tres movimientos de ejemplo aparecen.
3. Crear un gasto: se ve en el listado y cambia el total del inicio.
4. Abrir el detalle del gasto nuevo y presionar Eliminar. Con Cancelar se conserva; con Eliminar se borra, vuelve al listado y se actualiza Inicio.
5. Intentar guardar sin nombre, con monto 0, negativo o no numérico: deben mostrarse errores y no crearse movimientos.
6. Eliminar los 3 gastos de ejemplo: Inicio muestra 0 movimientos, total $0 y «Todavía no registraste gastos.»; Gastos muestra «Todavía no hay gastos registrados.».
7. Reiniciar completamente la app: se recuperan solo los tres gastos iniciales (esperado en US #1).

**Pruebas de US #6 sin conexión:** pendientes; deben documentarse con capturas al implementar las US siguientes.
