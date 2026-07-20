import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './Home' // <-- Aquí importas tu componente (ajusta la ruta si está en otra carpeta)
import 'bootstrap/dist/css/bootstrap.min.css' // Si vas a usar Bootstrap

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Home /> {/* <-- Aquí cambias lo que venía por tu componente Main */}
  </React.StrictMode>,
)