import React from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background: var(--color-gray-100);
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 150px;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.875rem;

  &:hover {
    background: var(--color-gray-50);
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border);
  }
`;

interface GroupActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onManageMembers: () => void;
  canEdit: boolean;
  canDelete: boolean;
  canManageMembers: boolean;
}

export default function GroupActionsMenu({
  onEdit,
  onDelete,
  onManageMembers,
  canEdit,
  canDelete,
  canManageMembers
}: GroupActionsMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <MenuContainer>
      <MenuButton onClick={() => setIsOpen(!isOpen)}>
        ⋮
      </MenuButton>
      
      {isOpen && (
        <MenuDropdown>
          {canEdit && (
            <MenuItem onClick={() => handleAction(onEdit)}>
              ✏️ Editar Grupo
            </MenuItem>
          )}
          
          {canManageMembers && (
            <MenuItem onClick={() => handleAction(onManageMembers)}>
              👥 Gerenciar Membros
            </MenuItem>
          )}
          
          {canDelete && (
            <MenuItem onClick={() => handleAction(onDelete)}>
              🗑️ Excluir Grupo
            </MenuItem>
          )}
        </MenuDropdown>
      )}
    </MenuContainer>
  );
}