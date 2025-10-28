import { useState, useEffect } from 'react'
import { UserSettings } from '../types/index'

const DEFAULT_SETTINGS: UserSettings = {
  notifications: {
    email: true,
    push: true,
    achievements: true,
    challenges: false,
  },
  privacy: {
    profileVisibility: 'public',
    showEmail: false,
    showStats: true,
  },
  preferences: {
    language: 'pt',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'dd/mm/yyyy',
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    animations: true,
  },
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)

  // Carrega configurações do localStorage na inicialização
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('userSettings')
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings })
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Salva configurações no localStorage sempre que mudarem
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('userSettings', JSON.stringify(settings))
    }
  }, [settings, isLoading])

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  const saveSettings = async () => {
    try {
      // Aqui você pode adicionar uma chamada para a API para salvar as configurações no servidor
      // await apiService.saveUserSettings(settings)
      console.log('Configurações salvas:', settings)
      return true
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      return false
    }
  }

  return {
    settings,
    isLoading,
    updateSettings,
    resetSettings,
    saveSettings,
  }
}
