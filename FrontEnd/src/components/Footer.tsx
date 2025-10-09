import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaGithub,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Logo e Descrição */}
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-white mb-3">
            <span className="text-blue-400">{"{"}</span>
            DevQuest
            <span className="text-blue-400">{"}"}</span>
          </h3>
          <p className="text-gray-400 max-w-md">
            Transforme seu aprendizado em código com desafios práticos,
            gamificação e uma comunidade apaixonada por programação.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Column 1 - Plataforma */}
          <div>
            <h4 className="font-bold text-white mb-3">Plataforma</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/desafios"
                  className="hover:text-blue-400 transition-colors"
                >
                  Desafios
                </Link>
              </li>
              <li>
                <Link
                  to="/ranking"
                  className="hover:text-blue-400 transition-colors"
                >
                  Ranking
                </Link>
              </li>
              <li>
                <Link
                  to="/badges"
                  className="hover:text-blue-400 transition-colors"
                >
                  Badges
                </Link>
              </li>
              <li>
                <Link
                  to="/grupos"
                  className="hover:text-blue-400 transition-colors"
                >
                  Grupos
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - Linguagens */}
          <div>
            <h4 className="font-bold text-white mb-3">Linguagens</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/python"
                  className="hover:text-blue-400 transition-colors"
                >
                  Python
                </Link>
              </li>
              <li>
                <Link
                  to="/javascript"
                  className="hover:text-blue-400 transition-colors"
                >
                  JavaScript
                </Link>
              </li>
              <li>
                <Link
                  to="/java"
                  className="hover:text-blue-400 transition-colors"
                >
                  Java
                </Link>
              </li>
              <li>
                <Link
                  to="/csharp"
                  className="hover:text-blue-400 transition-colors"
                >
                  C#
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Recursos */}
          <div>
            <h4 className="font-bold text-white mb-3">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/blog"
                  className="hover:text-blue-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/documentacao"
                  className="hover:text-blue-400 transition-colors"
                >
                  Documentação
                </Link>
              </li>
              <li>
                <Link
                  to="/tutoriais"
                  className="hover:text-blue-400 transition-colors"
                >
                  Tutoriais
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-blue-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Empresa */}
          <div>
            <h4 className="font-bold text-white mb-3">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/sobre"
                  className="hover:text-blue-400 transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  to="/carreiras"
                  className="hover:text-blue-400 transition-colors"
                >
                  Carreiras
                </Link>
              </li>
              <li>
                <Link
                  to="/contato"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  to="/parceiros"
                  className="hover:text-blue-400 transition-colors"
                >
                  Parceiros
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 - Suporte */}
          <div>
            <h4 className="font-bold text-white mb-3">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/ajuda"
                  className="hover:text-blue-400 transition-colors"
                >
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link
                  to="/termos"
                  className="hover:text-blue-400 transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  to="/privacidade"
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacidade
                </Link>
              </li>
              <li className="text-gray-400 pt-2">suporte@devquest.com</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Social Media */}
          <div className="flex justify-center space-x-6 mb-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-2xl transition-colors"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 text-2xl transition-colors"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 text-2xl transition-colors"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-500 text-2xl transition-colors"
            >
              <FaYoutube />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-500 text-2xl transition-colors"
            >
              <FaInstagram />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 text-2xl transition-colors"
            >
              <FaFacebook />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-center text-sm text-gray-500">
            Copyright © 2025 DevQuest. Todos os direitos reservados. | Feito com
            💙 para desenvolvedores
          </p>
        </div>
      </div>
    </footer>
  );
}
