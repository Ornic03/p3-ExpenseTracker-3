import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Encabezado from '../components/Encabezado';
import { RUTAS } from '../navigation/rutas';
import { useExpenses } from '../hooks/useExpenses';

// La lista toma los gastos del Context compartido (US #1).
// User Story #6: esta pantalla se muestra a través del TabNavigator.
export default function PantallaGastos({ navigation }) {
  const { expenses, isLoaded } = useExpenses();
  return (
    <SafeAreaView edges={['top']} style={styles.contenedor}>
      <Encabezado
        titulo="Listado de gastos"
        descripcion="Así se verán tus gastos cuando los registres."
      />

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text>{isLoaded ? 'Todavía no hay gastos registrados.' : 'Cargando gastos…'}</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={styles.tarjetaGasto}
            onPress={() => navigation.navigate(RUTAS.DETALLE_GASTO, { id: item.id })}
          >
            <Text style={styles.nombreGasto}>{item.descripcion}</Text>
            <Text style={styles.montoGasto}>
              ${item.monto.toLocaleString('es-AR')}
            </Text>
          </Pressable>
        )}
      />

      <Pressable
        style={styles.botonVolver}
        onPress={() => navigation.navigate(RUTAS.INICIO)}
        accessibilityRole="button"
      >
        <Text style={styles.textoBotonVolver}>Volver al inicio</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  lista: { paddingBottom: 16 },
  tarjetaGasto: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
  },
  nombreGasto: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    flexShrink: 1,
  },
  montoGasto: { fontSize: 16, color: '#2563EB', fontWeight: 'bold' },
  botonVolver: { padding: 14, alignItems: 'center' },
  textoBotonVolver: { color: '#2563EB', fontSize: 16, fontWeight: '600' },
});
