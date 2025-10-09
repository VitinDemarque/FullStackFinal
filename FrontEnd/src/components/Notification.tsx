import { useEffect } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa'
import './Notification.css'

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
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {type === 'success' ? (
            <FaCheckCircle className="icon-success" />
          ) : (
            <FaExclamationCircle className="icon-error" />
          )}
        </div>
        <div className="notification-message">
          <h4 className="notification-title">
            {type === 'success' ? 'Sucesso!' : 'Erro!'}
          </h4>
          <p className="notification-text">{message}</p>
        </div>
        <button className="notification-close" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <div className={`notification-progress notification-progress-${type}`} />
    </div>
  )
}

