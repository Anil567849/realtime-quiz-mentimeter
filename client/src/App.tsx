import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { User } from './pages/User';
import { Admin } from './pages/Admin';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
          <Route path="admin" element={<Admin />} />
          <Route path="/" element={<User />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App