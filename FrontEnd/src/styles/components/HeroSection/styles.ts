import styled from 'styled-components';

export const HeroSectionContainer = styled.section`
  position: relative;
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-background) 50%, var(--color-background) 100%);
  padding: 5rem 2rem;
  overflow: hidden;
  transition: background 0.3s ease;

  .dark & {
    background: linear-gradient(135deg, var(--color-surface) 0%, #1e293b 50%, #0f172a 100%);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 3rem 1.5rem;
  }
`;

export const ShapeTopLeft = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 16rem;
  height: 16rem;
  background: ${({ theme }) => theme.colors.accentYellow};
  border-radius: 50%;
  opacity: 0.3;
  transform: translate(-8rem, -8rem);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 10rem;
    height: 10rem;
    transform: translate(-5rem, -5rem);
  }
`;

export const ShapeBottomRight = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24rem;
  height: 24rem;
  background: #93c5fd;
  opacity: 0.4;
  transform: translate(8rem, 8rem);
  border-radius: 100% 0 0 0;
  transition: background 0.3s ease, opacity 0.3s ease;

  .dark & {
    background: var(--color-blue-500);
    opacity: 0.2;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 16rem;
    height: 16rem;
    transform: translate(5rem, 5rem);
  }
`;

export const HeroContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 10;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.1;
  transition: color 0.3s ease;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 4rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

export const Description = styled.p`
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  line-height: 1.75;
  transition: color 0.3s ease;
`;

export const GoogleButtonWrapper = styled.div`
  width: fit-content;
`;

export const GoogleButtonAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  padding: 1rem 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
  width: fit-content;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
  }

  span {
    flex: 1;
  }

  &:hover {
    background: var(--color-surface-hover);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-blue-400);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Stats = styled.div`
  display: flex;
  gap: 2rem;
  padding-top: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 1.5rem;
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: default;

  .dark & {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const StatValue = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-blue-400);
  transition: color 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.75rem;
  }
`;

export const StatLabel = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-light);
  transition: color 0.3s ease;
`;

export const IllustrationContainer = styled.div`
  position: relative;
`;

export const IllustrationImage = styled.img`
  width: 100%;
  height: auto;
  filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25));
`;

// Container para linhas decorativas
export const DecorativeLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
  opacity: 0;
  transition: opacity 0.3s ease;

  .dark & {
    opacity: 1;
  }
`;

// Espirais decorativas
export const SpiralLine1 = styled.div`
  position: absolute;
  top: 10%;
  left: 5%;
  width: 120px;
  height: 120px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  opacity: 0.6;
  animation: spiralRotate 20s linear infinite;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80px;
    height: 80px;
    border: 2px solid rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  @keyframes spiralRotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 80px;
    height: 80px;
    top: 5%;
    left: 2%;
  }
`;

export const SpiralLine2 = styled.div`
  position: absolute;
  bottom: 15%;
  left: 8%;
  width: 100px;
  height: 100px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  opacity: 0.5;
  animation: spiralRotateReverse 25s linear infinite;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 70px;
    height: 70px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  @keyframes spiralRotateReverse {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 60px;
    height: 60px;
    bottom: 10%;
    left: 3%;
  }
`;

// Linhas decorativas curvas
export const DecorativeLine1 = styled.div`
  position: absolute;
  top: 20%;
  right: 15%;
  width: 150px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transform: rotate(-25deg);
  opacity: 0.6;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100px;
    top: 15%;
    right: 10%;
  }
`;

export const DecorativeLine2 = styled.div`
  position: absolute;
  top: 35%;
  right: 20%;
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  transform: rotate(15deg);
  opacity: 0.5;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 80px;
    top: 30%;
    right: 15%;
  }
`;

export const DecorativeLine3 = styled.div`
  position: absolute;
  bottom: 25%;
  right: 10%;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: rotate(45deg);
  opacity: 0.4;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 70px;
    bottom: 20%;
    right: 8%;
  }
`;

export const DecorativeLine4 = styled.div`
  position: absolute;
  top: 50%;
  left: 12%;
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  transform: rotate(-35deg);
  opacity: 0.5;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 60px;
    top: 45%;
    left: 8%;
  }
`;

// Elementos decorativos em X
export const DecorativeX1 = styled.div`
  position: absolute;
  top: 15%;
  right: 25%;
  width: 20px;
  height: 20px;
  opacity: 0.4;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 100%;
    background: rgba(255, 255, 255, 0.6);
    transform: translate(-50%, -50%);
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 15px;
    height: 15px;
    top: 12%;
    right: 20%;
  }
`;

export const DecorativeX2 = styled.div`
  position: absolute;
  bottom: 30%;
  left: 15%;
  width: 15px;
  height: 15px;
  opacity: 0.35;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 12px;
    height: 12px;
    bottom: 25%;
    left: 12%;
  }
`;

export const DecorativeX3 = styled.div`
  position: absolute;
  top: 40%;
  right: 12%;
  width: 12px;
  height: 12px;
  opacity: 0.3;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1.5px;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 10px;
    height: 10px;
    top: 35%;
    right: 10%;
  }
`;

export const DecorativeX4 = styled.div`
  position: absolute;
  bottom: 40%;
  right: 18%;
  width: 18px;
  height: 18px;
  opacity: 0.4;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 100%;
    background: rgba(255, 255, 255, 0.55);
    transform: translate(-50%, -50%);
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 14px;
    height: 14px;
    bottom: 35%;
    right: 15%;
  }
`;

export const DecorativeX5 = styled.div`
  position: absolute;
  top: 60%;
  left: 8%;
  width: 14px;
  height: 14px;
  opacity: 0.35;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1.5px;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 12px;
    height: 12px;
    top: 55%;
    left: 5%;
  }
`;

