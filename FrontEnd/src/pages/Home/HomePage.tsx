import { motion } from "framer-motion";
import Navbar from "@components/Layout/Navbar";
import HeroSection from "@components/HeroSection";
import FeaturesCarousel from "@components/FeaturesCarousel";
import TestimonialsSection from "@components/TestimonialsSection";
import Footer from "@components/Footer";
import styled from "styled-components";

const PageContainer = styled(motion.div)`
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
`;

export default function HomePage() {
  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <HeroSection />
      <FeaturesCarousel />
      <TestimonialsSection />
      <Footer />
    </PageContainer>
  );
}
