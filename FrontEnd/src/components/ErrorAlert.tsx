// ============================================
// ERROR ALERT - Componente de alerta de erro
// ============================================

import { FaExclamationCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa'
import type { ErrorHandlerResult } from '@utils/errorHandler'
import './ErrorAlert.css'

interface ErrorAlertProps {
  error: ErrorHandlerResult
  onClose?: () => void
  onRetry?: () => void
}

export default function ErrorAlert({ error, onClose, onRetry }: ErrorAlertProps) {
  return (
    <div className="error-alert">
      <div className="error-alert-content">
        <div className="error-alert-icon">
          <FaExclamationCircle />
        </div>
        <div className="error-alert-text">
          <h4 className="error-alert-title">{error.title}</h4>
          <p className="error-alert-message">{error.message}</p>
        </div>
        {onClose && (
          <button className="error-alert-close" onClick={onClose} aria-label="Fechar">
            <FaTimes />
          </button>
        )}
      </div>
      {error.canRetry && onRetry && (
        <button className="error-alert-retry" onClick={onRetry}>
          🔄 Tentar Novamente
        </button>
      )}
    </div>
  )
}

interface WarningAlertProps {
  title: string
  message: string
  onClose?: () => void
}

export function WarningAlert({ title, message, onClose }: WarningAlertProps) {
  return (
    <div className="warning-alert">
      <div className="warning-alert-content">
        <div className="warning-alert-icon">
          <FaExclamationTriangle />
        </div>
        <div className="warning-alert-text">
          <h4 className="warning-alert-title">{title}</h4>
          <p className="warning-alert-message">{message}</p>
        </div>
        {onClose && (
          <button className="warning-alert-close" onClick={onClose} aria-label="Fechar">
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  )
}

