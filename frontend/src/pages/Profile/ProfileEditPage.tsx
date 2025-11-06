import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'
import { useAuth } from '@contexts/AuthContext'
import { collegesService } from '@services/colleges.service'
import { apiRequest } from '@services/api'
import type { College } from '@/types/index'
import { FaArrowLeft, FaSave, FaUserEdit, FaKey, FaPlus } from 'react-icons/fa'
import styled from 'styled-components'

const PageContainer = styled.div`
  max-width: 960px;
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
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  position: relative;
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

const Card = styled.section`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  padding: 20px;
  margin-bottom: 20px;
`

const SectionTitle = styled.h2`
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 12px 0;
`

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const Select = styled.select`
  background: var(--color-gray-200);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

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

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-red-600);
  color: #fff;
  border: 1px solid var(--color-red-600);
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-red-700);
    border-color: var(--color-red-700);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
`

const HelpText = styled.small`
  color: var(--text-light);
`

const ErrorText = styled.small`
  color: var(--color-red-600);
  font-weight: 600;
`

const Inline = styled.div`
  grid-column: 1 / -1;
`

const InlineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid var(--color-blue-500);
  background: var(--color-blue-500);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.35);

  &:hover {
    background: var(--color-blue-600);
    border-color: var(--color-blue-600);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.45);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35);
  }
`

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const [newCollegeId, setNewCollegeId] = useState<string | null>(null)
  const { user, updateUser } = useAuth()

  const [loading, setLoading] = useState(false)
  const [colleges, setColleges] = useState<College[]>([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    collegeId: '' as string | '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        collegeId: user.collegeId || '',
      }))
    }

    // Detectar newCollegeId via query string
    try {
      const params = new URLSearchParams(window.location.search)
      const createdId = params.get('newCollegeId')
      if (createdId) {
        setNewCollegeId(createdId)
      }
    } catch {}

    // carregar faculdades
    collegesService.getAll(1, 100)
      .then((res) => {
        setColleges(res.items)
        if (newCollegeId) {
          setForm((prev) => ({ ...prev, collegeId: newCollegeId }))
        }
      })
      .catch(() => setColleges([]))
  }, [user?.id, newCollegeId])

  const canSubmitProfile = useMemo(() => {
    const isChangingPassword = !!form.currentPassword || !!form.newPassword || !!form.confirmNewPassword
    const passwordsValid = !isChangingPassword || (
      !!form.currentPassword && !!form.newPassword && form.newPassword === form.confirmNewPassword
    )
    const basicsValid = !!form.name && !!form.email
    return basicsValid && passwordsValid
  }, [form.name, form.email, form.currentPassword, form.newPassword, form.confirmNewPassword])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    try {
      // Atualizar dados básicos
      const payload: any = {
        name: form.name,
        email: form.email,
        collegeId: form.collegeId || null,
      }

      const updated = await apiRequest<any>('PATCH', '/users/me', payload)
      if (updated) {
        updateUser(updated)
      }

      // Alterar senha se informada
      if (form.currentPassword || form.newPassword || form.confirmNewPassword) {
        if (!form.currentPassword || !form.newPassword || !form.confirmNewPassword) {
          alert('❌ Para alterar a senha, preencha os três campos: senha atual, nova senha e confirmação.')
          setLoading(false)
          return
        }
        if (form.newPassword !== form.confirmNewPassword) {
          alert('❌ As novas senhas não coincidem. Verifique e tente novamente.')
          setLoading(false)
          return
        }
        await apiRequest<any>('POST', '/users/me/password', {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        })
      }

      alert('✅ Perfil atualizado com sucesso!')
      navigate('/profile')
    } catch (error: any) {
      alert(`❌ Erro ao atualizar perfil: ${error?.message || 'Tente novamente'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthenticatedLayout>
      <PageContainer>
        <Header>
          <BackLink onClick={() => navigate('/profile')}>
            <FaArrowLeft /> Voltar
          </BackLink>
          <Title><FaUserEdit /> Editar Perfil</Title>
        </Header>

        <Card>
          <SectionTitle>Informações Pessoais</SectionTitle>
          <Form onSubmit={handleSubmit}>
            <Inline>
              <FormGroup>
                <Label>Nome</Label>
                <Input name="name" value={form.name} onChange={handleChange} placeholder="Seu nome" />
              </FormGroup>
            </Inline>

            <Inline>
              <FormGroup>
                <Label>Email</Label>
                <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Seu email" />
              </FormGroup>
            </Inline>

            {/* Campo de apelido removido conforme solicitado */}

            <Inline>
              <FormGroup>
                <Label>Faculdade</Label>
                <InlineRow>
                  <Select name="collegeId" value={form.collegeId} onChange={handleChange}>
                    <option value="">Selecionar...</option>
                    {colleges.map((c) => {
                      const acronym = c.acronym?.trim()
                      const hasAcronymInName = acronym
                        ? (c.name || '').toLowerCase().includes(`(${acronym.toLowerCase()})`)
                        : false
                      const displayName = hasAcronymInName
                        ? c.name
                        : `${c.name}${acronym ? ` (${acronym})` : ''}`
                      return (
                        <option key={c.id} value={c.id}>
                          {displayName}
                        </option>
                      )
                    })}
                  </Select>
                  <IconButton type="button" aria-label="Cadastrar nova faculdade" title="Cadastrar nova faculdade" onClick={() => navigate('/faculdades/criar')}>
                    <FaPlus />
                  </IconButton>
                </InlineRow>
                <HelpText>Opcional: altere sua instituição de ensino.</HelpText>
              </FormGroup>
            </Inline>

            <Inline>
              <SectionTitle><FaKey /> Alterar Senha</SectionTitle>
            </Inline>

            <Inline>
              <FormGroup>
                <Label>Senha atual</Label>
                <Input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} placeholder="Informe sua senha atual" />
              </FormGroup>
            </Inline>

            <Inline>
              <FormGroup>
                <Label>Nova senha</Label>
                <Input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="Escolha uma nova senha" />
              </FormGroup>
            </Inline>

            <Inline>
              <FormGroup>
                <Label>Confirmar nova senha</Label>
                <Input
                  type="password"
                  name="confirmNewPassword"
                  value={form.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Confirme a nova senha"
                  aria-invalid={form.newPassword && form.confirmNewPassword && form.newPassword !== form.confirmNewPassword ? true : undefined}
                />
                {form.newPassword && form.confirmNewPassword && form.newPassword !== form.confirmNewPassword && (
                  <ErrorText role="alert">As novas senhas não coincidem.</ErrorText>
                )}
              </FormGroup>
            </Inline>

            <Inline>
              <Actions>
                <PrimaryButton type="submit" disabled={loading || !canSubmitProfile}>
                  <FaSave /> {loading ? 'Salvando...' : 'Salvar alterações'}
                </PrimaryButton>
                <SecondaryButton type="button" onClick={() => navigate('/profile')}>Cancelar</SecondaryButton>
              </Actions>
            </Inline>
          </Form>
        </Card>
      </PageContainer>
    </AuthenticatedLayout>
  )
}