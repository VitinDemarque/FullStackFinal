import Navbar from '@components/Layout/Navbar'
import HeroSection from '@components/HeroSection'
import VideoSection from '@components/VideoSection'
import TestimonialsSection from '@components/TestimonialsSection'
import Footer from '@components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <VideoSection />
      <TestimonialsSection />
      <Footer />
    </div>
  )
}
