import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styled from "styled-components";

const CarouselSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.2rem;
  color: #718096;
  text-align: center;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

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

const CarouselTrack = styled.div<{ $currentSlide: number }>`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(-${(props) => props.$currentSlide * 100}%);
`;

const Slide = styled.div`
  min-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rem;
  background: white;
  gap: 4rem;

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
  color: #2d3748;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SlideIcon = styled.div<{ $color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 10px 20px ${(props) => props.$color}50;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    background: ${(props) => props.$color};
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.15);
      opacity: 0.7;
    }
  }
`;

const SlideDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a5568;
  margin-bottom: 2rem;
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
  color: #718096;

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

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    font-size: 1.2rem;
    color: #667eea;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;

    svg {
      font-size: 1rem;
    }
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
      : "#cbd5e0"};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : "#a0aec0"};
  }
`;

interface Feature {
  id: number;
  title: string;
  description: string;
  features: string[];
  color: string;
  shape: string;
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

  return (
    <CarouselSection>
      <Container>
        <SectionTitle>Explore Nossas Funcionalidades</SectionTitle>
        <SectionDescription>
          Descubra tudo o que a plataforma oferece para acelerar seu aprendizado
        </SectionDescription>

        <CarouselContainer>
          <CarouselWrapper>
            <CarouselTrack $currentSlide={currentSlide}>
              {features.map((feature) => (
                <Slide key={feature.id}>
                  <SlideContent>
                    <SlideTitle>
                      <SlideIcon $color={feature.color} />
                      {feature.title}
                    </SlideTitle>
                    <SlideDescription>{feature.description}</SlideDescription>
                    <SlideFeatures>
                      {feature.features.map((item, index) => (
                        <FeatureItem key={index}>{item}</FeatureItem>
                      ))}
                    </SlideFeatures>
                  </SlideContent>

                  <SlideImage>
                    <ImagePlaceholder $color={feature.color}>
                      <DotsPattern>
                        {Array.from({ length: 35 }).map((_, index) => (
                          <AnimatedDot key={index} $delay={index * 0.06} />
                        ))}
                      </DotsPattern>
                      <CentralShape $shape={feature.shape} />
                    </ImagePlaceholder>
                  </SlideImage>
                </Slide>
              ))}
            </CarouselTrack>
          </CarouselWrapper>

          <PrevButton onClick={prevSlide} aria-label="Slide anterior">
            <FaChevronLeft />
          </PrevButton>
          <NextButton onClick={nextSlide} aria-label="Próximo slide">
            <FaChevronRight />
          </NextButton>
        </CarouselContainer>

        <DotsContainer>
          {features.map((_, index) => (
            <Dot
              key={index}
              $active={currentSlide === index}
              onClick={() => goToSlide(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </DotsContainer>
      </Container>
    </CarouselSection>
  );
}
