import * as S from './styles';

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
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <S.Icon type={type}>
            {type === 'danger' && '⚠️'}
            {type === 'warning' && '⚠️'}
            {type === 'info' && 'ℹ️'}
          </S.Icon>
          <S.Title>{title}</S.Title>
        </S.Header>

        <S.Content>
          <S.Message>{message}</S.Message>
        </S.Content>

        <S.Footer>
          <S.CancelButton onClick={onClose}>
            {cancelText}
          </S.CancelButton>
          <S.ConfirmButton onClick={handleConfirm} type={type}>
            {confirmText}
          </S.ConfirmButton>
        </S.Footer>
      </S.Modal>
    </S.Overlay>
  );
}
