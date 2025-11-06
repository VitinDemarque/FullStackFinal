import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout'
import { forunsService } from '@/services/forum.services'
import { userService } from '@/services/user.service'
import { forumTopicService } from '@/services/forumTopic.service'
import type { Forum, ForumTopic } from '@/types/forum'
import type { User } from '@/types/index'
import * as S from '@/styles/pages/Foruns/styles'

export default function ForumDetalhesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [forum, setForum] = useState<Forum | null>(null);
  const [dono, setDono] = useState<User | null>(null);
  const [usuarioAtual, setUsuarioAtual] = useState<User | null>(null);
  const [participando, setParticipando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [processando, setProcessando] = useState(false);
  const [topicos, setTopicos] = useState<ForumTopic[]>([]);
  const [criandoTopico, setCriandoTopico] = useState(false);
  const [tituloTopico, setTituloTopico] = useState("");
  const [conteudoTopico, setConteudoTopico] = useState("");

  const createSectionRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      if (!id) {
        setErro("ID do fórum não informado.");
        return;
      }

      try {
        setLoading(true);

        const me = await userService.getMe();
        setUsuarioAtual(me);

        const data = await forunsService.getById(id);
        setForum(data);

        if (data.donoUsuarioId) {
          const donoUser = await userService.getById(data.donoUsuarioId);
          setDono(donoUser);
        }

        // Verifica se o usuário já participa (considerando _id ou id)
        const myId = String(me._id || me.id || '');
        const ehParticipante =
          String(data.donoUsuarioId || '') === myId ||
          data.moderadores?.some((m) => String(m.usuarioId) === myId) ||
          data.membros?.some((m) => String(m.usuarioId) === myId);

        setParticipando(!!ehParticipante);

        // Carregar tópicos do fórum
        const lista = await forumTopicService.listarPorForum(id);
        setTopicos(lista);
      } catch (err: any) {
        setErro(err?.message || err?.mensagem || "Erro ao carregar fórum.");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id]);

  const handleParticipar = async () => {
    if (!id) return;
    try {
      setProcessando(true);
      await forunsService.participar(id);
      setParticipando(true);
      const atualizado = await forunsService.getById(id);
      setForum(atualizado);
      // Após entrar, recarrega tópicos e limpa qualquer erro exibido
      try {
        const lista = await forumTopicService.listarPorForum(id);
        setTopicos(lista);
      } catch {}
      setErro(null);
      // Após entrar no fórum, abre (foca) a seção de criação de tópico
      setTimeout(() => {
        createSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        titleInputRef.current?.focus();
      }, 250);
    } catch (err: any) {
      const msg = err?.message || err?.mensagem || "Não foi possível participar deste fórum.";
      if (typeof msg === 'string' && msg.toLowerCase().includes('já participa')) {
        // Usuário já participa: ajusta estado e atualiza fórum sem exibir erro
        setParticipando(true);
        try {
          const atualizado = await forunsService.getById(id);
          setForum(atualizado);
          const lista = await forumTopicService.listarPorForum(id);
          setTopicos(lista);
        } catch {}
        setErro(null);
        setTimeout(() => {
          createSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          titleInputRef.current?.focus();
        }, 250);
      } else {
        setErro(msg);
      }
    } finally {
      setProcessando(false);
    }
  };

  const handleCriarTopico = async () => {
    if (!id) return;
    if (!tituloTopico.trim() || !conteudoTopico.trim()) return;

    try {
      setCriandoTopico(true);
      const novo = await forumTopicService.criar(id, {
        titulo: tituloTopico.trim(),
        conteudo: conteudoTopico.trim(),
        palavrasChave: [],
      });
      // Adiciona o novo tópico à lista local
      setTopicos((prev) => [novo, ...prev]);
      // Limpa campos e mantém foco para criar outro se desejar
      setTituloTopico("");
      setConteudoTopico("");
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    } catch (err: any) {
      setErro(err?.message || err?.mensagem || 'Erro ao criar tópico.');
    } finally {
      setCriandoTopico(false);
    }
  };

  

    return (
        <AuthenticatedLayout>
            <S.Container>
                <S.BackButton to="/foruns">← Voltar</S.BackButton>

                {loading && <S.Loading>Carregando fórum...</S.Loading>}
                {erro && <S.Error>{erro}</S.Error>}

                {forum && (
                    <S.DetailContainer>
                        <S.DetailTitle>{forum.nome}</S.DetailTitle>

                        <S.DetailSection>
                            <S.DetailText>
                                {forum.descricao || 'Sem descrição'}
                            </S.DetailText>
                            <S.ForumMeta>
                                <span>
                                    <S.DetailLabel>Dono:</S.DetailLabel> {dono?.name || 'Desconhecido'}
                                </span>
                                <span>
                                    <S.DetailLabel>Privacidade:</S.DetailLabel> {forum.statusPrivacidade === 'PRIVADO' ? 'Privado' : 'Público'}
                                </span>
                            </S.ForumMeta>
                            {!participando && (
                                <S.ActionsRow>
                                    <S.Button onClick={handleParticipar} disabled={processando} variant="primary">
                                        {processando ? 'Ingressando...' : 'Participar deste fórum'}
                                    </S.Button>
                                </S.ActionsRow>
                            )}
                        </S.DetailSection>

                        {participando && (
                            <>
                                <S.DetailSection>
                                    <S.DetailSectionTitle>Tópicos</S.DetailSectionTitle>
                                    {topicos.length === 0 ? (
                                        <S.DetailText>Nenhum tópico ainda.</S.DetailText>
                                    ) : (
                                        <S.TopicList>
                                            {topicos.map((t) => (
                                                <S.TopicCard key={t._id}>
                                                    <S.TopicHeader>
                                                        <S.TopicTitle>{t.titulo}</S.TopicTitle>
                                                        <S.TopicContent>{t.conteudo}</S.TopicContent>
                                                    </S.TopicHeader>
                                                    <S.TopicActions>
                                                        <S.Button
                                                            variant="secondary"
                                                            onClick={() => navigate(`/foruns/${forum._id}/topicos/${t._id}`)}
                                                        >
                                                            Abrir
                                                        </S.Button>
                                                    </S.TopicActions>
                                                </S.TopicCard>
                                            ))}
                                        </S.TopicList>
                                    )}
                                </S.DetailSection>

                                <S.DetailSection ref={createSectionRef}>
                                    <S.DetailSectionTitle>Criar novo tópico</S.DetailSectionTitle>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <S.Input
                                            type="text"
                                            value={tituloTopico}
                                            ref={titleInputRef}
                                            onChange={(e) => setTituloTopico(e.target.value)}
                                            placeholder="Título do tópico"
                                        />
                                        <S.Textarea
                                            value={conteudoTopico}
                                            onChange={(e) => setConteudoTopico(e.target.value)}
                                            placeholder="Conteúdo do tópico"
                                        />
                                        <S.ActionsRow>
                                            <S.Button
                                                onClick={handleCriarTopico}
                                                disabled={criandoTopico || !tituloTopico || !conteudoTopico}
                                                variant="success"
                                            >
                                                {criandoTopico ? 'Criando...' : 'Criar tópico'}
                                            </S.Button>
                                        </S.ActionsRow>
                                    </div>
                                </S.DetailSection>
                            </>
                        )}
                    </S.DetailContainer>
                )}
            </S.Container>
        </AuthenticatedLayout>
    )
}