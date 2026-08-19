import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import SearchOverlay from './components/SearchOverlay/SearchOverlay'
import MobileMenu from './components/MobileMenu/MobileMenu'

import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ActivitiesPage from './pages/ActivitiesPage'
import PartnershipPage from './pages/PartnershipPage'
import SynodPage from './pages/SynodPage'
import MediaPage from './pages/MediaPage'
import GalleryPage from './pages/GalleryPage'
import ContactPage from './pages/ContactPage'
import AlbumPage from './components/AlbumPage/AlbumPage'

function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <LanguageProvider>
      <Router>
        <Header
          onSearchOpen={() => setSearchOpen(true)}
          onMenuOpen={() => setMobileMenuOpen(true)}
        />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/partnership" element={<PartnershipPage />} />
            <Route path="/synod" element={<SynodPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gallery/album/:uniq" element={<AlbumPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>

        <Footer />

        <SearchOverlay
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />

        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      </Router>
    </LanguageProvider>
  )
}

export default App
