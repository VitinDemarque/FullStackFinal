import styled from 'styled-components'
import { theme } from '../../theme'

// ============================================
// CONTAINER PRINCIPAL
// ============================================

export const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  position: relative;
  overflow: hidden;
  padding: 2rem;
`

// ============================================
// FORMAS GEOMÉTRICAS DECORATIVAS
// ============================================

interface ShapeProps {
  variant: 'blue-top' | 'yellow-bottom' | 'yellow-top' | 'orange-bottom'
}

export const Shape = styled.div<ShapeProps>`
  position: absolute;
  border-radius: 50% 50% 0 0;
  z-index: 0;
  width: 500px;
  height: 400px;

  ${(props) => {
    switch (props.variant) {
      case 'blue-top':
        return `
          top: -200px;
          right: -150px;
          background: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%);
          border-radius: 0 0 0 200px;
        `
      case 'yellow-bottom':
        return `
          bottom: -200px;
          left: -150px;
          background: linear-gradient(135deg, #fde68a 0%, #fbbf24 100%);
          border-radius: 0 200px 0 0;
        `
      case 'yellow-top':
        return `
          top: -200px;
          right: -150px;
          background: linear-gradient(135deg, #fde68a 0%, #fbbf24 100%);
          border-radius: 0 0 0 200px;
        `
      case 'orange-bottom':
        return `
          bottom: -200px;
          left: -150px;
          background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
          border-radius: 0 200px 0 0;
        `
    }
  }}

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 300px;
    height: 250px;
  }
`

// ============================================
// CARD DE AUTENTICAÇÃO
// ============================================

interface AuthCardProps {
  isSignup?: boolean
}

export const AuthCard = styled.div<AuthCardProps>`
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: ${(props) => (props.isSignup ? '500px' : '420px')};
  position: relative;
  z-index: 10;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 2rem 1.5rem;
  }
`

// ============================================
// BOTÃO DE VOLTAR
// ============================================

export const BackButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${theme.colors.gray[500]};
  font-size: ${theme.fontSizes.sm};
  text-decoration: none;
  margin-bottom: 1rem;
  transition: ${theme.transitions.base};
  font-weight: ${theme.fontWeights.medium};

  &:hover {
    color: ${theme.colors.blue[400]};
    transform: translateX(-4px);
  }
`

// ============================================
// TÍTULO
// ============================================

export const AuthTitle = styled.h1`
  font-size: ${theme.fontSizes['4xl']};
  font-weight: ${theme.fontWeights.bold};
  text-align: center;
  margin-bottom: 2rem;
  color: ${theme.colors.gray[800]};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes['3xl']};
  }
`

export const Bracket = styled.span`
  color: ${theme.colors.gray[500]};
  font-weight: ${theme.fontWeights.normal};
`

// ============================================
// FORMULÁRIO
// ============================================

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
`

export const FormLabel = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.gray[700]};
`

export const FormInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9375rem;
  color: ${theme.colors.gray[800]};
  transition: ${theme.transitions.base};
  background: white;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.blue[400]};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.gray[400]};
  }
`

export const FormSelect = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  padding-right: 2.5rem;
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9375rem;
  color: ${theme.colors.gray[800]};
  transition: ${theme.transitions.base};
  background: white;
  font-family: inherit;
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;

  &:focus {
    outline: none;
    border-color: ${theme.colors.blue[400]};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

// ============================================
// BOTÃO PRINCIPAL
// ============================================

export const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
  transition: ${theme.transitions.base};
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

// ============================================
// LINK DE CADASTRO/LOGIN
// ============================================

export const AuthLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray[500]};
`

export const LinkHighlight = styled.a`
  color: ${theme.colors.blue[400]};
  text-decoration: none;
  font-weight: ${theme.fontWeights.semibold};
  transition: ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.blue[500]};
    text-decoration: underline;
  }
`

// ============================================
// BOTÕES SOCIAIS
// ============================================

export const SocialButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${theme.colors.gray[200]};
`

interface SocialButtonProps {
  variant: 'google' | 'facebook'
}

export const SocialButton = styled.button<SocialButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.sm};
  background: white;
  color: ${theme.colors.gray[700]};
  font-size: 0.9375rem;
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: ${theme.transitions.base};

  svg {
    font-size: 1.25rem;
  }

  &:hover {
    background: ${theme.colors.gray[50]};
    border-color: ${theme.colors.gray[400]};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    ${(props) =>
      props.variant === 'google' &&
      `
      border-color: #ea4335;
      color: #ea4335;
    `}

    ${(props) =>
      props.variant === 'facebook' &&
      `
      border-color: #1877f2;
      color: #1877f2;
    `}
  }
`

