import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-bracket">{"{"}</span>
          <span className="logo-text">DevQuest</span>
          <span className="logo-bracket">{"}"}</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu desktop-menu">
          <Link to="/" className="nav-link">
            Início
          </Link>
          <Link to="/desafios" className="nav-link">
            Desafios
          </Link>
          <Link to="/ranking" className="nav-link">
            Ranking
          </Link>
          <Link to="/meu-progresso" className="nav-link">
            Meu Progresso
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions desktop-actions">
          <Link to="/login" className="btn-login">
            <FaUser className="btn-icon" />
            Entrar
          </Link>
          <Link to="/signup" className="btn-signup">
            Começar Agora
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-links">
            <Link to="/" className="mobile-nav-link" onClick={toggleMobileMenu}>
              Início
            </Link>
            <Link
              to="/desafios"
              className="mobile-nav-link"
              onClick={toggleMobileMenu}
            >
              Desafios
            </Link>
            <Link
              to="/ranking"
              className="mobile-nav-link"
              onClick={toggleMobileMenu}
            >
              Ranking
            </Link>
            <Link
              to="/meu-progresso"
              className="mobile-nav-link"
              onClick={toggleMobileMenu}
            >
              Meu Progresso
            </Link>
          </div>
          <div className="mobile-menu-actions">
            <Link
              to="/login"
              className="mobile-btn-login"
              onClick={toggleMobileMenu}
            >
              Entrar
            </Link>
            <Link
              to="/signup"
              className="mobile-btn-signup"
              onClick={toggleMobileMenu}
            >
              Começar Agora
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
