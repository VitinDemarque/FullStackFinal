import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { theme } from '../styles/theme'

interface NotificationProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose?: () => void
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`

const NotificationContainer = styled.div<{ $type: string; $isVisible: boolean }>`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: ${props => {
    switch (props.$type) {
      case 'success': return theme.colors.green[500]
      case 'error': return theme.colors.red[500]
      case 'warning': return theme.colors.yellow[400]
      case 'info': return theme.colors.blue[500]
      default: return theme.colors.gray[600]
    }
  }};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.xl};
  z-index: 1000;
  min-width: 300px;
  max-width: 400px;
  animation: ${props => props.$isVisible ? slideIn : slideOut} 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .dark & {
    background: ${props => {
    switch (props.$type) {
      case 'success': return theme.colors.green[500]
      case 'error': return theme.colors.red[500]
      case 'warning': return theme.colors.yellow[400]
      case 'info': return theme.colors.blue[500]
      default: return theme.colors.dark.surface
    }
  }};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    min-width: auto;
    max-width: none;
  }
`

const Icon = styled.div<{ $type: string }>`
  font-size: 1.25rem;
  flex-shrink: 0;
`

const Message = styled.div`
  flex: 1;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  line-height: 1.4;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  opacity: 0.7;
  transition: ${theme.transitions.base};

  &:hover {
    opacity: 1;
  }
`

const Notification = ({
  message,
  type = 'info',
  duration = 5000,
  onClose
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose?.(), 300)
  }

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return 'ℹ️'
    }
  }

  return (
    <NotificationContainer $type={type} $isVisible={isVisible}>
      <Icon $type={type}>{getIcon()}</Icon>
      <Message>{message}</Message>
      <CloseButton onClick={handleClose}>×</CloseButton>
    </NotificationContainer>
  )
}

// Hook para usar notificações
export const useNotification = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    duration?: number
  }>>([])

  const addNotification = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration = 5000
  ) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { id, message, type, duration }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const NotificationContainerComponent = () => (
    <>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  )

  return {
    addNotification,
    removeNotification,
    NotificationContainer: NotificationContainerComponent,
  }
}

export default Notification
