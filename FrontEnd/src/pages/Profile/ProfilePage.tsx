import { useEffect, useState } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { useAsync } from '@hooks/useAsync'
import { userService } from '@services/user.service'
import { api } from '@services/api'
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'
import { FaUser, FaTrophy, FaStar, FaMedal, FaAward, FaEdit, FaLock } from 'react-icons/fa'
import './ProfilePage.css'

interface Badge {
  _id: string
  name: string
  description: string
  icon?: string
  type: 'gold' | 'silver' | 'bronze' | 'special'
  earned?: boolean
  requirement?: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { data: scoreboard, loading, execute } = useAsync(
    () => userService.getScoreboard(user!.id),
    false
  )

  const [allBadges, setAllBadges] = useState<Badge[]>([])
  const [userBadges, setUserBadges] = useState<string[]>([])
  const [loadingBadges, setLoadingBadges] = useState(true)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)

  useEffect(() => {
    if (user) {
      execute()
      loadBadges()
      // Carregar foto de perfil se existir
      if (user.profileImage) {
        setProfileImage(user.profileImage)
      }
    }
  }, [user, execute])

  async function loadBadges() {
    try {
      setLoadingBadges(true)
      
      // Buscar todas as badges disponíveis
      const badgesResponse = await api.get('/badges')
      const allBadgesData = badgesResponse.data.data || badgesResponse.data
      
      // Buscar badges do usuário
      const userBadgesResponse = await api.get(`/users/${user?.id}/badges`)
      const userBadgesData = userBadgesResponse.data.data || userBadgesResponse.data || []
      
      // Extrair IDs das badges conquistadas
      const earnedBadgeIds = userBadgesData.map((ub: any) => 
        typeof ub.badge === 'string' ? ub.badge : ub.badge?._id
      )
      
      setAllBadges(allBadgesData)
      setUserBadges(earnedBadgeIds)
    } catch (error) {
      console.error('Erro ao carregar badges:', error)
      // Se der erro, criar badges mock para demonstração
      setAllBadges(createMockBadges())
      setUserBadges([])
    } finally {
      setLoadingBadges(false)
    }
  }

  function createMockBadges(): Badge[] {
    return [
      { _id: '1', name: 'Primeiro Desafio', description: 'Complete seu primeiro desafio', type: 'bronze', requirement: '1 desafio' },
      { _id: '2', name: '10 Desafios', description: 'Complete 10 desafios', type: 'silver', requirement: '10 desafios' },
      { _id: '3', name: '50 Desafios', description: 'Complete 50 desafios', type: 'bronze', requirement: '50 desafios' },
      { _id: '4', name: 'Streak 7 dias', description: 'Pratique 7 dias seguidos', type: 'special', requirement: '7 dias consecutivos' },
      { _id: '5', name: '100 Desafios', description: 'Complete 100 desafios', type: 'bronze', requirement: '100 desafios' },
      { _id: '6', name: 'Mestre Python', description: 'Domine Python', type: 'gold', requirement: '50 desafios Python' },
      { _id: '7', name: 'JavaScript Pro', description: 'Expert em JavaScript', type: 'silver', requirement: '50 desafios JS' },
      { _id: '8', name: '500 XP', description: 'Alcance 500 XP', type: 'bronze', requirement: '500 XP' },
      { _id: '9', name: 'Top 100', description: 'Entre no top 100', type: 'special', requirement: 'Top 100 ranking' },
      { _id: '10', name: '1000 XP', description: 'Alcance 1000 XP', type: 'silver', requirement: '1000 XP' },
      { _id: '11', name: 'Speed Runner', description: 'Complete em tempo recorde', type: 'gold', requirement: 'Tempo < 5min' },
      { _id: '12', name: 'Perfect Score', description: 'Nota 100% em desafio', type: 'silver', requirement: '100% score' },
      { _id: '13', name: 'Code Master', description: 'Domine as estruturas', type: 'bronze', requirement: '30 desafios' },
      { _id: '14', name: 'Team Player', description: 'Participe de grupos', type: 'bronze', requirement: 'Entre em 1 grupo' },
      { _id: '15', name: 'Bug Hunter', description: 'Encontre e corrija bugs', type: 'bronze', requirement: '10 bugs corrigidos' },
      { _id: '16', name: 'Algorithm Expert', description: 'Expert em algoritmos', type: 'silver', requirement: '20 algoritmos' },
      { _id: '17', name: 'Database Guru', description: 'Mestre em bancos de dados', type: 'bronze', requirement: '15 BD desafios' },
      { _id: '18', name: 'API Master', description: 'Expert em APIs', type: 'gold', requirement: '25 APIs criadas' },
    ]
  }

  const topBadges = allBadges
    .filter(badge => userBadges.includes(badge._id) && badge.type === 'gold')
    .slice(0, 3)

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida')
      return
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB')
      return
    }

    try {
      setUploadingImage(true)

      // Criar preview local
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload para o backend
      const formData = new FormData()
      formData.append('profileImage', file)

      await api.patch(`/users/${user?.id}/profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      alert('Foto de perfil atualizada com sucesso!')
      setShowImageUpload(false)
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error)
      alert('Erro ao fazer upload. A imagem foi salva localmente.')
    } finally {
      setUploadingImage(false)
    }
  }

  function handleRemoveImage() {
    if (confirm('Tem certeza que deseja remover sua foto de perfil?')) {
      setProfileImage(null)
      // Aqui você pode adicionar chamada à API para remover do backend
      api.delete(`/users/${user?.id}/profile-image`).catch(err => {
        console.error('Erro ao remover imagem:', err)
      })
    }
  }

  if (!user) return null

  const xpPercent = ((user.xp || 0) / 800) * 100
  const hasAnyBadge = userBadges.length > 0

  return (
    <AuthenticatedLayout>
      <div className="profile-page">
        {/* Hero Section */}
        <div className="profile-hero">
          <button className="btn-edit-profile" onClick={() => setShowImageUpload(!showImageUpload)}>
            <FaEdit /> Editar Perfil
          </button>

          {/* Avatar com Upload */}
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {profileImage ? (
                <img src={profileImage} alt="Perfil" className="avatar-image" />
              ) : (
                <FaUser />
              )}
            </div>
            <button 
              className="avatar-edit-button" 
              onClick={() => document.getElementById('avatar-input')?.click()}
              title="Alterar foto"
            >
              <FaEdit />
            </button>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
          </div>

          {/* Upload Options */}
          {showImageUpload && (
            <div className="image-upload-options">
              <button 
                className="btn-upload"
                onClick={() => document.getElementById('avatar-input')?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? 'Enviando...' : '📷 Escolher Foto'}
              </button>
              {profileImage && (
                <button 
                  className="btn-remove"
                  onClick={handleRemoveImage}
                >
                  🗑️ Remover Foto
                </button>
              )}
            </div>
          )}

          {/* User Info */}
          <h1 className="profile-name">{user.name}</h1>
          
          {/* Badge Icon */}
          <div className="profile-badge-icon">
            <FaMedal />
          </div>

          {/* Level and XP */}
          <div className="profile-stats">
            <div className="stat-item">
              <p className="stat-label">Nível</p>
              <p className="stat-value">{user.level || 7}</p>
            </div>
            <div className="stat-item">
              <p className="stat-label">Experiência</p>
              <p className="stat-value">{user.xp || 730}/800</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="xp-progress-container">
            <div className="xp-progress-bar">
              <div 
                className="xp-progress-fill" 
                style={{ width: `${xpPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Top Achievements */}
        <section className="achievements-section">
          <h2 className="section-title">
            {'<'}CONQUISTAS TRIUNFANTES{'>'}
          </h2>
          <p className="section-subtitle">
            Somente conquistas de maior prestígio ficam aqui
          </p>

          {loadingBadges ? (
            <div className="loading-badges">Carregando conquistas...</div>
          ) : hasAnyBadge && topBadges.length > 0 ? (
            <div className="top-badges">
              {topBadges.map((badge, index) => (
                <div key={badge._id} className="top-badge">
                  <div className={`badge-trophy badge-trophy-${index + 1}`}>
                    <FaTrophy />
                  </div>
                  <div className="badge-pedestal"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-badges-message">
              <FaLock className="lock-icon" />
              <p>Complete desafios para desbloquear suas primeiras conquistas!</p>
            </div>
          )}
        </section>

        {/* All Achievements */}
        <section className="achievements-section">
          <h2 className="section-title">
            {'<'}CONQUISTAS{'>'}
          </h2>

          {loadingBadges ? (
            <div className="loading-badges">Carregando...</div>
          ) : allBadges.length > 0 ? (
            <div className="all-badges">
              {allBadges.map((badge, index) => {
                const isEarned = userBadges.includes(badge._id)
                const icons = [FaTrophy, FaStar, FaMedal, FaAward, FaTrophy, FaStar]
                const Icon = icons[index % icons.length]
                
                return (
                  <div 
                    key={badge._id} 
                    className={`badge-item ${isEarned ? 'earned' : 'locked'}`}
                    title={isEarned ? badge.name : `🔒 ${badge.requirement || 'Bloqueado'}`}
                  >
                    {isEarned ? (
                      <Icon />
                    ) : (
                      <FaLock />
                    )}
                    <div className="badge-base"></div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="no-badges-message">
              <p>Nenhuma conquista disponível no momento.</p>
            </div>
          )}
        </section>
      </div>
    </AuthenticatedLayout>
  )
}
