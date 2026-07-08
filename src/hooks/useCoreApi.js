import { useState, useEffect, useCallback, useRef } from 'react'

export function useCoreApi(apiFunc, _immediate = false) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const funcRef = useRef(apiFunc)

  useEffect(() => { funcRef.current = apiFunc }, [apiFunc])

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await funcRef.current(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setLoading(false)
    setError(null)
  }, [])

  return { data, loading, error, execute, reset }
}

export function useCountries(initialParams = {}) {
  const [countries, setCountries] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    sortBy: 'id',
    sort: 'desc',
    search: '',
    ...initialParams,
  })

  const load = useCallback(async (overrides = {}) => {
    setLoading(true)
    setError(null)
    try {
      const mergedParams = { ...params, ...overrides }
      const { default: api } = await import('../services/coreApi')
      const response = await api.countries.list(mergedParams)
      setCountries(response.data?.data || [])
      setPagination(response.data || null)
      if (Object.keys(overrides).length) {
        setParams(mergedParams)
      }
    } catch (err) {
      setError(err)
      setCountries([])
    } finally {
      setLoading(false)
    }
  }, [params])

  const setPage = useCallback((page) => load({ ...params, page }), [params, load])
  const setSearch = useCallback((search) => load({ ...params, search, page: 1 }), [params, load])
  const setSort = useCallback((sortBy, sort) => load({ ...params, sortBy, sort, page: 1 }), [params, load])
  const setPerPage = useCallback((perPage) => load({ ...params, perPage, page: 1 }), [params, load])
  const refresh = useCallback(() => load(params), [params, load])

  return {
    countries, pagination, loading, error, params,
    load, setPage, setSearch, setSort, setPerPage, refresh,
  }
}
