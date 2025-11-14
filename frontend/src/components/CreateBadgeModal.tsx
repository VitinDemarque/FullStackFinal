import { useRef, useState, useEffect } from 'react'
import { badgesService, type Badge } from '@/services/badges.service'
import { useNotification } from '@/components/Notification'
import * as S from '@/styles/components/CreateExerciseModal/styles'
import { FaPlus } from 'react-icons/fa'

interface CreateBadgeModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: (badge: Badge) => void
  mode: 'triumphant' | 'highScore'
}

export default function CreateBadgeModal({ isOpen, onClose, onCreated, mode }: CreateBadgeModalProps) {
  const { addNotification } = useNotification()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [iconUrl, setIconUrl] = useState('')
  const [badgeRarity, setBadgeRarity] = useState<'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | undefined>(undefined)
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !description.trim() || !iconFile || !badgeRarity) {
      setFormError('Preencha todos os campos obrigatórios: Nome, Descrição, Ícone e Raridade.')
      return
    }
    setIsSubmitting(true)
    setFormError('')
    try {
      if (iconFile && !iconUrl) {
        const dataUrl = await fileToDataUrl(iconFile)
        setIconUrl(dataUrl)
      }
      const isTriumphant = mode === 'triumphant'
      const created = await badgesService.create({ 
        name, 
        description, 
        iconUrl: iconUrl || undefined, 
        isTriumphant: isTriumphant, 
        rarity: badgeRarity 
      })
      
      addNotification('Emblema criado com sucesso!', 'success')
      onCreated(created)
      handleClose()
    } catch (err: any) {
      if (err?.statusCode === 409) {
        const errorMessage = err?.message || 'Já existe um emblema com este nome. Por favor, escolha outro nome.'
        setFormError(errorMessage)
      } else {
        setFormError(err?.message || 'Erro ao criar emblema. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleClose() {
    setName('')
    setDescription('')
    setIconUrl('')
    setBadgeRarity(undefined)
    setIconFile(null)
    setIconPreview('')
    setFormError('')
    onClose()
  }

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    if (!file) return
    const isValid = ['image/png', 'image/jpeg'].includes(file.type)
    if (!isValid) {
      // ignorar tipos inválidos
      return
    }
    setIconFile(file)
    const url = URL.createObjectURL(file)
    setIconPreview(url)
    // converter para dataURL para enviar ao backend como iconUrl
    fileToDataUrl(file).then(setIconUrl).catch(() => {})
  }

  useEffect(() => {
    return () => {
      if (iconPreview) URL.revokeObjectURL(iconPreview)
    }
  }, [iconPreview])

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return (
    <S.Overlay onClick={handleClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
          <S.Header>
          <S.Title>{mode === 'triumphant' ? 'Criar Emblema Triunfante' : 'Criar Emblema de Maior Pontuação'}</S.Title>
          <S.CloseButton onClick={handleClose}>×</S.CloseButton>
        </S.Header>

        <S.Form onSubmit={handleSubmit}>
            <S.FieldGroup>
              <S.Label htmlFor="badgeName">Nome *</S.Label>
              <S.Input id="badgeName" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </S.FieldGroup>

            <S.FieldGroup>
              <S.Label htmlFor="badgeDescription">Descrição *</S.Label>
              <S.TextArea id="badgeDescription" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
            </S.FieldGroup>

          <S.Row>
            <S.FieldGroup>
              <S.Label>Ícone *</S.Label>
              <S.UploadArea type="button" onClick={openFilePicker} $hasImage={!!iconPreview} aria-label="Selecionar ícone" title="Selecionar ícone">
                {iconPreview ? (
                  <S.IconPreview src={iconPreview} alt="Pré-visualização do ícone" />
                ) : (
                  <FaPlus />
                )}
              </S.UploadArea>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: 'none' }}
                multiple={false}
                onChange={handleFileChange}
              />
              <S.UploadHint>Formatos: .jpg, .png — apenas 1 arquivo.</S.UploadHint>
            </S.FieldGroup>

            <S.FieldGroup>
              <S.Label htmlFor="badgeRarity">Raridade *</S.Label>
              <S.Select
                id="badgeRarity"
                value={badgeRarity ?? ''}
                onChange={(e) => {
                  const v = e.target.value
                  setBadgeRarity(v ? (v as 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY') : undefined)
                }}
              >
                <option value="">Selecione...</option>
                <option value="COMMON">Comum</option>
                <option value="RARE">Rara</option>
                <option value="EPIC">Épica</option>
                <option value="LEGENDARY">Lendária</option>
              </S.Select>
            </S.FieldGroup>

            {formError && (
              <S.FormAlert aria-live="polite">{formError}</S.FormAlert>
            )}
          </S.Row>

          <S.ButtonGroup>
            <S.CancelButton type="button" onClick={handleClose}>Cancelar</S.CancelButton>
            <S.SubmitButton type="submit" disabled={isSubmitting}>Criar</S.SubmitButton>
          </S.ButtonGroup>
        </S.Form>
      </S.Modal>
    </S.Overlay>
  )
}