import { useState, FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { FaArrowLeft } from "react-icons/fa";
import Notification from "@components/Notification";
import "./AuthPages.css";

interface College {
  _id: string;
  name: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    handle: "",
    college: "",
  });
  const [colleges, setColleges] = useState<College[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Mock de faculdades - você pode buscar da API depois
    setColleges([
      { _id: "1", name: "Universidade de São Paulo (USP)" },
      { _id: "2", name: "Universidade Federal do Rio de Janeiro (UFRJ)" },
      { _id: "3", name: "Universidade Estadual de Campinas (UNICAMP)" },
      { _id: "4", name: "Universidade Federal de Minas Gerais (UFMG)" },
      { _id: "5", name: "Pontifícia Universidade Católica (PUC)" },
    ]);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNotification(null);
    setLoading(true);

    try {
      // Combinar firstName e lastName em name
      const signupData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        handle: formData.handle || formData.email.split("@")[0], // Gerar handle do email se não fornecido
        college: formData.college,
      };

      await signup(signupData);

      // Sucesso!
      setNotification({
        type: "success",
        message: "Conta criada com sucesso! Redirecionando...",
      });

      // Aguardar 2 segundos antes de redirecionar
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      // Extrair mensagem de erro da API
      let errorMessage = "Erro ao criar conta";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Tratar erros específicos
      if (err.response?.status === 409) {
        errorMessage = "Este e-mail já está cadastrado. Tente fazer login.";
      } else if (err.response?.status === 400) {
        if (err.response.data?.details) {
          // Erros de validação
          const details = err.response.data.details;
          if (Array.isArray(details)) {
            errorMessage = details.map((d: any) => d.message).join(", ");
          }
        }
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        <div className="shape shape-yellow-top"></div>
        <div className="shape shape-orange-bottom"></div>

        {/* Card de Cadastro */}
        <div className="auth-card signup-card">
          <Link to="/" className="back-button">
            <FaArrowLeft /> Voltar para Home
          </Link>

          <h1 className="auth-title">
            <span className="bracket">{"{"}</span>Cadastro
            <span className="bracket">{"}"}</span>
          </h1>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Digite seu nome"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Sobrenome</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder=""
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Faculdade</label>
              <select
                name="college"
                value={formData.college}
                onChange={handleChange}
                required
                className="form-input form-select"
              >
                <option value="">Selecione sua Faculdade</option>
                {colleges.map((college) => (
                  <option key={college._id} value={college._id}>
                    {college.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite seu E-mail"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua senha"
                required
                className="form-input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Criando conta..." : "Concluir"}
            </button>
          </form>

          <p className="auth-link">
            Já tem conta?{" "}
            <Link to="/login" className="link-signup">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
