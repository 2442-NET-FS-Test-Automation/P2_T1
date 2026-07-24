import './css/App.css';
import { Routes, Route } from 'react-router-dom'
import { About } from './pages/About'
import { Routines } from './pages/Routines'
import { MyRoutines } from './pages/MyRoutines'
import { Trainings } from './pages/Trainings'
import Home from './pages/UserHome';
import Achievements from './pages/UserAchievements';
import ProfileSettings from './pages/UserProfileSettings';
import { Login } from './pages/Login';
import { LandingPage } from './pages/LandingPage';
import { UserStatistics } from './pages/UserStadistics';
import { NotFound } from './pages/NotFound';

function App() {

  return (
    <>
      <div className="app">
        <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user/achievements" element={<Achievements />} />
          <Route path="/user/profileSettings" element={<ProfileSettings />} />
          <Route path='/login' element={<Login/>} />
          <Route path="/home-user" element={<Home />} />
          <Route path="/user/stadistics" element={<UserStatistics />}/>
          <Route path='/routines' element={<Routines />} />
          <Route path='/routines/myroutines' element= {<MyRoutines /> } />
          <Route path='/training' element={<Trainings/>}/>
          <Route path='/login' element={<Login/>} />
          <Route path="/home-user" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path='*' element={<NotFound/>} />
        </Routes>
      </main>
      </div>
    </>
  );
}

export default App