import { FaUser, FaStar } from 'react-icons/fa'
import * as S from '@/styles/components/TestimonialsSection/styles'

interface Testimonial {
  id: number
  name: string
  role: string
  text: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ana Carolina Silva',
    role: 'Estudante de Ciência da Computação - USP',
    text: 'A gamificação torna o aprendizado muito mais divertido! Consegui melhorar minhas habilidades em Python e JavaScript enquanto competia com colegas. Recomendo demais!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Carlos Eduardo Santos',
    role: 'Desenvolvedor Junior - Google',
    text: 'Comecei do zero e em 6 meses já estava trabalhando como dev. Os desafios práticos me prepararam para o mercado de trabalho de forma incrível. Melhor plataforma que já usei!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Mariana Oliveira',
    role: 'Estudante de Engenharia - UNICAMP',
    text: 'O sistema de ranking me motivou a estudar todos os dias. Já conquistei mais de 50 badges e subi para o top 100 global. É viciante de um jeito bom!',
    rating: 5,
  },
  {
    id: 4,
    name: 'Felipe Costa',
    role: 'Desenvolvedor Full Stack - Microsoft',
    text: 'Uso a plataforma para me manter afiado e aprender novas linguagens. A variedade de desafios e o feedback instantâneo fazem toda a diferença no aprendizado.',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <S.TestimonialsSectionContainer>
      <S.ShapeBottomRight />

      <S.TestimonialsContent>
        <S.Title>
          {'{'}O Que Dizem Nossos Alunos{'}'}
        </S.Title>
        <S.Description>
          Mais de 10.000 desenvolvedores já transformaram suas carreiras com a DevQuest
        </S.Description>

        <S.TestimonialsGrid>
          {testimonials.map((testimonial) => (
            <S.TestimonialCard key={testimonial.id}>
              <S.TestimonialHeader>
                <S.AvatarContainer>
                  <S.Avatar>
                    <FaUser />
                  </S.Avatar>
                </S.AvatarContainer>
                <S.TestimonialInfo>
                  <S.TestimonialName>
                    {testimonial.name}
                  </S.TestimonialName>
                  <S.TestimonialRole>{testimonial.role}</S.TestimonialRole>
                  <S.Stars>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </S.Stars>
                </S.TestimonialInfo>
              </S.TestimonialHeader>

              <S.TestimonialText>
                "{testimonial.text}"
              </S.TestimonialText>
            </S.TestimonialCard>
          ))}
        </S.TestimonialsGrid>

        <S.CTAContainer>
          <S.CTAText>
            Junte-se a milhares de desenvolvedores que já estão aprendendo de forma diferente
          </S.CTAText>
          <S.CTAButton href="/signup">
            Começar Gratuitamente Agora
          </S.CTAButton>
        </S.CTAContainer>
      </S.TestimonialsContent>
    </S.TestimonialsSectionContainer>
  )
}
