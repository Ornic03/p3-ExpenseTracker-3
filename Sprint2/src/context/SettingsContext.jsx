import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SETTINGS_KEY } from '../storage/keys';
import { leerAjustes, guardarJSON } from '../storage/localPersistence';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => leerAjustes());
  const isLoaded = true;

  useEffect(() => {
    if (!isLoaded) return;
    guardarJSON(SETTINGS_KEY, settings);
  }, [settings, isLoaded]);

  const value = useMemo(() => ({ settings, setSettings, isLoaded }), [settings, isLoaded]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === null) throw new Error('useSettings requiere SettingsProvider');
  return context;
}
