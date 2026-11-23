# Sprint 3 — User Stories #1 y #2

## Qué se implementó (US #1 + US #2)

- `ExpensesProvider` y `useExpenses()` en `src/context` y `src/hooks`.
- `expenses`, `isLoaded`, `addExpense(data)` y `removeExpense(id)` son compartidos por las pantallas.
- Datos iniciales comunes al proyecto React Native en `src/data/initialExpenses.js`.
- Categorías centralizadas en `src/data/categories.js`.
- El Provider se monta en `main.jsx`, por encima del router.
- Inicio, listado y detalle leen el Context; el modal valida nombre, monto positivo numérico y llama a `addExpense(data)`.
- El detalle obtiene el `id` mediante `useParams()`, busca en Context y confirma con `window.confirm()` antes de eliminar y volver al listado.
- Si no quedan gastos reales, Inicio y Listado muestran estados vacíos; los totales se calculan desde el Context.
- Un enlace directo a `/expenses/:id` inexistente o eliminado muestra «Gasto no encontrado».
- Se mantiene la demostración separada de los 800 gastos simulados del Sprint 2 (no se agregan al Context).

## Estado de la arquitectura por capas

**US #1 y US #2:** los gastos se conservan **solo en `useState`**; se pierden al cerrar o actualizar la página.
`isLoaded` es `true` de inmediato porque todavía no existe hidratación asíncrona.

**Pendiente de próximas US:** almacenamiento de ajustes con localStorage, hidratación, Firestore, `onSnapshot()`, sincronización y pruebas offline con capturas. No se afirma que ya estén implementadas.

## Comparación con React Native (US #1)

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
3. Crear un gasto en el modal: se ve en el listado y cambia el total del inicio.
4. Abrir el detalle del gasto nuevo y presionar Eliminar. Cancelar en `window.confirm` no borra; aceptar borra y vuelve a `/expenses`.
5. Intentar guardar sin nombre, con monto 0, negativo o no numérico: no debe crearse ningún gasto.
6. Eliminar los 3 gastos iniciales: Inicio muestra $0, 0 movimientos y «Todavía no registraste gastos.»; Listado muestra «Todavía no hay gastos registrados.».
7. Entrar manualmente a `/expenses/ID-ELIMINADO`: debe aparecer «Gasto no encontrado» (no una pantalla en blanco).
8. Actualizar la página: se recuperan solo los tres gastos iniciales (esperado en US #1).
9. Comprobar que «800 simulados» y el listado virtualizado siguen funcionando sin mezclar gastos.

**Pruebas de US #6 sin conexión:** pendientes; deben documentarse con capturas al implementar las US siguientes.
