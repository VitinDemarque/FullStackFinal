import styled from 'styled-components';

export const TestimonialsSectionContainer = styled.section`
  position: relative;
  background: linear-gradient(135deg, #f9fafb 0%, #eff6ff 50%, #dbeafe 100%);
  padding: 5rem 2rem;
  overflow: hidden;

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

export const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const TestimonialCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.xl};
    transform: translateY(-4px);
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
  border: 4px solid ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.md};

  svg {
    color: ${({ theme }) => theme.colors.white};
    font-size: 1.5rem;
  }
`;

export const TestimonialInfo = styled.div`
  flex: 1;
`;

export const TestimonialName = styled.h3`
  font-weight: 700;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.gray900};
`;

export const TestimonialRole = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
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
  color: ${({ theme }) => theme.colors.gray700};
  line-height: 1.75;
  font-style: italic;
`;

export const CTAContainer = styled.div`
  text-align: center;
  margin-top: 3rem;
`;

export const CTAText = styled.p`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: 1.125rem;
  margin-bottom: 1rem;
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

