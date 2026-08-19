import Hero from '../components/Hero/Hero'
import AboutSection from '../components/AboutSection/AboutSection'
import MinistriesSection from '../components/MinistriesSection/MinistriesSection'
import FeaturedSection from '../components/FeaturedSection/FeaturedSection'
import EventsSection from '../components/EventsSection/EventsSection'
import TestimoniesSection from '../components/TestimoniesSection/TestimoniesSection'
import Newsletter from '../components/Newsletter/Newsletter'

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <MinistriesSection />
      <FeaturedSection />
      <EventsSection />
      <TestimoniesSection />
      <Newsletter />
    </>
  )
}
