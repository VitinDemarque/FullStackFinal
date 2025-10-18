import { FcGoogle } from 'react-icons/fc'
import * as S from '@/styles/components/HeroSection/styles'

export default function HeroSection() {
  return (
    <S.HeroSectionContainer>
      <S.ShapeTopLeft />
      <S.ShapeBottomRight />

      <S.HeroContent>
        <S.LeftContent>
          <S.Title>
            {'{'}Aprenda a Programar Jogando{'}'}
          </S.Title>
          <S.Description>
            Transforme seu aprendizado em código com desafios práticos e divertidos. 
            Suba no ranking, ganhe XP, conquiste badges e torne-se um desenvolvedor de elite 
            através da gamificação educacional!
          </S.Description>

          <S.GoogleButton to="/signup">
            <FcGoogle />
            <span>Continuar com Google</span>
          </S.GoogleButton>

          <S.Stats>
            <S.StatItem>
              <S.StatValue>10K+</S.StatValue>
              <S.StatLabel>Estudantes Ativos</S.StatLabel>
            </S.StatItem>
            <S.StatItem>
              <S.StatValue>500+</S.StatValue>
              <S.StatLabel>Desafios</S.StatLabel>
            </S.StatItem>
            <S.StatItem>
              <S.StatValue>20+</S.StatValue>
              <S.StatLabel>Linguagens</S.StatLabel>
            </S.StatItem>
          </S.Stats>
        </S.LeftContent>

        <S.IllustrationContainer>
          <S.IllustrationImage
            src="https://illustrations.popsy.co/amber/remote-work.svg"
            alt="Desenvolvedores programando"
          />
        </S.IllustrationContainer>
      </S.HeroContent>
    </S.HeroSectionContainer>
  )
}
