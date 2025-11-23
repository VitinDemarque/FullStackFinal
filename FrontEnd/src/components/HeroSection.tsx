import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { Users, Target, Languages, ArrowRight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import * as S from "@/styles/components/HeroSection/styles";
import { useAuth } from "@/contexts/AuthContext";
import { statsService } from "@/services/stats.service";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Componente para animar números
const AnimatedNumber: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(value, increment * step);
      setDisplayValue(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (val: number) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    return Math.floor(val).toString();
  };

  return <>{formatValue(displayValue)}{suffix}</>;
};

export default function HeroSection() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: 0,
    challenges: 0,
    languages: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const publicStats = await statsService.getPublicStats();
        setStats({
          students: publicStats.totalUsers,
          challenges: publicStats.totalExercises,
          languages: publicStats.totalLanguages
        });
      } catch (error) {
        // Mantém valores padrão em caso de erro
      }
    };

    loadStats();
  }, []);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        await loginWithGoogle(credentialResponse.credential);
      } catch {
        // Error handled by AuthContext
      }
    }
  };

  const handleGoogleError = () => {
    // Error handled by Google OAuth component
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <S.HeroSectionContainer
      as={motion.section}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <S.ShapeTopLeft 
        as={motion.div}
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <S.ShapeBottomRight 
        as={motion.div}
        animate={{ 
          rotate: [0, -360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Linhas decorativas brancas - apenas no modo dark */}
      <S.DecorativeLines>
        <S.SpiralLine1 />
        <S.SpiralLine2 />
        <S.DecorativeLine1 />
        <S.DecorativeLine2 />
        <S.DecorativeLine3 />
        <S.DecorativeLine4 />
        <S.DecorativeX1 />
        <S.DecorativeX2 />
        <S.DecorativeX3 />
        <S.DecorativeX4 />
        <S.DecorativeX5 />
      </S.DecorativeLines>

      <S.HeroContent
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <S.LeftContent>
          <S.Title
            as={motion.h1}
            variants={itemVariants}
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {"{"}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Aperfeiçõe suas Habilidades Programando
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {"}"}
            </motion.span>
          </S.Title>
          <S.Description
            as={motion.p}
            variants={itemVariants}
          >
            Aperfeiçõe suas habilidades fazendo desafios práticos e criando seus próprios desafios. 
            Suba no ranking, ganhe XP, conquiste badges e torne-se um desenvolvedor de elite através 
            da gamificação educacional. Aprenda programando e compartilhe conhecimento com a comunidade!
          </S.Description>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <S.GoogleButtonWrapper>
              {googleClientId ? (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  render={({ onClick, disabled }) => (
                    <S.GoogleButtonAction 
                      onClick={onClick} 
                      disabled={disabled}
                      as={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FcGoogle size={24} />
                      <span>Continuar com Google</span>
                      <ArrowRight size={20} />
                    </S.GoogleButtonAction>
                  )}
                />
              ) : (
                <S.GoogleButtonAction 
                  onClick={() => navigate("/login")}
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FcGoogle size={24} />
                  <span>Começar Agora</span>
                  <ArrowRight size={20} />
                </S.GoogleButtonAction>
              )}
            </S.GoogleButtonWrapper>
          </motion.div>

          <S.Stats
            as={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <S.StatItem
              as={motion.div}
              variants={itemVariants}
              whileHover={{ scale: 1.1, y: -5 }}
            >
              <Users size={24} style={{ marginBottom: '0.5rem', color: 'var(--color-blue-400)' }} />
              <S.StatValue>
                <AnimatedNumber value={stats.students} suffix="+" />
              </S.StatValue>
              <S.StatLabel>Estudantes Ativos</S.StatLabel>
            </S.StatItem>
            <S.StatItem
              as={motion.div}
              variants={itemVariants}
              whileHover={{ scale: 1.1, y: -5 }}
            >
              <Target size={24} style={{ marginBottom: '0.5rem', color: 'var(--color-blue-400)' }} />
              <S.StatValue>
                <AnimatedNumber value={stats.challenges} suffix="+" />
              </S.StatValue>
              <S.StatLabel>Desafios</S.StatLabel>
            </S.StatItem>
            <S.StatItem
              as={motion.div}
              variants={itemVariants}
              whileHover={{ scale: 1.1, y: -5 }}
            >
              <Languages size={24} style={{ marginBottom: '0.5rem', color: 'var(--color-blue-400)' }} />
              <S.StatValue>
                <AnimatedNumber value={stats.languages} suffix="+" />
              </S.StatValue>
              <S.StatLabel>Linguagens</S.StatLabel>
            </S.StatItem>
          </S.Stats>
        </S.LeftContent>

        <S.IllustrationContainer
          as={motion.div}
          variants={itemVariants}
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ duration: 0.3 }}
        >
          <S.IllustrationImage
            src="https://illustrations.popsy.co/amber/remote-work.svg"
            alt="Desenvolvedores programando"
            as={motion.img}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </S.IllustrationContainer>
      </S.HeroContent>
    </S.HeroSectionContainer>
  );
}
