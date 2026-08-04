import { useState } from 'react'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import AboutSection from './components/AboutSection/AboutSection'
import MinistriesSection from './components/MinistriesSection/MinistriesSection'
import EncounterSection from './components/EncounterSection/EncounterSection'
import FeaturedSection from './components/FeaturedSection/FeaturedSection'
import SchoolsSection from './components/SchoolsSection/SchoolsSection'
import EventsSection from './components/EventsSection/EventsSection'
import TestimoniesSection from './components/TestimoniesSection/TestimoniesSection'
import Newsletter from './components/Newsletter/Newsletter'
import Footer from './components/Footer/Footer'
import SearchOverlay from './components/SearchOverlay/SearchOverlay'
import MobileMenu from './components/MobileMenu/MobileMenu'

function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <Header
        onSearchOpen={() => setSearchOpen(true)}
        onMenuOpen={() => setMobileMenuOpen(true)}
      />

      <main>
        <Hero />
        <AboutSection />
        <MinistriesSection />
        <EncounterSection />
        <FeaturedSection />
        <SchoolsSection />
        <EventsSection />
        <TestimoniesSection />
        <Newsletter />
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
    </>
  )
}

export default App
