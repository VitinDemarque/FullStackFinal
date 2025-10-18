import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import * as S from "@/styles/pages/Shared/ComingSoon";

export default function SettingsPage() {
  return (
    <AuthenticatedLayout>
      <S.Container>
        <S.Title>⚙️ Configurações</S.Title>
        <S.Description>
          Configure suas preferências, notificações e privacidade.
        </S.Description>

        <S.Card>
          <S.IconWrapper>🔧</S.IconWrapper>
          <S.ComingSoonText>Em Desenvolvimento</S.ComingSoonText>
          <S.ComingSoonDescription>
            Em breve você poderá personalizar sua experiência, gerenciar
            notificações, privacidade e muito mais!
          </S.ComingSoonDescription>
        </S.Card>
      </S.Container>
    </AuthenticatedLayout>
  );
}
