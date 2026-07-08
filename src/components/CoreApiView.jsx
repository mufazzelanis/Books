import { useState, useEffect, useCallback, useRef } from 'react'
import {
  ArrowLeftIcon, MagnifyingGlassIcon, PlusIcon,
  ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon,
  PencilSquareIcon, TrashIcon, ArrowPathIcon,
} from "@heroicons/react/24/outline"
import coreApi from '../services/coreApi'
import { useAuth } from '../context/AuthContext'
import CountryForm from './CountryForm'

const SortIcon = ({ active, direction }) => {
  if (!active) return <ChevronUpIcon className="w-3 h-3 text-gray-600" />
  return direction === 'asc'
    ? <ChevronUpIcon className="w-3 h-3 text-cyan-400" />
    : <ChevronDownIcon className="w-3 h-3 text-cyan-400" />
}

const CoreApiView = ({ onClose }) => {
  const { isAuthenticated, user, login, logout, loading: authLoading, error: authError, clearError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [countries, setCountries] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [perPage] = useState(10)
  const [sortBy, setSortBy] = useState('id')
  const [sort, setSort] = useState('desc')

  const [selectedCountry, setSelectedCountry] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const fetchCountries = useCallback(async (overrides = {}) => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        page: overrides.page ?? page,
        perPage: overrides.perPage ?? perPage,
        sortBy: overrides.sortBy ?? sortBy,
        sort: overrides.sort ?? sort,
        search: overrides.search ?? search,
      }
      const response = await coreApi.countries.list(params)
      setCountries(response.data?.data || [])
      setPagination(response.data || null)
      if (overrides.page !== undefined) setPage(overrides.page)
      if (overrides.sortBy !== undefined) setSortBy(overrides.sortBy)
      if (overrides.sort !== undefined) setSort(overrides.sort)
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Failed to fetch countries')
      setCountries([])
    } finally {
      setLoading(false)
    }
  }, [page, perPage, sortBy, sort, search])

  const searchTimer = useRef(null)
  const fetchRef = useRef(fetchCountries)
  fetchRef.current = fetchCountries

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (searchInput === search) return
    searchTimer.current = setTimeout(() => {
      fetchRef.current({ search: searchInput, page: 1 })
      setSearch(searchInput)
    }, 350)
    return () => clearTimeout(searchTimer.current)
  }, [searchInput])

  useEffect(() => {
    if (isAuthenticated) fetchCountries()
  }, [isAuthenticated, fetchCountries])

  const handleLogin = async (e) => {
    e.preventDefault()
    clearError()
    try {
      await login(email, password)
    } catch {
    }
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      fetchCountries({ sortBy: column, sort: sort === 'asc' ? 'desc' : 'asc' })
    } else {
      fetchCountries({ sortBy: column, sort: 'asc' })
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (pagination && newPage > pagination.last_page)) return
    fetchCountries({ page: newPage })
  }

  const handleAdd = () => {
    setSelectedCountry(null)
    setShowForm(true)
  }

  const handleEdit = (country) => {
    setSelectedCountry(country)
    setShowForm(true)
  }

  const handleDelete = async (country) => {
    if (!confirm(`Delete "${country.name}"?`)) return
    setDeleting(country.id)
    try {
      await coreApi.countries.destroy(country.id)
      fetchCountries()
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const handleStatusToggle = async (country) => {
    const newStatus = country.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await coreApi.countries.updateStatus(country.id, newStatus)
      fetchCountries()
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Status update failed')
    }
  }

  const handleSaved = () => {
    fetchCountries()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <button onClick={onClose} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-all">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Books
          </button>

          <div className="bg-gray-900/80 backdrop-blur-2xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Core API Access</h2>
              <p className="text-sm text-gray-400">Sign in to manage countries data</p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-100 text-sm focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-100 text-sm focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" disabled={authLoading}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 transition-all"
              >
                {authLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const totalPages = pagination?.last_page || 1
  const currentPage = pagination?.current_page || 1
  const from = pagination?.from || 0
  const to = pagination?.to || 0
  const total = pagination?.total || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Countries</h1>
            <p className="text-sm text-gray-400">
              {user?.name && <span>Signed in as {user.name} · </span>}
              <button onClick={logout} className="text-cyan-400 hover:text-cyan-300">Sign out</button>
            </p>
          </div>
        </div>
        <button onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all"
        >
          <PlusIcon className="w-4 h-4" />
          Add Country
        </button>
      </div>

      <div className="bg-gray-900/80 backdrop-blur-2xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-800/50">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-100 text-sm focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
                placeholder="Search by name, alpha2, alpha3..."
              />
            </div>
            {searchInput && (
              <button type="button" onClick={() => { setSearchInput(''); setSearch(''); fetchRef.current({ search: '', page: 1 }) }}
                className="px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                {[
                  { key: null, label: 'Serial', sortable: false },
                  { key: 'name', label: 'Name', sortable: true },
                  { key: 'alpha2', label: 'Country Name', sortable: true },
                  { key: 'alpha3', label: 'Country Code', sortable: true },
                  { key: 'dial_code', label: 'Dial Code', sortable: true },
                  { key: 'currency', label: 'Currency', sortable: true },
                  { key: 'status', label: 'Status', sortable: true },
                  { key: null, label: 'Actions', sortable: false },
                ].map(col => (
                  <th key={col.label} className={`px-4 py-3 ${col.sortable ? 'cursor-pointer hover:text-white select-none' : ''}`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && <SortIcon active={sortBy === col.key} direction={sort} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-gray-800/30">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-800/50 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : countries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    {search ? 'No countries match your search' : 'No countries found'}
                  </td>
                </tr>
              ) : (
                countries.map((country, i) => (
                  <tr key={country.id} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors">
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs text-center">{(currentPage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-3 text-gray-200 font-medium">{country.name}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold text-cyan-400">{country.alpha2}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{country.alpha3}</td>
                    <td className="px-4 py-3 text-gray-400">{country.dial_code || '-'}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{country.currency || '-'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleStatusToggle(country)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          country.status === 'Active'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                        }`}
                      >
                        {country.status}
                      </button>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(country)}
                          className="p-1.5 rounded-lg hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 transition-all"
                          title="Edit"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(country)} disabled={deleting === country.id}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === country.id
                            ? <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            : <TrashIcon className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800/50">
            <span className="text-xs text-gray-500">
              Showing {from} to {to} of {total} entries
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => handlePageChange(1)} disabled={currentPage <= 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                Math.max(0, currentPage - 3),
                Math.min(totalPages, currentPage + 2),
              ).map(p => (
                <button key={p} onClick={() => handlePageChange(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    p === currentPage
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button onClick={() => handlePageChange(totalPages)} disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <CountryForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        country={selectedCountry}
        onSaved={handleSaved}
      />
    </div>
  )
}

export default CoreApiView
