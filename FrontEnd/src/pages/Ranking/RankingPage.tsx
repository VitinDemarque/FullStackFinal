import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import * as S from "@/styles/pages/Shared/ComingSoon";

export default function RankingPage() {
  return (
    <AuthenticatedLayout>
      <S.Container>
        <S.Title>🏆 Ranking Global</S.Title>
        <S.Description>
          Veja sua posição no ranking global e compita com outros
          desenvolvedores!
        </S.Description>

        <S.Card>
          <S.IconWrapper>🎯</S.IconWrapper>
          <S.ComingSoonText>Em Desenvolvimento</S.ComingSoonText>
          <S.ComingSoonDescription>
            Em breve você poderá ver sua posição no ranking, comparar com outros
            desenvolvedores e competir pelos primeiros lugares!
          </S.ComingSoonDescription>
        </S.Card>
      </S.Container>
    </AuthenticatedLayout>
  );
}
