import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon, BookOpenIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"
import { useSettings } from '../context/SettingsContext'

const API_KEY = 'AIzaSyDhLI6vmoJqJGu6F4NT9sGHj6wusopkK8I'

const exploreConfig = {
  'best-sellers': {
    title: 'nav.bestSellers',
    subtitle: 'explore.bestSellersSub',
    query: 'subject:fiction&orderBy=relevance&maxResults=40',
    gradient: 'from-amber-500/10 via-orange-500/5 to-red-500/10',
  },
  'new-releases': {
    title: 'nav.newReleases',
    subtitle: 'explore.newReleasesSub',
    query: 'subject:fiction&orderBy=newest&maxResults=40',
    gradient: 'from-emerald-500/10 via-teal-500/5 to-cyan-500/10',
  },
  'trending': {
    title: 'nav.trending',
    subtitle: 'explore.trendingSub',
    query: 'subject:fiction&orderBy=relevance&maxResults=40',
    gradient: 'from-violet-500/10 via-purple-500/5 to-fuchsia-500/10',
  },
  'categories': {
    title: 'nav.categories',
    subtitle: 'explore.categoriesSub',
    query: 'subject:fiction&orderBy=relevance&maxResults=40',
    gradient: 'from-blue-500/10 via-cyan-500/5 to-indigo-500/10',
  }
}

const categoryOptions = [
  { label: 'Fiction', value: 'fiction', color: 'from-blue-400 to-indigo-500' },
  { label: 'Science', value: 'science', color: 'from-emerald-400 to-teal-500' },
  { label: 'History', value: 'history', color: 'from-amber-400 to-orange-500' },
  { label: 'Romance', value: 'romance', color: 'from-pink-400 to-rose-500' },
  { label: 'Thriller', value: 'thriller', color: 'from-red-400 to-rose-500' },
  { label: 'Fantasy', value: 'fantasy', color: 'from-violet-400 to-purple-500' },
  { label: 'Biography', value: 'biography', color: 'from-cyan-400 to-blue-500' },
  { label: 'Philosophy', value: 'philosophy', color: 'from-stone-400 to-stone-600' },
  { label: 'Self-Help', value: 'self-help', color: 'from-teal-400 to-cyan-500' },
  { label: 'Poetry', value: 'poetry', color: 'from-fuchsia-400 to-pink-500' }
]

const ExploreView = ({ exploreId, onClose, onBookSelect }) => {
  const { t } = useSettings()
  const config = exploreConfig[exploreId]
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const perPage = 9

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      let query = config.query
      if (selectedCategory) {
        query = `subject:${selectedCategory}&orderBy=relevance&maxResults=40`
      }
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`
      )
      const data = await res.json()
      const items = (data.items || []).filter(b => b.volumeInfo.title)
      setBooks(items)
      setPage(1)
    } catch (err) {
      console.error(err)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }, [config.query, selectedCategory])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const totalPages = Math.ceil(books.length / perPage)
  const paginatedBooks = books.slice((page - 1) * perPage, page * perPage)

  const handleBookClick = (book) => {
    onBookSelect(book.id)
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-b ${config.gradient}`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-cyan-300 text-sm font-medium transition-all border border-white/5 hover:border-cyan-500/20">
            <ArrowLeftIcon className="w-4 h-4" />
            {t('hero.backToExplore')}
          </button>
          <div className="flex items-center gap-3">
            <BookOpenIcon className="w-6 h-6 text-cyan-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {t(config.title)}
              </h1>
              <p className="text-sm text-gray-500">{t(config.subtitle)}</p>
            </div>
          </div>
        </div>

        {exploreId === 'categories' && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                }`}>
                {t('explore.all')}
              </button>
              {categoryOptions.map((cat) => (
                <button key={cat.value} onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.value
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:text-white'
                  }`}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: perPage }).map((_, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-4 animate-pulse">
                  <div className="aspect-[3/4] bg-white/10 rounded-xl mb-4" />
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/10 rounded w-1/2 mb-3" />
                  <div className="h-3 bg-white/10 rounded w-full" />
                </div>
              ))}
            </motion.div>
          ) : books.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpenIcon className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">{t('explore.noBooks')}</h3>
              <p className="text-gray-600 text-sm max-w-md">{t('explore.noBooksDesc')}</p>
              {selectedCategory && (
                <button onClick={() => setSelectedCategory(null)}
                  className="mt-6 px-6 py-2.5 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors">
                  {t('explore.clearFilter')}
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedBooks.map((book, i) => {
                  const info = book.volumeInfo
                  const cover = info.imageLinks?.thumbnail?.replace('http:', 'https:')?.replace('&edge=curl', '') || ''
                  const authors = info.authors?.join(', ') || t('hero.unknownAuthor')
                  const rating = info.averageRating || 0

                  return (
                    <motion.div key={book.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      onClick={() => handleBookClick(book)}
                      className="group cursor-pointer bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-white/5">
                        {cover ? (
                          <img src={cover} alt={info.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpenIcon className="w-12 h-12 text-gray-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <h3 className="font-semibold text-white text-sm leading-tight mb-1 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                        {info.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2 truncate">{authors}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <svg key={s} className={`w-3 h-3 ${s < Math.round(rating) ? 'text-amber-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-[10px] text-gray-600 ml-1">{rating > 0 ? rating.toFixed(1) : ''}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10 pb-8">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                          page === i + 1
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-white/5 text-gray-500 hover:bg-white/10'
                        }`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ExploreView
