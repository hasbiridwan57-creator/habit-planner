import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import HabitsPage from './pages/HabitsPage'
import WeeklyPage from './pages/WeeklyPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HabitsPage />} />
          <Route path="habits" element={<HabitsPage />} />
          <Route path="weekly" element={<WeeklyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
