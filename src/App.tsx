import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Journal from './pages/Journal'
import EntryForm from './pages/EntryForm'
import Profile from './pages/Profile'
import Community from './pages/Community'
import PublicMemoryPage from './pages/PublicMemoryPage'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/diario"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Journal />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/diario/nueva"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <EntryForm />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/diario/:id/editar"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <EntryForm />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/comunidad"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Community />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Página pública: sin ProtectedRoute ni AppLayout, accesible sin sesión. */}
            <Route path="/m/:token" element={<PublicMemoryPage />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
