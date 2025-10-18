import { FaPlay, FaCode, FaTrophy, FaUsers, FaChartLine } from "react-icons/fa";
import * as S from "@/styles/components/VideoSection/styles";

export default function VideoSection() {
  return (
    <S.VideoSectionContainer>
      <S.ShapeTopLeft />

      <S.VideoContent>
        <S.Title>
          {"{"}Como Funciona a Plataforma{"}"}
        </S.Title>
        <S.Description>
          Uma plataforma completa de aprendizado gamificado que transforma a
          forma como você aprende a programar
        </S.Description>

        <S.VideoContainer>
          <S.VideoPlaceholder>
            <S.VideoOverlay />
            <S.VideoContentInner>
              <S.PlayButton>
                <FaPlay />
              </S.PlayButton>
              <S.VideoText>
                Assista ao vídeo introdutório (2:30)
              </S.VideoText>
              <S.ComingSoonText>(Vídeo em breve)</S.ComingSoonText>
            </S.VideoContentInner>
          </S.VideoPlaceholder>
        </S.VideoContainer>

        <S.FeaturesGrid>
          <S.FeatureCard>
            <S.FeatureIcon color="blue">
              <FaCode />
            </S.FeatureIcon>
            <S.FeatureTitle>Desafios Práticos</S.FeatureTitle>
            <S.FeatureDescription>
              Resolva exercícios reais de programação em diversas linguagens
            </S.FeatureDescription>
          </S.FeatureCard>

          <S.FeatureCard>
            <S.FeatureIcon color="yellow">
              <FaTrophy />
            </S.FeatureIcon>
            <S.FeatureTitle>Sistema de XP</S.FeatureTitle>
            <S.FeatureDescription>
              Ganhe experiência, suba de nível e desbloqueie conquistas
            </S.FeatureDescription>
          </S.FeatureCard>

          <S.FeatureCard>
            <S.FeatureIcon color="green">
              <FaChartLine />
            </S.FeatureIcon>
            <S.FeatureTitle>Ranking Global</S.FeatureTitle>
            <S.FeatureDescription>
              Compare seu progresso e compita com outros desenvolvedores
            </S.FeatureDescription>
          </S.FeatureCard>

          <S.FeatureCard>
            <S.FeatureIcon color="purple">
              <FaUsers />
            </S.FeatureIcon>
            <S.FeatureTitle>Comunidade Ativa</S.FeatureTitle>
            <S.FeatureDescription>
              Participe de grupos e aprenda com outros estudantes
            </S.FeatureDescription>
          </S.FeatureCard>
        </S.FeaturesGrid>
      </S.VideoContent>
    </S.VideoSectionContainer>
  );
}
