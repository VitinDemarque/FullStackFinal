import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Code, 
  Trophy, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Rocket
} from "lucide-react";
import Navbar from "@components/Layout/Navbar";
import Footer from "@components/Footer";
import styled from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text-primary);
  transition: background 0.3s ease, color 0.3s ease;
`;

const HeroSection = styled(motion.section)`
  padding: 6rem 2rem 4rem;
  text-align: center;
  background: var(--gradient-primary);
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.3;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Bracket = styled.span`
  color: var(--color-yellow-400);
  font-size: 3.5rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  font-weight: 300;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.95;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ContentSection = styled.section`
  background: var(--color-surface);
  border-radius: 30px 30px 0 0;
  margin-top: -2rem;
  padding: 4rem 2rem;
  flex: 1;
  position: relative;
  z-index: 10;
  transition: background 0.3s ease;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 3rem;
  text-align: center;
  position: relative;
  transition: color 0.3s ease;

  &::after {
    content: "";
    display: block;
    width: 80px;
    height: 4px;
    background: var(--gradient-primary);
    margin: 1rem auto 0;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const MissionBox = styled(motion.div)`
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  padding: 3rem;
  border-radius: 20px;
  margin-bottom: 4rem;
  text-align: center;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    border-color: var(--color-primary);
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const MissionText = styled.p`
  font-size: 1.25rem;
  line-height: 1.8;
  color: var(--color-text-secondary);
  margin: 0;
  font-weight: 500;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const FeaturesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  margin-bottom: 4rem;
`;

const FeatureCard = styled(motion.div)`
  background: var(--color-surface);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  border: 2px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
    border-color: var(--color-primary);
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const FeatureIcon = styled(motion.div)<{ $color: string }>`
  width: 80px;
  height: 80px;
  background: ${({ $color }) => $color};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  transition: color 0.3s ease;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  transition: color 0.3s ease;
`;

const TechSection = styled(motion.div)`
  background: var(--gradient-primary);
  padding: 3rem;
  border-radius: 20px;
  margin-bottom: 4rem;
  color: white;
  text-align: center;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }
`;

const TechContent = styled.div`
  position: relative;
  z-index: 1;
`;

const TechTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const TechDescription = styled.p`
  font-size: 1.15rem;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.95;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const TechBadge = styled(motion.span)`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const CTASection = styled(motion.div)`
  text-align: center;
  padding: 3rem 2rem;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-lg);
  }
`;

const CTATitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  transition: color 0.3s ease;
`;

const CTADescription = styled.p`
  font-size: 1.15rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
  transition: color 0.3s ease;
`;

const CTAButton = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 3rem;
  background: var(--gradient-primary);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
    text-decoration: none;
    color: white;
  }
`;

const features = [
  {
    icon: Code,
    title: "Desafios de Código",
    description: "Resolva problemas reais de programação em diversas linguagens, com diferentes níveis de dificuldade para todos os perfis.",
    color: "var(--gradient-primary)",
  },
  {
    icon: Trophy,
    title: "Rankings",
    description: "Acompanhe seu desempenho e compare-se com outros desenvolvedores em rankings globais, por linguagem e instituição.",
    color: "var(--gradient-yellow)",
  },
  {
    icon: Users,
    title: "Grupos de Estudo",
    description: "Crie ou participe de grupos colaborativos, compartilhe conhecimento e aprenda junto com outros desenvolvedores.",
    color: "var(--gradient-green)",
  },
  {
    icon: MessageSquare,
    title: "Fóruns",
    description: "Participe de discussões técnicas, tire dúvidas e troque experiências com a comunidade em tempo real.",
    color: "var(--gradient-blue)",
  },
  {
    icon: TrendingUp,
    title: "Acompanhamento",
    description: "Monitore sua evolução com estatísticas detalhadas e histórico completo de todas as suas submissões.",
    color: "var(--gradient-primary)",
  },
];

const techStack = [
  "React",
  "TypeScript",
  "Node.js",
  "Express",
  "MongoDB",
  "Framer Motion",
  "Styled Components",
];

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      scale: 1.05,
      y: -8,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <PageContainer>
      <Navbar />

      <HeroSection
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Bracket>{"{"}</Bracket>
            Sobre o DevQuest
            <Bracket>{"}"}</Bracket>
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Transformando desenvolvedores através de desafios práticos e
            aprendizado colaborativo
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      <ContentSection>
        <Container>
          <MissionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <MissionText>
              O DevQuest é uma plataforma inovadora de aprendizado e desafios de
              programação, criada para desenvolvedores que buscam aprimorar suas
              habilidades através da prática constante em um ambiente
              colaborativo e motivador.
            </MissionText>
          </MissionBox>

          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            O que oferecemos
          </SectionTitle>

          <FeaturesGrid
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <FeatureCard
                  key={index}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <FeatureIcon
                    $color={feature.color}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent size={40} />
                  </FeatureIcon>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureCard>
              );
            })}
          </FeaturesGrid>

          <TechSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <TechContent>
              <TechTitle>Tecnologia de Ponta</TechTitle>
              <TechDescription>
                Construído com as tecnologias mais modernas do mercado para garantir
                uma experiência rápida, segura e escalável.
              </TechDescription>
              <TechStack>
                {techStack.map((tech, index) => (
                  <TechBadge
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {tech}
                  </TechBadge>
                ))}
              </TechStack>
            </TechContent>
          </TechSection>

          <CTASection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <CTATitle>Pronto para começar?</CTATitle>
            <CTADescription>
              Junte-se a milhares de desenvolvedores e comece sua jornada hoje
              mesmo. Cadastre-se gratuitamente e tenha acesso completo à
              plataforma!
            </CTADescription>
            <CTAButton
              to="/signup"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Rocket size={20} />
              Criar Conta Gratuita
            </CTAButton>
          </CTASection>
        </Container>
      </ContentSection>

      <Footer />
    </PageContainer>
  );
}
