import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'
import * as S from '@/styles/pages/Shared/ComingSoon'

export default function InProgressPage() {
  return (
    <AuthenticatedLayout>
      <S.Container>
        <S.Title>
          📊 Em Andamento
        </S.Title>
        <S.Description>
          Aqui você verá todos os seus desafios em andamento!
        </S.Description>
        
        <S.Card>
          <S.IconWrapper>⏳</S.IconWrapper>
          <S.ComingSoonText>Em Desenvolvimento</S.ComingSoonText>
          <S.ComingSoonDescription>
            Acompanhe o progresso dos seus desafios, veja estatísticas e continue de onde parou.
            Funcionalidade chegando em breve!
          </S.ComingSoonDescription>
        </S.Card>
      </S.Container>
    </AuthenticatedLayout>
  )
}

