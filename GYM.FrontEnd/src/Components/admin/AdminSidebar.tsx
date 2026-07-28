import { NavLink } from 'react-router-dom';
import {useAuth} from '../../auth/useAuth';

export function AdminSidebar() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';

    return (
        <aside 
        className="d-flex flex-column flex-shrink-0 p-3 gq-card rounded-0 border-top-0 border-bottom-0 border-start-0" 
        style={{ width: '260px', minHeight: '100vh' }}
        >
        {/* GymQuest Brand */}
        <NavLink to="/admin" className="d-flex align-items-center mb-3 text-decoration-none px-2">
            <span className="fs-4 fw-bold text-aqua tracking-wider">GymQuest</span>
            {isAdmin ? (
                <span className="badge ms-2 px-2 py-1" style={{ backgroundColor: 'var(--gq-purple)', fontSize: '0.65rem' }}>
                ADMIN HQ
                </span>
                ) : (
                <span className="badge ms-2 px-2 py-1" style={{ backgroundColor: 'var(--gq-purple)', fontSize: '0.65rem' }}>
                ADMIN HQ
                </span>
                ) 
            }
        </NavLink>
        
        <hr style={{ borderColor: 'var(--gq-surface-border)' }} />

        {/* Navigation Menu */}
        <ul className="nav nav-pills flex-column mb-auto gap-2">
            <li>
            <NavLink 
                to="/admin" 
                end
                className={({ isActive }) => 
                `nav-link text-white d-flex align-items-center gap-3 py-2 px-3 rounded ${isActive ? 'gq-active' : 'opacity-75 hover-opacity-100'}`
                }
            >
                <span className="fs-5">📊</span> <span>Dashboard</span>
            </NavLink>
            </li>
            <li>
            <NavLink 
                to="/admin/users" 
                className={({ isActive }) => 
                `nav-link text-white d-flex align-items-center gap-3 py-2 px-3 rounded ${isActive ? 'gq-active' : 'opacity-75 hover-opacity-100'}`
                }
            >
                <span className="fs-5">👥</span> <span>Users & Roles</span>
            </NavLink>
            </li>
            <li>
            <NavLink 
                to="/admin/trainings" 
                className={({ isActive }) => 
                `nav-link text-white d-flex align-items-center gap-3 py-2 px-3 rounded ${isActive ? 'gq-active' : 'opacity-75 hover-opacity-100'}`
                }
            >
                <span className="fs-5">🏋️‍♂️</span> <span>Trainings</span>
            </NavLink>
            </li>
            <li>
            <NavLink 
                to="/admin/exercises" 
                className={({ isActive }) => 
                `nav-link text-white d-flex align-items-center gap-3 py-2 px-3 rounded ${isActive ? 'gq-active' : 'opacity-75 hover-opacity-100'}`
                }
            >
                <span className="fs-5">💪</span> <span>Exercises</span>
            </NavLink>
            </li>
        </ul>

        <hr style={{ borderColor: 'var(--gq-surface-border)' }} />

        {/* Admin Profile Footer */}
        <div className="d-flex align-items-center p-2 rounded" style={{ backgroundColor: '#161729' }}>
            <div 
            className="rounded-circle d-flex align-items-center justify-content-center me-3 border"
            style={{ width: '40px', height: '40px', borderColor: 'var(--gq-magenta)', backgroundColor: 'var(--gq-purple)' }}
            >
            💪
            </div>
            <div className="lh-sm">
            {isAdmin ? (
                <>
                    <strong className="d-block text-white small">Admin Master</strong>
                    <small className="text-aqua" style={{ fontSize: '0.72rem' }}>Level 99 Admin </small>
                </>
            ) : (
                <>
                    <strong className="d-block text-white small">Trainer Master</strong>
                    <small className="text-aqua" style={{ fontSize: '0.72rem' }}>Level 99 Trainer</small>
                </>
            )}
            </div>
        </div>
        </aside>
    );
};