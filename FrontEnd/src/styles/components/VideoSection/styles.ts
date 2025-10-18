import styled from 'styled-components';

export const VideoSectionContainer = styled.section`
  position: relative;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%);
  padding: 5rem 2rem;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 3rem 1.5rem;
  }
`;

export const ShapeTopLeft = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 24rem;
  height: 24rem;
  background: ${({ theme }) => theme.colors.yellow400};
  opacity: 0.4;
  transform: translate(-12rem, -12rem);
  border-radius: 0 0 100% 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 16rem;
    height: 16rem;
    transform: translate(-8rem, -8rem);
  }
`;

export const VideoContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
`;

export const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.gray900};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 3rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

export const Description = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray700};
  font-size: 1.125rem;
  margin-bottom: 3rem;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
`;

export const VideoContainer = styled.div`
  max-width: 48rem;
  margin: 0 auto 3rem;
`;

export const VideoPlaceholder = styled.div`
  background: ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  overflow: hidden;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
`;

export const VideoContentInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 10;
  position: relative;
`;

export const PlayButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  background: #dc2626;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;

  svg {
    color: ${({ theme }) => theme.colors.white};
    font-size: 1.5rem;
    margin-left: 0.25rem;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

export const VideoText = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: 500;
`;

export const ComingSoonText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

interface FeatureCardProps {
  color: 'blue' | 'yellow' | 'green' | 'purple';
}

const colorMap = {
  blue: {
    bg: '#dbeafe',
    icon: '#2563eb',
  },
  yellow: {
    bg: '#fef3c7',
    icon: '#d97706',
  },
  green: {
    bg: '#d1fae5',
    icon: '#059669',
  },
  purple: {
    bg: '#e9d5ff',
    icon: '#7c3aed',
  },
};

export const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.xl};
    transform: translateY(-4px);
  }
`;

export const FeatureIcon = styled.div<FeatureCardProps>`
  width: 3.5rem;
  height: 3.5rem;
  background: ${({ color }) => colorMap[color].bg};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;

  svg {
    color: ${({ color }) => colorMap[color].icon};
    font-size: 1.5rem;
  }
`;

export const FeatureTitle = styled.h3`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: 0.5rem;
`;

export const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.875rem;
`;

