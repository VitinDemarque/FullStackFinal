import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { statsService } from '@/services/stats.service';
import * as S from '@/styles/components/TestimonialsSection/styles';

interface Testimonial {
  id: number
  name: string
  role: string
  text: string
  rating: number
  avatar: string
}

const getAvatarUrl = (name: string): string => {
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&size=128&background=667eea&color=fff&bold=true&font-size=0.5`;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ana Carolina Silva',
    role: 'Desenvolvedora Full Stack',
    text: 'A plataforma me ajudou a praticar programação de forma divertida e eficiente. Os desafios práticos e o sistema de ranking me mantiveram motivada. Consegui melhorar significativamente minhas habilidades em várias linguagens!',
    rating: 5,
    avatar: getAvatarUrl('Ana Carolina Silva'),
  },
  {
    id: 2,
    name: 'Carlos Eduardo Santos',
    role: 'Desenvolvedor Backend',
    text: 'Os desafios são muito bem estruturados e me ajudaram a preparar para entrevistas técnicas. A possibilidade de criar meus próprios desafios também é incrível! Recomendo para qualquer desenvolvedor que queira evoluir.',
    rating: 5,
    avatar: getAvatarUrl('Carlos Eduardo Santos'),
  },
  {
    id: 3,
    name: 'Mariana Oliveira',
    role: 'Desenvolvedora Frontend',
    text: 'Adoro a gamificação! O sistema de XP e badges me motiva a estudar todos os dias. Já subi vários níveis e conquistei muitas conquistas. A comunidade também é muito acolhedora e colaborativa.',
    rating: 5,
    avatar: getAvatarUrl('Mariana Oliveira'),
  },
  {
    id: 4,
    name: 'Felipe Costa',
    role: 'Desenvolvedor Full Stack',
    text: 'Uso a plataforma para me manter atualizado e aprender novas tecnologias. A variedade de desafios e o feedback instantâneo são excelentes. Os grupos de estudo também são uma funcionalidade muito útil!',
    rating: 5,
    avatar: getAvatarUrl('Felipe Costa'),
  },
]

export default function TestimonialsSection() {
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const publicStats = await statsService.getPublicStats();
        setTotalUsers(publicStats.totalUsers);
      } catch {
        // Mantém valor padrão em caso de erro
      }
    };

    loadStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <S.TestimonialsSectionContainer
      as={motion.section}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <S.ShapeBottomRight />

      <S.TestimonialsContent>
        <S.Title
          as={motion.h2}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {'{'}O Que Dizem Nossos Desenvolvedores{'}'}
        </S.Title>
        <S.Description
          as={motion.p}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {totalUsers > 0 
            ? `Mais de ${formatNumber(totalUsers)} desenvolvedores já estão transformando suas carreiras com a DevQuest`
            : 'Milhares de desenvolvedores já estão transformando suas carreiras com a DevQuest'
          }
        </S.Description>

        <S.TestimonialsGrid
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {testimonials.map((testimonial) => (
            <S.TestimonialCard 
              key={testimonial.id}
              as={motion.div}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <S.TestimonialHeader>
                <S.AvatarContainer>
                  <S.Avatar
                    as={motion.div}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <S.AvatarImage 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                    />
                  </S.Avatar>
                </S.AvatarContainer>
                <S.TestimonialInfo>
                  <S.TestimonialName>
                    {testimonial.name}
                  </S.TestimonialName>
                  <S.TestimonialRole>{testimonial.role}</S.TestimonialRole>
                  <S.Stars>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16}
                        fill="var(--color-yellow-400)"
                        color="var(--color-yellow-400)"
                      />
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

        <S.CTAContainer
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <S.CTAText>
            Junte-se a milhares de desenvolvedores que já estão aprendendo de forma diferente
          </S.CTAText>
          <S.CTAButton 
            href="/signup"
            as={motion.a}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Começar Gratuitamente Agora
          </S.CTAButton>
        </S.CTAContainer>
      </S.TestimonialsContent>
    </S.TestimonialsSectionContainer>
  )
}
