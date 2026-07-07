import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../context/SettingsContext";

const API_KEY = "AIzaSyDhLI6vmoJqJGu6F4NT9sGHj6wusopkK8I";

const exploreCategories = [
  { nameKey: "fiction", icon: "📖", color: "from-blue-500 to-cyan-400", query: "fiction books" },
  { nameKey: "science", icon: "🔬", color: "from-emerald-500 to-teal-400", query: "science" },
  { nameKey: "history", icon: "📜", color: "from-amber-500 to-orange-400", query: "history" },
  { nameKey: "technology", icon: "💻", color: "from-purple-500 to-pink-400", query: "technology" },
  { nameKey: "philosophy", icon: "🧠", color: "from-rose-500 to-red-400", query: "philosophy" },
  { nameKey: "art", icon: "🎨", color: "from-violet-500 to-indigo-400", query: "art design" },
];

const Hero = ({ searchQuery, onSearch }) => {
    const { settings, t } = useSettings();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = parseInt(settings.resultsPerPage) || 6;

    useEffect(() => {
        if (!searchQuery.trim()) { setBooks([]); return; }
        const fetchBooks = async () => {
            try {
                setLoading(true);
                setCurrentPage(1);
                const response = await fetch(
                    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=35&key=${API_KEY}`
                );
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                const mappedBooks = data.items?.map(item => ({
                    id: item.id,
                    title: item.volumeInfo.title || 'Untitled',
                    authors: item.volumeInfo.authors || ['Unknown Author'],
                    categories: item.volumeInfo.categories?.join(', ') || 'General',
                    rating: item.volumeInfo.averageRating || 0,
                    pageCount: item.volumeInfo.pageCount || 'N/A',
                    ratingsCount: item.volumeInfo.ratingsCount || 0,
                    imageUrl: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
                    description: item.volumeInfo.description || 'No description available',
                    infoLink: item.volumeInfo.infoLink || '#',
                })) || [];
                setBooks(mappedBooks);
            } catch {
                setBooks([]);
            } finally {
                setLoading(false);
            }
        }
        fetchBooks();
    }, [searchQuery])

    const totalPages = Math.ceil(books.length / itemsPerPage);
    const paginatedBooks = books.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        const el = document.getElementById('hero-results');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const getPlaceholder = (title) => {
        const initials = title.split(' ').slice(0, 3).map(w => w[0]?.toUpperCase() || '').join('');
        return `data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900">
<rect width="100%" height="100%" fill="#1e293b"/>
<rect x="40" y="40" width="520" height="820" rx="20" fill="#334155"/>
<text x="50%" y="50%" fill="#475569" font-family="monospace" font-size="100" font-weight="bold"
      text-anchor="middle" dominant-baseline="middle">${initials || '?'}</text>
</svg>`
        )}`;
    }

    const truncateText = (text, max) => {
        if (!text || text.length <= max) return text;
        return text.substring(0, max) + '...';
    }

    const renderStars = (rating) => {
        if (!rating) return '';
        let s = '';
        for (let i = 0; i < 5; i++) s += i < Math.floor(rating) ? '★' : '☆';
        return s;
    }

    // Empty state — beautiful landing
    if (!searchQuery.trim()) {
        return (
            <div className="min-h-screen pt-20 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-800/30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="text-6xl block mb-6"
                        >
                            📚
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                            {t('hero.welcome')}
                        </h2>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto">
                            {t('hero.welcomeSub')}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {exploreCategories.map((cat, i) => (
                            <motion.button
                                key={cat.nameKey}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.07 }}
                                onClick={() => onSearch(cat.query)}
                                className="group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-5 text-center hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_-10px_rgba(34,211,238,0.2)]"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-b ${cat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                                <span className="text-3xl block mb-2">{cat.icon}</span>
                                <span className="text-sm font-medium text-gray-300 group-hover:text-cyan-300 transition-colors">
                                    {t(`categories.${cat.nameKey}`)}
                                </span>
                            </motion.button>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-20 text-center"
                    >
                        <div className="inline-flex items-center gap-2 text-gray-600 text-sm">
                            <span className="w-20 h-px bg-gray-800" />
                            <span>{t('hero.poweredBy')}</span>
                            <span className="w-20 h-px bg-gray-800" />
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Search results
    return (
        <div id="hero-results" className="min-h-screen pt-16 md:pt-20 bg-gradient-to-b from-gray-900/60 to-gray-800/40 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-800/50 rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-64 bg-gray-700/50" />
                                <div className="p-4 space-y-3">
                                    <div className="h-5 bg-gray-700/50 rounded w-3/4" />
                                    <div className="h-4 bg-gray-700/50 rounded w-1/2" />
                                    <div className="h-3 bg-gray-700/50 rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : paginatedBooks.length === 0 ? (
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <div className="text-center">
                            <div className="text-6xl mb-4 opacity-30">📚</div>
                            <p className="text-gray-400 text-xl">{t('hero.noResults')} "{searchQuery}"</p>
                            <p className="text-gray-500 text-sm mt-2">{t('hero.tryDifferent')}</p>
                            <button onClick={() => onSearch('')} className="mt-4 text-xs px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/30 text-gray-400 hover:text-cyan-300 transition-colors">
                                {t('hero.backToExplore')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-400 text-sm">
                                {t('hero.showing')} {paginatedBooks.length} {t('hero.of')} {books.length} {t('hero.resultsFor')} <span className="text-cyan-300">"{searchQuery}"</span>
                            </p>
                            <button onClick={() => onSearch('')} className="text-xs px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/30 text-gray-500 hover:text-cyan-300 transition-colors">
                                {t('hero.clear')}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                            <AnimatePresence mode="popLayout">
                                {paginatedBooks.map((book, index) => (
                                    <motion.a
                                        href={book.infoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        key={book.id || index}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                        className="group relative bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/30 hover:border-cyan-400/30 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.3)] hover:-translate-y-1"
                                    >
                                        <div className="relative h-64 overflow-hidden bg-gray-900">
                                            <img
                                                src={book.imageUrl || getPlaceholder(book.title)}
                                                alt={book.title}
                                                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                                onError={(e) => { e.target.src = getPlaceholder(book.title) }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                                        </div>
                                        <div className="p-4 space-y-2">
                                            <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                                                {book.title}
                                            </h2>
                                            <p className="text-sm text-gray-400">
                                                {book.authors[0]}
                                            </p>
                                            {settings.showRating && book.rating > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-yellow-400 text-sm">{renderStars(book.rating)}</span>
                                                    <span className="text-gray-500 text-xs">({book.ratingsCount})</span>
                                                </div>
                                            )}
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                {truncateText(book.description?.replace(/<[^>]+>/g, ''), 120)}
                                            </p>
                                            <div className="flex items-center gap-2 pt-1">
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-400">
                                                    {book.categories}
                                                </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-400">
                                                {book.pageCount}{t('hero.pages')}
                                            </span>
                                            </div>
                                        </div>
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 backdrop-blur-sm border border-cyan-400/20">
                                                {t('hero.view')}
                                            </span>
                                        </div>
                                    </motion.a>
                                ))}
                            </AnimatePresence>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-10 pb-8">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-gray-800/50 border border-gray-700/30 text-gray-300 hover:bg-gray-700/50 hover:border-cyan-400/30 disabled:opacity-30 disabled:cursor-not-allowed"
                                >← Prev</button>
                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-300 ${currentPage === page
                                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                                                : 'bg-gray-800/50 border border-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                                                }`}
                                        >{page}</button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-gray-800/50 border border-gray-700/30 text-gray-300 hover:bg-gray-700/50 hover:border-cyan-400/30 disabled:opacity-30 disabled:cursor-not-allowed"
                                >Next →</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Hero;