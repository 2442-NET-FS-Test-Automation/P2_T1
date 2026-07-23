import { Route, Routes } from 'react-router-dom';
import Home from './pages/UserHome';
import Achievements from './pages/UserAchievements';
import ProfileSettings from './pages/UserProfileSettings';
import { Login } from './pages/Login';
import { LandingPage } from './pages/LandingPage';
//import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';

function App() {

  return (
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile/settings" element={<ProfileSettings />} />
          <Route path='/login' element={<Login/>} />
          <Route path="/home-user" element={<Home />} />
        </Routes>
      </main>
  );
}

export default App