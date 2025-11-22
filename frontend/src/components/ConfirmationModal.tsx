import * as S from '../styles/components/ConfirmationModal/styles';
import { useTheme } from '@contexts/ThemeContext';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'info'
}: ConfirmationModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal $isDark={isDark} onClick={(e) => e.stopPropagation()}>
        <S.Header $isDark={isDark}>
          <S.Icon $type={type}>
            {type === 'danger' && '⚠️'}
            {type === 'warning' && '⚠️'}
            {type === 'info' && 'ℹ️'}
          </S.Icon>
          <S.Title $isDark={isDark}>{title}</S.Title>
        </S.Header>

        <S.Content $isDark={isDark}>
          <S.Message $isDark={isDark}>{message}</S.Message>
        </S.Content>

        <S.Footer $isDark={isDark}>
          <S.CancelButton $isDark={isDark} onClick={onClose}>
            {cancelText}
          </S.CancelButton>
          <S.ConfirmButton onClick={handleConfirm} $type={type}>
            {confirmText}
          </S.ConfirmButton>
        </S.Footer>
      </S.Modal>
    </S.Overlay>
  );
}
