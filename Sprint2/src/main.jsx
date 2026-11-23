
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import App from './App.jsx'
import { ExpensesProvider } from './context/ExpensesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExpensesProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ExpensesProvider>
  </StrictMode>,
)
