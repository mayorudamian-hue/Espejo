import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
        <BrowserRouter>
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
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
