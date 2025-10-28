import styled, { keyframes } from 'styled-components'
import { theme } from '../../styles/theme'

// ============================================
// ANIMATIONS
// ============================================

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`

// ============================================
// MAIN CONTAINER
// ============================================

export const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme?.colors?.background || theme.colors.gray[50]};
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  animation: ${slideIn} 0.5s ease;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 1rem;
  }

  .dark & {
    background: ${theme.colors.dark.background};
  }
`

// ============================================
// HEADER
// ============================================

export const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`

export const Title = styled.h1`
  font-size: ${theme.fontSizes['4xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${props => props.theme?.colors?.textPrimary || theme.colors.gray[800]};
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;

  .dark & {
    color: ${theme.colors.dark.textPrimary};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`

export const Description = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${props => props.theme?.colors?.textSecondary || theme.colors.gray[600]};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  .dark & {
    color: ${theme.colors.dark.textSecondary};
  }
`

// ============================================
// SETTINGS GRID
// ============================================

export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

// ============================================
// SETTINGS CARD
// ============================================

export const SettingsCard = styled.div`
  background: ${props => props.theme?.colors?.white || theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  overflow: hidden;
  transition: ${theme.transitions.all};
  border: 1px solid ${theme.colors.gray[200]};

  &:hover {
    box-shadow: ${theme.shadows.lg};
    transform: translateY(-2px);
  }

  .dark & {
    background: ${theme.colors.dark.surface};
    border-color: ${theme.colors.dark.border};
  }
`

export const CardHeader = styled.div`
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid ${theme.colors.gray[200]};
  display: flex;
  align-items: center;
  gap: 1rem;

  .dark & {
    border-bottom-color: ${theme.colors.dark.border};
  }
`

export const CardIcon = styled.div`
  font-size: 1.5rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.gradients.blue};
  border-radius: ${theme.borderRadius.md};
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
`

export const CardTitle = styled.h3`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
  color: ${props => props.theme?.colors?.textPrimary || theme.colors.gray[800]};
  margin: 0;

  .dark & {
    color: ${theme.colors.dark.textPrimary};
  }
`

export const CardContent = styled.div`
  padding: 1.5rem;
`

// ============================================
// SETTING ITEMS
// ============================================

export const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid ${theme.colors.gray[100]};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }

  .dark & {
    border-bottom-color: ${theme.colors.dark.border};
  }
`

export const SettingInfo = styled.div`
  flex: 1;
  margin-right: 1rem;
`

export const SettingLabel = styled.div`
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.medium};
  color: ${props => props.theme?.colors?.textPrimary || theme.colors.gray[800]};
  margin-bottom: 0.25rem;

  .dark & {
    color: ${theme.colors.dark.textPrimary};
  }
`

export const SettingDescription = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${props => props.theme?.colors?.textSecondary || theme.colors.gray[600]};
  line-height: 1.4;

  .dark & {
    color: ${theme.colors.dark.textSecondary};
  }
`


// ============================================
// THEME TOGGLE
// ============================================

interface ThemeToggleProps {
  $isDark: boolean
}

export const ThemeToggle = styled.button<ThemeToggleProps>`
  position: relative;
  width: 4rem;
  height: 2.25rem;
  background: ${props => props.$isDark ? theme.colors.gray[700] : theme.colors.gray[200]};
  border: none;
  border-radius: ${theme.borderRadius.full};
  cursor: pointer;
  transition: ${theme.transitions.all};
  padding: 0.25rem;

  &:hover {
    transform: scale(1.05);
  }

  .dark & {
    background: ${props => props.$isDark ? theme.colors.dark.surfaceHover : theme.colors.gray[200]};
  }
`

interface ToggleSliderProps {
  $isDark: boolean
}

export const ToggleSlider = styled.div<ToggleSliderProps>`
  width: 1.75rem;
  height: 1.75rem;
  background: ${props => props.$isDark ? theme.colors.gray[800] : theme.colors.white};
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${theme.transitions.all};
  transform: ${props => props.$isDark ? 'translateX(1.75rem)' : 'translateX(0)'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`

export const ToggleIcon = styled.span`
  font-size: 0.875rem;
  line-height: 1;
`

// ============================================
// SELECT
// ============================================

export const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.white};
  color: ${theme.colors.gray[800]};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: ${theme.transitions.base};
  min-width: 120px;

  &:focus {
    outline: none;
    border-color: ${theme.colors.blue[400]};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: ${theme.colors.gray[400]};
  }

  .dark & {
    background: ${theme.colors.dark.surface};
    border-color: ${theme.colors.dark.border};
    color: ${theme.colors.dark.textPrimary};

    &:focus {
      border-color: ${theme.colors.dark.accent};
    }
  }
`

// ============================================
// ACTION BUTTONS
// ============================================

export const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${theme.gradients.blue};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: ${theme.transitions.all};
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`

export const DangerButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${theme.colors.red[500]};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: ${theme.transitions.all};

  &:hover {
    background: ${theme.colors.red[600]};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`

// ============================================
// ABOUT SECTION
// ============================================

export const AboutItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${theme.colors.gray[100]};

  &:last-child {
    border-bottom: none;
  }

  .dark & {
    border-bottom-color: ${theme.colors.dark.border};
  }
`

export const AboutLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${props => props.theme?.colors?.textSecondary || theme.colors.gray[600]};

  .dark & {
    color: ${theme.colors.dark.textSecondary};
  }
`

export const AboutValue = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${props => props.theme?.colors?.textPrimary || theme.colors.gray[800]};

  .dark & {
    color: ${theme.colors.dark.textPrimary};
  }
`

// ============================================
// SAVE BUTTON
// ============================================

export const SaveButton = styled.button`
  width: 100%;
  max-width: 300px;
  margin: 2rem auto 0;
  padding: 1rem 2rem;
  background: ${theme.gradients.green};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
  transition: ${theme.transitions.all};
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
    animation: ${pulse} 0.6s ease;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    max-width: 100%;
  }
`
