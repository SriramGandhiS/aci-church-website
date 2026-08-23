import Hero from '../components/Hero/Hero'
import InteractiveShowcase from '../components/InteractiveShowcase/InteractiveShowcase'
import AboutSection from '../components/AboutSection/AboutSection'
import DioceseSection from '../components/DioceseSection/DioceseSection'
import MinistriesSection from '../components/MinistriesSection/MinistriesSection'
import FeaturedSection from '../components/FeaturedSection/FeaturedSection'
import EventsSection from '../components/EventsSection/EventsSection'
import TestimoniesSection from '../components/TestimoniesSection/TestimoniesSection'
import Newsletter from '../components/Newsletter/Newsletter'

export default function HomePage() {
  return (
    <>
      {/* 1. Original Classic Hero with original background image & typography */}
      <Hero />

      {/* 2. Interactive Sliding Gallery Spotlight right under the Hero */}
      <InteractiveShowcase />

      {/* 3. About Section with Statement of Faith & Vision */}
      <AboutSection />

      {/* 4. Diocese Governance & Statutory Accreditation Overview */}
      <DioceseSection />

      {/* 5. Core Ministries & Equipments */}
      <MinistriesSection />

      {/* 6. Featured Conference & Word Sharing */}
      <FeaturedSection />

      {/* 7. Upcoming Events */}
      <EventsSection />

      {/* 8. Partner Testimonies */}
      <TestimoniesSection />

      {/* 9. Newsletter & Sowing */}
      <Newsletter />
    </>
  )
}
