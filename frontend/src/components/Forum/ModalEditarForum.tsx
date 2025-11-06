import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { forunsService } from '@/services/forum.services'
import type { Forum } from '@/types/forum'

interface ModalEditarForumProps {
  aberto: boolean
  forum: Forum | null
  onFechar: () => void
  onAtualizado: (forum: Forum) => void
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`

const ModalContent = styled.div`
  background: var(--color-surface);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.75rem;
  position: relative;
  color: var(--color-text-primary);
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: var(--color-text-primary);
  margin: 0;
`

const CloseButton = styled.button`
  background: transparent;
  border: 1px solid var(--color-border);
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: var(--color-text-secondary);
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: var(--color-text-secondary);
`

const Input = styled.input`
  padding: 0.7rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: var(--color-text-primary);
`

const Textarea = styled.textarea`
  padding: 0.7rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: var(--color-text-primary);
  min-height: 100px;
  resize: vertical;
`

const Select = styled.select`
  padding: 0.7rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: var(--color-text-primary);
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.6rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: none;
  background: var(--color-surface);
  color: var(--color-text-primary);

  ${(props) => props.variant === 'primary' ? `
    background: var(--color-blue-500);
    color: white;
    border-color: var(--color-blue-500);
  ` : ''}
`

const Alert = styled.div<{ type: 'error' | 'success' }>`
  padding: 0.6rem 0.8rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: 0.75rem;

  ${(props) => props.type === 'error' ? `
    background: var(--color-danger-bg);
    color: var(--color-danger-text);
    border: 1px solid var(--color-red-400);
  ` : `
    background: var(--color-success-bg);
    color: var(--color-success-text);
    border: 1px solid var(--color-green-400);
  `}
`

export default function ModalEditarForum({ aberto, forum, onFechar, onAtualizado }: ModalEditarForumProps) {
  const [nome, setNome] = useState('')
  const [assunto, setAssunto] = useState('')
  const [descricao, setDescricao] = useState('')
  const [palavrasChave, setPalavrasChave] = useState('')
  const [privacidade, setPrivacidade] = useState<'PUBLICO' | 'PRIVADO'>('PUBLICO')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  useEffect(() => {
    if (forum) {
      setNome(forum.nome || '')
      setAssunto(forum.assunto || '')
      setDescricao(forum.descricao || '')
      setPalavrasChave((forum.palavrasChave || []).join(', '))
      setPrivacidade(forum.statusPrivacidade || 'PUBLICO')
    }
  }, [forum])

  if (!aberto) return null

  const handleClose = () => {
    if (!loading) onFechar()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forum) return
    setErro(null)
    setSucesso(null)
    try {
      setLoading(true)
      const payload = {
        nome,
        assunto,
        descricao,
        palavrasChave: palavrasChave.split(',').map(p => p.trim()).filter(Boolean),
        statusPrivacidade: privacidade,
      }
      const atualizado = await forunsService.atualizar(forum._id, payload)
      setSucesso('Fórum atualizado com sucesso!')
      onAtualizado(atualizado)
      setTimeout(() => {
        onFechar()
      }, 800)
    } catch (err: any) {
      setErro(err?.message || 'Erro ao atualizar fórum.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Editar Fórum</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        {erro && <Alert type="error">{erro}</Alert>}
        {sucesso && <Alert type="success">{sucesso}</Alert>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nome *</Label>
            <Input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label>Assunto *</Label>
            <Input
              type="text"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label>Descrição</Label>
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label>Palavras-chave</Label>
            <Input
              type="text"
              placeholder="react, backend, javascript"
              value={palavrasChave}
              onChange={(e) => setPalavrasChave(e.target.value)}
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label>Privacidade</Label>
            <Select
              value={privacidade}
              onChange={(e) => setPrivacidade(e.target.value as 'PUBLICO' | 'PRIVADO')}
              disabled={loading}
            >
              <option value="PUBLICO">Público</option>
              <option value="PRIVADO">Privado</option>
            </Select>
          </FormGroup>

          <Footer>
            <Button type="button" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </Footer>
        </Form>
      </ModalContent>
    </ModalOverlay>
  )
}