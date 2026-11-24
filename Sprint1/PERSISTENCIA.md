# Sprint 3 — User Stories #1, #2 y #3

## Qué se implementó (US #1 + US #2)

- `ExpensesProvider` y `useExpenses()` en `src/context` y `src/hooks`.
- `expenses`, `isLoaded`, `addExpense(data)` y `removeExpense(id)` son compartidos por las pantallas.
- Datos iniciales comunes al proyecto PWA en `src/data/initialExpenses.js`.
- Categorías centralizadas en `src/data/categories.js`.
- El Provider se monta en `App.js`, por encima de la navegación.
- Inicio y listado muestran datos del Context; formulario valida nombre y monto positivo, convierte el monto a `Number` y llama a `addExpense(data)`.
- Detalle recibe **solo `id`**, consulta el gasto en el Context y confirma la eliminación con `Alert.alert()` antes de llamar a `removeExpense(id)` y volver al listado.
- Si se borran todos los gastos, Inicio y Listado muestran un mensaje de estado vacío; totales y cantidad de movimientos se actualizan desde `expenses`.

## US #3 — Persistencia local en React Native

- Dependencia `@react-native-async-storage/async-storage` 2.2.0, versión indicada en `expo/bundledNativeModules.json` del SDK 57 del proyecto.
- Claves en `src/storage/keys.js`: `@expensetracker/expenses` y `@expensetracker/settings`.
- `ExpensesProvider` comienza con `expenses = []` e `isLoaded = false`. Un `useEffect` lee la clave mediante `await AsyncStorage.getItem`, deserializa con `JSON.parse` y termina la hidratación antes de habilitar las escrituras. Si la clave no existe, carga los tres gastos iniciales; si existe un arreglo vacío, lo respeta.
- Un segundo `useEffect` observa `expenses` e `isLoaded`; solo después de una lectura correcta ejecuta `await AsyncStorage.setItem` con `JSON.stringify`. Las escrituras se encadenan para preservar el orden. Todas las operaciones de lectura/escritura tienen `try/catch`.
- Mientras se hidratan los gastos aparece un `ActivityIndicator`, antes de montar la navegación. La pantalla Ajustes también tiene un indicador mientras carga sus preferencias.
- `SettingsProvider` conserva los valores booleanos de los dos `Switch`: notificaciones (por defecto activadas) y modo oscuro (por defecto desactivado). Se guarda la preferencia; no se incorporan notificaciones reales ni se rediseña el tema visual en esta US.
- Si la lectura falla, se registra el error y se bloquean las escrituras de esa clave durante la sesión, evitando sobreescribir datos que no se pudieron recuperar. Los cambios de esa sesión no serán persistentes en esa clave; volver a abrir permite reintentar la lectura.
- Se mantienen `useExpenses()`, `addExpense()`, `removeExpense()`, la validación, el detalle por ID y los estados vacíos de las US anteriores.

### Error de hidratación pedido por la consigna

**Prueba realizada con almacenamiento y hooks simulados (no en Expo Go):** se preparó un gasto guardado, se demoró la lectura inicial y se quitó temporalmente la condición del efecto de persistencia en una copia de prueba. El efecto escribió `[]` antes de concluir la lectura. Al terminar, recuperó el arreglo vacío en lugar del gasto original. Con la condición `if (!isLoaded || !canPersist.current) return;` restaurada, no hubo ninguna escritura antes de la hidratación y se recuperó el gasto correctamente. La versión entregada conserva la protección.

Para repetirlo físicamente en Expo Go, usar exclusivamente datos de prueba y una copia del proyecto: registrar un gasto, cerrar la app, introducir una demora antes de `getItem`, quitar temporalmente la protección del efecto, abrir y comprobar la pérdida. Restaurar la condición y retirar la demora. No incluir la versión defectuosa en la entrega.

### Comparación por plataforma

| Aspecto | React Native (US #3) | PWA (US #1 + US #2) |
| --- | --- | --- |
| Gastos | AsyncStorage | useState, sin persistencia todavía |
| Ajustes | AsyncStorage | Pendiente de US #4 |
| Persistencia compartida | Pendiente de Firestore | Pendiente de Firestore |

## Pruebas de US #1 + US #2 para realizar

1. Abrir Inicio: total inicial `$75.000` y 3 movimientos.
2. Abrir Gastos: los tres movimientos de ejemplo aparecen.
3. Crear un gasto: se ve en el listado y cambia el total del inicio.
4. Abrir el detalle del gasto nuevo y presionar Eliminar. Con Cancelar se conserva; con Eliminar se borra, vuelve al listado y se actualiza Inicio.
5. Intentar guardar sin nombre, con monto 0, negativo o no numérico: deben mostrarse errores y no crearse movimientos.
6. Eliminar los 3 gastos de ejemplo: Inicio muestra 0 movimientos, total $0 y «Todavía no registraste gastos.»; Gastos muestra «Todavía no hay gastos registrados.».
7. Reiniciar completamente la app: en la US #3 se recuperan los gastos guardados, incluso si quedaron cero.

**Pruebas de US #6 sin conexión:** pendientes; deben documentarse con capturas al implementar las US siguientes.

## Pruebas de US #3

Comprobadas en el entorno de desarrollo mediante un simulador de hooks y AsyncStorage: hidratación demorada sin escrituras iniciales, restauración de gastos, validación de montos, agregar/eliminar, persistencia de arreglo vacío, primer inicio con los tres ejemplos, error de lectura sin sobrescritura, recuperación de ambos ajustes y reproducción deliberada del error de hidratación. Se analizó la sintaxis JSX de 17 archivos. La instalación real de dependencias y la ejecución nativa no se pudieron realizar en el entorno sin acceso al registro npm.

Pendientes de comprobar físicamente con Expo Go SDK 57:

1. Registrar un gasto, cerrar desde el selector de aplicaciones y volver a abrir: debe conservarse, con el total correcto.
2. Eliminarlo, cerrar y abrir: no debe reaparecer.
3. Eliminar todos los gastos y reiniciar: debe mantenerse la lista vacía y el total $0.
4. Cambiar ambos switches y reiniciar: deben conservar su valor.
5. Repetir con otros valores de los switches. Capturar evidencia antes/después para la entrega si corresponde.
