import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { collegesService } from '@services/colleges.service'
import type { College } from '@/types'
import { brUniversitiesService } from '@services/brUniversities.service'

interface CreateCollegeModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: (college: College) => void
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`

const Modal = styled.div`
  background: var(--color-surface);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  color: var(--color-text-primary);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: var(--color-text-light);
  cursor: pointer;
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
  padding: 0.65rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: var(--color-text-primary);
`

// Dropdown de sugestões ancorado ao campo de nome
const FieldWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

const BRSuggestions = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: var(--shadow-md);
  max-height: 240px;
  overflow-y: auto;
  z-index: 1100;
  margin: 0;
  padding: 8px;
  list-style: none;
`

const BRItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  color: var(--color-text-primary);

  &:hover { background: var(--color-surface-hover); }
`

const Footer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.65rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--color-surface-hover);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const Alert = styled.div<{ type: 'error' | 'success' }>`
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  border: 1px solid var(--color-border);
  color: ${({ type }) => (type === 'error' ? 'var(--color-danger-text)' : 'var(--color-success-text)')};
  background: ${({ type }) => (type === 'error' ? 'var(--color-danger-bg)' : 'var(--color-success-bg)')};
`

export default function CreateCollegeModal({ isOpen, onClose, onCreated }: CreateCollegeModalProps) {
  const [name, setName] = useState('')
  const [acronym, setAcronym] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [brOpen, setBrOpen] = useState(false)
  const [brFocused, setBrFocused] = useState(false)
  const [brResults, setBrResults] = useState<Array<{ id: string; name: string; acronym?: string; city?: string; state?: string }>>([])
  const debounceRef = useRef<number | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const created = await collegesService.create({ name: name.trim(), acronym: acronym.trim() || undefined, city: city.trim() || undefined, state: state.trim() || undefined })
      setSuccess('Faculdade criada com sucesso!')
      onCreated(created)
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Erro ao criar faculdade')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) onClose()
  }

  // Busca inicial
  useEffect(() => {
    if (!isOpen) return
    let active = true
    brUniversitiesService.search('', 10).then(res => {
      if (!active) return
      setBrResults(res.items)
    })
    return () => { active = false }
  }, [isOpen])

  // Busca com debounce usando nome
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(async () => {
      const res = await brUniversitiesService.search(name, 10)
      setBrResults(res.items)
      setBrOpen(brFocused)
    }, 250)
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [name, brFocused])

  // Fecha sugestões ao clicar fora do campo
  useEffect(() => {
    function handleDocClick(ev: MouseEvent | TouchEvent) {
      const el = wrapperRef.current
      if (!el) return
      const target = ev.target as Node | null
      if (target && !el.contains(target)) {
        setBrOpen(false)
        setBrFocused(false)
      }
    }
    document.addEventListener('mousedown', handleDocClick)
    document.addEventListener('touchstart', handleDocClick)
    return () => {
      document.removeEventListener('mousedown', handleDocClick)
      document.removeEventListener('touchstart', handleDocClick)
    }
  }, [])

  return isOpen ? (
    <Overlay onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Criar Faculdade</Title>
          <CloseButton onClick={handleClose} aria-label="Fechar">×</CloseButton>
        </Header>

        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        <Form onSubmit={handleSubmit} autoComplete="off">
          <FormGroup>
            <Label>Nome *</Label>
            <FieldWrapper ref={wrapperRef}>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => { setBrFocused(true); setBrOpen(true) }}
                placeholder="Ex: Universidade de Exemplo"
                required
                disabled={loading}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              {brOpen && (
                <BRSuggestions>
                  {brResults.map(u => (
                    <BRItem key={u.id} onClick={() => {
                      setName(u.name)
                      setAcronym(u.acronym || '')
                      setCity(u.city || '')
                      setState(u.state || '')
                      setBrOpen(false)
                    }}>
                      <span>{u.name}{u.acronym ? ` (${u.acronym})` : ''}</span>
                      {(u.city || u.state) && (
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                          {[u.city, u.state].filter(Boolean).join(' / ')}
                        </span>
                      )}
                    </BRItem>
                  ))}
                </BRSuggestions>
              )}
            </FieldWrapper>
          </FormGroup>
          <FormGroup>
            <Label>Sigla</Label>
            <Input value={acronym} onChange={(e) => setAcronym(e.target.value)} placeholder="Ex: UEX" disabled={loading} autoComplete="off" autoCorrect="off" spellCheck={false} />
          </FormGroup>
          <FormGroup>
            <Label>Cidade</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex: São Paulo" disabled={loading} autoComplete="off" autoCorrect="off" spellCheck={false} />
          </FormGroup>
          <FormGroup>
            <Label>Estado</Label>
            <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="Ex: SP" disabled={loading} autoComplete="off" autoCorrect="off" spellCheck={false} />
          </FormGroup>

          <Footer>
            <Button type="button" onClick={handleClose} disabled={loading}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading || !name.trim()}>
              {loading ? 'Criando...' : 'Criar'}
            </Button>
          </Footer>
        </Form>
      </Modal>
    </Overlay>
  ) : null
}