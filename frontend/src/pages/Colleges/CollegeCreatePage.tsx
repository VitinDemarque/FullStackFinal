import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'
import { collegesService } from '@services/colleges.service'
import type { College } from '@/types/index'
import styled from 'styled-components'
import { FaPlus, FaArrowLeft } from 'react-icons/fa'

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
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<{ name: string; acronym?: string; city?: string; state?: string }>({
    name: '',
    acronym: '',
    city: '',
    state: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      alert('Informe o nome da faculdade')
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

      alert('✅ Faculdade criada com sucesso!')
      navigate(`/profile/editar?newCollegeId=${created.id}`)
    } catch (err: any) {
      const message = err?.message || 'Erro ao criar faculdade'
      if (err?.statusCode === 403) {
        alert('Você não tem permissão para criar faculdades. Contate um administrador.')
      } else if (err?.statusCode === 409) {
        alert('Já existe uma faculdade com esse nome.')
      } else {
        alert(`❌ ${message}`)
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
          <Form onSubmit={handleSubmit}>
            <Inline>
              <FormGroup>
                <Label>Nome da faculdade</Label>
                <Input name="name" value={form.name} onChange={handleChange} placeholder="Ex.: Universidade XYZ" />
              </FormGroup>
            </Inline>
            <FormGroup>
              <Label>Sigla (opcional)</Label>
              <Input name="acronym" value={form.acronym} onChange={handleChange} placeholder="Ex.: USP" />
            </FormGroup>
            <FormGroup>
              <Label>Cidade (opcional)</Label>
              <Input name="city" value={form.city} onChange={handleChange} placeholder="Ex.: São Paulo" />
            </FormGroup>
            <FormGroup>
              <Label>Estado (UF) (opcional)</Label>
              <Input name="state" value={form.state} onChange={handleChange} placeholder="Ex.: SP" />
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
    </AuthenticatedLayout>
  )
}