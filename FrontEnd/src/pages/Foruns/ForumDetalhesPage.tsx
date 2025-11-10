import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout'
import ModalEditarForum from '@/components/Forum/ModalEditarForum'
import ConfirmationModal from '@/components/ConfirmationModal'
import { forunsService } from '@/services/forum.services'
import { exercisesService } from '@/services/exercises.service'
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
  const [palavraChaveTopico, setPalavraChaveTopico] = useState<string>("");
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null);
  const [editandoTopicoId, setEditandoTopicoId] = useState<string | null>(null);
  const [editTitulo, setEditTitulo] = useState<string>('');
  const [editConteudo, setEditConteudo] = useState<string>('');
  const [confirmarExclusaoTopicoId, setConfirmarExclusaoTopicoId] = useState<string | null>(null);
  const [mostrarTodosTopicos, setMostrarTodosTopicos] = useState(false);
  const [buscaTopico, setBuscaTopico] = useState('');
  const [exerciseStatus, setExerciseStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | null>(null);

  const createSectionRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const irParaCriarTopico = () => {
    createSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 250);
  };

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

        // Buscar status do desafio ligado ao fórum para exibir estado inativo nos tópicos
        if (data.exerciseId) {
          try {
            const ex = await exercisesService.getById(String(data.exerciseId));
            setExerciseStatus(ex.status as any);
          } catch {}
        }

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
        palavrasChave: (() => {
          const txt = palavraChaveTopico.trim();
          if (!txt) return [];
          // Suporta múltiplas palavras separadas por vírgula, mas aceita uma única também
          return txt.split(',').map((s) => s.trim()).filter(Boolean);
        })(),
      });
      // Adiciona o novo tópico à lista local
      setTopicos((prev) => [novo, ...prev]);
      // Limpa campos e mantém foco para criar outro se desejar
      setTituloTopico("");
      setConteudoTopico("");
      setPalavraChaveTopico("");
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    } catch (err: any) {
      setErro(err?.message || err?.mensagem || 'Erro ao criar tópico.');
    } finally {
      setCriandoTopico(false);
    }
  };

  const isOwner = !!usuarioAtual && !!forum && String(forum.donoUsuarioId || '') === String(usuarioAtual._id || usuarioAtual.id || '');
  const isAdmin = (usuarioAtual as any)?.role === 'ADMIN';

  const handleExcluirForum = async () => {
    if (!forum) return;
    try {
      await forunsService.excluir(forum._id);
      navigate('/foruns');
    } catch (err: any) {
      setErro(err?.message || 'Erro ao excluir fórum.');
    }
  };

  const handleForumAtualizado = (f: Forum) => {
    setForum(f);
  };

  const meuUsuarioId = String(usuarioAtual?._id || usuarioAtual?.id || '');

  const toggleMenuTopico = (id: string) => {
    setMenuAbertoId((prev) => (prev === id ? null : id));
  };

  const iniciarEdicaoTopico = (t: ForumTopic) => {
    setEditandoTopicoId(t._id);
    setEditTitulo(t.titulo);
    setEditConteudo(t.conteudo);
    setMenuAbertoId(null);
  };

  const cancelarEdicaoTopico = () => {
    setEditandoTopicoId(null);
    setEditTitulo('');
    setEditConteudo('');
  };

  const salvarEdicaoTopico = async () => {
    if (!editandoTopicoId) return;
    try {
      const atualizado = await forumTopicService.atualizar(editandoTopicoId, {
        titulo: editTitulo.trim(),
        conteudo: editConteudo.trim(),
      });
      setTopicos((prev) => prev.map((t) => (t._id === editandoTopicoId ? atualizado : t)));
      cancelarEdicaoTopico();
    } catch (err: any) {
      setErro(err?.message || err?.mensagem || 'Erro ao editar tópico.');
    }
  };

  const solicitarExclusaoTopico = (t: ForumTopic) => {
    setConfirmarExclusaoTopicoId(t._id);
    setMenuAbertoId(null);
  };

  const confirmarExclusaoTopico = async () => {
    if (!confirmarExclusaoTopicoId) return;
    try {
      await forumTopicService.excluir(confirmarExclusaoTopicoId);
      setTopicos((prev) => prev.filter((t) => t._id !== confirmarExclusaoTopicoId));
      setConfirmarExclusaoTopicoId(null);
    } catch (err: any) {
      setErro(err?.message || err?.mensagem || 'Erro ao excluir tópico.');
    }
  };
  
  const isExerciseActive = exerciseStatus === 'PUBLISHED';
  

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
                            {(isOwner || isAdmin) && (
                              <S.ActionsRow>
                                <S.Button variant="secondary" onClick={() => setMostrarEditar(true)}>✏️ Editar Fórum</S.Button>
                                <S.Button variant="danger" onClick={() => setConfirmarExclusao(true)}>🗑️ Excluir Fórum</S.Button>
                              </S.ActionsRow>
                            )}
                            <S.ForumMeta>
                                <span>
                                    <S.DetailLabel>Dono:</S.DetailLabel>{' '}
                                    {forum.donoUsuarioId ? (
                                      <Link to={`/perfil/${forum.donoUsuarioId}`} style={{ textDecoration: 'none' }}>
                                        <S.OwnerNameLink>{dono?.name || 'Desconhecido'}</S.OwnerNameLink>
                                      </Link>
                                    ) : (
                                      dono?.name || 'Desconhecido'
                                    )}
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
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                      <S.DetailSectionTitle style={{ margin: 0 }}>Tópicos</S.DetailSectionTitle>
                                      <S.TopicsSearchBar>
                                        <FaSearch />
                                        <input
                                          placeholder="Buscar por título, conteúdo ou palavra-chave"
                                          value={buscaTopico}
                                          onChange={(e) => setBuscaTopico(e.target.value)}
                                        />
                                      </S.TopicsSearchBar>
                                    </div>

                                    {(() => {
                                      const q = buscaTopico.trim().toLowerCase();
                                      const filtrados = q
                                        ? topicos.filter((t) => {
                                            const titulo = (t.titulo || '').toLowerCase();
                                            const conteudo = (t.conteudo || '').toLowerCase();
                                            const chaves = (t.palavrasChave || []).map((c) => c.toLowerCase());
                                            return (
                                              titulo.includes(q) ||
                                              conteudo.includes(q) ||
                                              chaves.some((c) => c.includes(q))
                                            );
                                          })
                                        : topicos;
                                      const topicosVisiveis = mostrarTodosTopicos ? filtrados : filtrados.slice(0, 2);
                                      const restantes = Math.max(0, filtrados.length - topicosVisiveis.length);

                                      if (filtrados.length === 0) {
                                        return <S.DetailText>Nenhum tópico encontrado.</S.DetailText>;
                                      }

                                      return (
                                        <>
                                          <S.TopicList>
                                            {topicosVisiveis.map((t) => (
                                                <S.TopicCard key={t._id} menuAberto={menuAbertoId === t._id} $inactive={!isExerciseActive}>
                                                    <S.TopicHeader>
                                                        {editandoTopicoId === t._id ? (
                                                          <>
                                                            <S.Input
                                                              type="text"
                                                              value={editTitulo}
                                                              onChange={(e) => setEditTitulo(e.target.value)}
                                                              placeholder="Título do tópico"
                                                            />
                                                            <S.Textarea
                                                              value={editConteudo}
                                                              onChange={(e) => setEditConteudo(e.target.value)}
                                                              placeholder="Conteúdo do tópico"
                                                            />
                                                            <S.ActionsRow>
                                                              <S.Button variant="success" onClick={salvarEdicaoTopico} disabled={!editTitulo.trim() || !editConteudo.trim()}>
                                                                Salvar
                                                              </S.Button>
                                                              <S.Button variant="secondary" onClick={cancelarEdicaoTopico}>
                                                                Cancelar
                                                              </S.Button>
                                                            </S.ActionsRow>
                                                          </>
                                                        ) : (
                                                          <>
                                                            <S.TopicTitle>{t.titulo}</S.TopicTitle>
                                                            <S.TopicContent>{t.conteudo}</S.TopicContent>
                                                          </>
                                                        )}
                                                    </S.TopicHeader>
                                                    <S.TopicActions>
                                                        <S.Button
                                                            variant="secondary"
                                                            onClick={() => navigate(`/foruns/${forum._id}/topicos/${t._id}`)}
                                                        >
                                                            Abrir
                                                        </S.Button>
                                                        {String(t.autorUsuarioId) === meuUsuarioId && (
                                                          <>
                                                            <S.Button variant="secondary" onClick={() => toggleMenuTopico(t._id)} aria-label="Mais opções">...</S.Button>
                                                            {menuAbertoId === t._id && (
                                                              <S.OptionsMenu role="menu" aria-label="Opções do tópico">
                  <S.OptionsItem onClick={() => iniciarEdicaoTopico(t)}>
                    <span aria-hidden>✏️</span>
                    <span>Editar</span>
                  </S.OptionsItem>
                                                                <S.OptionsDivider />
                  <S.OptionsItem className="danger" onClick={() => solicitarExclusaoTopico(t)}>
                    <span aria-hidden>🗑️</span>
                    <span>Excluir</span>
                  </S.OptionsItem>
                                                              </S.OptionsMenu>
                                                            )}
                                                          </>
                                                        )}
                                                    </S.TopicActions>
                                                    {!isExerciseActive && (
                                                      <S.InactiveOverlay>
                                                        <S.InactiveLabel>INATIVO</S.InactiveLabel>
                                                      </S.InactiveOverlay>
                                                    )}
                                                </S.TopicCard>
                                            ))}
                                          </S.TopicList>
                                          <S.ActionsRow>
                                            {restantes > 0 && !mostrarTodosTopicos && (
                                              <S.Button variant="secondary" onClick={() => setMostrarTodosTopicos(true)}>
                                                Ver mais tópicos ({restantes})
                                              </S.Button>
                                            )}
                                            {mostrarTodosTopicos && (
                                              <S.Button variant="secondary" onClick={() => setMostrarTodosTopicos(false)}>
                                                Mostrar menos
                                              </S.Button>
                                            )}
                                            <S.Button variant="primary" onClick={irParaCriarTopico}>
                                              Criar tópico
                                            </S.Button>
                                          </S.ActionsRow>
                                        </>
                                      );
                                    })()}
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
                                        <S.Input
                                            type="text"
                                            value={palavraChaveTopico}
                                            onChange={(e) => setPalavraChaveTopico(e.target.value)}
                                            placeholder="Palavra-chave (opcional)"
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
                <ModalEditarForum
                  aberto={mostrarEditar}
                  forum={forum}
                  onFechar={() => setMostrarEditar(false)}
                  onAtualizado={handleForumAtualizado}
                />

                <ConfirmationModal
                  isOpen={confirmarExclusao}
                  onClose={() => setConfirmarExclusao(false)}
                  onConfirm={handleExcluirForum}
                  title="Excluir Fórum"
                  message="Tem certeza que deseja excluir este fórum? Esta ação não pode ser desfeita."
                  confirmText="Excluir"
                  cancelText="Cancelar"
                  type="danger"
                />
                <ConfirmationModal
                  isOpen={!!confirmarExclusaoTopicoId}
                  onClose={() => setConfirmarExclusaoTopicoId(null)}
                  onConfirm={confirmarExclusaoTopico}
                  title="Excluir Tópico"
                  message="Tem certeza que deseja excluir este tópico? Esta ação não pode ser desfeita."
                  confirmText="Excluir"
                  cancelText="Cancelar"
                  type="danger"
                />
            </S.Container>
        </AuthenticatedLayout>
    )
}