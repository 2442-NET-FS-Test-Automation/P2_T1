import { StatCard } from '../../Components/admin/StatCard';

export function AdminDashboardPage () {
  return (
        <div className="d-flex flex-column gap-4">
        {/* Header de bienvenida */}
        <div className="d-flex justify-content-between align-items-center">
            <div>
            <h1 className="h3 fw-bold text-white mb-1">
                Welcome back, <span className="text-aqua">Admin Master</span> 👋
            </h1>
            <p className="small mb-0" style={{ color: '#B0B5C0' }}>
                Here's what is happening across the GymQuest Realm today.
            </p>
            </div>
            <button className="btn btn-gq-purple px-3 py-2 d-flex align-items-center gap-2">
            ⚡ <span>Quick Report</span>
            </button>
        </div>

        {/* Grid de KPIs / Métricas principales */}
        <div className="row g-3">
            <div className="col-12 col-sm-6 col-xl-3">
            <StatCard 
                title="Total Athletes" 
                value="1,248" 
                change="+18% this month" 
                icon="👥" 
                accentColor="aqua" 
            />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
            <StatCard 
                title="Active Trainers" 
                value="34" 
                change="+3 new" 
                icon="🏋️‍♂️" 
                accentColor="purple" 
            />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
            <StatCard 
                title="Exercises Catalog" 
                value="156" 
                change="Global Library" 
                icon="💪" 
                accentColor="blue" 
            />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
            <StatCard 
                title="Completed Quests" 
                value="8,920" 
                change="+5.2% daily avg" 
                icon="🏆" 
                accentColor="magenta" 
            />
            </div>
        </div>

        {/* Sección Inferior: Tabla de Usuarios Recientes + Panel de Estado */}
        <div className="row g-4">
            {/* Tabla de Registros Recientes */}
            <div className="col-12 col-lg-8">
            <div className="card gq-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-white mb-0">Recent User Registrations</h5>
                <button className="btn btn-link text-aqua text-decoration-none p-0 small">
                    View All →
                </button>
                </div>

                <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                    <thead>
                    <tr className="text-muted border-bottom border-secondary small">
                        <th scope="col">USER</th>
                        <th scope="col">ROLE</th>
                        <th scope="col">JOINED</th>
                        <th scope="col" className="text-end">STATUS</th>
                    </tr>
                    </thead>
                    <tbody className="border-0">
                    <tr>
                        <td>
                        <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: '32px', height: '32px' }}>
                            ⚡
                            </div>
                            <div>
                            <span className="fw-semibold d-block text-white">Alex Turner</span>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>alex@gymquest.com</small>
                            </div>
                        </div>
                        </td>
                        <td><span className="badge bg-secondary text-white">User</span></td>
                        <td className="text-muted small">Today, 10:45 AM</td>
                        <td className="text-end"><span className="text-aqua small">Active</span></td>
                    </tr>
                    <tr>
                        <td>
                        <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: '32px', height: '32px' }}>
                            🏋️
                            </div>
                            <div>
                            <span className="fw-semibold d-block text-white">Sarah Connor</span>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>sarah@gymquest.com</small>
                            </div>
                        </div>
                        </td>
                        <td>
                        <span className="badge" style={{ backgroundColor: 'var(--gq-purple)' }}>
                            Trainer
                        </span>
                        </td>
                        <td className="text-muted small">Yesterday</td>
                        <td className="text-end"><span className="text-aqua small">Active</span></td>
                    </tr>
                    <tr>
                        <td>
                        <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: '32px', height: '32px' }}>
                            🎮
                            </div>
                            <div>
                            <span className="fw-semibold d-block text-white">Alan Smith</span>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>alan@gymquest.com</small>
                            </div>
                        </div>
                        </td>
                        <td><span className="badge bg-secondary text-white">User</span></td>
                        <td className="text-muted small">Jul 24, 2026</td>
                        <td className="text-end"><span className="text-aqua small">Active</span></td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
            </div>

            {/* Panel Lateral: System Health & Roles Quick Info */}
            <div className="col-12 col-lg-4">
            <div className="card gq-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                <h5 className="fw-bold text-white mb-3">Realm Operations</h5>
                
                <div className="d-flex flex-column gap-3">
                    {/* Indicador de uso de BD */}
                    <div>
                    <div className="d-flex justify-content-between small mb-1">
                        <span className="text-muted">Database Capacity</span>
                        <span className="text-aqua fw-semibold">42%</span>
                    </div>
                    <div className="progress" style={{ height: '6px', backgroundColor: '#161729' }}>
                        <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ width: '42%', backgroundColor: 'var(--gq-aqua)' }}
                        />
                    </div>
                    </div>

                    {/* Indicador de API Latency */}
                    <div>
                    <div className="d-flex justify-content-between small mb-1">
                        <span className="text-muted">API Latency</span>
                        <span className="text-white fw-semibold">24 ms</span>
                    </div>
                    <div className="progress" style={{ height: '6px', backgroundColor: '#161729' }}>
                        <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ width: '15%', backgroundColor: 'var(--gq-purple)' }}
                        />
                    </div>
                    </div>
                </div>
                </div>

                {/* Banner de Acción Rápidas */}
                <div className="p-3 rounded mt-4" style={{ backgroundColor: '#161729', border: '1px solid var(--gq-surface-border)' }}>
                <span className="badge mb-2" style={{ backgroundColor: 'var(--gq-magenta)' }}>ROLE MANAGEMENT</span>
                <p className="small text-muted mb-2">Need to grant trainer privileges to an existing user account?</p>
                <button className="btn btn-sm btn-gq-aqua w-100">
                    Go to Role Manager
                </button>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};