import { useEffect } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa'
import * as S from '@/styles/components/Notification/styles'

interface NotificationProps {
  type: 'success' | 'error'
  message: string
  onClose: () => void
  duration?: number
}

export default function Notification({ type, message, onClose, duration = 5000 }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <S.NotificationContainer type={type}>
      <S.NotificationContent>
        <S.NotificationIcon type={type}>
          {type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
        </S.NotificationIcon>
        <S.NotificationMessage>
          <S.NotificationTitle>
            {type === 'success' ? 'Sucesso!' : 'Erro!'}
          </S.NotificationTitle>
          <S.NotificationText>{message}</S.NotificationText>
        </S.NotificationMessage>
        <S.NotificationCloseButton onClick={onClose}>
          <FaTimes />
        </S.NotificationCloseButton>
      </S.NotificationContent>
      <S.NotificationProgress type={type} />
    </S.NotificationContainer>
  )
}

