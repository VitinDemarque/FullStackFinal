import { useState } from 'react'
import styled from 'styled-components'
import { forunsService } from '@/services/forum.services'

interface ModalCriarForumProps {
    aberto: boolean
    onFechar: () => void
    onCriado: () => void
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
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem;
    max-width: 100%;
  }
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`

const Alert = styled.div<{ variant: 'error' | 'success' }>`
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 1rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};

  ${props => props.variant === 'error' ? `
    background: ${props.theme.colors.danger.bg};
    color: ${props.theme.colors.danger.text};
    border: 1px solid ${props.theme.colors.red[400]};
  ` : `
    background: ${props.theme.colors.success.bg};
    color: ${props.theme.colors.success.text};
    border: 1px solid ${props.theme.colors.green[400]};
  `}
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
  min-width: 120px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${props => {
    if (props.variant === 'primary') {
      return `
        background: ${props.theme.gradients.primary};
        color: white;
        box-shadow: ${props.theme.shadows.md};

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: ${props.theme.shadows.lg};
        }
      `
    }
    if (props.variant === 'danger') {
      return `
        background: ${props.theme.colors.gray[200]};
        color: ${props.theme.colors.textPrimary};

        &:hover:not(:disabled) {
          background: ${props.theme.colors.gray[300]};
        }
      `
    }
    return `
      background: ${props.theme.colors.gray[200]};
      color: ${props.theme.colors.textPrimary};

      &:hover:not(:disabled) {
        background: ${props.theme.colors.gray[300]};
      }
    `
  }}
`

const SecondaryButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`

export default function ModalCriarForum({ aberto, onFechar, onCriado }: ModalCriarForumProps) {
    const [nome, setNome] = useState('')
    const [assunto, setAssunto] = useState('')
    const [descricao, setDescricao] = useState('')
    const [palavrasChave, setPalavrasChave] = useState('')
    const [privacidade, setPrivacidade] = useState<'PUBLICO' | 'PRIVADO'>('PUBLICO')
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState<string | null>(null)
    const [sucesso, setSucesso] = useState<string | null>(null)

    if (!aberto) return null

    const limparCampos = () => {
        setNome('')
        setAssunto('')
        setDescricao('')
        setPalavrasChave('')
        setPrivacidade('PUBLICO')
        setErro(null)
        setSucesso(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
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

            await forunsService.criar(payload)
            setSucesso('Fórum criado com sucesso!')
            limparCampos()
            onCriado()

            setTimeout(() => {
                setSucesso(null)
                onFechar()
            }, 2000)

        } catch (err: any) {
            setErro(err.message || 'Erro ao criar fórum.')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        if (!loading) {
            limparCampos()
            onFechar()
        }
    }

    return (
        <ModalOverlay onClick={handleClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>Criar Novo Fórum</ModalTitle>
                    <CloseButton onClick={handleClose} disabled={loading}>
                        ×
                    </CloseButton>
                </ModalHeader>

                {erro && <Alert variant="error">{erro}</Alert>}
                {sucesso && <Alert variant="success">{sucesso}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Nome do Fórum *</Label>
                        <Input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Digite o nome do fórum"
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
                            placeholder="Ex: Desenvolvimento Web, Backend, Frontend..."
                            required
                            disabled={loading}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Descrição</Label>
                        <Textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Descreva o propósito e tema deste fórum..."
                            rows={4}
                            disabled={loading}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Palavras-chave</Label>
                        <Input
                            type="text"
                            placeholder="Ex: react, backend, javascript (separadas por vírgula)"
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
                            <option value="PUBLICO">Público - Qualquer um pode ver e participar</option>
                            <option value="PRIVADO">Privado - Apenas membros podem ver e participar</option>
                        </Select>
                    </FormGroup>

                    <ButtonGroup>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={limparCampos}
                            disabled={loading}
                        >
                            Limpar
                        </Button>

                        <SecondaryButtonGroup>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                            >
                                {loading ? 'Criando...' : 'Criar Fórum'}
                            </Button>
                        </SecondaryButtonGroup>
                    </ButtonGroup>
                </Form>
            </ModalContent>
        </ModalOverlay>
    )
}