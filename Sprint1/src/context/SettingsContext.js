import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SETTINGS_KEY } from '../storage/keys';

const SettingsContext = createContext(null);
const DEFAULT_SETTINGS = { notifications: true, darkMode: false };

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const canPersist = useRef(false);
  const pendingWrite = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;
    async function hydrate() {
      try {
        const raw = await AsyncStorage.getItem(SETTINGS_KEY);
        const stored = raw === null ? DEFAULT_SETTINGS : JSON.parse(raw);
        if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
          throw new Error('Formato de ajustes inválido');
        }
        if (active) {
          setSettings({
            notifications: typeof stored.notifications === 'boolean' ? stored.notifications : DEFAULT_SETTINGS.notifications,
            darkMode: typeof stored.darkMode === 'boolean' ? stored.darkMode : DEFAULT_SETTINGS.darkMode,
          });
          canPersist.current = true;
        }
      } catch (error) {
        console.warn('No se pudieron cargar los ajustes:', error);
      } finally {
        if (active) setIsLoaded(true);
      }
    }
    hydrate();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!isLoaded || !canPersist.current) return;
    async function persist() {
      try {
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch (error) {
        console.warn('No se pudieron guardar los ajustes:', error);
      }
    }
    pendingWrite.current = pendingWrite.current.then(persist);
  }, [settings, isLoaded]);

  const value = useMemo(() => ({ settings, setSettings, isLoaded }), [settings, isLoaded]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === null) throw new Error('useSettings requiere SettingsProvider');
  return context;
}
