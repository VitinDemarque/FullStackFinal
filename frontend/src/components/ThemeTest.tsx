import React from 'react'
import styled from 'styled-components'
import { useTheme } from '@contexts/ThemeContext'
import * as S from '@/styles/components/ThemeTest/styles'

export default function ThemeTest() {
  const { theme, toggleTheme } = useTheme()

  return (
    <S.TestContainer>
      <S.TestCard>
        <S.TestTitle>Teste de Tema Global</S.TestTitle>
        <S.TestText>Tema atual: <strong>{theme}</strong></S.TestText>
        
        <S.TestButton onClick={toggleTheme}>
          Alternar Tema ({theme === 'light' ? '🌙' : '☀️'})
        </S.TestButton>
        
        <S.TestSection>
          <h3>Cores do Tema:</h3>
          <S.ColorGrid>
            <S.ColorBox color="var(--color-text-primary)">Texto Primário</S.ColorBox>
            <S.ColorBox color="var(--color-text-secondary)">Texto Secundário</S.ColorBox>
            <S.ColorBox color="var(--color-text-light)">Texto Claro</S.ColorBox>
            <S.ColorBox color="var(--color-surface)">Superfície</S.ColorBox>
            <S.ColorBox color="var(--color-surface-hover)">Hover</S.ColorBox>
            <S.ColorBox color="var(--color-border)">Borda</S.ColorBox>
            <S.ColorBox color="var(--color-blue-500)">Azul</S.ColorBox>
            <S.ColorBox color="var(--color-green-500)">Verde</S.ColorBox>
            <S.ColorBox color="var(--color-red-500)">Vermelho</S.ColorBox>
          </S.ColorGrid>
        </S.TestSection>
        
        <S.TestSection>
          <h3>Elementos de Formulário:</h3>
          <S.FormGrid>
            <input type="text" placeholder="Campo de texto" />
            <textarea placeholder="Área de texto"></textarea>
            <select>
              <option>Opção 1</option>
              <option>Opção 2</option>
            </select>
          </S.FormGrid>
        </S.TestSection>
        
        <S.TestSection>
          <h3>Botões:</h3>
          <S.ButtonGrid>
            <button className="btn-primary">Primário</button>
            <button className="btn-secondary">Secundário</button>
            <button className="btn-danger">Perigo</button>
          </S.ButtonGrid>
        </S.TestSection>
        
        <S.TestSection>
          <h3>Teste de Links:</h3>
          <p>
            <a href="#">Link de exemplo</a> - 
            <ThemedLink href="#">Link tematizado</ThemedLink>
          </p>
        </S.TestSection>
      </S.TestCard>
    </S.TestContainer>
  )
}

// Componentes tematizados para teste
const ThemedLink = styled.a`
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