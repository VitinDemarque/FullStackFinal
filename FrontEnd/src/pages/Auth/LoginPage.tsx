import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { FaGoogle, FaFacebook, FaArrowLeft } from "react-icons/fa";
import Notification from "@components/Notification";
import ErrorAlert from "@components/ErrorAlert";
import { useErrorHandler } from "@hooks/useErrorHandler";
import * as S from "@/styles/pages/Auth/styles";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { error, setError, clearError } = useErrorHandler();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    setNotification(null);
    setLoading(true);

    try {
      await login({ email, password });

      // Sucesso!
      setNotification({
        type: "success",
        message: "Login realizado com sucesso! Bem-vindo de volta!",
      });

      // Aguardar 1.5 segundos antes de redirecionar
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err, "Login");
      setNotification({
        type: "error",
        message: err.message || "Erro ao fazer login",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleRetry() {
    clearError();
    handleSubmit(new Event('submit') as any);
  }

  return (
    <>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <S.AuthContainer>
        <S.Shape variant="blue-top" />
        <S.Shape variant="yellow-bottom" />

        <S.AuthCard>
          <S.BackButton as={Link} to="/">
            <FaArrowLeft /> Voltar para Home
          </S.BackButton>

          <S.AuthTitle>
            <S.Bracket>{"{"}</S.Bracket>Login
            <S.Bracket>{"}"}</S.Bracket>
          </S.AuthTitle>

          {error && (
            <ErrorAlert
              error={error}
              onClose={clearError}
              onRetry={error.canRetry ? handleRetry : undefined}
            />
          )}

          <S.AuthForm onSubmit={handleSubmit}>
            <S.FormGroup>
              <S.FormLabel>E-mail</S.FormLabel>
              <S.FormInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu E-mail"
                required
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.FormLabel>Senha</S.FormLabel>
              <S.FormInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua Senha"
                required
              />
            </S.FormGroup>

            <S.PrimaryButton type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </S.PrimaryButton>
          </S.AuthForm>

          <S.AuthLink>
            Não tem uma conta?{" "}
            <S.LinkHighlight as={Link} to="/signup">
              CADASTRE-SE!
            </S.LinkHighlight>
          </S.AuthLink>

          <S.SocialButtons>
            <S.SocialButton
              variant="google"
              type="button"
              onClick={() => alert("Login com Google em breve!")}
            >
              <FaGoogle />
              Entrar com Google
            </S.SocialButton>
            <S.SocialButton
              variant="facebook"
              type="button"
              onClick={() => alert("Login com Facebook em breve!")}
            >
              <FaFacebook />
              Entrar com Facebook
            </S.SocialButton>
          </S.SocialButtons>
        </S.AuthCard>
      </S.AuthContainer>
    </>
  );
}
