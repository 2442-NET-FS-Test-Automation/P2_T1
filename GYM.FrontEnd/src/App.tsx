import './css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom'
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
import { useAuth } from './auth/useAuth';
import { RequireAuth } from './components/RequireAuth';
import { Register } from './pages/Register';
import { UserBooking } from './pages/UserBooking';
import { NotFound } from './pages/NotFound';
import Navbar from './components/Navbar';

function App() {

  const { status, user } = useAuth();
  const isAuthenticated = status === "authenticated";

  //Vamos a utilizar const {status, user, logout} = useAuth(); cada vez que queramos poner
  //validaciones, por ejemplo quien deberia poder ver "AdminPanel" en nuestro panel de opciones
  //Para ver el ejemplo de como aplicarlo ir al ejemplo de Jonathan en App.tsx más o menos
  //por la linea 18 a 40

  function checkUserRole() {
    console.log("User role: " + user?.role)
  }
  checkUserRole();


  return (
    <>
      <div className="app">
        <Navbar />
          <main>
          <Routes>
            {/* =========================================================
                1. RUTAS LIBRES / PÚBLICAS
              ========================================================= */}
            <Route path="/about" element={<About />} />

            {/* =========================================================
                2. RUTAS SOLO PARA NO AUTENTICADOS (Invitados)
                Si el usuario YA está autenticado, lo manda directo a /home-user
              ========================================================= */}
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/home-user" replace /> : <LandingPage />} 
            />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/home-user" replace /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/home-user" replace /> : <Register />} 
            />

            {/* =========================================================
                3. RUTAS PROTEGIDAS PARA USUARIOS AUTENTICADOS
                Si NO están autenticados, RequireAuth los expulsará a /login
              ========================================================= */}
            <Route 
              path="/home-user"
              element={<RequireAuth role="User"><Home /></RequireAuth>} 
            />
            <Route 
              path="/user/achievements" 
              element={<RequireAuth role="User"><Achievements /></RequireAuth>} 
            />
            <Route 
              path="/user/booking"
              element={<RequireAuth role="User"><UserBooking /></RequireAuth>} 
            />
            <Route 
              path="/user/profileSettings" 
              element={<RequireAuth role="User"><ProfileSettings /></RequireAuth>} 
            />
            <Route 
              path="/user/stadistics" 
              element={<RequireAuth role="User"><UserStatistics /></RequireAuth>} 
            />
            <Route 
              path="/routines" 
              element={<RequireAuth role="User"><Routines /></RequireAuth>} 
            />
            <Route 
              path="/routines/myroutines" 
              element={<RequireAuth role="User"><MyRoutines /></RequireAuth>} 
            />
            <Route 
              path="/training" 
              element={<RequireAuth role="User"><Trainings /></RequireAuth>} 
            />

            {/* =========================================================
                4. RUTAS PROTEGIDAS POR ROL ESPECÍFICO (Trainer / Admin)
              ========================================================= */}
            <Route 
              path="/trainer-panel" 
              element={
                <RequireAuth role="trainer">
                  <p className="text-white p-4">Trainer page</p>
                </RequireAuth>
              }
            />
            <Route 
              path="/admin-panel" 
              element={
                <RequireAuth role="admin">
                  <p className="text-white p-4">Admin page</p>
                </RequireAuth>
              } 
            />

            {/* =========================================================
                5. RUTA 404
              ========================================================= */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App