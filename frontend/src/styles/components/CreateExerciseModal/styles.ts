import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  
  &:hover {
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

export const Form = styled.form`
  padding: 1.5rem;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  transition: ${({ theme }) => theme.transitions.base};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.blue[100]};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: ${({ theme }) => theme.transitions.base};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.blue[100]};
  }
`;

export const CodeTextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  resize: vertical;
  min-height: 120px;
  background: ${({ theme }) => theme.colors.gray[50]};
  transition: ${({ theme }) => theme.transitions.base};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.blue[100]};
  }
`;

export const EditorPanel = styled.div`
  background: #101316;
  border: 1px solid ${({ theme }) => theme.colors.gray[800]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-height: 360px;
  display: flex;
  flex-direction: column;
`;

export const EditorHeader = styled.div`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[800]};
  background: linear-gradient(135deg, #2a2252, #3b2469);
`;

export const CodeEditor = styled.textarea`
  width: 100%;
  height: 100%;
  min-height: 300px;
  resize: vertical;
  border: none;
  outline: none;
  padding: 1rem;
  background: #1e1e1e;
  color: #e6e6e6;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.95rem;
  line-height: 1.5;

  &::placeholder {
    color: #9aa0a6;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.blue[100]};
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
`;

export const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  user-select: none;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

export const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

export const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.blue[500]};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.blue[600]};
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray[400]};
    cursor: not-allowed;
    transform: none;
  }
`;

// Inline controls para posicionar o botão "+" ao lado dos selects
export const InlineControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const AddBadgeButton = styled.button`
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid ${({ theme }) => theme.colors.blue[400]};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.blue[500]}, ${({ theme }) => theme.colors.blue[600]});
  color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-1px) scale(1.03);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.blue[200]};
    outline-offset: 2px;
  }
`;

// Área de upload/previsualização do ícone do badge
export const UploadArea = styled.button<{ $hasImage?: boolean }>`
  width: 96px;
  height: 96px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  background: ${({ theme }) => theme.colors.white};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};
  overflow: hidden;

  ${({ $hasImage, theme }) => $hasImage ? `
    border-style: solid;
    border-color: ${theme.colors.gray[200]};
    box-shadow: ${theme.shadows.md};
  ` : ''}

  &:hover {
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-1px);
  }
`;

export const IconPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const UploadHint = styled.small`
  display: block;
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: 0.5rem;
`;

// Alerta simples para feedback de formulário
export const FormAlert = styled.div`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: 0.875rem;
`;
