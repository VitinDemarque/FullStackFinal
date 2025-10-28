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
import ProfilePage from '@pages/Profile/ProfilePage'
import SettingsPage from '@pages/Settings/SettingsPage'
import NotFoundPage from '@pages/NotFound/NotFoundPage'
import PrivateRoute from '@components/PrivateRoute'

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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App
