import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'
import * as S from '@/styles/pages/Shared/ComingSoon'

export default function ChallengesPage() {
  return (
    <AuthenticatedLayout>
      <S.Container>
        <S.Title>
          🎯 Desafios
        </S.Title>
        <S.Description>
          Em breve você terá acesso a centenas de desafios de programação!
        </S.Description>
        
        <S.Card>
          <S.IconWrapper>🚀</S.IconWrapper>
          <S.ComingSoonText>Em Desenvolvimento</S.ComingSoonText>
          <S.ComingSoonDescription>
            Estamos preparando desafios incríveis para você praticar suas habilidades de programação.
            Aguarde novidades em breve!
          </S.ComingSoonDescription>
        </S.Card>
      </S.Container>
    </AuthenticatedLayout>
  )
}

