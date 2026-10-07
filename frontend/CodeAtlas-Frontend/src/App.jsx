import { Routes, Route } from "react-router-dom"

import { ThemeProvider } from "./components/provider/theme-provider"
import LoginPage from "./routes/LoginPage"
import AuthCallbackPage from "./routes/AuthCallbackPage"
import ProtectedRoute from "./routes/ProtectedRoutes"
import { AppShell } from "./components/layout/app-shell"
import DashboardPage from "./pages/DashboardPage"
import LandingPage from "./pages/LandingPage"

function App() {
  return (
    <ThemeProvider
      defaultTheme="dark"
      storageKey="vite-ui-theme"
    >
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/auth/callback"
          element={<AuthCallbackPage />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppShell
                title="Dashboard"
                description="Overview of your repositories and AI sessions"
              >
                <DashboardPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <div className="flex min-h-svh items-center justify-center">
              <h1 className="text-2xl font-bold">
                CodeAtlas
              </h1>
            </div>
          }
        />
      </Routes>
    </ThemeProvider>
  )
}

export default App