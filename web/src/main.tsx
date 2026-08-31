import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ApiProvider } from './hooks/apiHook.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ListaLibriPage } from './pages/listaLibri/listaLibriPage'
import { LoginPage } from './pages/login/loginPage.tsx'
import { UserProvider } from './hooks/userHook.tsx'
import { LibroDetailsPage } from './pages/listaLibri/libroDetails/LibroDetailsPage.tsx'
import { ListaPrestitiPage } from './pages/gestionePrestiti/gestionePrestitiPage.tsx'
import { RicercaUtentiPage } from './pages/ricercaUtenti/ricercaUtentiPage.tsx'
import { CreaLibroPage } from './pages/creaLibro/creaLibroPage.tsx'
import { RegistrazionePage } from './pages/registrazione/registrazionePage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<ListaLibriPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/libri/:isbn' element={<LibroDetailsPage />} />
            <Route path='/prestiti' element={<ListaPrestitiPage />} />
            <Route path='/ricercaUtenti' element={<RicercaUtentiPage />} />
            <Route path='/creaLibro' element={<CreaLibroPage />} />
            <Route path='/registrazione' element={<RegistrazionePage />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ApiProvider>
  </StrictMode>,
)
