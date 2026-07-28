import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../Components/Admin/StatCard';
import { UserService } from '../../services/adminServices';
import { ExerciseService } from '../../services/adminServices';
import type { UserAdminDTO } from '../../types/user';
import { useAuth } from '../../auth/useAuth';

export function AdminDashboardPage() {
    const navigate = useNavigate();

    // Estados para los datos reales de la BD
    const [users, setUsers] = useState<UserAdminDTO[]>([]);
    const [exerciseCount, setExerciseCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    
    const {user} = useAuth();
    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                
                // Carga paralela de usuarios y catálogo de ejercicios
                const [fetchedUsers, fetchedExercises] = await Promise.all([
                    UserService.getAllUsers(),
                    ExerciseService.getAllExercises()
                ]);

                setUsers(fetchedUsers || []);
                setExerciseCount(fetchedExercises?.length || 0);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Cálculo dinámico de métricas basado en la BD real
    const totalAthletes = users.filter(u => u.role === 'User').length;
    const totalTrainers = users.filter(u => u.role === 'Trainer').length;
    const recentUsers = [...users].reverse().slice(0, 5); // Últimos 5 usuarios registrados

    return (
        <div className="d-flex flex-column gap-4">
            {/* Header de bienvenida */}
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    {isAdmin ? (
                    <h1 className="h3 fw-bold text-white mb-1">
                        Welcome back, <span className="text-aqua">Admin Master</span> 👋
                    </h1>    
                    ) : (
                    <h1 className="h3 fw-bold text-white mb-1">
                        Welcome back, <span className="text-gold">Trainer</span> 👋
                    </h1>
                    )}
                    <p className="small mb-0" style={{ color: '#B0B5C0' }}>
                        Here's real-time system performance across the TrainerSync platform.
                    </p>
                </div>
                <button 
                    className="btn btn-gq-purple px-3 py-2 d-flex align-items-center gap-2"
                    onClick={() => window.location.reload()}
                >
                    ⚡ <span>Refresh Stats</span>
                </button>
            </div>

            {/* Grid de KPIs / Métricas principales conectadas a la BD */}
            <div className="row g-3">
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard 
                        title="Total Athletes" 
                        value={loading ? "..." : totalAthletes.toString()} 
                        change="Active Users" 
                        icon="👥" 
                        accentColor="aqua" 
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard 
                        title="Active Trainers" 
                        value={loading ? "..." : totalTrainers.toString()} 
                        change="Routine Masters" 
                        icon="🏋️‍♂️" 
                        accentColor="purple" 
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard 
                        title="Exercises Catalog" 
                        value={loading ? "..." : exerciseCount.toString()} 
                        change="Global Library" 
                        icon="💪" 
                        accentColor="blue" 
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard 
                        title="System Accounts" 
                        value={loading ? "..." : users.length.toString()} 
                        change="Total DB Records" 
                        icon="👑" 
                        accentColor="magenta" 
                    />
                </div>
            </div>

            {/* Sección Inferior: Tabla de Registros Recientes + Operations */}
            <div className="row g-4">
                {/* Tabla de Registros Recientes en Vivo */}
                <div className="col-12 col-lg-8">
                    <div className="card gq-card p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold text-white mb-0">Recent Registrations</h5>
                            <button 
                                className="btn btn-link text-aqua text-decoration-none p-0 small fw-semibold"
                                onClick={() => navigate('/admin/users')}
                            >
                                View All Users →
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                                <thead>
                                    <tr className="text-muted border-bottom border-secondary small">
                                        <th scope="col">USER</th>
                                        <th scope="col">PHONE</th>
                                        <th scope="col">ROLE</th>
                                        <th scope="col" className="text-end">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody className="border-0">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted py-4">
                                                Loading real-time records...
                                            </td>
                                        </tr>
                                    ) : recentUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted py-4">
                                                No users registered yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentUsers.map((u) => (
                                            <tr key={u.id}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div 
                                                            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white fw-bold" 
                                                            style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}
                                                        >
                                                            {u.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <span className="fw-semibold d-block text-white">
                                                                {u.name} {u.surname}
                                                            </span>
                                                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                                {u.email}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-muted small">{u.phone || 'N/A'}</td>
                                                <td>
                                                    <span 
                                                        className={`badge ${
                                                            u.role === 'Admin' ? 'bg-danger' : 
                                                            u.role === 'Trainer' ? 'bg-purple' : 'bg-secondary'
                                                        }`}
                                                        style={u.role === 'Trainer' ? { backgroundColor: 'var(--gq-purple)' } : {}}
                                                    >
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <span className="text-aqua small fw-semibold">Active</span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Panel Lateral: System Operations & Health */}
                <div className="col-12 col-lg-4">
                    <div className="card gq-card p-4 h-100 d-flex flex-column justify-content-between">
                        <div>
                            <h5 className="fw-bold text-white mb-3">System Health</h5>
                            
                            <div className="d-flex flex-column gap-3">
                                <div>
                                    <div className="d-flex justify-content-between small mb-1">
                                        <span className="text-muted">Docker Engine (WSL2)</span>
                                        <span className="text-aqua fw-semibold">Healthy</span>
                                    </div>
                                    <div className="progress" style={{ height: '6px', backgroundColor: '#161729' }}>
                                        <div 
                                            className="progress-bar" 
                                            role="progressbar" 
                                            style={{ width: '100%', backgroundColor: 'var(--gq-aqua)' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="d-flex justify-content-between small mb-1">
                                        <span className="text-muted">Database Engine</span>
                                        <span className="text-white fw-semibold">SQL Server</span>
                                    </div>
                                    <div className="progress" style={{ height: '6px', backgroundColor: '#161729' }}>
                                        <div 
                                            className="progress-bar" 
                                            role="progressbar" 
                                            style={{ width: '85%', backgroundColor: 'var(--gq-purple)' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Banner de Accesos Rápidos */}
                        <div className="p-3 rounded mt-4" style={{ backgroundColor: '#161729', border: '1px solid var(--gq-surface-border)' }}>
                            <span className="badge mb-2" style={{ backgroundColor: 'var(--gq-magenta)' }}>
                                STAFF MANAGEMENT
                            </span>
                            <p className="small text-muted mb-2">
                                Manage roles, update user credentials, or add new Trainers to the platform.
                            </p>
                            <button 
                                className="btn btn-sm btn-gq-aqua w-100"
                                onClick={() => navigate('/admin/users')}
                            >
                                Manage Staff Accounts
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}