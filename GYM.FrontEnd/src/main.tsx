import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import Home from './Home'
import Achievements from './Achievements'
import ProfileSettings from './ProfileSettings'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/profile/settings" element={<ProfileSettings />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)