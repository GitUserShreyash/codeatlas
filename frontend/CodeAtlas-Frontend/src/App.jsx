import { useState } from 'react'
import { ThemeProvider } from './components/provider/theme-provider'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {children}
      </ThemeProvider>
    </>
  )
}

export default App
