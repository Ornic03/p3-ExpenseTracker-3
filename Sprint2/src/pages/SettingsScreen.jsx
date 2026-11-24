import { useSettings } from '../context/SettingsContext'
import '../styles/SettingsScreen.css'

export default function SettingsScreen() {
  const { settings, setSettings } = useSettings()
  return (
    <main className="settings-screen">
      <header className="settings-screen__header">
        <h1>Configuración</h1>
        <p>Personalizá los ajustes de la app.</p>
      </header>
      <section className="settings-screen__card" aria-label="Preferencias">
        <label className="settings-screen__row">
          <span>Notificaciones</span>
          <input type="checkbox" role="switch" className="settings-screen__switch"
            checked={settings.notifications}
            onChange={(event) => {
              const checked = event.target.checked
              setSettings((prev) => ({ ...prev, notifications: checked }))
            }} />
        </label>
        <label className="settings-screen__row">
          <span>Modo oscuro</span>
          <input type="checkbox" role="switch" className="settings-screen__switch"
            checked={settings.darkMode}
            onChange={(event) => {
              const checked = event.target.checked
              setSettings((prev) => ({ ...prev, darkMode: checked }))
            }} />
        </label>
      </section>
    </main>
  )
}
