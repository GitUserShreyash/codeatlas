import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import QueryProvider from './components/provider/QueryProvider.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>
)
