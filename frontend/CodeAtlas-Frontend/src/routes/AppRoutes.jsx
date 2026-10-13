import { Routes, Route } from "react-router-dom"

import LandingPage from "@/pages/LandingPage"
import LoginPage from "@/pages/LoginPage"
import AuthCallbackPage from "@/pages/AuthCallbackPage"
import DashboardPage from "@/pages/DashboardPage"
import RepositoriesPage from "@/pages/RepositoriesPage"
import ChatPage from "@/pages/ChatPage"
import SettingsPage from "@/pages/SettingsPage"
import ProtectedRoute from "./ProtectedRoute"
import { AppShell } from "@/components/layout/AppShell"

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
        path="/repositories"
        element={
          <ProtectedRoute>
            <AppShell
              title="Repositories"
              description="Manage and index your GitHub repositories"
            >
              <RepositoriesPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AppShell
              title="Chat"
              description="Ground queries and conversations against your codebase"
            >
              <ChatPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppShell
              title="Settings"
              description="Manage preferences and connected accounts"
            >
              <SettingsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <div className="flex min-h-svh items-center justify-center">
            <h1 className="text-2xl font-bold font-heading">Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  )
}

export default AppRoutes
