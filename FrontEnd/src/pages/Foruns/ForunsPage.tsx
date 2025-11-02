import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout'
import { forunsService } from '@/services/forum.services'
import ModalCriarForum from '@/components/Forum/ModalCriarForum'
import type { Forum } from '@/types/forum'
import * as S from '@/styles/pages/Foruns/styles'

export default function ForunsPage() {
  const [foruns, setForuns] = useState<Forum[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarModalCriar, setMostrarModalCriar] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const carregarForuns = async () => {
    try {
      setLoading(true)
      const data = await forunsService.listarPublicos()
      setForuns(data || [])
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar fóruns.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarForuns()
  }, [])

  const filteredForuns = foruns.filter((forum) => {
    const search = searchTerm.toLowerCase()
    return (
      forum.nome.toLowerCase().includes(search) ||
      forum.descricao?.toLowerCase().includes(search) ||
      forum.assunto?.toLowerCase().includes(search)
    )
  })

  const handleForumClick = (forumId: string) => {
    navigate(`/foruns/${forumId}`)
  }

  return (
    <AuthenticatedLayout>
      <S.Container>
        <S.Header>
          <S.Title>Fóruns Públicos</S.Title>
          <S.NewForumButton onClick={() => setMostrarModalCriar(true)}>
            <span>+</span>
            Novo Fórum
          </S.NewForumButton>
        </S.Header>

        {erro && <S.Error>{erro}</S.Error>}

        <S.SearchBar>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar fóruns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </S.SearchBar>

        {loading ? (
          <S.Loading>Carregando fóruns...</S.Loading>
        ) : filteredForuns.length === 0 ? (
          <S.NoResults>
            <p>{searchTerm ? 'Nenhum fórum encontrado com esses termos.' : 'Nenhum fórum encontrado.'}</p>
            {!searchTerm && (
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Seja o primeiro a criar um fórum!
              </p>
            )}
          </S.NoResults>
        ) : (
          <S.ForumList>
            {filteredForuns.map((forum) => (
              <S.ForumCard
                key={forum._id}
                onClick={() => handleForumClick(forum._id)}
              >
                <S.CardHeader>
                  <S.CardTitle>{forum.nome}</S.CardTitle>
                  <S.BadgeContainer>
                    <S.Badge variant={forum.statusPrivacidade === 'PRIVADO' ? 'private' : 'public'}>
                      {forum.statusPrivacidade === 'PRIVADO' ? 'Privado' : 'Público'}
                    </S.Badge>
                  </S.BadgeContainer>
                </S.CardHeader>

                <S.CardDescription>
                  {forum.descricao || 'Sem descrição disponível.'}
                </S.CardDescription>

                <S.CardMeta>
                  {forum.assunto && (
                    <S.MetaItem>
                      <span><strong>Assunto:</strong> {forum.assunto}</span>
                    </S.MetaItem>
                  )}
                  {forum.criadoEm && (
                    <S.MetaItem>
                      <span>
                        Criado em {new Date(forum.criadoEm).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </S.MetaItem>
                  )}
                  {forum.palavrasChave && forum.palavrasChave.length > 0 && (
                    <S.MetaItem>
                      <span>
                        {forum.palavrasChave.slice(0, 3).map((tag, idx) => (
                          <span key={idx}>
                            {tag}
                            {idx < Math.min(forum.palavrasChave!.length - 1, 2) && ', '}
                          </span>
                        ))}
                        {forum.palavrasChave.length > 3 && '...'}
                      </span>
                    </S.MetaItem>
                  )}
                </S.CardMeta>
              </S.ForumCard>
            ))}
          </S.ForumList>
        )}

        <ModalCriarForum
          aberto={mostrarModalCriar}
          onFechar={() => setMostrarModalCriar(false)}
          onCriado={carregarForuns}
        />
      </S.Container>
    </AuthenticatedLayout>
  )
}