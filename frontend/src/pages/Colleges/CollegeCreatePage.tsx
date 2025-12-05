import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'
import { collegesService } from '@services/colleges.service'
import type { College } from '@/types/index'
import styled from 'styled-components'
import { brUniversitiesService } from '@services/brUniversities.service'
import { FaPlus, FaArrowLeft } from 'react-icons/fa'
import { useNotification } from '@components/Notification'

const PageContainer = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 24px;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const Title = styled.h1`
  color: var(--text-primary);
  font-size: clamp(1.4rem, 2.5vw, 1.8rem);
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 10px;
`

const Card = styled.section`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  padding: 20px;
`

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--surface-hover);
    color: var(--text-primary);
    transform: translateY(-1px);
  }
`

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const FieldWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const BRSuggestions = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  width: 100%;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  max-height: 280px;
  overflow-y: auto;
  z-index: 1000;
  margin: 0;
  padding: 8px;
  list-style: none;
  opacity: 1;
  backdrop-filter: none;
`

const BRItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 0.95rem;
  background: var(--color-surface, #ffffff);

  &:hover { background: var(--surface-hover); }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Inline = styled.div`
  grid-column: 1 / -1;
`

const Label = styled.label`
  color: var(--text-secondary);
  font-weight: 600;
`

const Input = styled.input`
  background: var(--color-gray-200);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

  &::placeholder {
    color: var(--color-text-light);
  }

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  .dark & {
    background: var(--color-gray-800);
  }
`

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--gradient-green);
  color: #fff;
  border: 1px solid var(--color-green-500);
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
`

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: var(--surface-hover);
    color: var(--text-primary);
    transform: translateY(-1px);
  }
`

export default function CollegeCreatePage() {
  const navigate = useNavigate()
  const { addNotification, NotificationContainer } = useNotification()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<{ name: string; acronym?: string; city?: string; state?: string }>({
    name: '',
    acronym: '',
    city: '',
    state: '',
  })

  const [brOpen, setBrOpen] = useState(false)
  const [brFocused, setBrFocused] = useState(false)
  const [brResults, setBrResults] = useState<Array<{ id: string; name: string; acronym?: string; city?: string; state?: string }>>([])
  const debounceRef = React.useRef<number | null>(null)
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    let active = true
    brUniversitiesService.search('', 10).then(res => {
      if (!active) return
      setBrResults(res.items)
    })
    return () => { active = false }
  }, [])

  React.useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(async () => {
      const res = await brUniversitiesService.search(form.name, 10)
      setBrResults(res.items)
      setBrOpen(brFocused)
    }, 250)
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [form.name, brFocused])

  // Fecha ao clicar fora
  React.useEffect(() => {
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      addNotification('Informe o nome da faculdade', 'warning', 4000)
      return
    }
    setLoading(true)
    try {
      const created: College = await collegesService.create({
        name: form.name.trim(),
        acronym: form.acronym?.trim() || undefined,
        city: form.city?.trim() || undefined,
        state: form.state?.trim() || undefined,
      })

      addNotification('Faculdade criada com sucesso!', 'success', 4000)
      setTimeout(() => navigate(`/profile/editar?newCollegeId=${created.id}`), 1000)
    } catch (err: any) {
      const message = err?.message || 'Erro ao criar faculdade'
      if (err?.statusCode === 403) {
        addNotification('Você não tem permissão para criar faculdades. Contate um administrador.', 'error', 5000)
      } else if (err?.statusCode === 409) {
        addNotification('Já existe uma faculdade com esse nome.', 'error', 5000)
      } else {
        addNotification(message, 'error', 5000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthenticatedLayout>
      <PageContainer>
        <Header>
          <BackLink onClick={() => navigate('/profile/editar')}>
            <FaArrowLeft /> Voltar
          </BackLink>
          <Title>
            <FaPlus /> Nova Faculdade
          </Title>
        </Header>

        <Card>
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Inline>
              <FieldWrapper ref={wrapperRef}>
                <Label>Nome da faculdade</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => { setBrFocused(true); setBrOpen(true) }}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="Ex.: Universidade XYZ"
                />
                {brOpen && (
                  <BRSuggestions>
                    {brResults.map(u => (
                      <BRItem key={u.id} onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          name: u.name,
                          acronym: u.acronym || '',
                          city: u.city || '',
                          state: u.state || '',
                        }))
                        setBrOpen(false)
                      }}>
                        <span>{u.name}{u.acronym ? ` (${u.acronym})` : ''}</span>
                        {(u.city || u.state) && (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            {[u.city, u.state].filter(Boolean).join(' / ')}
                          </span>
                        )}
                      </BRItem>
                    ))}
                  </BRSuggestions>
                )}
              </FieldWrapper>
            </Inline>
            <FormGroup>
              <Label>Sigla (opcional)</Label>
              <Input name="acronym" value={form.acronym} onChange={handleChange} placeholder="Ex.: USP" autoComplete="off" autoCorrect="off" spellCheck={false} />
            </FormGroup>
            <FormGroup>
              <Label>Cidade (opcional)</Label>
              <Input name="city" value={form.city} onChange={handleChange} placeholder="Ex.: São Paulo" autoComplete="off" autoCorrect="off" spellCheck={false} />
            </FormGroup>
            <FormGroup>
              <Label>Estado (UF) (opcional)</Label>
              <Input name="state" value={form.state} onChange={handleChange} placeholder="Ex.: SP" autoComplete="off" autoCorrect="off" spellCheck={false} />
            </FormGroup>

            <Inline>
              <Actions>
                <PrimaryButton type="submit" disabled={loading}>
                  <FaPlus /> {loading ? 'Criando...' : 'Criar faculdade'}
                </PrimaryButton>
                <SecondaryButton type="button" onClick={() => navigate('/profile/editar')}>Cancelar</SecondaryButton>
              </Actions>
            </Inline>
          </Form>
        </Card>
      </PageContainer>
      <NotificationContainer />
    </AuthenticatedLayout>
  )
}