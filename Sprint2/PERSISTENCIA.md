# Sprint 3 — User Stories #1, #2 y #4 (PWA)

## US #1 y #2 — Estado compartido y CRUD

- `ExpensesProvider` y `useExpenses()` centralizan gastos, `isLoaded`, `addExpense(data)` y `removeExpense(id)`; el Provider se monta en `main.jsx`, por encima del router.
- Los datos de ejemplo y las categorías están centralizados. Inicio, Listado y Detalle leen el Context. El modal valida nombre y monto positivo numérico.
- Detalle busca por `useParams()`, confirma con `window.confirm()` y regresa al listado al eliminar. Si no encuentra el ID, muestra «Gasto no encontrado».
- Inicio y Listado muestran estados vacíos; el total y los movimientos se calculan desde los gastos reales del Context.
- Los 800 gastos simulados y el listado virtualizado se conservan separados del Context y no se guardan.

## US #4 — Persistencia local

Se usan las mismas claves que en React Native, definidas en `src/storage/keys.js`:

- `@expensetracker/expenses`: arreglo de gastos en JSON.
- `@expensetracker/settings`: objeto `{ "notifications": true, "darkMode": false }` en JSON (valores iniciales).

`src/storage/localPersistence.js` contiene las funciones de lectura y escritura. El `ExpensesProvider` hidrata con `useState(() => leerGastos())`; cuando la clave no existe, carga los tres ejemplos originales. Si existe un arreglo vacío, lo conserva vacío. Si hay JSON dañado o formato inválido, devuelve `[]`. `SettingsProvider` hidrata del mismo modo y recupera los valores iniciales si los ajustes están dañados. La lectura y escritura tienen `try/catch` para que un fallo del almacenamiento no detenga la aplicación.

Los dos Providers mantienen `isLoaded = true` porque la lectura termina durante la inicialización del estado. Sus efectos guardan con `JSON.stringify` y `localStorage.setItem` después del render, solo con `isLoaded` verdadero. No hay un render inicial vacío que sobrescriba los datos existentes. Los inputs de Ajustes son `type="checkbox" role="switch"`, controlados por el Context. La consigna exige persistir los valores, no cambiar el tema ni emitir notificaciones.

### Comparación con React Native (US #3)

| Aspecto | React Native | PWA |
| --- | --- | --- |
| API | AsyncStorage | localStorage |
| Lectura | Asíncrona (`await`) | Síncrona |
| Hidratación | `useEffect` al montar | Inicializador perezoso de `useState` |
| `isLoaded` | Inicialmente falso; verdadero tras leer | Verdadero desde el primer render |
| Escritura | Efecto protegido, `await`, cola de escrituras | Efecto protegido, `setItem` síncrono |
| Formato | JSON | JSON |

AsyncStorage devuelve una promesa. No se puede usar `useState(() => AsyncStorage.getItem(...))` para obtener directamente el arreglo: el estado sería una promesa, no los datos. Por eso React Native usa un efecto asíncrono, muestra un indicador y espera la hidratación antes de guardar. En la PWA, `getItem` devuelve el texto inmediatamente y permite parsearlo antes de renderizar. Las mismas claves no implican sincronización entre dispositivos ni entre apps: cada almacenamiento es independiente.

### Rutas profundas

Se mantiene `BrowserRouter`, la búsqueda por ID y `vercel.json` con rewrite a `index.html`, además de `navigateFallback` de Workbox. Al recargar `/expenses/:id`, el Context ya está hidratado y el detalle encuentra el gasto persistido. Un gasto eliminado muestra el estado inexistente.

## Validación manual (pendiente en navegador/dispositivo)

1. Crear un gasto de $10.000, recargar y comprobar listado y total. Abrir el detalle del gasto y recargar directamente esa URL.
2. Cambiar ambos interruptores, recargar, volver a Ajustes y comprobar sus valores.
3. En Chrome, F12 > Application > Local Storage > origen de la PWA: revisar las dos claves y sus valores JSON.
4. Eliminar un gasto y recargar: no debe reaparecer. Eliminar todos y recargar: debe seguir vacío (total $0).
5. Para probar JSON dañado, usar una sesión de prueba o copiar antes el valor de la clave. En DevTools > Console, ejecutar `localStorage.setItem('@expensetracker/expenses', '{invalido'); location.reload();`. Debe abrir sin romperse, con gastos vacíos. El efecto reemplaza el JSON dañado por `[]`. Se pueden restaurar los datos desde la copia previa o borrar la clave y recargar para recuperar los ejemplos iniciales.
6. Probar lo mismo en ajustes: `localStorage.setItem('@expensetracker/settings', '{invalido'); location.reload();`. Debe recuperar los valores iniciales. Restaurar preferencias de prueba si se desea.
7. Ejecutar `npm run build` y `npm run preview` para probar la PWA en modo producción, instalarla cuando el navegador lo permita, cerrarla y abrirla en el mismo origen. Los datos deben conservarse. Las pruebas de desarrollo y producción pueden usar puertos distintos, por lo que sus almacenamientos son distintos.
8. Verificar que los 800 simulados y ambos métodos de listado funcionen como antes.

Firestore, sincronización entre apps y pruebas de US #6 siguen pendientes. No se modifica el proyecto React Native en US #4.
