import { useState } from "react";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import * as S from "@/styles/components/Navbar/styles";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <S.Nav>
      <S.NavContainer>
        <S.Logo to="/">
          <S.LogoBracket>{"{"}</S.LogoBracket>
          <S.LogoText>DevQuest</S.LogoText>
          <S.LogoBracket>{"}"}</S.LogoBracket>
        </S.Logo>

        <S.NavMenu>
          <S.NavLink to="/">Início</S.NavLink>
          <S.NavLink to="/sobre">Sobre</S.NavLink>
        </S.NavMenu>

        <S.NavActions>
          <S.LoginButton to="/login">
            <FaUser />
            Entrar
          </S.LoginButton>
          <S.SignupButton to="/signup">Começar Agora</S.SignupButton>
        </S.NavActions>

        <S.MobileMenuButton onClick={toggleMobileMenu} aria-label="Toggle menu">
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </S.MobileMenuButton>
      </S.NavContainer>

      {mobileMenuOpen && (
        <S.MobileMenu>
          <S.MobileMenuLinks>
            <S.MobileNavLink to="/" onClick={toggleMobileMenu}>
              Início
            </S.MobileNavLink>
            <S.MobileNavLink to="/sobre" onClick={toggleMobileMenu}>
              Sobre
            </S.MobileNavLink>
          </S.MobileMenuLinks>
          <S.MobileMenuActions>
            <S.MobileLoginButton to="/login" onClick={toggleMobileMenu}>
              Entrar
            </S.MobileLoginButton>
            <S.MobileSignupButton to="/signup" onClick={toggleMobileMenu}>
              Começar Agora
            </S.MobileSignupButton>
          </S.MobileMenuActions>
        </S.MobileMenu>
      )}
    </S.Nav>
  );
}
