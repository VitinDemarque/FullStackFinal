import { useState, FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { FaPlus } from "react-icons/fa";
import CreateCollegeModal from "@/components/CreateCollegeModal";
import CollegeAutocomplete from "@components/Colleges/CollegeAutocomplete";
import { useAuth } from "@contexts/AuthContext";
import { FaArrowLeft } from "react-icons/fa";
import Notification from "@components/Notification";
import ErrorAlert from "@components/ErrorAlert";
import { useErrorHandler } from "@hooks/useErrorHandler";
import { collegesService } from "@services/index";
import type { College } from "../../types";
import * as S from "@/styles/pages/Auth/styles";

const CollegeActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  & > :first-child {
    flex: 1;
  }
`;

const CreateCollegeButton = styled.button`
  background: var(--color-surface);
  color: var(--color-text-primary);
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid var(--color-border);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  cursor: pointer;

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-blue-400);
    box-shadow: var(--shadow-md);
  }
`;

export default function SignupPage() {
  const [isCreateCollegeOpen, setIsCreateCollegeOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      setColleges([
        {
          id: "1",
          name: "Faculdade de Minas",
          acronym: "FAMINAS",
          city: "Muriaé",
          state: "MG",
        },
        {
          id: "2",
          name: "Universidade de São Paulo",
          acronym: "USP",
          city: "São Paulo",
          state: "SP",
        },
        {
          id: "3",
          name: "Universidade Federal de Minas Gerais",
          acronym: "UFMG",
          city: "Belo Horizonte",
          state: "MG",
        },
        {
          id: "4",
          name: "Pontifícia Universidade Católica",
          acronym: "PUC-SP",
          city: "São Paulo",
          state: "SP",
        },
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
      if (formData.password !== formData.confirmPassword) {
        setNotification({
          type: "error",
          message: "As senhas são diferentes.",
        });
        setLoading(false);
        return;
      }

      const signupData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        handle: formData.handle || formData.email.split("@")[0],
        collegeId: formData.college,
      };

      await signup(signupData);

      setNotification({
        type: "success",
        message: "Conta criada com sucesso! Redirecionando...",
      });

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
    handleSubmit(new Event("submit") as any);
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
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <S.AuthContainer>
        <S.Shape $variant="yellow-top" />
        <S.Shape $variant="orange-bottom" />

        <S.AuthCard isSignup>
          <S.BackButton as={Link} to="/">
            <FaArrowLeft /> Voltar para Home
          </S.BackButton>

          <S.AuthTitle>
            <S.Bracket>{"{"}</S.Bracket>Cadastro
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
            <S.FormRow>
              <S.FormGroup>
                <S.FormLabel>Nome Completo</S.FormLabel>
                <S.FormInput
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Digite seu nome"
                  required
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.FormLabel>Sobrenome</S.FormLabel>
                <S.FormInput
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Digite seu sobrenome"
                  required
                />
              </S.FormGroup>
            </S.FormRow>

            <S.FormGroup>
              <S.FormLabel>Faculdade</S.FormLabel>
              <CollegeActions>
                <CollegeAutocomplete
                  value={formData.college}
                  onChange={(id) => setFormData((prev) => ({ ...prev, college: (id || '') }))}
                  onCreateRequested={() => setIsCreateCollegeOpen(true)}
                  placeholder="Digite o nome da faculdade"
                />
                <CreateCollegeButton
                  type="button"
                  aria-label="Criar faculdade"
                  title="Criar faculdade"
                  onClick={() => setIsCreateCollegeOpen(true)}
                >
                  <FaPlus />
                </CreateCollegeButton>
              </CollegeActions>
            </S.FormGroup>

            <S.FormGroup>
              <S.FormLabel>E-mail</S.FormLabel>
              <S.FormInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite seu E-mail"
                required
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.FormLabel>Senha</S.FormLabel>
              <S.FormInput
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua senha"
                required
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.FormLabel>Confirmar Senha</S.FormLabel>
              <S.FormInput
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                required
              />
            </S.FormGroup>

            <S.PrimaryButton type="submit" disabled={loading}>
              {loading ? "Criando conta..." : "Concluir"}
            </S.PrimaryButton>
          </S.AuthForm>

          <S.AuthLink>
            Já tem conta?{" "}
            <S.LinkHighlight as={Link} to="/login">
              Faça login
            </S.LinkHighlight>
          </S.AuthLink>
        </S.AuthCard>
      </S.AuthContainer>

      <CreateCollegeModal
        isOpen={isCreateCollegeOpen}
        onClose={() => setIsCreateCollegeOpen(false)}
        onCreated={(college) => {
          setColleges((prev) => [college, ...prev]);
          setFormData((prev) => ({ ...prev, college: college.id }));
        }}
      />
    </>
  );
}
