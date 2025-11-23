import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, Rocket } from "lucide-react";
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
          <S.LoginButton 
            to="/login"
            as={motion(Link)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogIn size={18} />
            Entrar
          </S.LoginButton>
          <S.SignupButton 
            to="/signup"
            as={motion(Link)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Rocket size={18} />
            Começar Agora
          </S.SignupButton>
        </S.NavActions>

        <S.MobileMenuButton 
          onClick={toggleMobileMenu} 
          aria-label="Toggle menu"
          as={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </S.MobileMenuButton>
      </S.NavContainer>

      <AnimatePresence>
        {mobileMenuOpen && (
          <S.MobileMenu
            as={motion.div}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <S.MobileMenuLinks>
              <S.MobileNavLink 
                to="/" 
                onClick={toggleMobileMenu}
                as={motion(Link)}
                whileHover={{ x: 5 }}
              >
                Início
              </S.MobileNavLink>
              <S.MobileNavLink 
                to="/sobre" 
                onClick={toggleMobileMenu}
                as={motion(Link)}
                whileHover={{ x: 5 }}
              >
                Sobre
              </S.MobileNavLink>
            </S.MobileMenuLinks>
            <S.MobileMenuActions>
              <S.MobileLoginButton 
                to="/login" 
                onClick={toggleMobileMenu}
                as={motion(Link)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Entrar
              </S.MobileLoginButton>
              <S.MobileSignupButton 
                to="/signup" 
                onClick={toggleMobileMenu}
                as={motion(Link)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Começar Agora
              </S.MobileSignupButton>
            </S.MobileMenuActions>
          </S.MobileMenu>
        )}
      </AnimatePresence>
    </S.Nav>
  );
}
