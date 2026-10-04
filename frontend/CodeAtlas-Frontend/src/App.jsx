import { useState } from 'react'
import { ThemeProvider } from './components/provider/theme-provider'
import './App.css'
import { ModeToggle } from './components/ui/mode-toggle'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ModeToggle/>
      </ThemeProvider>
    </>
  )
}

export default App
