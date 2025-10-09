import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { FaGoogle, FaFacebook, FaArrowLeft } from "react-icons/fa";
import Notification from "@components/Notification";
import "./AuthPages.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
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
      // Extrair mensagem de erro da API
      let errorMessage = "Erro ao fazer login";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Tratar erros específicos
      if (err.response?.status === 401) {
        errorMessage = "E-mail ou senha incorretos. Tente novamente.";
      } else if (err.response?.status === 404) {
        errorMessage = "Usuário não encontrado. Verifique seu e-mail.";
      } else if (err.response?.status === 400) {
        errorMessage = "Por favor, preencha todos os campos corretamente.";
      } else if (!navigator.onLine) {
        errorMessage = "Sem conexão com a internet. Verifique sua conexão.";
      } else if (err.code === "ECONNREFUSED" || err.statusCode === 0) {
        errorMessage =
          "Não foi possível conectar ao servidor. Tente novamente.";
      }

      setError(errorMessage);
      setNotification({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Notificação */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="auth-container">
      {/* Formas geométricas decorativas */}
      <div className="shape shape-blue-top"></div>
      <div className="shape shape-yellow-bottom"></div>

      {/* Card de Login */}
      <div className="auth-card">
        <Link to="/" className="back-button">
          <FaArrowLeft /> Voltar para Home
        </Link>

        <h1 className="auth-title">
          <span className="bracket">{"{"}</span>Login
          <span className="bracket">{"}"}</span>
        </h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu E-mail"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua Senha"
              required
              className="form-input"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-link">
          Não tem uma conta?{" "}
          <Link to="/signup" className="link-signup">
            CADASTRE-SE!
          </Link>
        </p>

        <div className="social-buttons">
          <button
            className="btn-social btn-google"
            onClick={() => alert("Login com Google em breve!")}
          >
            <FaGoogle className="social-icon" />
            Entrar com Google
          </button>
          <button
            className="btn-social btn-facebook"
            onClick={() => alert("Login com Facebook em breve!")}
          >
            <FaFacebook className="social-icon" />
            Entrar com Facebook
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
