import React from 'react'
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'
import { useTheme } from '@contexts/ThemeContext'
import { ToggleSwitch } from '../../components/ToggleSwitch'
import { useUserSettings } from '../../hooks/useUserSettings'
import { UserSettings } from '../../types/index'
import { useNotification } from '../../components/Notification'
import * as S from './styles'

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { settings, isLoading, updateSettings, saveSettings } = useUserSettings()
  const { addNotification, NotificationContainer } = useNotification()

  const handleNotificationChange = (key: keyof UserSettings['notifications']) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    })
  }

  const handlePrivacyChange = (key: keyof UserSettings['privacy'], value: any) => {
    updateSettings({
      privacy: {
        ...settings.privacy,
        [key]: value,
      },
    })
  }

  const handlePreferenceChange = (key: keyof UserSettings['preferences'], value: any) => {
    updateSettings({
      preferences: {
        ...settings.preferences,
        [key]: value,
      },
    })
  }

  const handleAccessibilityChange = (key: keyof UserSettings['accessibility'], value: any) => {
    updateSettings({
      accessibility: {
        ...settings.accessibility,
        [key]: value,
      },
    })
  }

  const handleSaveSettings = async () => {
    const success = await saveSettings()
    if (success) {
      addNotification('Configurações salvas com sucesso!', 'success')
    } else {
      addNotification('Erro ao salvar configurações. Tente novamente.', 'error')
    }
  }

  if (isLoading) {
  return (
    <AuthenticatedLayout>
      <S.Container>
          <S.Header>
            <S.Title>⚙️ Configurações</S.Title>
            <S.Description>Carregando suas configurações...</S.Description>
          </S.Header>
        </S.Container>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <NotificationContainer />
      <S.Container>
        <S.Header>
        <S.Title>⚙️ Configurações</S.Title>
        <S.Description>
            Personalize sua experiência e configure suas preferências
        </S.Description>
        </S.Header>

        <S.SettingsGrid>
          {/* Aparência */}
          <S.SettingsCard>
            <S.CardHeader>
              <S.CardIcon>🎨</S.CardIcon>
              <S.CardTitle>Aparência</S.CardTitle>
            </S.CardHeader>
            <S.CardContent>
              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Tema</S.SettingLabel>
                  <S.SettingDescription>
                    Escolha entre modo claro ou escuro
                  </S.SettingDescription>
                </S.SettingInfo>
                <S.ThemeToggle onClick={toggleTheme} $isDark={theme === 'dark'}>
                  <S.ToggleSlider $isDark={theme === 'dark'}>
                    <S.ToggleIcon>{theme === 'dark' ? '🌙' : '☀️'}</S.ToggleIcon>
                  </S.ToggleSlider>
                </S.ThemeToggle>
              </S.SettingItem>

              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Tamanho da Fonte</S.SettingLabel>
                  <S.SettingDescription>
                    Ajuste o tamanho do texto para melhor legibilidade
                  </S.SettingDescription>
                </S.SettingInfo>
                <S.Select
                  value={settings.accessibility.fontSize}
                  onChange={(e) => handleAccessibilityChange('fontSize', e.target.value)}
                >
                  <option value="small">Pequeno</option>
                  <option value="medium">Médio</option>
                  <option value="large">Grande</option>
                </S.Select>
              </S.SettingItem>

              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Alto Contraste</S.SettingLabel>
                  <S.SettingDescription>
                    Melhore a visibilidade com cores de alto contraste
                  </S.SettingDescription>
                </S.SettingInfo>
                <ToggleSwitch
                  checked={settings.accessibility.highContrast}
                  onChange={() => handleAccessibilityChange('highContrast', !settings.accessibility.highContrast)}
                />
              </S.SettingItem>

              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Animações</S.SettingLabel>
                  <S.SettingDescription>
                    Ative ou desative animações na interface
                  </S.SettingDescription>
                </S.SettingInfo>
                <ToggleSwitch
                  checked={settings.accessibility.animations}
                  onChange={() => handleAccessibilityChange('animations', !settings.accessibility.animations)}
                />
              </S.SettingItem>
            </S.CardContent>
          </S.SettingsCard>

          {/* Notificações */}
          <S.SettingsCard>
            <S.CardHeader>
              <S.CardIcon>🔔</S.CardIcon>
              <S.CardTitle>Notificações</S.CardTitle>
            </S.CardHeader>
            <S.CardContent>
              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Notificações por Email</S.SettingLabel>
                  <S.SettingDescription>
                    Receba atualizações importantes por email
                  </S.SettingDescription>
                </S.SettingInfo>
                <ToggleSwitch
                  checked={settings.notifications.email}
                  onChange={() => handleNotificationChange('email')}
                />
              </S.SettingItem>

              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Notificações Push</S.SettingLabel>
                  <S.SettingDescription>
                    Receba notificações no navegador
                  </S.SettingDescription>
                </S.SettingInfo>
                <ToggleSwitch
                  checked={settings.notifications.push}
                  onChange={() => handleNotificationChange('push')}
                />
              </S.SettingItem>

              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Conquistas</S.SettingLabel>
                  <S.SettingDescription>
                    Seja notificado quando ganhar novas conquistas
                  </S.SettingDescription>
                </S.SettingInfo>
                <ToggleSwitch
                  checked={settings.notifications.achievements}
                  onChange={() => handleNotificationChange('achievements')}
                />
              </S.SettingItem>

              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Novos Desafios</S.SettingLabel>
                  <S.SettingDescription>
                    Receba notificações sobre novos desafios disponíveis
                  </S.SettingDescription>
                </S.SettingInfo>
                <ToggleSwitch
                  checked={settings.notifications.challenges}
                  onChange={() => handleNotificationChange('challenges')}
                />
              </S.SettingItem>
            </S.CardContent>
          </S.SettingsCard>

          {/* Privacidade */}
          <S.SettingsCard>
            <S.CardHeader>
              <S.CardIcon>🔒</S.CardIcon>
              <S.CardTitle>Privacidade</S.CardTitle>
            </S.CardHeader>
            <S.CardContent>
              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Visibilidade do Perfil</S.SettingLabel>
                  <S.SettingDescription>
                    Quem pode ver seu perfil
                  </S.SettingDescription>
                </S.SettingInfo>
                <S.Select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                >
                  <option value="public">Público</option>
                  <option value="friends">Apenas Amigos</option>
                  <option value="private">Privado</option>
                </S.Select>
              </S.SettingItem>

              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Mostrar Email</S.SettingLabel>
                  <S.SettingDescription>
                    Exibir seu email no perfil público
                  </S.SettingDescription>
                </S.SettingInfo>
                <ToggleSwitch
                  checked={settings.privacy.showEmail}
                  onChange={() => handlePrivacyChange('showEmail', !settings.privacy.showEmail)}
                />
              </S.SettingItem>

              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Mostrar Estatísticas</S.SettingLabel>
                  <S.SettingDescription>
                    Exibir suas estatísticas de progresso
                  </S.SettingDescription>
                </S.SettingInfo>
                <ToggleSwitch
                  checked={settings.privacy.showStats}
                  onChange={() => handlePrivacyChange('showStats', !settings.privacy.showStats)}
                />
              </S.SettingItem>
            </S.CardContent>
          </S.SettingsCard>

          {/* Preferências */}
          <S.SettingsCard>
            <S.CardHeader>
              <S.CardIcon>🌍</S.CardIcon>
              <S.CardTitle>Preferências</S.CardTitle>
            </S.CardHeader>
            <S.CardContent>
              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Idioma</S.SettingLabel>
                  <S.SettingDescription>
                    Idioma da interface
                  </S.SettingDescription>
                </S.SettingInfo>
                <S.Select
                  value={settings.preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                >
                  <option value="pt">Português</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </S.Select>
              </S.SettingItem>

              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Fuso Horário</S.SettingLabel>
                  <S.SettingDescription>
                    Seu fuso horário local
                  </S.SettingDescription>
                </S.SettingInfo>
                <S.Select
                  value={settings.preferences.timezone}
                  onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                >
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/New_York">Nova York (GMT-5)</option>
                  <option value="Europe/London">Londres (GMT+0)</option>
                  <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
                </S.Select>
              </S.SettingItem>

              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Formato de Data</S.SettingLabel>
                  <S.SettingDescription>
                    Como as datas são exibidas
                  </S.SettingDescription>
                </S.SettingInfo>
                <S.Select
                  value={settings.preferences.dateFormat}
                  onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                >
                  <option value="dd/mm/yyyy">DD/MM/AAAA</option>
                  <option value="mm/dd/yyyy">MM/DD/AAAA</option>
                  <option value="yyyy-mm-dd">AAAA-MM-DD</option>
                </S.Select>
              </S.SettingItem>
            </S.CardContent>
          </S.SettingsCard>

          {/* Conta */}
          <S.SettingsCard>
            <S.CardHeader>
              <S.CardIcon>👤</S.CardIcon>
              <S.CardTitle>Conta</S.CardTitle>
            </S.CardHeader>
            <S.CardContent>
              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Alterar Senha</S.SettingLabel>
                  <S.SettingDescription>
                    Atualize sua senha de acesso
                  </S.SettingDescription>
                </S.SettingInfo>
                <S.ActionButton>Alterar</S.ActionButton>
              </S.SettingItem>

              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Exportar Dados</S.SettingLabel>
                  <S.SettingDescription>
                    Baixe uma cópia dos seus dados
                  </S.SettingDescription>
                </S.SettingInfo>
                <S.ActionButton>Exportar</S.ActionButton>
              </S.SettingItem>

              <S.SettingItem>
                <S.SettingInfo>
                  <S.SettingLabel>Excluir Conta</S.SettingLabel>
                  <S.SettingDescription>
                    Remover permanentemente sua conta
                  </S.SettingDescription>
                </S.SettingInfo>
                <S.DangerButton>Excluir</S.DangerButton>
              </S.SettingItem>
            </S.CardContent>
          </S.SettingsCard>

          {/* Sobre */}
          <S.SettingsCard>
            <S.CardHeader>
              <S.CardIcon>ℹ️</S.CardIcon>
              <S.CardTitle>Sobre</S.CardTitle>
            </S.CardHeader>
            <S.CardContent>
              <S.AboutItem>
                <S.AboutLabel>Versão</S.AboutLabel>
                <S.AboutValue>1.0.0</S.AboutValue>
              </S.AboutItem>
              <S.AboutItem>
                <S.AboutLabel>Última Atualização</S.AboutLabel>
                <S.AboutValue>15 de Janeiro, 2024</S.AboutValue>
              </S.AboutItem>
              <S.AboutItem>
                <S.AboutLabel>Suporte</S.AboutLabel>
                <S.AboutValue>suporte@exemplo.com</S.AboutValue>
              </S.AboutItem>
            </S.CardContent>
          </S.SettingsCard>
        </S.SettingsGrid>

        <S.SaveButton onClick={handleSaveSettings}>
          💾 Salvar Configurações
        </S.SaveButton>
      </S.Container>
    </AuthenticatedLayout>
  )
}