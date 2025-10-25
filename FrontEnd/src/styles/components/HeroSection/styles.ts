import styled from 'styled-components';

export const HeroSectionContainer = styled.section`
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #bfdbfe 100%);
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
  color: ${({ theme }) => theme.colors.gray900};
  line-height: 1.1;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 4rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

export const Description = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.gray700};
  line-height: 1.75;
`;

export const GoogleButtonAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.gray300};
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray700};
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadows.md};
  width: fit-content;
  cursor: pointer;
  border: none;

  svg {
    font-size: 1.5rem;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
    box-shadow: ${({ theme }) => theme.shadows.lg};
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

export const StatItem = styled.div``;

export const StatValue = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentBlue};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.75rem;
  }
`;

export const StatLabel = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const IllustrationContainer = styled.div`
  position: relative;
`;

export const IllustrationImage = styled.img`
  width: 100%;
  height: auto;
  filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25));
`;

