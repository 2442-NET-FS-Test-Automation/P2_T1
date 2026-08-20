import './css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom'
import { About } from './Pages/About'
import Home from './Pages/UserHome';
import Achievements from './Pages/UserAchievements';
import ProfileSettings from './Pages/UserProfileSettings';
import { Login } from './Pages/Login';
import { LandingPage } from './Pages/LandingPage';
import { UserStatistics } from './Pages/UserStadistics';
import { useAuth } from './auth/useAuth';
import { RequireAuth } from './Components/RequireAuth';
import { Register } from './Pages/Register';
import { UserBooking } from './Pages/UserBooking';
import { NotFound } from './Pages/NotFound';
import Navbar from './Components/Navbar';
import { UserDetailsStep } from './Pages/Onboarding/UserDetailsStep';
import { UserStatsStep } from './Pages/Onboarding/UserStatsStep';
import { UserMyBookings } from './Pages/UserMyBookings';
import { AdminLayout } from './Components/admin/AdminLayout';
import { AdminDashboardPage } from './Pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './Pages/admin/AdminUsersPage';
import { AdminExercisesPage } from './Pages/admin/AdminExercisesPage';
import { AdminTrainingsPage } from './Pages/admin/AdminTrainingsPage';
import { ConfirmBooking } from './Pages/ConfirmBooking';
import { useLocation } from 'react-router-dom'; // return current location
import { ExerciseDetail } from './Pages/ExerciseDetail';
import { Report } from './Pages/Report';
import { ToastContainer } from "react-toastify"; // library for notifications (success messages/error messages) like an alert in js
import { TrainingDetail } from './Pages/TrainingDetail';
import { Footer } from './Components/Footer';
import { AdminBookingsPage } from './Pages/admin/AdminBookingsPage';

function App() {
  const { status, user } = useAuth();
  const isAuthenticated = status === "authenticated";

  // Paths where we want to hide the navBar
  const HIDDEN_NAVBAR_PREFIXES = ["/user/booking/confirm"];

  const location = useLocation();

  const hideNavbar = HIDDEN_NAVBAR_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix),
  );

  //Vamos a utilizar const {status, user, logout} = useAuth(); cada vez que queramos poner
  //validaciones, por ejemplo quien deberia poder ver "AdminPanel" en nuestro panel de opciones
  //Para ver el ejemplo de como aplicarlo ir al ejemplo de Jonathan en App.tsx más o menos
  //por la linea 18 a 40

  function checkUserRole() {
    console.log("User role: " + user?.role);
  }
  checkUserRole();

  return (
    <>
      <div className="app">
        {/* we add the notification container at the top */}
        <ToastContainer position="top-right" autoClose={3000} />
        {!hideNavbar && <Navbar />}
          <main className="page-container">
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
              element={
                isAuthenticated ? (
                  <Navigate to="/home-user" replace />
                ) : (
                  <LandingPage />
                )
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/home-user" replace />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/home-user" replace />
                ) : (
                  <Register />
                )
              }
            />

            {/* =========================================================
                3. RUTAS PROTEGIDAS PARA USUARIOS AUTENTICADOS
                Si NO están autenticados, RequireAuth los expulsará a /login
              ========================================================= */}
            <Route
              path="/home-user"
              element={
                <RequireAuth allowedRoles={["User", "Trainer", "Admin"]}>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="/user/achievements"
              element={
                <RequireAuth allowedRoles={["User", "Trainer", "Admin"]}>
                  <Achievements />
                </RequireAuth>
              }
            />
            <Route
              path="/user/booking"
              element={
                <RequireAuth allowedRoles={["User", "Trainer", "Admin"]}>
                  <UserBooking />
                </RequireAuth>
              }
            />
            <Route
              path="/user/report"
              element={
                <RequireAuth allowedRoles={["User", "Trainer", "Admin"]}>
                  <Report />
                </RequireAuth>
              }
            />
            <Route
              path="/exercise/:id"
              element={
                <RequireAuth allowedRoles={["User", "Trainer", "Admin"]}>
                  <ExerciseDetail />
                </RequireAuth>
              }
            />
            <Route
              path="/user/booking/confirm/:trainingid"
              element={
                <RequireAuth allowedRoles={["User", "Trainer", "Admin"]}>
                  <ConfirmBooking />
                </RequireAuth>
              }
            />
            <Route
              path="/user/profileSettings"
              element={
                <RequireAuth allowedRoles={["User", "Trainer", "Admin"]}>
                  <ProfileSettings />
                </RequireAuth>
              }
            />
            <Route
              path="/user/stadistics"
              element={
                <RequireAuth allowedRoles={["User", "Trainer", "Admin"]}>
                  <UserStatistics />
                </RequireAuth>
              }
            />
            <Route
              path="/user/mybookings"
              element={
                <RequireAuth allowedRoles={["User", "Trainer", "Admin"]}>
                  <UserMyBookings />
                </RequireAuth>
              }
            />
            <Route
              path="/training"
              element={
                <RequireAuth allowedRoles={["User", "Trainer", "Admin"]}>
                  <TrainingDetail />
                </RequireAuth>
              }
            />
            <Route
              path="/onboarding/details"
              element={
                <RequireAuth allowedRoles={["User", "Trainer", "Admin"]}>
                  <UserDetailsStep />
                </RequireAuth>
              }
            />
            <Route
              path="/onboarding/stats"
              element={
                <RequireAuth allowedRoles={["User", "Trainer", "Admin"]}>
                  <UserStatsStep />
                </RequireAuth>
              }
            />

            {/* =========================================================
                4. RUTAS PROTEGIDAS POR ROL ESPECÍFICO (Trainer / Admin)
              ========================================================= */}
            <Route 
              path="/admin" 
              element={
                <RequireAuth allowedRoles={["Trainer", "Admin"]}>
                  <p className="text-white p-4">En desarollo... Iniciar sesión como Admin para ver como se veria Trainer</p>
                </RequireAuth>
              }
            />
            <Route 
              path="/admin" 
              element={
                <RequireAuth allowedRoles={["Trainer", "Admin"]}>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} /> {/*Las restricciones para admin se aplican en AdminUserPage.tsx*/}
              <Route path="trainings" element={<AdminTrainingsPage />} />
              <Route path="exercises" element={<AdminExercisesPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
            </Route>

            {/* =========================================================
                5. RUTA 404
              ========================================================= */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </>
  );
}

export default App;
