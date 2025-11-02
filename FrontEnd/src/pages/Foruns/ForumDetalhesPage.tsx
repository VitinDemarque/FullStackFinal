import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout'
import { forunsService } from '@/services/forum.services'
import { userService } from '@/services/user.service'
import type { Forum } from '@/types/forum'
import type { User } from '@/types/index'
import * as S from '@/styles/pages/Foruns/styles'

interface UserBasic {
    _id: string
    name: string
}

function toUserBasic(u: User): UserBasic | null {
    const maybeId = (u as any)._id ?? (u as any).id ?? (u as any).userId
    const maybeName = (u as any).name ?? (u as any).nome ?? (u as any).handle
    if (!maybeId || !maybeName) return null
    return { _id: String(maybeId), name: String(maybeName) }
}

export default function ForumDetalhesPage() {
    const params = useParams<{ id?: string }>()
    const id = params.id
    const navigate = useNavigate()

    const [forum, setForum] = useState<Forum | null>(null)
    const [dono, setDono] = useState<UserBasic | null>(null)
    const [moderadores, setModeradores] = useState<UserBasic[]>([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        const carregarForum = async () => {
            if (!id) {
                setErro('ID do fórum não informado.')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const data = await forunsService.getById(id)
                setForum(data)

                const donoId = data.donoUsuarioId ?? data.criadoPor ?? null
                if (donoId && typeof donoId === 'string') {
                    try {
                        const donoUser = await userService.getById(donoId)
                        const normalized = toUserBasic(donoUser)
                        if (normalized) setDono(normalized)
                    } catch (err) {
                        // Erro ao buscar dono é ignorado
                    }
                }

                const moderadoresRaw = data.moderadores ?? []
                if (moderadoresRaw.length > 0) {
                    const promises = moderadoresRaw.map(async (m: any) => {
                        const userId = m?.usuarioId ?? m?._id ?? m ?? null
                        if (!userId) return null
                        try {
                            const u = await userService.getById(String(userId))
                            return toUserBasic(u)
                        } catch (err) {
                            return null
                        }
                    })

                    const modsResolved = await Promise.all(promises)
                    const modsFiltered = modsResolved.filter((x): x is UserBasic => x !== null)
                    setModeradores(modsFiltered)
                } else {
                    setModeradores([])
                }
            } catch (err: any) {
                setErro(err.message || 'Erro ao carregar fórum.')
            } finally {
                setLoading(false)
            }
        }

        carregarForum()
    }, [id])

    return (
        <AuthenticatedLayout>
            <S.Container>
                <S.BackButton to="/foruns">
                    <span>←</span>
                    Voltar para Fóruns
                </S.BackButton>

                {loading && <S.Loading>Carregando fórum...</S.Loading>}

                {erro && <S.Error>{erro}</S.Error>}

                {forum && (
                    <S.DetailContainer>
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                <S.DetailTitle>{forum.nome}</S.DetailTitle>
                                <S.Badge variant={forum.statusPrivacidade === 'PRIVADO' ? 'private' : 'public'}>
                                    {forum.statusPrivacidade === 'PRIVADO' ? 'Privado' : 'Público'}
                                </S.Badge>
                            </div>

                            {forum.assunto && (
                                <S.DetailText>
                                    <S.DetailLabel>Assunto: </S.DetailLabel>
                                    {forum.assunto}
                                </S.DetailText>
                            )}
                        </div>

                        {forum.descricao && (
                            <S.DetailSection>
                                <S.DetailSectionTitle>Descrição</S.DetailSectionTitle>
                                <S.DetailText>{forum.descricao}</S.DetailText>
                            </S.DetailSection>
                        )}

                        {forum.palavrasChave && forum.palavrasChave.length > 0 && (
                            <S.DetailSection>
                                <S.DetailSectionTitle>Palavras-chave</S.DetailSectionTitle>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {forum.palavrasChave.map((tag, idx) => (
                                        <S.Badge key={idx} variant="public" style={{ fontSize: '0.875rem' }}>
                                            {tag}
                                        </S.Badge>
                                    ))}
                                </div>
                            </S.DetailSection>
                        )}

                        <S.DetailSection>
                            <S.DetailSectionTitle>Informações</S.DetailSectionTitle>
                            <S.DetailText>
                                <S.DetailLabel>Dono: </S.DetailLabel>
                                {dono ? dono.name : forum.donoUsuarioId ?? 'Desconhecido'}
                            </S.DetailText>
                            {forum.criadoEm && (
                                <S.DetailText>
                                    <S.DetailLabel>Data de criação: </S.DetailLabel>
                                    {new Date(forum.criadoEm).toLocaleString('pt-BR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </S.DetailText>
                            )}
                            {forum.ultimaAtividade && (
                                <S.DetailText>
                                    <S.DetailLabel>Última atividade: </S.DetailLabel>
                                    {new Date(forum.ultimaAtividade).toLocaleString('pt-BR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </S.DetailText>
                            )}
                            <S.DetailText>
                                <S.DetailLabel>Privacidade: </S.DetailLabel>
                                {forum.statusPrivacidade === 'PRIVADO' ? 'Privado' : 'Público'}
                            </S.DetailText>
                        </S.DetailSection>

                        {moderadores.length > 0 && (
                            <S.DetailSection>
                                <S.DetailSectionTitle>Moderadores ({moderadores.length})</S.DetailSectionTitle>
                                <S.ModeratorList>
                                    {moderadores.map((mod) => (
                                        <S.ModeratorItem key={mod._id}>
                                            {mod.name}
                                        </S.ModeratorItem>
                                    ))}
                                </S.ModeratorList>
                            </S.DetailSection>
                        )}

                        {moderadores.length === 0 && (
                            <S.DetailSection>
                                <S.DetailSectionTitle>Moderadores</S.DetailSectionTitle>
                                <S.DetailText style={{ fontStyle: 'italic', color: '#999' }}>
                                    Nenhum moderador cadastrado.
                                </S.DetailText>
                            </S.DetailSection>
                        )}

                        <S.DetailSection style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px dashed #e5e7eb' }}>
                            <S.DetailText style={{ fontStyle: 'italic', color: '#999', textAlign: 'center' }}>
                                Em breve: tópicos e discussões deste fórum estarão disponíveis aqui.
                            </S.DetailText>
                        </S.DetailSection>
                    </S.DetailContainer>
                )}
            </S.Container>
        </AuthenticatedLayout>
    )
}