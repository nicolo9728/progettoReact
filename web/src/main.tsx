import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ApiProvider } from './hooks/apiHook.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ListaLibriPage } from './pages/listaLibri/listaLibriPage'
import { LoginPage } from './pages/login/loginPage.tsx'
import { UserProvider } from './hooks/userHook.tsx'
import { LibroDetailsPage } from './pages/listaLibri/libroDetails/LibroDetailsPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<ListaLibriPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/libri/:isbn' element={<LibroDetailsPage />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ApiProvider>
  </StrictMode>,
)
