import styled from 'styled-components'

// Componentes utilitários para aplicar estilos de tema facilmente

export const ThemedCard = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-text-primary);
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-surface-hover);
  }
`

export const ThemedButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: var(--gradient-primary);
          color: white;
          box-shadow: var(--shadow-md);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
          }
        `
      case 'danger':
        return `
          background: var(--color-danger-bg);
          color: var(--color-danger-text);
          border: 1px solid var(--color-red-400);
          
          &:hover {
            background: var(--color-red-500);
            color: white;
          }
        `
      default:
        return `
          background: var(--color-gray-200);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
          
          &:hover {
            background: var(--color-gray-300);
          }
          
          .dark & {
            background: var(--color-gray-700);
            color: var(--color-text-primary);
            border-color: var(--color-border);
            
            &:hover {
              background: var(--color-gray-600);
            }
          }
        `
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const ThemedInput = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-blue-400);
    box-shadow: 0 0 0 3px var(--color-blue-400)20;
  }
  
  &::placeholder {
    color: var(--color-text-light);
  }
  
  .dark & {
    background: var(--color-gray-800);
    border-color: var(--color-border);
    
    &:focus {
      border-color: var(--color-blue-400);
      box-shadow: 0 0 0 3px var(--color-blue-400)30;
    }
  }
`

export const ThemedTextarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-blue-400);
    box-shadow: 0 0 0 3px var(--color-blue-400)20;
  }
  
  &::placeholder {
    color: var(--color-text-light);
  }
  
  .dark & {
    background: var(--color-gray-800);
    border-color: var(--color-border);
    
    &:focus {
      border-color: var(--color-blue-400);
      box-shadow: 0 0 0 3px var(--color-blue-400)30;
    }
  }
`

export const ThemedSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-surface);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-blue-400);
    box-shadow: 0 0 0 3px var(--color-blue-400)20;
  }
  
  .dark & {
    background: var(--color-gray-800);
    border-color: var(--color-border);
    
    &:focus {
      border-color: var(--color-blue-400);
      box-shadow: 0 0 0 3px var(--color-blue-400)30;
    }
  }
`

export const ThemedLink = styled.a`
  color: var(--color-blue-500);
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--color-blue-600);
  }
  
  .dark & {
    color: var(--color-blue-400);
    
    &:hover {
      color: var(--color-blue-500);
    }
  }
`

export const TextPrimary = styled.span`
  color: var(--color-text-primary);
`

export const TextSecondary = styled.span`
  color: var(--color-text-secondary);
`

export const TextLight = styled.span`
  color: var(--color-text-light);
`

export const BackgroundSurface = styled.div`
  background-color: var(--color-surface);
  color: var(--color-text-primary);
`

export const BackgroundHover = styled.div`
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
`

export const BorderContainer = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 8px;
`