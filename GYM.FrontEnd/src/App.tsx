import './css/App.css';
import { NavLink, Routes, Route } from 'react-router-dom'
import { About } from './Pages/About'
import { Routines } from './Pages/Routines'
import { MyRoutines } from './Pages/MyRoutines'
import { TrainingDetail } from './Pages/TrainingDetail'
import Home from './Pages/UserHome';
import Achievements from './Pages/UserAchievements';
import ProfileSettings from './Pages/UserProfileSettings';
import { Login } from './Pages/Login';
import { LandingPage } from './Pages/LandingPage';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';

function App() {

  return (
    <>
      <div className="app">
        <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile/settings" element={<ProfileSettings />} />
          <Route path='/routines' element={<Routines />} />
          <Route path='/routines/myroutines' element= {<MyRoutines /> } />
          <Route path='/training' element={<TrainingDetail/>}/>
          <Route path='/login' element={<Login/>} />
          <Route path="/home-user" element={<Home />} />
          <Route path="/about" element={<About />} />
        <Route path='*' element={<p>Page not found</p>} /> {/* consider a NotFound.tsx page? */}
        </Routes>
      </main>
      </div>
    </>
  );
}

export default App