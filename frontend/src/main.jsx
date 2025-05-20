import { StrictMode } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import Login from './login'
import CreateUser from './create-user'
import Menu from './menu.jsx'
import Table from "./table.jsx";
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <HashRouter>
    <Routes>
      <Route path='/' element={<Navigate to="/login" replace />} />
      <Route path='/login' element={<Login />} />
      <Route path="/create-user" element={<CreateUser />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/table/:tableName" element={<Table />} />
    </Routes>
  </HashRouter>
  </StrictMode>
)