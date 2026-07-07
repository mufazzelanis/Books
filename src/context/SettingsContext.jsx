import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import translations from '../translations';

const defaultSettings = {
  theme: 'dark',
  language: 'en',
  region: 'us',
  resultsPerPage: '6',
  showRating: true,
};

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('bookshow_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('bookshow_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.add('light');
      root.style.setProperty('--bg-primary', '#f8fafc');
      root.style.setProperty('--bg-secondary', '#e2e8f0');
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--border', '#cbd5e1');
    } else {
      root.classList.remove('light');
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1e293b');
      root.style.setProperty('--text-primary', '#f1f5f9');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--border', '#334155');
    }
  }, [settings.theme]);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const t = useCallback((path, lang) => {
    const langCode = lang || settings.language;
    const keys = path.split('.');
    let result = translations[langCode];
    for (const key of keys) {
      if (result && typeof result === 'object') result = result[key];
      else return path;
    }
    return result || path;
  }, [settings.language]);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};