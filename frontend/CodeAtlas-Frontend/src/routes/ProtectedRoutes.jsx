import { Navigate, useLocation } from "react-router-dom"

import { useCurrentUser } from "@/hooks/use-auth"
import { Spinner } from "@/components/ui/spinner"

export default function ProtectedRoute({ children }) {
  const location = useLocation()

  const {
    data: user,
    isLoading,
  } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (!user) {
    const next = `${location.pathname}${location.search}`

    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(next)}`}
        replace
      />
    )
  }

  return children
}