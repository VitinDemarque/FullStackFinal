import styled from 'styled-components'

export const TestContainer = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text-primary);
  transition: all 0.3s ease;
`

export const TestCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
`

export const TestTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
  text-align: center;
`

export const TestText = styled.p`
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  text-align: center;
`

export const TestButton = styled.button`
  display: block;
  margin: 0 auto 2rem;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  &:active {
    transform: translateY(0);
  }
`

export const TestSection = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--color-surface-hover);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  
  h3 {
    color: var(--color-text-primary);
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
`

export const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

export const ColorBox = styled.div<{ color: string }>`
  padding: 1rem;
  background: ${props => props.color};
  border: 2px solid var(--color-border);
  border-radius: 8px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${props => props.color.includes('fff') || props.color.includes('white') ? '#333' : 'white'};
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-sm);
  }
`

export const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  
  input, textarea, select {
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
  }
  
  textarea {
    min-height: 80px;
    resize: vertical;
  }
  
  .dark & {
    input, textarea, select {
      background: var(--color-gray-800);
      border-color: var(--color-border);
    }
  }
`

export const ButtonGrid = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  button {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &.btn-primary {
      background: var(--gradient-primary);
      color: white;
      box-shadow: var(--shadow-md);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }
    }
    
    &.btn-secondary {
      background: var(--color-gray-200);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border);
      
      &:hover {
        background: var(--color-gray-300);
      }
      
      .dark & {
        background: var(--color-gray-700);
        color: var(--color-text-primary);
        
        &:hover {
          background: var(--color-gray-600);
        }
      }
    }
    
    &.btn-danger {
      background: var(--color-danger-bg);
      color: var(--color-danger-text);
      border: 1px solid var(--color-red-400);
      
      &:hover {
        background: var(--color-red-500);
        color: white;
      }
    }
  }
`