import { useState, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import AuthModal from './components/Auth/AuthModal'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import MobileMenu from './components/MobileMenu/MobileMenu'
import ProtectedAdminRoute from './components/Admin/ProtectedAdminRoute'

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
import ApplicantDashboardPage from './pages/ApplicantDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminApplicationDetailPage from './pages/AdminApplicationDetailPage'
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
      <AuthProvider>
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
              <Route path="/get-involved/status" element={<ApplicantDashboardPage />} />
              
              {/* Strictly Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/applications"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/members"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/subscriptions"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/coordinators"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/churches"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/activities"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/gallery"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/announcements"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/audit-log"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/application/:id"
                element={
                  <ProtectedAdminRoute>
                    <AdminApplicationDetailPage />
                  </ProtectedAdminRoute>
                }
              />

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

          <AuthModal />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
