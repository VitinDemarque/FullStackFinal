import React from 'react'
import styled from 'styled-components'
import { theme } from '../styles/theme'

interface ToggleSwitchProps {
  checked: boolean
  onChange: () => void
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

const SwitchContainer = styled.label<{ $size: 'small' | 'medium' | 'large'; $disabled: boolean }>`
  position: relative;
  display: inline-block;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.6 : 1};
  
  width: ${props => {
    switch (props.$size) {
      case 'small': return '2.5rem'
      case 'medium': return '3.5rem'
      case 'large': return '4rem'
    }
  }};
  
  height: ${props => {
    switch (props.$size) {
      case 'small': return '1.25rem'
      case 'medium': return '2rem'
      case 'large': return '2.25rem'
    }
  }};

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${theme.colors.gray[300]};
    transition: ${theme.transitions.all};
    border-radius: ${theme.borderRadius.full};

    &:before {
      position: absolute;
      content: "";
      height: ${props => {
        switch (props.$size) {
          case 'small': return '1rem'
          case 'medium': return '1.5rem'
          case 'large': return '1.75rem'
        }
      }};
      width: ${props => {
        switch (props.$size) {
          case 'small': return '1rem'
          case 'medium': return '1.5rem'
          case 'large': return '1.75rem'
        }
      }};
      left: ${props => {
        switch (props.$size) {
          case 'small': return '0.125rem'
          case 'medium': return '0.25rem'
          case 'large': return '0.25rem'
        }
      }};
      bottom: ${props => {
        switch (props.$size) {
          case 'small': return '0.125rem'
          case 'medium': return '0.25rem'
          case 'large': return '0.25rem'
        }
      }};
      background-color: white;
      transition: ${theme.transitions.all};
      border-radius: ${theme.borderRadius.full};
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }

  input:checked + .slider {
    background: ${theme.gradients.blue};
  }

  input:checked + .slider:before {
    transform: translateX(${props => {
      switch (props.$size) {
        case 'small': return '1.25rem'
        case 'medium': return '1.5rem'
        case 'large': return '1.75rem'
      }
    }});
  }

  .dark & .slider {
    background-color: ${theme.colors.dark.surfaceHover};
  }

  &:hover:not(.disabled) .slider {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`

export function ToggleSwitch({ 
  checked, 
  onChange, 
  disabled = false, 
  size = 'medium' 
}: ToggleSwitchProps) {
  return (
    <SwitchContainer $size={size} $disabled={disabled}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="slider" />
    </SwitchContainer>
  )
}
