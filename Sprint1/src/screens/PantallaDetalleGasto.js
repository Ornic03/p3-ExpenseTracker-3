import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Encabezado from '../components/Encabezado';
import { useExpenses } from '../hooks/useExpenses';

// El detalle recibe solo el ID: el gasto siempre se consulta desde el Context.
export default function PantallaDetalleGasto({ route, navigation }) {
  const { expenses, removeExpense } = useExpenses();
  const id = route.params?.id ?? route.params?.gasto?.id;
  const gasto = expenses.find((item) => String(item.id) === String(id));

  const confirmarEliminacion = () => {
    Alert.alert('Eliminar gasto', '¿Querés eliminar este gasto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          removeExpense(id);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!gasto) {
    return (
      <View style={styles.contenedor}>
        <Encabezado titulo="Gasto no encontrado" />
        <Text>No existe ese gasto o fue eliminado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Encabezado titulo={gasto.descripcion} />
      <Text style={styles.monto}>${gasto.monto.toLocaleString('es-AR')}</Text>
      <Pressable style={styles.botonEliminar} onPress={confirmarEliminacion} accessibilityRole="button">
        <Text style={styles.textoEliminar}>Eliminar gasto</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#F3F4F6', padding: 24 },
  monto: { fontSize: 32, fontWeight: 'bold', color: '#2563EB', textAlign: 'center' },
  botonEliminar: { marginTop: 28, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#DC2626', alignItems: 'center' },
  textoEliminar: { color: '#DC2626', fontWeight: '600', fontSize: 16 },
});