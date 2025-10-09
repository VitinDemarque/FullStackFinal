import { FaUser, FaStar } from 'react-icons/fa'

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
    <section className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100 py-20 px-8 overflow-hidden">
      {/* Background decorative shapes */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 opacity-30 translate-x-32 translate-y-32 rounded-tl-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
          {'{'}O Que Dizem Nossos Alunos{'}'}
        </h2>
        <p className="text-center text-gray-700 text-lg mb-12 max-w-2xl mx-auto">
          Mais de 10.000 desenvolvedores já transformaram suas carreiras com a DevQuest
        </p>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                    <FaUser className="text-2xl text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  {/* Stars */}
                  <div className="flex gap-1 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-sm" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 leading-relaxed italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-700 text-lg mb-4">
            Junte-se a milhares de desenvolvedores que já estão aprendendo de forma diferente
          </p>
          <a
            href="/signup"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold px-8 py-4 rounded-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Começar Gratuitamente Agora
          </a>
        </div>
      </div>
    </section>
  )
}
