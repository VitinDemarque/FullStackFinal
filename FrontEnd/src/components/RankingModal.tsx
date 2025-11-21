import { useState, useEffect } from 'react'
import { FaTimes, FaTrophy } from 'react-icons/fa'
import { useTheme } from '@/contexts/ThemeContext'
import { rankingService } from '@/services/ranking.service'
import { useAuth } from '@/contexts/AuthContext'
import type { RankingResult, UserPosition } from '@/services/ranking.service'
import ExerciseRanking from './ExerciseRanking'
import styled from 'styled-components'

const Overlay = styled.div<{ $isDark: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ $isDark }) => 
    $isDark ? "rgba(0, 0, 0, 0.95)" : "rgba(0, 0, 0, 0.85)"};
  backdrop-filter: blur(5px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const ModalContainer = styled.div<{ $isDark: boolean }>`
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  background: ${({ $isDark }) => ($isDark ? "#0f172a" : "#ffffff")};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  border: ${({ $isDark }) => ($isDark ? "1px solid #334155" : "none")};

  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`

const Content = styled.div<{ $isDark: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: ${({ $isDark }) => ($isDark ? "#0f172a" : "#ffffff")};
`

interface RankingModalProps {
  exerciseId: string
  exerciseTitle?: string
  onClose: () => void
}

export default function RankingModal({
  exerciseId,
  exerciseTitle,
  onClose,
}: RankingModalProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Overlay $isDark={isDark} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer $isDark={isDark}>
        <Header>
          <Title>
            <FaTrophy />
            Ranking {exerciseTitle && `- ${exerciseTitle}`}
          </Title>
          <CloseButton onClick={onClose} type="button">
            <FaTimes />
          </CloseButton>
        </Header>

        <Content $isDark={isDark}>
          <ExerciseRanking exerciseId={exerciseId} limit={50} showMyPosition={true} />
        </Content>
      </ModalContainer>
    </Overlay>
  )
}

