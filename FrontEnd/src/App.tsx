import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@contexts/AuthContext'

// Pages
import HomePage from '@pages/Home/HomePage'
import LoginPage from '@pages/Auth/LoginPage'
import SignupPage from '@pages/Auth/SignupPage'
import ProfilePage from '@pages/Profile/ProfilePage'
import NotFoundPage from '@pages/NotFound/NotFoundPage'

// Components
import PrivateRoute from '@components/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Private Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
