import { useState, FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { FaArrowLeft } from "react-icons/fa";
import Notification from "@components/Notification";
import ErrorAlert from "@components/ErrorAlert";
import { useErrorHandler } from "@hooks/useErrorHandler";
import { collegesService } from "@services/index";
import type { College } from "../../types";
import "./AuthPages.css";

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
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const { error, setError, clearError } = useErrorHandler();

  useEffect(() => {
    loadColleges();
  }, []);

  async function loadColleges() {
    setLoadingColleges(true);
    try {
      const response = await collegesService.getAll();
      setColleges(response.items);
    } catch (error) {
      console.error("Erro ao carregar faculdades:", error);
      // Fallback manual caso o serviço falhe completamente
      setColleges([
        { id: '1', name: 'Faculdade de Minas', acronym: 'FAMINAS', city: 'Muriaé', state: 'MG' },
        { id: '2', name: 'Universidade de São Paulo', acronym: 'USP', city: 'São Paulo', state: 'SP' },
        { id: '3', name: 'Universidade Federal de Minas Gerais', acronym: 'UFMG', city: 'Belo Horizonte', state: 'MG' },
        { id: '4', name: 'Pontifícia Universidade Católica', acronym: 'PUC-SP', city: 'São Paulo', state: 'SP' },
      ]);
    } finally {
      setLoadingColleges(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
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
      setError(err, "Signup");
      setNotification({
        type: "error",
        message: err.message || "Erro ao criar conta",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleRetry() {
    clearError();
    handleSubmit(new Event('submit') as any);
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

        {error && <ErrorAlert error={error} onClose={clearError} onRetry={error.canRetry ? handleRetry : undefined} />}

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
                disabled={loadingColleges}
              >
                <option value="">
                  {loadingColleges ? 'Carregando faculdades...' : 'Selecione sua Faculdade'}
                </option>
                {colleges.map((college) => (
                  <option key={college.id} value={college.id}>
                    {college.name} {college.acronym ? `(${college.acronym})` : ''}
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
