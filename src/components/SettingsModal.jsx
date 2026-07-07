import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, Cog6ToothIcon, MoonIcon, SunIcon, GlobeAltIcon } from "@heroicons/react/24/outline"
import { useSettings } from '../context/SettingsContext'

const langLabels = {
  en: 'English', bn: 'বাংলা (Bengali)', hi: 'हिन्दी (Hindi)',
  es: 'Español (Spanish)', fr: 'Français (French)', de: 'Deutsch (German)',
  ja: '日本語 (Japanese)', zh: '中文 (Chinese)',
}

const regionLabels = {
  us: 'United States', uk: 'United Kingdom', in: 'India', bd: 'Bangladesh',
}

const SettingsModal = ({ isOpen, onClose }) => {
  const { settings, updateSetting, t } = useSettings();

  const settingsOptions = [
    {
      id: 'appearance',
      title: t('settings.appearance'),
      icon: SunIcon,
      fields: [
        {
          key: 'theme',
          label: t('settings.theme'),
          type: 'toggle',
          options: [
            { value: 'dark', label: t('settings.dark'), icon: MoonIcon },
            { value: 'light', label: t('settings.light'), icon: SunIcon },
          ]
        }
      ]
    },
    {
      id: 'language',
      title: t('settings.language'),
      icon: GlobeAltIcon,
      fields: [
        {
          key: 'language',
          label: t('settings.lang'),
          type: 'select',
          options: Object.keys(langLabels).map(code => ({ value: code, label: langLabels[code] })),
        },
        {
          key: 'region',
          label: t('settings.region'),
          type: 'select',
          options: Object.keys(regionLabels).map(code => ({ value: code, label: regionLabels[code] })),
        }
      ]
    },
    {
      id: 'results',
      title: t('settings.searchResults'),
      icon: Cog6ToothIcon,
      fields: [
        {
          key: 'resultsPerPage',
          label: t('settings.resultsPerPage'),
          type: 'select',
          options: ['6', '9', '12', '15'].map(n => ({ value: n, label: n })),
        },
        {
          key: 'showRating',
          label: t('settings.showRating'),
          type: 'switch',
        }
      ]
    }
  ];
  const [activeTab, setActiveTab] = useState(settingsOptions[0].id)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
          className="relative w-full max-w-lg max-h-[85vh] bg-gray-900/95 backdrop-blur-2xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-[0_0_80px_-20px_rgba(34,211,238,0.15)]"
        >
          <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center">
                <Cog6ToothIcon className="w-4 h-4 text-cyan-400" />
              </div>
                <h2 className="text-lg font-bold text-white">{t('settings.title')}</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all">
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex">
            <div className="w-36 flex-shrink-0 border-r border-gray-800/50 p-2 space-y-1">
              {settingsOptions.map(tab => {
                const TabIcon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/20'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30 border border-transparent'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span className="truncate">{tab.title}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5" style={{ maxHeight: "calc(85vh - 64px)" }}>
              {settingsOptions.filter(t => t.id === activeTab).map(tab => (
                <div key={tab.id}>
                  <h3 className="text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {tab.title}
                  </h3>
                  <div className="space-y-4">
                    {tab.fields.map(field => (
                      <div key={field.key}>
                        <label className="text-sm text-gray-300 mb-2 block">{field.label}</label>
                        {field.type === 'toggle' ? (
                          <div className="flex gap-2">
                            {field.options.map(opt => {
                              const OptIcon = opt.icon
                              const isActive = settings[field.key] === opt.value
                              return (
                                <button
                                  key={opt.value}
                                  onClick={() => updateSetting(field.key, opt.value)}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                    isActive
                                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_15px_-5px_rgba(34,211,238,0.2)]'
                                      : 'bg-gray-800/30 text-gray-500 border border-gray-700/30 hover:text-gray-300 hover:bg-gray-800/50'
                                  }`}
                                >
                                  <OptIcon className="w-4 h-4" />
                                  {opt.label}
                                </button>
                              )
                            })}
                          </div>
                        ) : field.type === 'switch' ? (
                          <button
                            onClick={() => updateSetting(field.key, !settings[field.key])}
                            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
                              settings[field.key] ? 'bg-cyan-500' : 'bg-gray-700'
                            }`}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow ${
                              settings[field.key] ? 'translate-x-5' : ''
                            }`} />
                          </button>
                        ) : (
                          <select
                            value={settings[field.key]}
                            onChange={(e) => updateSetting(field.key, e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-400/30 focus:ring-1 focus:ring-cyan-400/20 transition-all appearance-none cursor-pointer"
                          >
                            {field.options.map(opt => (
                              <option key={opt.value} value={opt.value} className="bg-gray-900">{opt.label}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 bg-gray-900/80 backdrop-blur-xl border-t border-gray-800/50 px-5 py-3 flex justify-between items-center">
            <p className="text-[10px] text-gray-600">{t('settings.autoSave')}</p>
            <button onClick={onClose} className="text-xs px-4 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30 transition-all">
              {t('settings.done')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default SettingsModal