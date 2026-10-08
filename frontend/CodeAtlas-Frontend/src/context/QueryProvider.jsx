import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"

export const QueryProvider = ({ children }) => {
  const [query] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={query}>
      {children}
    </QueryClientProvider>
  )
}

export default QueryProvider
