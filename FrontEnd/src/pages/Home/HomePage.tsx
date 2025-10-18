import Navbar from '@components/Layout/Navbar'
import HeroSection from '@components/HeroSection'
import VideoSection from '@components/VideoSection'
import TestimonialsSection from '@components/TestimonialsSection'
import Footer from '@components/Footer'
import styled from 'styled-components'

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.white};
`;

export default function HomePage() {
  return (
    <PageContainer>
      <Navbar />
      <HeroSection />
      <VideoSection />
      <TestimonialsSection />
      <Footer />
    </PageContainer>
  )
}
