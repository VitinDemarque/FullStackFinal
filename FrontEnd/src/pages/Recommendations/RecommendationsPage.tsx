import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'
import * as S from '@/styles/pages/Shared/ComingSoon'

export default function RecommendationsPage() {
  return (
    <AuthenticatedLayout>
      <S.Container>
        <S.Title>
          ⭐ Recomendações
        </S.Title>
        <S.Description>
          Desafios personalizados baseados no seu histórico e nível!
        </S.Description>
        
        <S.Card>
          <S.IconWrapper>✨</S.IconWrapper>
          <S.ComingSoonText>Em Desenvolvimento</S.ComingSoonText>
          <S.ComingSoonDescription>
            Nossa IA está aprendendo sobre você! Em breve você receberá recomendações 
            personalizadas de desafios baseados no seu nível e interesses.
          </S.ComingSoonDescription>
        </S.Card>
      </S.Container>
    </AuthenticatedLayout>
  )
}

