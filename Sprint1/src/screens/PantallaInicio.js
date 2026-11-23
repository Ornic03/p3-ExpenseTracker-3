import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Encabezado from '../components/Encabezado';
import Boton from '../components/Boton';
import { RUTAS } from '../navigation/rutas';
import { useExpenses } from '../hooks/useExpenses';

// Pantalla de bienvenida: ahora es una pantalla real del TabNavigator.
export default function PantallaInicio({ navigation }) {
  const { expenses, isLoaded } = useExpenses();
  const total = expenses.reduce((suma, gasto) => suma + Number(gasto.monto || 0), 0);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>ExpenseTracker</Text>
        <Encabezado
          titulo="¡Bienvenido/a!"
          descripcion="Una forma sencilla de registrar y organizar tus gastos diarios."
        />

        <View style={styles.resumen}>
          <Text style={styles.textoResumen}>Total registrado: ${total.toLocaleString('es-AR')}</Text>
          <Text style={styles.textoResumen}>Movimientos: {expenses.length}</Text>
          {isLoaded && expenses.length === 0 && (
            <Text style={styles.mensajeVacio}>Todavía no registraste gastos.</Text>
          )}
        </View>

        {/* La acción se envía al StackNavigator que contiene las pestañas. */}
        <Boton
          titulo="Nuevo gasto"
          onPress={() => navigation.navigate(RUTAS.FORMULARIO)}
        />

        {/* Esta acción cambia a la pestaña Gastos. */}
        <Boton
          titulo="Ver gastos"
          variante="secundario"
          estilo={styles.separacion}
          onPress={() => navigation.navigate(RUTAS.GASTOS)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 24,
    textAlign: 'center',
  },
  separacion: { marginTop: 12 },
  resumen: { marginBottom: 20, alignItems: 'center' },
  textoResumen: { fontSize: 14, color: '#374151', marginBottom: 4 },
  mensajeVacio: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 12 },
});