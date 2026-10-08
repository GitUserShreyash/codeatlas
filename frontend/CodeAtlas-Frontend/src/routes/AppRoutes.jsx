import { Routes, Route } from "react-router-dom"

import LandingPage from "@/pages/landing/LandingPage"
import LoginPage from "@/pages/auth/LoginPage"
import AuthCallbackPage from "@/pages/auth/AuthCallbackPage"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import ProtectedRoute from "./ProtectedRoute"
import { AppLayout } from "@/layouts/AppLayout"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout
              title="Dashboard"
              description="Overview of your repositories and AI sessions"
            >
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <div className="flex min-h-svh items-center justify-center">
            <h1 className="text-2xl font-bold">CodeAtlas Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  )
}

export default AppRoutes
