import config from '../config'

class CoreApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'CoreApiError'
    this.status = status
    this.data = data
  }
}

function getToken() {
  try {
    return localStorage.getItem(config.authTokenKey) || config.authToken || null
  } catch {
    return config.authToken || null
  }
}

function getHeaders(includeAuth = true) {
  const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
  if (config.domain) headers['X-Panel-Domain'] = config.domain
  if (includeAuth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function handleResponse(res) {
  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('application/json')) {
    throw new CoreApiError(
      'Backend server is not available. The API only works when the backend is running locally.',
      503, null
    )
  }
  const data = await res.json()
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem(config.authTokenKey)
      localStorage.removeItem(config.authUserKey)
    }
    throw new CoreApiError(data?.message || 'Request failed', res.status, data)
  }
  return data
}

function buildQuery(params) {
  const filtered = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''))
  return new URLSearchParams(filtered).toString()
}

const coreApi = {
  auth: {
    async login(email, password) {
      const body = new URLSearchParams({ email, password })
      const res = await fetch(`${config.apiBaseUrl}/auth/login`, {
        method: 'POST', headers: { ...getHeaders(false), 'Content-Type': 'application/x-www-form-urlencoded' }, body,
      })
      return handleResponse(res)
    },

    async logout() {
      const res = await fetch(`${config.apiBaseUrl}/auth/logout`, {
        method: 'POST', headers: getHeaders(),
      })
      return handleResponse(res)
    },

    async me() {
      const res = await fetch(`${config.apiBaseUrl}/auth/me`, {
        method: 'POST', headers: getHeaders(),
      })
      return handleResponse(res)
    },

    async sendPasswordResetLink(email) {
      const res = await fetch(`${config.apiBaseUrl}/auth/password/email`, {
        method: 'POST', headers: getHeaders(false), body: JSON.stringify({ email }),
      })
      return handleResponse(res)
    },

    async resetPassword(data) {
      const res = await fetch(`${config.apiBaseUrl}/auth/password/reset`, {
        method: 'POST', headers: getHeaders(false), body: JSON.stringify(data),
      })
      return handleResponse(res)
    },
  },

  countries: {
    async list(params = {}) {
      const query = buildQuery({
        page: params.page || 1,
        per_page: params.perPage || config.defaultPerPage,
        sort_by: params.sortBy || config.defaultSortBy,
        sort: params.sort || config.defaultSort,
        search: params.search || undefined,
      })
      const res = await fetch(`${config.apiBaseUrl}/countries?${query}`, { headers: getHeaders() })
      return handleResponse(res)
    },

    async show(id) {
      const res = await fetch(`${config.apiBaseUrl}/countries/${id}`, { headers: getHeaders() })
      return handleResponse(res)
    },

    async create(data) {
      const res = await fetch(`${config.apiBaseUrl}/countries`, {
        method: 'POST', headers: getHeaders(), body: JSON.stringify(data),
      })
      return handleResponse(res)
    },

    async update(id, data) {
      const res = await fetch(`${config.apiBaseUrl}/countries/${id}`, {
        method: 'PUT', headers: getHeaders(), body: JSON.stringify(data),
      })
      return handleResponse(res)
    },

    async destroy(id) {
      const res = await fetch(`${config.apiBaseUrl}/countries/${id}`, {
        method: 'DELETE', headers: getHeaders(),
      })
      return handleResponse(res)
    },

    async updateStatus(id, status) {
      const res = await fetch(`${config.apiBaseUrl}/countries/${id}/status`, {
        method: 'PUT', headers: getHeaders(), body: JSON.stringify({ status }),
      })
      return handleResponse(res)
    },
  },

  lookups: {
    async countries() {
      const res = await fetch(`${config.apiBaseUrl}/lookups/countries`, { headers: getHeaders() })
      return handleResponse(res)
    },
  },

  dashboard: {
    async index() {
      const res = await fetch(`${config.apiBaseUrl}/dashboard`, { headers: getHeaders() })
      return handleResponse(res)
    },
  },
}

export default coreApi
export { CoreApiError }
