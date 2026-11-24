import { ActivityIndicator, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Encabezado from '../components/Encabezado';
import { useSettings } from '../context/SettingsContext';

export default function PantallaConfiguracion() {
  const { settings, setSettings, isLoaded } = useSettings();
  return (
    <SafeAreaView edges={['top']} style={styles.contenedor}>
      <Encabezado titulo="Configuración" descripcion="Personalizá los ajustes de la app." />
      {!isLoaded ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : (
        <View style={styles.tarjeta}>
          <View style={[styles.fila, styles.separador]}>
            <Text style={styles.etiqueta}>Notificaciones</Text>
            <Switch
              accessibilityLabel="Notificaciones"
              value={settings.notifications}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, notifications: value }))}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={settings.notifications ? '#2563EB' : '#F9FAFB'}
            />
          </View>
          <View style={styles.fila}>
            <Text style={styles.etiqueta}>Modo oscuro</Text>
            <Switch
              accessibilityLabel="Modo oscuro"
              value={settings.darkMode}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, darkMode: value }))}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={settings.darkMode ? '#2563EB' : '#F9FAFB'}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#F3F4F6', padding: 24 },
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 18, elevation: 2 },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  separador: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  etiqueta: { fontSize: 16, fontWeight: '600', color: '#374151' },
});
