const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  authTokenKey: 'core_api_token',
  authUserKey: 'core_api_user',
  authToken: null,
  domain: import.meta.env.VITE_DOMAIN || 'b2b.com',
  defaultPerPage: 10,
  defaultSortBy: 'id',
  defaultSort: 'desc',
}

export default config
