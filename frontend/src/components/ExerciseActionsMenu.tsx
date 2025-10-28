import { useState, useRef, useEffect } from 'react';
import * as S from '@/styles/components/ExerciseActionsMenu/styles';

interface ExerciseActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onInactivate: () => void;
  isActive: boolean;
}

export default function ExerciseActionsMenu({ onEdit, onDelete, onInactivate, isActive }: ExerciseActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <S.Container>
      <S.MenuButton
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        ⋯
      </S.MenuButton>

      {isOpen && (
        <S.Menu ref={menuRef}>
          <S.MenuItem onClick={() => handleAction(onEdit)}>
            <S.MenuIcon>✏️</S.MenuIcon>
            Editar
          </S.MenuItem>
          
          <S.MenuItem onClick={() => handleAction(onInactivate)}>
            <S.MenuIcon>{isActive ? '⏸️' : '▶️'}</S.MenuIcon>
            {isActive ? 'Inativar' : 'Ativar'}
          </S.MenuItem>
          
          <S.MenuDivider />
          
          <S.MenuItem onClick={() => handleAction(onDelete)} danger>
            <S.MenuIcon>🗑️</S.MenuIcon>
            Excluir
          </S.MenuItem>
        </S.Menu>
      )}
    </S.Container>
  );
}
