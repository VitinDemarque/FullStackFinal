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
  max-width: 1400px;
  max-height: 95vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  flex-shrink: 0;
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
  padding: 0;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  padding: 1.25rem;
  overflow-y: auto;
  flex: 1;
  min-height: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

export const FieldGroup = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: 0.4rem;
  letter-spacing: 0.01em;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1.5px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[900]};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.blue[100]};
    background: ${({ theme }) => theme.colors.white};
  }
  
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.gray[400]};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1.5px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 60px;
  line-height: 1.5;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[900]};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.blue[100]};
    background: ${({ theme }) => theme.colors.white};
  }
  
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.gray[400]};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
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
  min-height: 400px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  padding: 0.5rem 0.75rem;
  border: 1.5px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 6px;
  font-size: 0.875rem;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[900]};
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'%3E%3Cpath d='M3.5 5.25L7 8.75L10.5 5.25' stroke='%234a5568' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.blue[100]}, 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: ${({ theme }) => theme.colors.white};
  }
  
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.gray[400]};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  &:active:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.blue[500]};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  /* Estilização das opções no dropdown */
  option {
    padding: 0.75rem 1rem;
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.gray[900]};
    font-size: 0.875rem;
    line-height: 1.6;
    min-height: 2.75rem;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
    
    /* Opção selecionada */
    &:checked {
      background: linear-gradient(135deg, ${({ theme }) => theme.colors.blue[50]}, ${({ theme }) => theme.colors.blue[100]}) !important;
      color: ${({ theme }) => theme.colors.blue[900]} !important;
      font-weight: 600;
    }
    
    /* Opção desabilitada */
    &:disabled {
      background: ${({ theme }) => theme.colors.gray[50]};
      color: ${({ theme }) => theme.colors.gray[400]};
      cursor: not-allowed;
      font-style: italic;
    }
  }
  
  /* Estilização para o primeiro option (placeholder) */
  option[value=""] {
    color: ${({ theme }) => theme.colors.gray[400]};
    font-style: italic;
    font-weight: 400;
  }
  
  /* Melhorar a aparência quando o select está aberto */
  &[open],
  &:focus {
    option {
      &:hover {
        background: ${({ theme }) => theme.colors.blue[50]} !important;
        color: ${({ theme }) => theme.colors.blue[700]} !important;
      }
    }
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Checkbox = styled.input`
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.blue[500]};
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  user-select: none;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  flex-shrink: 0;
  width: 100%;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
    
    button {
      width: 100%;
    }
  }
`;

export const CancelButton = styled.button`
  padding: 0.625rem 1.25rem;
  border: 1.5px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const SubmitButton = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.blue[500]};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.blue[600]};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray[400]};
    cursor: not-allowed;
    transform: none;
    opacity: 0.6;
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
