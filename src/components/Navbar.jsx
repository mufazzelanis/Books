import { useEffect, useState, useRef, useCallback } from 'react';
import {
  BookOpenIcon, MagnifyingGlassCircleIcon, XMarkIcon, BookmarkIcon,
  UserCircleIcon, Cog6ToothIcon,
  ArrowRightOnRectangleIcon, HeartIcon
} from "@heroicons/react/24/outline";
import FloatingParticle from './FloatingParticle';
import { useSettings } from '../context/SettingsContext';

const API_KEY = "AIzaSyDhLI6vmoJqJGu6F4NT9sGHj6wusopkK8I";

const Navbar = ({ handleSearch, onBookSelect, profile, onSignIn, onSettings, onSignOut }) => {
  const { t } = useSettings();

  const [isHovered, setIsHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showProfile, setShowProfile] = useState(false);

  const profileMenu = [
    {
      label: t('nav.settings'),
      icon: Cog6ToothIcon,
      action: () => { setShowProfile(false); onSettings(); }
    },
    {
      label: t('nav.favorites'),
      icon: HeartIcon,
      action: () => { setShowProfile(false); }
    },
    {
      label: profile.name ? t('nav.signOut') : t('nav.signIn'),
      icon: profile.name ? ArrowRightOnRectangleIcon : UserCircleIcon,
      action: () => { setShowProfile(false); if (profile.name) onSignOut(); else onSignIn(); }
    }
  ];
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const fetchSuggestions = useCallback(async (term) => {
    if (!term.trim()) { setSuggestions([]); return; }
    setSuggestLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(term)}&maxResults=6&key=${API_KEY}`
      );
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      const items = (data.items || []).map(item => ({
        id: item.id,
        title: item.volumeInfo.title || 'Untitled',
        authors: item.volumeInfo.authors || ['Unknown'],
        thumbnail: item.volumeInfo.imageLinks?.smallThumbnail?.replace('http:', 'https:') || '',
        categories: item.volumeInfo.categories?.[0] || '',
      }));
      setSuggestions(items);
      setSelectedIndex(-1);
    } catch {
      setSuggestions([]);
    } finally {
      setSuggestLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      const book = suggestions[selectedIndex];
      setSearchTerm(book.title);
      if (onBookSelect) onBookSelect(book.id);
      else doSearch(book.title);
    } else if (searchTerm.trim()) {
      doSearch(searchTerm);
    }
  };

  const doSearch = (term) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    handleSearch(term.trim());
    setSuggestions([]);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
    handleSearch('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const book = suggestions[selectedIndex];
      setSearchTerm(book.title);
      if (onBookSelect) onBookSelect(book.id);
      else doSearch(book.title);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setSuggestions([]);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // DYNAMIC EFFECT HOVER
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.dynamic-gradient');
      cards.forEach((cards) => {
        const rect = cards.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cards.style.setProperty('--mouse-x', `${x}px`)
        cards.style.setProperty('--mouse-y', `${y}px`)
      })
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  })

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const showDropdown = isFocused && (suggestions.length > 0 || suggestLoading);

  return (
    <nav className=' sticky top-0 z-50 bg-gray-900/50 backdrop-blur-2xl border-b border-gray-800 shadow-[0_0_60px_-15px_rgba(96,165,250,0.3)]'>
      <div className=' mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>

        <div className=' flex min-h-[4rem] md:min-h-[5rem] items-center justify-between flex-wrap gap-y-3 gap-x-4 py-2'>
          {/* logo section */}
          <div className=' dynamic-gradient relative overflow-hidden rounded-2xl p-1 hover:scale-105 transition-transform duration-300 order-1 md:order-none' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
            style={{
              '--mouse-x': '0px',
              '--mouse-y': '0px',
              background: isHovered ? 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(59,130,246,0.4), transparent 40%)' : 'transparent'
            }}>
            <div className=' bg-gray-900/80 backdrop-blur-sm rounded-xl p-2'>
              <h1 className=' text-lg md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-text-shine'>
                <BookOpenIcon className=' w-5 h-5 md:h-6 md:w-6 inline-block animate-float text-cyan-400 mr-1 md:mr-2 stroke-[2.5]' />
                <a href="/" className=' ml-1 md:ml-2 text-shadow-[0_0_10px_rgba(96,165,250,0.5)]'>
                  BOOKSHOW
                </a>
              </h1>
            </div>
          </div>

          {/* Search BAR */}
          <div className=' w-full md:flex-1 md:max-w-2xl order-3 md:order-2 lg:ml-6 md:mx-4 relative'>
            <form onSubmit={handleSubmit} className=' w-full'>
              <div className=' relative group'>
                <div className={` absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl blur-xl transition-all duration-500 ${isFocused ? 'opacity-50' : 'opacity-30 group-hover:opacity-50'}`} />
                <div className=' relative dynamic-gradient flex items-center'>
                  <div className=' pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4'>
                    <MagnifyingGlassCircleIcon className=' h-5 w-5 md:h-6 md:w-6 text-cyan-300 drop-shadow-glow z-10' />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleChange}
                    onFocus={() => { setIsFocused(true); if (searchTerm.trim()) fetchSuggestions(searchTerm); }}
                    onBlur={() => setTimeout(() => { if (!dropdownRef.current?.contains(document.activeElement)) setIsFocused(false); }, 200)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('nav.placeholder')}
                    autoComplete="off"
                    className=' block w-full rounded-2xl border border-gray-700/50 bg-gray-900/60 py-2 md:py-3 pl-10 md:pl-12 pr-10 md:pr-12 text-sm md:text-base text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/30 backdop-blur-xl shadow-xl transition-all duration-300 hover:bg-gray-900/80'
                  />
                  {searchTerm && (
                    <button type="button" onClick={handleClear} className=" absolute right-3 md:right-4 p-1 rounded-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white transition-all">
                      <XMarkIcon className=" w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {showDropdown && (
              <div ref={dropdownRef} className=" absolute mt-2 w-full bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl z-50">
                {suggestLoading ? (
                  <div className=" p-4 space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className=" flex items-center gap-3 animate-pulse">
                        <div className=" w-10 h-14 rounded bg-gray-700/50 flex-shrink-0" />
                        <div className=" flex-1 space-y-1.5">
                          <div className=" h-3 bg-gray-700/50 rounded w-3/4" />
                          <div className=" h-2.5 bg-gray-700/50 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : suggestions.length > 0 ? (
                  <div>
                    <p className=" text-xs text-gray-500 px-3 pt-2 pb-1">{t('nav.suggestions')}</p>
                    {suggestions.map((book, i) => (
                      <button
                        key={book.id}
                        type="button"
                        onMouseEnter={() => setSelectedIndex(i)}
                        onClick={() => { setSearchTerm(book.title); if (onBookSelect) onBookSelect(book.id); else doSearch(book.title); }}
                        className={` w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-150 ${selectedIndex === i ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : 'hover:bg-gray-800/50 border-l-2 border-transparent'}`}
                      >
                        {book.thumbnail ? (
                          <img src={book.thumbnail} alt="" className=" w-8 h-12 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className=" w-8 h-12 rounded bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                            <BookmarkIcon className=" w-4 h-4 text-gray-500" />
                          </div>
                        )}
                        <div className=" flex-1 min-w-0">
                          <p className=" text-sm font-medium text-gray-200 truncate">{book.title}</p>
                          <p className=" text-xs text-gray-500 truncate">{book.authors.join(', ')}</p>
                        </div>
                        {book.categories && (
                          <span className=" text-[10px] px-2 py-0.5 rounded-full bg-gray-800/50 text-gray-500 flex-shrink-0 hidden sm:inline">{book.categories}</span>
                        )}
                      </button>
                    ))}
                    <div className=" border-t border-gray-800/50 px-3 py-1.5">
                      <p className=" text-[10px] text-gray-600 text-center">
                        {t('nav.navigate')}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Popular tags when focused but no input */}
            {isFocused && !searchTerm && suggestions.length === 0 && !suggestLoading && (
              <div className=" absolute mt-2 w-full bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-3 shadow-2xl z-50">
                <p className=" text-xs text-gray-500 px-2 mb-2">{t('nav.popular')}</p>
                <div className=" flex flex-wrap gap-2">
                  {["JavaScript", "Python", "React", "AI", "Design", "History", "Science", "Fiction"].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setSearchTerm(s); doSearch(s); }}
                      className=" text-xs px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/30 text-gray-300 hover:border-cyan-400/30 hover:text-cyan-300 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* AVATAR SECTION */}
          <div className=' flex items-center space-x-4 order-2 md:order-3 ml-auto md:ml-0 relative'>
            <button
              onClick={() => setShowProfile(prev => !prev)}
              className=' relative p-1 group hover:scale-105 transition-transform'
            >
              <div className=' absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity' />
              <div className=' relative flex items-center justify-center h-8 w-8 md:h-10 md:w-10 rounded-full bg-gray-900/80 border-2 border-cyan-300/20 group-hover:border-cyan-300/40 backdrop-blur-sm overflow-hidden'>
                {profile.name ? (
                  <span className=' text-sm md:text-base font-bold text-cyan-300'>{profile.initials}</span>
                ) : (
                  <UserCircleIcon className=' w-5 h-5 md:w-6 md:h-6 text-cyan-300' />
                )}
                <div className=' absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-blue-500/20' />
              </div>
              <div className={` absolute -top-1 -right-1 h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-300 ${showProfile ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'bg-cyan-400 shadow-glow-pulse'}`} />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <>
                <div className=" fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                <div className=" absolute right-0 top-full mt-2 w-64 z-50 bg-gray-900/95 backdrop-blur-2xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
                  <div className=" p-4 border-b border-gray-800/50">
                    {profile.name ? (
                      <div className=" flex items-center gap-3">
                        <div className=" w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                          {profile.initials}
                        </div>
                        <div className=" min-w-0">
                          <p className=" text-sm font-medium text-white truncate">{profile.name}</p>
                          <p className=" text-xs text-gray-500 truncate">{profile.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div className=" flex items-center gap-3">
                        <div className=" w-10 h-10 rounded-full bg-gray-800 border border-gray-700/50 flex items-center justify-center">
                          <UserCircleIcon className=" w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className=" text-sm font-medium text-gray-300">{t('nav.guest')}</p>
                          <p className=" text-xs text-gray-600">{t('nav.notSignedIn')}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className=" p-2">
                    {profileMenu.map(item => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={() => item.action()}
                          className=" w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group"
                        >
                          <ItemIcon className=" w-4 h-4 text-gray-500 group-hover:text-cyan-300 transition-colors" />
                          <span>{item.label}</span>
                          {item.label === t('nav.signIn') || item.label === t('nav.signOut') ? (
                            <span className=" ml-auto text-[10px] px-2 py-0.5 rounded-full bg-gray-800/50 text-gray-600 group-hover:text-cyan-400/60">
                              {profile.name ? t('nav.active') : t('nav.noMatch')}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className=" border-t border-gray-800/50 px-4 py-2">
                    <p className=" text-[10px] text-gray-700 text-center">BOOKSHOW v1.0</p>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
      <FloatingParticle />
    </nav>
  )
}

export default Navbar