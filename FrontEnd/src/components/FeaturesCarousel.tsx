import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Code, Trophy, Users, MessageSquare, TrendingUp } from "lucide-react";
import styled from "styled-components";

const CarouselSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, var(--color-background) 0%, var(--color-surface) 100%);
  overflow: hidden;
  transition: background 0.3s ease;

  .dark & {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: 1rem;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
`;

const CarouselWrapper = styled.div`
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
`;

const CarouselTrack = styled(motion.div)<{ $currentSlide: number }>`
  display: flex;
`;

const Slide = styled(motion.div)`
  min-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rem;
  background: var(--color-surface);
  gap: 4rem;
  transition: background 0.3s ease;

  @media (max-width: 968px) {
    flex-direction: column;
    padding: 3rem 2rem;
    gap: 2rem;
  }
`;

const SlideContent = styled.div`
  flex: 1;
  max-width: 500px;
`;

const SlideTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SlideIcon = styled(motion.div)<{ $color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 10px 20px ${(props) => props.$color}50;
  color: white;
  flex-shrink: 0;
`;

const SlideDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  transition: color 0.3s ease;
`;

const SlideFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--color-text-light);
  transition: color 0.3s ease;

  &::before {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

const SlideImage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;

  @media (max-width: 968px) {
    min-height: 300px;
  }
`;

const ImagePlaceholder = styled.div<{ $color: string }>`
  width: 100%;
  height: 100%;
  background: ${(props) => props.$color};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const DotsPattern = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 25px;
  padding: 40px;
  opacity: 0.5;
`;

const AnimatedDot = styled.div<{ $delay: number }>`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 50%;
  animation: floatDot 3s ease-in-out infinite;
  animation-delay: ${(props) => props.$delay}s;

  @keyframes floatDot {
    0%,
    100% {
      transform: translateY(0) scale(1);
      opacity: 0.8;
    }
    50% {
      transform: translateY(-10px) scale(1.2);
      opacity: 1;
    }
  }
`;

const CentralShape = styled.div<{ $shape: string }>`
  position: relative;
  z-index: 1;
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(15px);
  border: 4px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  animation: rotate 20s linear infinite;

  ${(props) => {
    switch (props.$shape) {
      case "circle":
        return "border-radius: 50%;";
      case "square":
        return "border-radius: 15px;";
      case "diamond":
        return "border-radius: 15px; transform: rotate(45deg);";
      case "hexagon":
        return "clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);";
      case "triangle":
        return "clip-path: polygon(50% 0%, 0% 100%, 100% 100%);";
      default:
        return "border-radius: 50%;";
    }
  }}

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const NavigationButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  z-index: 10;
  color: var(--color-blue-400);

  &:hover {
    box-shadow: var(--shadow-lg);
    background: var(--color-surface-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const PrevButton = styled(NavigationButton)`
  left: -25px;

  @media (max-width: 768px) {
    left: 10px;
  }
`;

const NextButton = styled(NavigationButton)`
  right: -25px;

  @media (max-width: 768px) {
    right: 10px;
  }
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: ${(props) => (props.$active ? "32px" : "12px")};
  height: 12px;
  border-radius: 6px;
  border: none;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "var(--color-border)"};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : "var(--color-text-light)"};
  }
`;

interface Feature {
  id: number;
  title: string;
  description: string;
  features: string[];
  color: string;
  shape: string;
  icon: React.ComponentType<{ size?: number }>;
}

const features: Feature[] = [
  {
    id: 1,
    title: "Desafios de Programação",
    description:
      "Resolva problemas reais de código em diversas linguagens de programação. Do básico ao avançado, com feedback instantâneo.",
    features: [
      "Múltiplas linguagens disponíveis",
      "Dificuldades variadas",
      "Feedback em tempo real",
      "Histórico completo de submissões",
    ],
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    shape: "circle",
    icon: Code,
  },
  {
    id: 2,
    title: "Rankings e Competições",
    description:
      "Compete com desenvolvedores do mundo todo. Acompanhe seu desempenho em rankings globais, por linguagem e instituição.",
    features: [
      "Ranking global em tempo real",
      "Competições por temporada",
      "Rankings por linguagem",
      "Rankings por faculdade",
    ],
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    shape: "square",
    icon: Trophy,
  },
  {
    id: 3,
    title: "Grupos Colaborativos",
    description:
      "Crie ou participe de grupos de estudo. Compartilhe desafios exclusivos e aprenda em equipe.",
    features: [
      "Grupos públicos e privados",
      "Desafios exclusivos do grupo",
      "Sistema de moderação",
      "Chat e discussões",
    ],
    color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    shape: "hexagon",
    icon: Users,
  },
  {
    id: 4,
    title: "Fóruns de Discussão",
    description:
      "Tire dúvidas, compartilhe conhecimento e participe de discussões técnicas com a comunidade.",
    features: [
      "Tópicos organizados por categoria",
      "Sistema de votação",
      "Busca avançada",
      "Notificações em tempo real",
    ],
    color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    shape: "diamond",
    icon: MessageSquare,
  },
  {
    id: 5,
    title: "Acompanhamento de Progresso",
    description:
      "Monitore sua evolução com gráficos detalhados, estatísticas e histórico completo de atividades.",
    features: [
      "Dashboard personalizado",
      "Gráficos de evolução",
      "Estatísticas detalhadas",
      "Relatórios de desempenho",
    ],
    color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    shape: "triangle",
    icon: TrendingUp,
  },
];

export default function FeaturesCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = features.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <CarouselSection
      as={motion.section}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Container>
        <SectionTitle
          as={motion.h2}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Explore Nossas Funcionalidades
        </SectionTitle>
        <SectionDescription
          as={motion.p}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Descubra tudo o que a plataforma oferece para acelerar seu aprendizado
        </SectionDescription>

        <CarouselContainer>
          <CarouselWrapper>
            <AnimatePresence mode="wait" custom={currentSlide}>
              <CarouselTrack
                key={currentSlide}
                custom={currentSlide}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                style={{ display: 'flex' }}
              >
                {features.map((feature, index) => {
                  if (index !== currentSlide) return null;
                  const IconComponent = feature.icon;
                  return (
                    <Slide key={feature.id}>
                      <SlideContent
                        as={motion.div}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <SlideTitle>
                          <SlideIcon 
                            $color={feature.color}
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          >
                            <IconComponent size={32} />
                          </SlideIcon>
                          {feature.title}
                        </SlideTitle>
                        <SlideDescription>{feature.description}</SlideDescription>
                        <SlideFeatures>
                          {feature.features.map((item, idx) => (
                            <FeatureItem 
                              key={idx}
                              as={motion.li}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                            >
                              {item}
                            </FeatureItem>
                          ))}
                        </SlideFeatures>
                      </SlideContent>

                      <SlideImage
                        as={motion.div}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <ImagePlaceholder $color={feature.color}>
                          <DotsPattern>
                            {Array.from({ length: 35 }).map((_, idx) => (
                              <AnimatedDot key={idx} $delay={idx * 0.06} />
                            ))}
                          </DotsPattern>
                          <CentralShape $shape={feature.shape} />
                        </ImagePlaceholder>
                      </SlideImage>
                    </Slide>
                  );
                })}
              </CarouselTrack>
            </AnimatePresence>
          </CarouselWrapper>

          <PrevButton 
            onClick={prevSlide} 
            aria-label="Slide anterior"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </PrevButton>
          <NextButton 
            onClick={nextSlide} 
            aria-label="Próximo slide"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} />
          </NextButton>
        </CarouselContainer>

        <DotsContainer>
          {features.map((_, index) => (
            <Dot
              key={index}
              $active={currentSlide === index}
              onClick={() => goToSlide(index)}
              aria-label={`Ir para slide ${index + 1}`}
              as={motion.button}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </DotsContainer>
      </Container>
    </CarouselSection>
  );
}
