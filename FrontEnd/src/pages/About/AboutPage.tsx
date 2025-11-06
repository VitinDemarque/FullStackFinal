import Navbar from "@components/Layout/Navbar";
import Footer from "@components/Footer";
import styled from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  padding: 6rem 2rem 4rem;
  text-align: center;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
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
  background: white;
  border-radius: 30px 30px 0 0;
  margin-top: 2rem;
  padding: 4rem 2rem;
  flex: 1;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 3rem;
  text-align: center;
  position: relative;

  &::after {
    content: "";
    display: block;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    margin: 1rem auto 0;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const MissionBox = styled.div`
  background: linear-gradient(135deg, #f6f8fb 0%, #e9ecf1 100%);
  padding: 3rem;
  border-radius: 20px;
  margin-bottom: 4rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const MissionText = styled.p`
  font-size: 1.25rem;
  line-height: 1.8;
  color: #4a5568;
  margin: 0;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  margin-bottom: 4rem;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
    border-color: #667eea;
  }
`;

const FeatureIcon = styled.div`
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #718096;
`;

const TechSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem;
  border-radius: 20px;
  margin-bottom: 4rem;
  color: white;
  text-align: center;
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

const CTASection = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f6f8fb 0%, #e9ecf1 100%);
  border-radius: 20px;
  margin-bottom: 2rem;
`;

const CTATitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const CTADescription = styled.p`
  font-size: 1.15rem;
  color: #4a5568;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CTAButton = styled.a`
  display: inline-block;
  padding: 1rem 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
  }
`;

export default function AboutPage() {
  return (
    <PageContainer>
      <Navbar />

      <HeroSection>
        <HeroTitle>Sobre o DevQuest</HeroTitle>
        <HeroSubtitle>
          Transformando desenvolvedores através de desafios práticos e
          aprendizado colaborativo
        </HeroSubtitle>
      </HeroSection>

      <ContentSection>
        <Container>
          <MissionBox>
            <MissionText>
              O DevQuest é uma plataforma inovadora de aprendizado e desafios de
              programação, criada para desenvolvedores que buscam aprimorar suas
              habilidades através da prática constante em um ambiente
              colaborativo e motivador.
            </MissionText>
          </MissionBox>

          <SectionTitle>O que oferecemos</SectionTitle>

          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>💻</FeatureIcon>
              <FeatureTitle>Desafios de Código</FeatureTitle>
              <FeatureDescription>
                Resolva problemas reais de programação em diversas linguagens,
                com diferentes níveis de dificuldade para todos os perfis.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🏆</FeatureIcon>
              <FeatureTitle>Rankings</FeatureTitle>
              <FeatureDescription>
                Acompanhe seu desempenho e compare-se com outros desenvolvedores
                em rankings globais, por linguagem e instituição.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>👥</FeatureIcon>
              <FeatureTitle>Grupos de Estudo</FeatureTitle>
              <FeatureDescription>
                Crie ou participe de grupos colaborativos, compartilhe
                conhecimento e aprenda junto com outros desenvolvedores.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>💬</FeatureIcon>
              <FeatureTitle>Fóruns</FeatureTitle>
              <FeatureDescription>
                Participe de discussões técnicas, tire dúvidas e troque
                experiências com a comunidade em tempo real.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>📊</FeatureIcon>
              <FeatureTitle>Acompanhamento</FeatureTitle>
              <FeatureDescription>
                Monitore sua evolução com estatísticas detalhadas e histórico
                completo de todas as suas submissões.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>

          <TechSection>
            <TechTitle>Tecnologia de Ponta</TechTitle>
            <TechDescription>
              Construído com as tecnologias mais modernas do mercado: React,
              TypeScript, Node.js, Express e MongoDB. Uma plataforma rápida,
              segura e escalável que garante a melhor experiência para sua
              jornada de aprendizado.
            </TechDescription>
          </TechSection>

          <CTASection>
            <CTATitle>Pronto para começar?</CTATitle>
            <CTADescription>
              Junte-se a milhares de desenvolvedores e comece sua jornada hoje
              mesmo. Cadastre-se gratuitamente e tenha acesso completo à
              plataforma!
            </CTADescription>
            <CTAButton href="/signup">Criar Conta Gratuita</CTAButton>
          </CTASection>
        </Container>
      </ContentSection>

      <Footer />
    </PageContainer>
  );
}
