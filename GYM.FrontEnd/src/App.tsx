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
import { UserDetailsStep } from './pages/Onboarding/UserDetailsStep';
import { UserStatsStep } from './pages/Onboarding/UserStatsStep';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminExercisesPage } from './pages/admin/AdminExercisesPage';
import { AdminTrainingsPage } from './pages/admin/AdminTrainingsPage';
import { ConfirmBooking } from './pages/ConfirmBooking';
import { useLocation } from 'react-router-dom'; // return current location
import { ExerciseDetail } from './pages/ExerciseDetail';
import { Report } from './pages/Report';

function App() {


  const { status, user } = useAuth();
  const isAuthenticated = status === "authenticated";


  // Paths where we want to hide the navBar
  const HIDDEN_NAVBAR_PREFIXES = ['/user/booking/confirm'];

  const location = useLocation();

  const hideNavbar = HIDDEN_NAVBAR_PREFIXES.some((prefix) => 
    location.pathname.startsWith(prefix)
  );

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
        {!hideNavbar && <Navbar />}
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
              element={<RequireAuth allowedRoles={["User", "Trainer", "Admin"]}><Home /></RequireAuth>} 
            />
            <Route 
              path="/user/achievements" 
              element={<RequireAuth allowedRoles={["User", "Trainer", "Admin"]}><Achievements /></RequireAuth>} 
            />
            <Route 
              path="/user/booking"
              element={<RequireAuth allowedRoles={["User", "Trainer", "Admin"]}><UserBooking /></RequireAuth>} 
            />
             <Route 
              path="/user/report"
              element={<RequireAuth allowedRoles={["User", "Trainer", "Admin"]}><Report /></RequireAuth>} 
            />
            <Route 
              path="/exercise-details"
              element={<RequireAuth role="User"><ExerciseDetail /></RequireAuth>} 
            />
            <Route 
              path="/user/booking/confirm/:trainingid" 
              element={<RequireAuth allowedRoles={["User", "Trainer", "Admin"]}><ConfirmBooking /></RequireAuth>} 
            />
            <Route 
              path="/user/profileSettings" 
              element={<RequireAuth allowedRoles={["User", "Trainer", "Admin"]}><ProfileSettings /></RequireAuth>} 
            />
            <Route 
              path="/user/stadistics" 
              element={<RequireAuth allowedRoles={["User", "Trainer", "Admin"]}><UserStatistics /></RequireAuth>} 
            />
            <Route 
              path="/routines" 
              element={<RequireAuth allowedRoles={["User", "Trainer", "Admin"]}><Routines /></RequireAuth>} 
            />
            <Route 
              path="/routines/myroutines" 
              element={<RequireAuth allowedRoles={["User", "Trainer", "Admin"]}><MyRoutines /></RequireAuth>} 
            />
            <Route 
              path="/training" 
              element={<RequireAuth allowedRoles={["User", "Trainer", "Admin"]}><Trainings /></RequireAuth>} 
            />
            <Route 
              path="/onboarding/details" 
              element={<RequireAuth allowedRoles={["User", "Trainer", "Admin"]}><UserDetailsStep /></RequireAuth>} 
            />
            <Route 
              path="/onboarding/stats" 
              element={<RequireAuth allowedRoles={["User", "Trainer", "Admin"]}><UserStatsStep /></RequireAuth>} 
            />

            {/* =========================================================
                4. RUTAS PROTEGIDAS POR ROL ESPECÍFICO (Trainer / Admin)
              ========================================================= */}
            <Route 
              path="/trainer-panel" 
              element={
                <RequireAuth allowedRoles={["Trainer", "Admin"]}>
                  <p className="text-white p-4">En desarollo... Iniciar sesión como Admin para ver como se veria Trainer</p>
                </RequireAuth>
              }
            />
            <Route 
              path="/admin" 
              element={
                <RequireAuth role="Admin">
                  <AdminLayout />
                </RequireAuth>
              } 
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="trainings" element={<AdminTrainingsPage />} />
              <Route path="exercises" element={<AdminExercisesPage />} />
            </Route>

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