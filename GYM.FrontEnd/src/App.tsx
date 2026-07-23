import { Route, Routes } from 'react-router-dom';
import Home from './pages/UserHome';
import Achievements from './pages/UserAchievements';
import ProfileSettings from './pages/UserProfileSettings';
import { Login } from './pages/Login';
import { LandingPage } from './pages/LandingPage';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import { UserStatistics } from './pages/UserStadistics';

function App() {

  return (
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user/achievements" element={<Achievements />} />
          <Route path="/user/profileSettings" element={<ProfileSettings />} />
          <Route path='/login' element={<Login/>} />
          <Route path="/home-user" element={<Home />} />
          <Route path="/user/stadistics" element={<UserStatistics />}/>
        </Routes>
      </main>
  );
}

export default App