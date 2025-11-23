import styled from 'styled-components';

export const TestimonialsSectionContainer = styled.section`
  position: relative;
  background: linear-gradient(135deg, var(--color-background) 0%, var(--color-background) 50%, var(--color-background) 100%);
  padding: 5rem 2rem;
  overflow: hidden;
  transition: background 0.3s ease;

  .dark & {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 3rem 1.5rem;
  }
`;

export const ShapeBottomRight = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24rem;
  height: 24rem;
  background: #93c5fd;
  opacity: 0.3;
  transform: translate(8rem, 8rem);
  border-radius: 100% 0 0 0;
  transition: background 0.3s ease, opacity 0.3s ease;

  .dark & {
    background: var(--color-blue-500);
    opacity: 0.15;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 16rem;
    height: 16rem;
    transform: translate(5rem, 5rem);
  }
`;

export const TestimonialsContent = styled.div`
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
  color: var(--color-text-primary);
  transition: color 0.3s ease;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 3rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

export const Description = styled.p`
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  margin-bottom: 3rem;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  transition: color 0.3s ease;
`;

export const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const TestimonialCard = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--shadow-xl);
    transform: translateY(-4px);
    border-color: var(--color-blue-400);
  }
`;

export const TestimonialHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const AvatarContainer = styled.div`
  flex-shrink: 0;
`;

export const Avatar = styled.div`
  width: 4rem;
  height: 4rem;
  background: ${({ theme }) => theme.gradients.blue};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid var(--color-surface);
  box-shadow: var(--shadow-md);
  transition: border-color 0.3s ease;
  overflow: hidden;
  position: relative;

  svg {
    color: ${({ theme }) => theme.colors.white};
    font-size: 1.5rem;
  }
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

export const TestimonialInfo = styled.div`
  flex: 1;
`;

export const TestimonialName = styled.h3`
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--color-text-primary);
  transition: color 0.3s ease;
`;

export const TestimonialRole = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-light);
  transition: color 0.3s ease;
`;

export const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-top: 0.25rem;

  svg {
    color: ${({ theme }) => theme.colors.yellow400};
    font-size: 0.875rem;
  }
`;

export const TestimonialText = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.75;
  font-style: italic;
  transition: color 0.3s ease;
`;

export const CTAContainer = styled.div`
  text-align: center;
  margin-top: 3rem;
`;

export const CTAText = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
`;

export const CTAButton = styled.a`
  display: inline-block;
  background: ${({ theme }) => theme.gradients.blue};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.xl};
    transform: scale(1.05);
  }
`;

