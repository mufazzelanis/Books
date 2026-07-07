import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, EnvelopeIcon, LockClosedIcon, UserCircleIcon, BookOpenIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { useSettings } from '../context/SettingsContext'

const SignInModal = ({ isOpen, onClose, onSignIn }) => {
  const { t } = useSettings();
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = t('signIn.emailRequired')
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = t('signIn.emailInvalid')
    if (!form.password.trim()) errs.password = t('signIn.passwordRequired')
    else if (form.password.length < 6) errs.password = t('signIn.passwordMin')
    if (mode === 'signup' && !form.name.trim()) errs.name = t('signIn.nameRequired')
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const initials = (mode === 'signup' ? form.name : form.email.split('@')[0])
      .split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')
    onSignIn({
      name: mode === 'signup' ? form.name : form.email.split('@')[0],
      initials,
      email: form.email,
    })
    setForm({ name: '', email: '', password: '' })
    setErrors({})
    onClose()
  }

  const switchMode = () => {
    setMode(prev => prev === 'signin' ? 'signup' : 'signin')
    setErrors({})
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative w-full max-w-md bg-gray-900/95 backdrop-blur-2xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-[0_0_80px_-20px_rgba(34,211,238,0.15)]"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400" />

          <div className="p-6">
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all">
              <XMarkIcon className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20 flex items-center justify-center mx-auto mb-3">
                <BookOpenIcon className="w-7 h-7 text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold text-white">{mode === 'signin' ? t('signIn.welcomeBack') : t('signIn.createAccount')}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {mode === 'signin' ? t('signIn.signInDesc') : t('signIn.signUpDesc')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">{t('signIn.fullName')}</label>
                  <div className="relative">
                    <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Reader"
                      className={`w-full bg-gray-800/50 border ${errors.name ? 'border-red-400/50' : 'border-gray-700/50'} rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400/30 transition-all`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">{t('signIn.email')}</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className={`w-full bg-gray-800/50 border ${errors.email ? 'border-red-400/50' : 'border-gray-700/50'} rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400/30 transition-all`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">{t('signIn.password')}</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full bg-gray-800/50 border ${errors.password ? 'border-red-400/50' : 'border-gray-700/50'} rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400/30 transition-all`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:shadow-[0_0_20px_-5px_rgba(34,211,238,0.3)] transition-all duration-300"
              >
                {mode === 'signin' ? t('signIn.signIn') : t('signIn.signUp')}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                {mode === 'signin' ? t('signIn.noAccount') : t('signIn.hasAccount')}
                <button onClick={switchMode} className="text-cyan-400 hover:text-cyan-300 ml-1 font-medium transition-colors">
                  {mode === 'signin' ? t('signIn.signUp') : t('signIn.signIn')}
                </button>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800/50">
              <p className="text-[10px] text-gray-600 text-center leading-relaxed">
                {t('signIn.agree')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default SignInModal