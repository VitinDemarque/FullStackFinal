import { FcGoogle } from 'react-icons/fc'
import * as S from '@/styles/components/HeroSection/styles'
import { useAuth } from '@/contexts/AuthContext'
import { useGoogleLogin } from '@react-oauth/google'

export default function HeroSection() {
  const { loginWithGoogle } = useAuth()

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: any) => {
      if (tokenResponse?.credential) {
        try {
          await loginWithGoogle(tokenResponse.credential)
        } catch (err) {}
      }
    },
    onError: () => {},
  })

  return (
    <S.HeroSectionContainer>
      <S.ShapeTopLeft />
      <S.ShapeBottomRight />

      <S.HeroContent>
        <S.LeftContent>
          <S.Title>{'{'}Aprenda a Programar Jogando{'}'}</S.Title>
          <S.Description>
            Transforme seu aprendizado em código com desafios práticos e divertidos. 
            Suba no ranking, ganhe XP, conquiste badges e torne-se um desenvolvedor de elite 
            através da gamificação educacional!
          </S.Description>

          <S.GoogleButtonAction onClick={() => handleGoogleLogin()}>
            <FcGoogle />
            <span>Continuar com Google</span>
          </S.GoogleButtonAction>

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
