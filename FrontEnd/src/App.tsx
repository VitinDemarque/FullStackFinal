import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@contexts/AuthContext'
import { ThemeProvider } from '@contexts/ThemeContext'
import HomePage from '@pages/Home/HomePage'
import LoginPage from '@pages/Auth/LoginPage'
import SignupPage from '@pages/Auth/SignupPage'
import DashboardPage from '@pages/Dashboard/DashboardPage'
import ChallengesPage from '@pages/Challenges/ChallengesPage'
import InProgressPage from '@pages/InProgress/InProgressPage'
import RankingPage from '@pages/Ranking/RankingPage'
import RecommendationsPage from '@pages/Recommendations/RecommendationsPage'
import ForunsPage from '@pages/Foruns/ForunsPage';
import ForumDetalhesPage from '@pages/Foruns/ForumDetalhesPage';
import TopicoPage from '@pages/Foruns/TopicoPage';
import ProfilePage from '@pages/Profile/ProfilePage'
import SettingsPage from '@pages/Settings/SettingsPage'
import NotFoundPage from '@pages/NotFound/NotFoundPage'
import PrivateRoute from '@components/PrivateRoute'
import GroupListPage from './pages/Groups/GroupListPage';
import GroupCreatePage from './pages/Groups/GroupCreatePage';
import GroupDetailsPage from './pages/Groups/GroupDetailsPage';
import GroupEditPage from './pages/Groups/GroupEditPage';
import GroupMembersPage from './pages/Groups/GroupMembersPage';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
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
              path="/em-andamento"
              element={
                <PrivateRoute>
                  <InProgressPage />
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
              path="/recomendacoes"
              element={
                <PrivateRoute>
                  <RecommendationsPage />
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
              path="/configuracoes"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
