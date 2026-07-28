import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../services/adminServices';
import { ExerciseService } from '../../services/adminServices';
import type { UserAdminDTO } from '../../types/user';
import type { exerciseDTO } from '../../types/ExerciseDTO';
import { useAuth } from '../../auth/useAuth';

export function AdminTopbar() {
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Estados de Búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [userResults, setUserResults] = useState<UserAdminDTO[]>([]);
    const [exerciseResults, setExerciseResults] = useState<exerciseDTO[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const {logout} = useAuth();

    useEffect(() => {
        const query = searchTerm.trim();
        if (query.length < 2) {
            setUserResults([]);
            setExerciseResults([]);
            setIsOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                // Consultamos usuarios y ejercicios
                const [allUsers, allExercises] = await Promise.all([
                    UserService.getAllUsers(),
                    ExerciseService.getAllExercises()
                ]);

                // Filtrar usuarios
                const matchedUsers = (allUsers || []).filter(u =>
                    `${u.name} ${u.surname} ${u.email}`
                        .toLowerCase()
                        .includes(query.toLowerCase())
                ).slice(0, 4);

                // Filtrar ejercicios
                const matchedExercises = (allExercises || []).filter(e =>
                    e.name.toLowerCase().includes(query.toLowerCase()) ||
                    e.description?.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 4);

                setUserResults(matchedUsers);
                setExerciseResults(matchedExercises);
                setIsOpen(true);
            } catch (err) {
                console.error("Error conducting global search:", err);
            } finally {
                setIsSearching(false);
            }
        }, 300); // Debounce de 300ms

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Cerrar el menú desplegable si se hace clic fuera del componente
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <header 
            className="navbar px-4 py-3 d-flex justify-content-between align-items-center gq-card rounded-0 border-top-0 border-start-0 border-end-0 position-relative"
            style={{ backgroundColor: 'var(--gq-surface)', zIndex: 1050 }}
        >
            {/* Global Search Input con Dropdown de Resultados */}
            <div className="w-50 position-relative" ref={dropdownRef}>
                <div className="input-group">
                    <span 
                        className="input-group-text border-end-0 text-aqua" 
                        style={{ backgroundColor: '#161729', borderColor: 'var(--gq-surface-border)' }}
                    >
                        {isSearching ? '⏳' : '🔍'}
                    </span>
                    <input 
                        type="text" 
                        className="form-control gq-input border-start-0 text-white" 
                        placeholder="Search users, exercises, or workouts in the Realm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => (userResults.length > 0 || exerciseResults.length > 0) && setIsOpen(true)}
                    />
                    {searchTerm && (
                        <button 
                            className="btn btn-outline-secondary text-muted border-start-0"
                            style={{ backgroundColor: '#161729', borderColor: 'var(--gq-surface-border)' }}
                            onClick={() => { setSearchTerm(''); setIsOpen(false); }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Dropdown de Resultados Rápidos */}
                {isOpen && (
                    <div 
                        className="position-absolute w-100 mt-2 p-3 rounded shadow-lg gq-card border border-secondary"
                        style={{ 
                            backgroundColor: '#111222', 
                            maxHeight: '380px', 
                            overflowY: 'auto',
                            zIndex: 1100 
                        }}
                    >
                        {userResults.length === 0 && exerciseResults.length === 0 ? (
                            <div className="text-muted text-center py-2 small">
                                No records found matching "{searchTerm}"
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {/* Sección de Usuarios Encontrados */}
                                {userResults.length > 0 && (
                                    <div>
                                        <div className="text-aqua fw-semibold small mb-2 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                                            👥 Users ({userResults.length})
                                        </div>
                                        <div className="d-flex flex-column gap-1">
                                            {userResults.map(user => (
                                                <div 
                                                    key={user.id} 
                                                    className="p-2 rounded d-flex justify-content-between align-items-center cursor-pointer transition-all"
                                                    style={{ backgroundColor: '#161729', cursor: 'pointer' }}
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        setSearchTerm('');
                                                        navigate('/admin/users');
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e2038'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#161729'}
                                                >
                                                    <div>
                                                        <span className="fw-semibold text-white d-block small">{user.name} {user.surname}</span>
                                                        <span className="text-muted small" style={{ fontSize: '0.7rem' }}>{user.email}</span>
                                                    </div>
                                                    <span className="badge bg-purple small" style={{ backgroundColor: 'var(--gq-purple)' }}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sección de Ejercicios Encontrados */}
                                {exerciseResults.length > 0 && (
                                    <div>
                                        <div className="text-aqua fw-semibold small mb-2 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                                            💪 Exercises ({exerciseResults.length})
                                        </div>
                                        <div className="d-flex flex-column gap-1">
                                            {exerciseResults.map(exercise => (
                                                <div 
                                                    key={exercise.id} 
                                                    className="p-2 rounded d-flex justify-content-between align-items-center cursor-pointer transition-all"
                                                    style={{ backgroundColor: '#161729', cursor: 'pointer' }}
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        setSearchTerm('');
                                                        navigate('/admin/exercises');
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e2038'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#161729'}
                                                >
                                                    <div>
                                                        <span className="fw-semibold text-white d-block small">{exercise.name}</span>
                                                        <span className="text-muted small" style={{ fontSize: '0.7rem' }}>
                                                            {exercise.description || 'General'}
                                                        </span>
                                                    </div>
                                                    <span className="badge bg-secondary small">
                                                        Catalog
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Quick Actions / System Status */}
            <div className="d-flex align-items-center gap-3">
                {/* System Online Status Badge */}
                <span 
                    className="badge px-3 py-2 fw-semibold d-flex align-items-center gap-2"
                    style={{ 
                        backgroundColor: 'rgba(70, 240, 210, 0.1)', 
                        color: 'var(--gq-aqua)', 
                        border: '1px solid var(--gq-aqua)',
                        boxShadow: '0 0 10px var(--gq-aqua-glow)'
                    }}
                >
                    <span style={{ fontSize: '0.6rem' }}>●</span> System Online
                </span>

                {/* Logout Button */}
                <button 
                    className="btn btn-sm px-3 py-1 fw-semibold transition-all"
                    onClick={logout}
                    style={{ 
                        backgroundColor: 'transparent',
                        color: 'var(--gq-magenta)',
                        border: '1px solid var(--gq-magenta)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--gq-magenta)';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.boxShadow = '0 0 12px var(--gq-magenta-glow)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--gq-magenta)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    Log Out
                </button>
            </div>
        </header>
    );
}