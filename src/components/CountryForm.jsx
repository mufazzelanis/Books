import { useState, useEffect } from 'react'
import { XMarkIcon } from "@heroicons/react/24/outline"
import coreApi from '../services/coreApi'

const emptyForm = {
  name: '', alpha2: '', alpha3: '', dial_code: '',
  currency: '', timezone: '', is_flight_enabled: false,
  is_hotel_enabled: false, is_visa_enabled: false, sort: 0,
}

const CountryForm = ({ isOpen, onClose, country, onSaved }) => {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const isEditing = !!country

  useEffect(() => {
    if (country) {
      setForm({
        name: country.name || '',
        alpha2: country.alpha2 || '',
        alpha3: country.alpha3 || '',
        dial_code: country.dial_code || '',
        currency: country.currency || '',
        timezone: country.timezone || '',
        is_flight_enabled: !!country.is_flight_enabled,
        is_hotel_enabled: !!country.is_hotel_enabled,
        is_visa_enabled: !!country.is_visa_enabled,
        sort: country.sort ?? 0,
      })
    } else {
      setForm(emptyForm)
    }
    setError(null)
  }, [country, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (isEditing) {
        await coreApi.countries.update(country.id, form)
      } else {
        await coreApi.countries.create(form)
      }
      onSaved()
      onClose()
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Failed to save country')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-lg bg-gray-900/95 backdrop-blur-2xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50">
            <h2 className="text-lg font-semibold text-white">
              {isEditing ? 'Edit Country' : 'Add Country'}
            </h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required
                  className="w-full px-3 py-2 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-100 text-sm focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Alpha-2</label>
                <input type="text" name="alpha2" value={form.alpha2} onChange={handleChange} required maxLength={2}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-100 text-sm uppercase focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Alpha-3</label>
                <input type="text" name="alpha3" value={form.alpha3} onChange={handleChange} required maxLength={3}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-100 text-sm uppercase focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Dial Code</label>
                <input type="text" name="dial_code" value={form.dial_code} onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-100 text-sm focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Currency</label>
                <input type="text" name="currency" value={form.currency} onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-100 text-sm focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Timezone</label>
                <input type="text" name="timezone" value={form.timezone} onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-100 text-sm focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Sort Order</label>
                <input type="number" name="sort" value={form.sort} onChange={handleChange} min={0} max={255}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-100 text-sm focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-sm text-gray-400 mb-1">Features</label>
              <div className="flex flex-wrap gap-4">
                {[
                  { key: 'is_flight_enabled', label: 'Flight' },
                  { key: 'is_hotel_enabled', label: 'Hotel' },
                  { key: 'is_visa_enabled', label: 'Visa' },
                ].map(f => (
                  <label key={f.key} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" name={f.key} checked={form[f.key]} onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-400/30 focus:ring-offset-0"
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800/50">
              <button type="button" onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
              >
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving...' : isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default CountryForm
