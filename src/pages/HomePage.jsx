import Hero from '../components/Hero/Hero'
import InteractiveShowcase from '../components/InteractiveShowcase/InteractiveShowcase'
import AboutSection from '../components/AboutSection/AboutSection'
import DioceseSection from '../components/DioceseSection/DioceseSection'
import DirectoryCta from '../components/DirectoryCta/DirectoryCta'
import MinistriesSection from '../components/MinistriesSection/MinistriesSection'
import FeaturedSection from '../components/FeaturedSection/FeaturedSection'
import TestimoniesSection from '../components/TestimoniesSection/TestimoniesSection'
import EventsSection from '../components/EventsSection/EventsSection'
import GetInvolvedCta from '../components/GetInvolvedCta/GetInvolvedCta'
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

      {/* 5. Member Directory Search CTA Banner */}
      <DirectoryCta />

      {/* 6. Core Ministries & Equipments */}
      <MinistriesSection />

      {/* 7. Featured Conference & Word Sharing */}
      <FeaturedSection />

      {/* 8. Get Involved / Membership Application CTA Banner */}
      <GetInvolvedCta />

      {/* 9. Upcoming Events */}
      <EventsSection />

      {/* 10. Partner Testimonies */}
      <TestimoniesSection />

      {/* 11. Newsletter & Sowing */}
      <Newsletter />
    </>
  )
}
