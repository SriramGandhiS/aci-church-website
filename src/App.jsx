import { useState, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import MobileMenu from './components/MobileMenu/MobileMenu'

import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import DiocesePage from './pages/DiocesePage'
import ActivitiesPage from './pages/ActivitiesPage'
import PartnershipPage from './pages/PartnershipPage'
import SynodPage from './pages/SynodPage'
import MediaPage from './pages/MediaPage'
import GalleryPage from './pages/GalleryPage'
import ContactPage from './pages/ContactPage'
import DirectoryPage from './pages/DirectoryPage'
import GetInvolvedPage from './pages/GetInvolvedPage'
import ApplicationPage from './pages/ApplicationPage'
import AlbumPage from './components/AlbumPage/AlbumPage'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleOpenMenu = useCallback(() => {
    setMobileMenuOpen(true)
  }, [])

  const handleCloseMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <LanguageProvider>
      <Router>
        <Header onMenuOpen={handleOpenMenu} />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/diocese" element={<DiocesePage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/partnership" element={<PartnershipPage />} />
            <Route path="/synod" element={<SynodPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/get-involved" element={<GetInvolvedPage />} />
            <Route path="/get-involved/application" element={<ApplicationPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gallery/album/:uniq" element={<AlbumPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>

        <Footer />

        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={handleCloseMenu}
        />
      </Router>
    </LanguageProvider>
  )
}

export default App
