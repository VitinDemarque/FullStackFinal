import { FaPlay, FaCode, FaTrophy, FaUsers, FaChartLine } from "react-icons/fa";

export default function VideoSection() {
  return (
    <section className="relative bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 py-20 px-8 overflow-hidden">
      {/* Background decorative shape */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 opacity-40 -translate-x-48 -translate-y-48 rounded-br-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
          {"{"}Como Funciona a Plataforma{"}"}
        </h2>
        <p className="text-center text-gray-700 text-lg mb-12 max-w-2xl mx-auto">
          Uma plataforma completa de aprendizado gamificado que transforma a
          forma como você aprende a programar
        </p>

        {/* Video Placeholder */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-black rounded-2xl shadow-2xl overflow-hidden aspect-video flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
            <div className="flex flex-col items-center justify-center gap-4 z-10">
              <div className="flex items-center justify-center w-20 h-20 bg-red-600 rounded-full">
                <FaPlay className="text-white text-2xl ml-1" />
              </div>
              <p className="text-white text-sm font-medium">
                Assista ao vídeo introdutório (2:30)
              </p>
              <p className="text-white/70 text-xs">(Vídeo em breve)</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCode className="text-blue-600 text-2xl" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Desafios Práticos</h3>
            <p className="text-gray-600 text-sm">
              Resolva exercícios reais de programação em diversas linguagens
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-center">
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrophy className="text-yellow-600 text-2xl" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Sistema de XP</h3>
            <p className="text-gray-600 text-sm">
              Ganhe experiência, suba de nível e desbloqueie conquistas
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaChartLine className="text-green-600 text-2xl" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Ranking Global</h3>
            <p className="text-gray-600 text-sm">
              Compare seu progresso e compita com outros desenvolvedores
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-center">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-purple-600 text-2xl" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Comunidade Ativa</h3>
            <p className="text-gray-600 text-sm">
              Participe de grupos e aprenda com outros estudantes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
