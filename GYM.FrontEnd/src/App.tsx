import { Route, Routes } from 'react-router-dom';
import Home from './pages/UserHome';
import Achievements from './pages/UserAchievements';
import ProfileSettings from './pages/UserProfileSettings';

function App() {

  return (
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile/settings" element={<ProfileSettings />} />
        </Routes>
      </main>
  );
}

export default App