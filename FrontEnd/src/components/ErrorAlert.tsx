import { FaExclamationCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa'
import type { ErrorHandlerResult } from '@utils/errorHandler'
import * as S from '@/styles/components/ErrorAlert/styles'

interface ErrorAlertProps {
  error: ErrorHandlerResult
  onClose?: () => void
  onRetry?: () => void
}

export default function ErrorAlert({ error, onClose, onRetry }: ErrorAlertProps) {
  return (
    <S.ErrorAlertContainer>
      <S.ErrorAlertContent>
        <S.ErrorAlertIcon>
          <FaExclamationCircle />
        </S.ErrorAlertIcon>
        <S.ErrorAlertText>
          <S.ErrorAlertTitle>{error.title}</S.ErrorAlertTitle>
          <S.ErrorAlertMessage>{error.message}</S.ErrorAlertMessage>
        </S.ErrorAlertText>
        {onClose && (
          <S.ErrorAlertCloseButton onClick={onClose} aria-label="Fechar">
            <FaTimes />
          </S.ErrorAlertCloseButton>
        )}
      </S.ErrorAlertContent>
      {error.canRetry && onRetry && (
        <S.ErrorAlertRetryButton onClick={onRetry}>
          🔄 Tentar Novamente
        </S.ErrorAlertRetryButton>
      )}
    </S.ErrorAlertContainer>
  )
}

interface WarningAlertProps {
  title: string
  message: string
  onClose?: () => void
}

export function WarningAlert({ title, message, onClose }: WarningAlertProps) {
  return (
    <S.WarningAlertContainer>
      <S.WarningAlertContent>
        <S.WarningAlertIcon>
          <FaExclamationTriangle />
        </S.WarningAlertIcon>
        <S.WarningAlertText>
          <S.WarningAlertTitle>{title}</S.WarningAlertTitle>
          <S.WarningAlertMessage>{message}</S.WarningAlertMessage>
        </S.WarningAlertText>
        {onClose && (
          <S.WarningAlertCloseButton onClick={onClose} aria-label="Fechar">
            <FaTimes />
          </S.WarningAlertCloseButton>
        )}
      </S.WarningAlertContent>
    </S.WarningAlertContainer>
  )
}

