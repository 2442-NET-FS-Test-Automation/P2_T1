import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/useAuth";
import { Carousel } from "../components/Carousel";
import type { TrainingDTO } from "../types/trainingDTO";
import "../css/HomeUser.css";
import { 
  Flame, 
  Trophy, 
  Calendar, 
  Zap, 
  PlusCircle, 
  Dumbbell, 
  LayoutDashboard, 
  Users, 
  Swords, 
  MapPin, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Award
} from "lucide-react";

// Variantes de animación para apariciones escalonadas (stagger)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [workouts, setWorkouts] = useState<TrainingDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const userName = user?.name || "Player";
  const userRole = user?.role?.toLowerCase() || "athlete";

  const userStats = {
    streakDays: 5,
    unlockedBadges: 8,
    totalBadges: 20,
    recentAchievements: [
      { id: 1, title: "First Blood ⚔️", desc: "Completed 1st Workout" },
      { id: 2, title: "Iron Will 🛡️", desc: "5-Day Streak Reached" },
      { id: 3, title: "Gym Warrior 🏋️", desc: "Burned 2000+ kcal" },
    ],
  };

  useEffect(() => {
    const fetchTrainings = async () => {
      setLoading(true);
      setWorkouts([
        {
          id: 1,
          trainingName: "Starter Strength",
          difficulty: "Beginner",
          place: "Gym",
          calories: 300,
          description: "Learn foundational movement patterns and build solid strength.",
          estimatedTime: "00:45:00",
          exercises: [],
        },
        {
          id: 2,
          trainingName: "Urban Endurance",
          difficulty: "Intermediate",
          place: "Outdoor",
          calories: 450,
          description: "High-intensity outdoor circuit designed for maximum calorie burn.",
          estimatedTime: "01:00:00",
          exercises: [],
        },
        {
          id: 3,
          trainingName: "Titan Power",
          difficulty: "Advanced",
          place: "Gym",
          calories: 600,
          description: "Hypertrophy & heavy lifting routine built for experienced lifters.",
          estimatedTime: "01:15:00",
          exercises: [],
        },
        {
          id: 4,
          trainingName: "Legendary Quest",
          difficulty: "Heroic",
          place: "Home",
          calories: 750,
          description: "Extreme bodyweight calisthenics routine to test endurance.",
          estimatedTime: "01:30:00",
          exercises: [],
        },
      ]);
      setLoading(false);
    };

    fetchTrainings();
  }, []);

  const getDifficultyBadge = (difficulty: string) => {
    const diff = difficulty.toLowerCase();
    if (diff.includes("beginner")) return "badge-diff-beginner";
    if (diff.includes("intermediate")) return "badge-diff-intermediate";
    if (diff.includes("advanced")) return "badge-diff-advanced";
    return "badge-diff-heroic";
  };

  return (
    <div className="gq-landing-bg pb-5">
      <div className="container pt-4">

        {/* ==========================================
            1. USER HUD (Animated Entry)
           ========================================== */}
        <motion.section 
          className="mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="gq-hud-box p-4 gq-hud-box-glow-aqua">
            <div className="row align-items-center g-3">
              <div className="col-lg-7 d-flex align-items-center gap-3">
                <motion.div 
                  className="position-relative"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold fs-2 shadow"
                    style={{
                      width: "70px",
                      height: "70px",
                      backgroundColor: "var(--gq-bg)",
                      border: "2px solid var(--gq-aqua)",
                      color: "var(--gq-aqua)",
                    }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </motion.div>

                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge rounded-pill px-3 py-1 fw-bold" style={{ background: "rgba(255, 0, 127, 0.2)", color: "var(--gq-magenta)", border: "1px solid var(--gq-magenta)" }}>
                      🔥 Welcome back!
                    </span>
                    <span className="small text-uppercase fw-semibold d-flex align-items-center gap-1" style={{ color: "var(--gq-text-muted)" }}>
                      <span className="pulse-indicator"></span> System: Online
                    </span>
                  </div>
                  <h1 className="h3 fw-extrabold text-white m-0">
                    Welcome back, <span style={{ color: "var(--gq-aqua)" }}>{userName}</span> ⚔️
                  </h1>
                </div>
              </div>

              <div className="col-lg-5 d-flex justify-content-lg-end gap-2 flex-wrap">
                {[
                  { label: `🏆 Badges (${userStats.unlockedBadges}/${userStats.totalBadges})`, route: '/user/achievements', color: 'var(--gq-purple)' },
                  { label: '📅 My Bookings', route: '/user/mybookings', color: 'var(--gq-blue)' },
                  { label: '⚡ Routines', route: '/routines', color: 'var(--gq-aqua)' }
                ].map((btn, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-sm rounded-pill px-3 py-2 fw-bold text-white"
                    style={{ background: "var(--gq-surface-border)", border: `1px solid ${btn.color}` }}
                    onClick={() => navigate(btn.route)}
                  >
                    {btn.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ==========================================
            2. CAROUSEL SHOWCASE
           ========================================== */}
        <motion.section 
          className="mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="text-center mb-3">
            <h2 className="fs-5 text-uppercase fw-bold tracking-wider" style={{ color: "var(--gq-aqua)" }}>
              ⚡ Featured Highlights & Announcements
            </h2>
          </div>
          <Carousel />
        </motion.section>

        {/* ==========================================
            3. RECENT ACHIEVEMENTS
           ========================================== */}
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="fs-5 text-uppercase fw-bold m-0" style={{ color: "var(--gq-purple)" }}>
              🏆 Recent Unlocked Achievements
            </h2>
            <button 
              className="btn btn-link text-decoration-none p-0 fw-bold small" 
              style={{ color: "var(--gq-aqua)" }}
              onClick={() => navigate('/user/achievements')}
            >
              View All Badges ➔
            </button>
          </div>

          <motion.div 
            className="row row-cols-1 row-cols-md-3 g-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {userStats.recentAchievements.map((ach) => (
              <motion.div key={ach.id} className="col" variants={itemVariants}>
                <motion.div 
                  whileHover={{ y: -4, borderColor: "var(--gq-purple)" }}
                  className="p-3 rounded-4 d-flex align-items-center gap-3"
                  style={{ background: "var(--gq-surface)", border: "1px solid var(--gq-surface-border)", transition: "border-color 0.2s" }}
                >
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center fs-4"
                    style={{ width: "48px", height: "48px", background: "rgba(138, 43, 226, 0.2)", border: "1px solid var(--gq-purple)" }}
                  >
                    🎖️
                  </div>
                  <div>
                    <h4 className="fs-6 fw-bold text-white mb-0">{ach.title}</h4>
                    <p className="small m-0" style={{ color: "var(--gq-text-muted)" }}>{ach.desc}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ==========================================
            4. TRAINING QUESTS (Interactive Stagger Cards)
           ========================================== */}
        <section className="mb-5 text-center">
          <div className="mb-4">
            <h2 className="display-6 fw-extrabold text-white mb-1">
              Start With The Right Leg 🦵⚔️
            </h2>
            <p style={{ color: "var(--gq-text-muted)" }}>
              Select your next quest and start conquering your fitness goals today.
            </p>
          </div>

          {loading ? (
            <div className="spinner-border my-5" role="status" style={{ color: "var(--gq-aqua)" }}>
              <span className="visually-hidden">Loading Quests...</span>
            </div>
          ) : (
            <motion.div 
              className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 text-start"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {workouts.map((workout) => (
                <motion.div key={workout.id ?? workout.trainingName} className="col" variants={itemVariants}>
                  <motion.div 
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="gq-quest-card h-100 d-flex flex-column justify-content-between"
                  >
                    {/* Header de la Tarjeta */}
                    <div className="gq-quest-card-header p-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className={`badge rounded-pill px-2 py-1 ${getDifficultyBadge(workout.difficulty)}`}>
                          {workout.difficulty}
                        </span>
                        <span 
                          className="badge rounded-pill px-2 py-1" 
                          style={{ background: "var(--gq-surface-border)", color: "var(--gq-text-white)" }}
                        >
                          📍 {workout.place}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <span 
                          className="badge rounded-2 px-2 py-1 small fw-semibold" 
                          style={{ background: "rgba(0,0,0,0.4)", color: "var(--gq-aqua)" }}
                        >
                          🔥 {workout.calories} kcal
                        </span>
                        <span 
                          className="badge rounded-2 px-2 py-1 small fw-semibold" 
                          style={{ background: "rgba(0,0,0,0.4)", color: "var(--gq-blue)" }}
                        >
                          ⏱️ {workout.estimatedTime.substring(0, 5)} hrs
                        </span>
                      </div>
                    </div>

                    {/* Cuerpo de la Tarjeta */}
                    <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
                      <div>
                        <h3 className="fs-5 text-white fw-bold mb-2">
                          {workout.trainingName}
                        </h3>
                        <p className="small mb-0" style={{ color: "var(--gq-text-muted)", lineHeight: "1.4" }}>
                          {workout.description}
                        </p>
                      </div>

                      <div 
                        className="mt-4 pt-2 d-flex align-items-center justify-content-between cursor-pointer"
                        style={{ borderTop: "1px solid var(--gq-surface-border)" }}
                        onClick={() => navigate('/trainings')}
                      >
                        <span className="small fw-bold" style={{ color: "var(--gq-aqua)" }}>
                          View Quest
                        </span>
                        <span style={{ color: "var(--gq-aqua)" }}>➔</span>
                      </div>
                    </div>

                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div 
            className="mt-5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              className="btn btn-gq-neon rounded-pill px-5 py-3 text-uppercase fs-6 shadow"
              onClick={() => navigate("/trainings")}
            >
              MORE TRAININGS ⚔️
            </button>
          </motion.div>
        </section>

      </div>
    </div>
  );
}