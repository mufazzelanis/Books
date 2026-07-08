import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Banner from './components/Banner';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ContentViewer from './components/ContentViewer';
import ExploreView from './components/ExploreView';
import BookDetail from './components/BookDetail';
import SettingsModal from './components/SettingsModal';
import SignInModal from './components/SignInModal';
import AnimatedBackground from './components/AnimatedBackground';
import CoreApiView from './components/CoreApiView';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';

const exploreIds = ['best-sellers', 'new-releases', 'trending', 'categories']

const AppContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contentPage, setContentPage] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [profile, setProfile] = useState({ name: '', initials: '', email: '' });
  const [showSettings, setShowSettings] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showCoreApi, setShowCoreApi] = useState(false);
  const isExplore = exploreIds.includes(contentPage);

  useEffect(() => {
    const handler = (e) => setContentPage(e.detail);
    window.addEventListener("openContent", handler);
    return () => window.removeEventListener("openContent", handler);
  }, []);

  return (
    <>
      <AnimatedBackground />
      <div className='bg-gray-900/60 min-h-screen flex flex-col' style={{ background: 'var(--bg-primary, transparent)' }}>
        <Navbar
          handleSearch={(term) => setSearchQuery(term)}
          onBookSelect={(id) => setSelectedBookId(id)}
          profile={profile}
          onSignIn={() => setShowSignIn(true)}
          onSettings={() => setShowSettings(true)}
          onSignOut={() => setProfile({ name: '', initials: '', email: '' })}
          onCoreApi={() => setShowCoreApi(true)}
        />
        {showCoreApi ? (
          <CoreApiView onClose={() => setShowCoreApi(false)} />
        ) : isExplore ? (
          <ExploreView exploreId={contentPage} onClose={() => setContentPage(null)} onBookSelect={(id) => setSelectedBookId(id)} />
        ) : (
          <>
            <Banner />
            <Hero searchQuery={searchQuery} onSearch={(term) => setSearchQuery(term)} />
          </>
        )}
        <Footer onContentClick={(id) => setContentPage(id)} />
      </div>
      <ContentViewer pageId={contentPage && !isExplore ? contentPage : null} onClose={() => setContentPage(null)} />
      <BookDetail bookId={selectedBookId} onClose={() => setSelectedBookId(null)} />
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSignIn={(p) => setProfile(p)}
      />
    </>
  )
}

const App = () => {
  return (
    <SettingsProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SettingsProvider>
  )
}

export default App