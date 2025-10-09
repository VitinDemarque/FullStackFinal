import { FcGoogle } from 'react-icons/fc'
import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50 to-blue-200 py-20 px-8 overflow-hidden">
      {/* Background decorative shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-300 rounded-full opacity-30 -translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 opacity-40 translate-x-32 translate-y-32 rounded-tl-full" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            {'{'}Aprenda a Programar Jogando{'}'}
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Transforme seu aprendizado em código com desafios práticos e divertidos. 
            Suba no ranking, ganhe XP, conquiste badges e torne-se um desenvolvedor de elite 
            através da gamificação educacional!
          </p>

          {/* Google Login Button */}
          <Link to="/signup">
            <button className="flex items-center space-x-3 bg-white border-2 border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg">
              <FcGoogle className="text-2xl" />
              <span className="font-medium text-gray-700">Continuar com Google</span>
            </button>
          </Link>

          {/* Stats */}
          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-blue-600">10K+</p>
              <p className="text-sm text-gray-600">Estudantes Ativos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">500+</p>
              <p className="text-sm text-gray-600">Desafios</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">20+</p>
              <p className="text-sm text-gray-600">Linguagens</p>
            </div>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative">
          <img
            src="https://illustrations.popsy.co/amber/remote-work.svg"
            alt="Desenvolvedores programando"
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}
