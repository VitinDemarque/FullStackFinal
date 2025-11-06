import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@contexts/AuthContext";
import { ThemeProvider } from "@contexts/ThemeContext";
import HomePage from "@pages/Home/HomePage";
import AboutPage from "@pages/About/AboutPage";
import LoginPage from "@pages/Auth/LoginPage";
import SignupPage from "@pages/Auth/SignupPage";
import DashboardPage from "@pages/Dashboard/DashboardPage";
import ChallengesPage from "@pages/Challenges/ChallengesPage";
import RankingPage from "@pages/Ranking/RankingPage";
import ForunsPage from "@pages/Foruns/ForunsPage";
import ForumDetalhesPage from "@pages/Foruns/ForumDetalhesPage";
import TopicoPage from "@pages/Foruns/TopicoPage";
import ProfilePage from "@pages/Profile/ProfilePage";
import ProfileEditPage from "@pages/Profile/ProfileEditPage";
import SettingsPage from "@pages/Settings/SettingsPage";
import NotFoundPage from "@pages/NotFound/NotFoundPage";
import PrivateRoute from "@components/PrivateRoute";
import GroupListPage from "./pages/Groups/GroupListPage";
import GroupCreatePage from "./pages/Groups/GroupCreatePage";
import GroupDetailsPage from "./pages/Groups/GroupDetailsPage";
import GroupEditPage from "./pages/Groups/GroupEditPage";
import GroupMembersPage from "./pages/Groups/GroupMembersPage";
import GroupExercisesPage from "./pages/Groups/GroupExercisesPage";
import GroupProgressPage from "./pages/Groups/GroupProgressPage";
import ThemeTest from "@components/ThemeTest";
import CollegeCreatePage from "@pages/Colleges/CollegeCreatePage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/desafios"
              element={
                <PrivateRoute>
                  <ChallengesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/ranking"
              element={
                <PrivateRoute>
                  <RankingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/foruns"
              element={
                <PrivateRoute>
                  <ForunsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/foruns/:id"
              element={
                <PrivateRoute>
                  <ForumDetalhesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/foruns/:id/topicos/:topicId"
              element={
                <PrivateRoute>
                  <TopicoPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/editar"
              element={
                <PrivateRoute>
                  <ProfileEditPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/faculdades/criar"
              element={<CollegeCreatePage />}
            />
            <Route
              path="/configuracoes"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            {/* ROTAS DE GRUPOS */}
            <Route
              path="/grupos"
              element={
                <PrivateRoute>
                  <GroupListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/grupos/novo"
              element={
                <PrivateRoute>
                  <GroupCreatePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/grupos/:id"
              element={
                <PrivateRoute>
                  <GroupDetailsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/grupos/:id/editar"
              element={
                <PrivateRoute>
                  <GroupEditPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/grupos/:id/membros"
              element={
                <PrivateRoute>
                  <GroupMembersPage />
                </PrivateRoute>
              }
            />
            {/* NOVAS ROTAS ADICIONADAS */}
            <Route
              path="/grupos/:id/exercicios"
              element={
                <PrivateRoute>
                  <GroupExercisesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/grupos/:id/progresso"
              element={
                <PrivateRoute>
                  <GroupProgressPage />
                </PrivateRoute>
              }
            />
            <Route path="/teste-tema" element={<ThemeTest />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
