import './App.css'
import { NavLink, Routes, Route } from 'react-router-dom'
import { About } from './Pages/About'
import { Routines } from './Pages/Routines'
import { MyRoutines } from './Pages/MyRoutines'
import { TrainingDetail } from './Pages/TrainingDetail'

function App() {

  return (
    <>
      <div className="app">
        <main>
          <Routes>
          <Route path='/' element={<About />} />
          <Route path='/Routines' element={<Routines />} />
          <Route path='/Routines/MyRoutines' element= {<MyRoutines /> } />
          <Route path='/Training' element={<TrainingDetail/>}/>
          <Route path='*' element={<p>Page not found</p>} /> {/* consider a NotFound.tsx page? */}
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App
