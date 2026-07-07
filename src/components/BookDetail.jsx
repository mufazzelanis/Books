import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, BookOpenIcon } from "@heroicons/react/24/outline";

const API_KEY = "AIzaSyDhLI6vmoJqJGu6F4NT9sGHj6wusopkK8I";

const BookDetail = ({ bookId, onClose }) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;
    setLoading(true);
    fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`)
      .then(r => r.json())
      .then(data => {
        const v = data.volumeInfo || {};
        setBook({
          id: data.id,
          title: v.title || 'Untitled',
          authors: v.authors || ['Unknown Author'],
          description: v.description || 'No description available.',
          image: v.imageLinks?.thumbnail?.replace('http:', 'https:') || v.imageLinks?.smallThumbnail?.replace('http:', 'https:') || '',
          categories: v.categories || [],
          pages: v.pageCount || 'N/A',
          rating: v.averageRating || 0,
          ratingsCount: v.ratingsCount || 0,
          publisher: v.publisher || 'Unknown',
          publishedDate: v.publishedDate || 'Unknown',
          infoLink: v.infoLink || '#',
          previewLink: v.previewLink || '#',
          language: v.language || 'en',
        });
        setLoading(false);
      })
      .catch(() => { setLoading(false); setBook(null); });
  }, [bookId]);

  useEffect(() => {
    if (bookId) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = '' };
  }, [bookId]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) stars.push(i < Math.floor(rating) ? '★' : '☆');
    return stars.join('');
  };

  if (!bookId) return null;

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
          className="relative w-full max-w-2xl max-h-[90vh] bg-gray-900/95 backdrop-blur-2xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-[0_0_80px_-20px_rgba(34,211,238,0.15)]"
        >
          <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 px-5 py-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-400">Book Details</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-300">
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto p-5" style={{ maxHeight: "calc(90vh - 56px)" }}>
            {loading ? (
              <div className="flex flex-col md:flex-row gap-6 animate-pulse">
                <div className="w-full md:w-48 h-64 rounded-xl bg-gray-700/50 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-700/50 rounded" style={{ width: `${60 + i * 8}%` }} />)}
                </div>
              </div>
            ) : book ? (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 flex flex-col items-center">
                  {book.image ? (
                    <img src={book.image} alt={book.title} className="w-40 md:w-48 rounded-xl shadow-lg" />
                  ) : (
                    <div className="w-40 md:w-48 h-60 rounded-xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center">
                      <BookOpenIcon className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <a href={book.previewLink} target="_blank" rel="noopener noreferrer" className="text-xs px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30 transition-all">
                      Preview
                    </a>
                    <a href={book.infoLink} target="_blank" rel="noopener noreferrer" className="text-xs px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300 border border-gray-700/30 hover:border-gray-600/50 transition-all">
                      View on Google
                    </a>
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{book.title}</h2>
                    <p className="text-sm text-gray-400 mt-1">{book.authors.join(', ')}</p>
                  </div>

                  {book.rating > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400 text-lg">{renderStars(book.rating)}</span>
                      <span className="text-gray-500 text-sm">{book.rating} ({book.ratingsCount} ratings)</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {book.categories.map(c => (
                      <span key={c} className="text-xs px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700/30 text-gray-300">{c}</span>
                    ))}
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700/30 text-gray-300">{book.pages} pages</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700/30 text-gray-300">{book.language?.toUpperCase()}</span>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Publisher: {book.publisher}</p>
                    <p>Published: {book.publishedDate}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-cyan-300 mb-2">Description</h3>
                    <p className="text-sm text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: book.description?.replace(/<[^>]+>/g, '') }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">Book not found.</div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookDetail;