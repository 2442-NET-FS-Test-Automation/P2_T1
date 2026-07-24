import { Route, Routes } from 'react-router-dom';
import Home from './pages/UserHome';
import Achievements from './pages/UserAchievements';
import ProfileSettings from './pages/UserProfileSettings';
import { Login } from './pages/Login';
import { LandingPage } from './pages/LandingPage';
//import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import { UserStatistics } from './pages/UserStadistics';
//import { useAuth } from './auth/useAuth';
import { RequireAuth } from './components/RequireAuth';
import { Register } from './pages/Register';


function App() {

  //Auth check
  //const {status, user, logout} = useAuth();

  //Vamos a utilizar const {status, user, logout} = useAuth(); cada vez que queramos poner
  //validaciones, por ejemplo quien deberia poder ver "AdminPanel" en nuestro panel de opciones
  //Para ver el ejemplo de como aplicarlo ir al ejemplo de Jonathan en App.tsx más o menos
  //por la linea 18 a 40


  return (
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user/achievements" element={<Achievements />} />
          <Route path="/user/profileSettings" element={<ProfileSettings />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path="/home-user" element={<Home />} />
          <Route path="/user/stadistics" element={<UserStatistics />}/>
          <Route path='/admin' element={<RequireAuth role='admin'> <p>Admin page</p> </RequireAuth>} />
          <Route path='*' element={<p>Page not found</p>} /> {/* Not found page */}
        </Routes>
      </main>
  );
}

export default App