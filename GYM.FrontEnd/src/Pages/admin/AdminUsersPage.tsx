import { useEffect, useState } from 'react';
import { UserModal } from '../../Components/admin/modals/UserModal';
import { UserService } from '../../services/adminServices';
import type { UserAdminDTO } from '../../types/user';
import { useAuth } from '../../auth/useAuth';
import { Pagination } from '../../Components/Pagination';

export function AdminUsersPage() {
    const [users, setUsers] = useState<UserAdminDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRoleFilter, setSelectedRoleFilter] = useState<'All' | 'User' | 'Trainer' | 'Admin'>('All');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserAdminDTO | null>(null);

    const {user} = useAuth();
    const isAdmin = user?.role === 'Admin';

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; 

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedRoleFilter]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await UserService.getAllUsers();
            setUsers(data);
        } catch (err: any) {
            console.error("Error fetching users:", err);
            setError("Could not load users list. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleRole = async (user: UserAdminDTO) => {
        if (user.role === 'Admin') return; // Protección para admins

        const targetRole = user.role === 'User' ? 'Trainer' : 'User';
        
        try {
            await UserService.updateUserRole(user.id, { newRole: targetRole });
            // Actualización optimista del estado local
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: targetRole } : u));
        } catch (err: any) {
            console.error("Error updating role:", err);
            alert("Failed to update user role.");
        }
    };

    // Modal Handlers
    const handleOpenCreateModal = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user: UserAdminDTO) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const filteredUsers = users.filter(user => {
        const fullName = `${user.name} ${user.surname}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRoleFilter === 'All' || user.role.toLowerCase() === selectedRoleFilter.toLowerCase();
        return matchesSearch && matchesRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (    
    <div className="d-flex flex-column gap-4">
            {/* Header del Módulo */}
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="h3 fw-bold text-white mb-1">
                        Users & Roles <span className="text-aqua">Management</span> 👥
                    </h1>
                    <p className="small mb-0 text-muted">
                        {isAdmin 
                            ? "Inspect accounts, manage privileges, and promote athletes to Trainers." 
                            : "Inspect accounts and review athlete profiles."}
                    </p>
                </div>
                
                {/* 🔒 Botón Crear Usuario: Oculto para Trainers */}
                {isAdmin && (
                    <button 
                        className="btn btn-gq-purple px-3 py-2 d-flex align-items-center gap-2"
                        onClick={handleOpenCreateModal}
                    >
                        ➕ <span>Create Staff User</span>
                    </button>
                )}
            </div>

            {/* Contenedor Principal / Tabla + Filtros */}
            <div className="card gq-card p-4">
                {/* Barra de Filtros */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                        <div className="input-group">
                            <span className="input-group-text border-end-0 text-aqua" style={{ backgroundColor: '#161729', borderColor: 'var(--gq-surface-border)' }}>
                                🔍
                            </span>
                            <input 
                                type="text" 
                                className="form-control gq-input border-start-0 text-white" 
                                placeholder="Search user by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
                        {(['All', 'User', 'Trainer', 'Admin'] as const).map((role) => (
                            <button
                                key={role}
                                className={`btn btn-sm px-3 fw-semibold transition-all ${
                                    selectedRoleFilter === role ? 'btn-gq-aqua' : 'btn-outline-secondary text-white'
                                }`}
                                onClick={() => setSelectedRoleFilter(role)}
                            >
                                {role === 'All' ? 'All Roles' : `${role}s`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mensajes de Carga o Error */}
                {isLoading && (
                    <div className="text-center py-5 text-aqua">
                        <div className="spinner-border text-info mb-2" role="status"></div>
                        <p className="mb-0">Loading athletes database...</p>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="alert alert-danger text-center my-3" role="alert">
                        {error}
                    </div>
                )}

                {/* Tabla de Usuarios */}
                {!isLoading && !error && (
                    <>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                                <thead>
                                    <tr className="text-muted border-bottom border-secondary small">
                                        <th scope="col">ATHLETE</th>
                                        <th scope="col">EMAIL</th>
                                        <th scope="col">PHONE</th>
                                        <th scope="col">ROLE</th>
                                        <th scope="col">JOINED DATE</th>
                                        {/* Mostrar columna ACTIONS solo si es Admin */}
                                        {isAdmin && <th scope="col" className="text-end">ACTIONS</th>}
                                    </tr>
                                </thead>
                                <tbody className="border-0">
                                    {/* 👈 Ojo aquí: iteramos paginatedUsers en vez de filteredUsers */}
                                    {paginatedUsers.length > 0 ? (
                                        paginatedUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div 
                                                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                                            style={{ 
                                                                width: '38px', 
                                                                height: '38px', 
                                                                backgroundColor: user.role === 'Trainer' ? 'var(--gq-purple)' : user.role === 'Admin' ? '#d9534f' : '#2A2C49',
                                                                border: `1px solid ${user.role === 'Trainer' ? 'var(--gq-aqua)' : 'transparent'}`
                                                            }}
                                                        >
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <span className="fw-semibold text-white d-block">{user.name} {user.surname}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-muted small">{user.email}</td>
                                                <td className="text-muted small">{user.phone || '—'}</td>
                                                <td>
                                                    {user.role === 'Admin' ? (
                                                        <span className="badge bg-danger text-white">⚙️ Admin</span>
                                                    ) : user.role === 'Trainer' ? (
                                                        <span 
                                                            className="badge px-2 py-1 fw-semibold" 
                                                            style={{ backgroundColor: 'var(--gq-purple)', color: '#fff', boxShadow: '0 0 8px var(--gq-purple-glow)' }}
                                                        >
                                                            🏋️‍♂️ Trainer
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-secondary text-white">🛡️ User</span>
                                                    )}
                                                </td>
                                                <td className="text-muted small">
                                                    {user.joinAt ? new Date(user.joinAt).toLocaleDateString() : 'N/A'}
                                                </td>

                                                {/* 🔒 Columna de Acciones: Oculta para Trainers */}
                                                {isAdmin && (
                                                    <td className="text-end">
                                                        <div className="d-flex justify-content-end gap-2">
                                                            {user.role !== 'Admin' && (
                                                                <button 
                                                                    className="btn btn-sm px-2 py-1"
                                                                    style={{ 
                                                                        backgroundColor: 'rgba(70, 240, 210, 0.1)', 
                                                                        color: 'var(--gq-aqua)', 
                                                                        border: '1px solid var(--gq-aqua)' 
                                                                    }}
                                                                    title={user.role === 'User' ? 'Promote to Trainer' : 'Demote to User'}
                                                                    onClick={() => handleToggleRole(user)}
                                                                >
                                                                    {user.role === 'User' ? '👑 Promote' : '⬇️ Demote'}
                                                                </button>
                                                            )}

                                                            <button 
                                                                className="btn btn-sm btn-outline-info px-2 py-1"
                                                                title="Edit User Info"
                                                                onClick={() => handleOpenEditModal(user)}
                                                            >
                                                                ✏️
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={isAdmin ? 6 : 5} className="text-center py-4 text-muted">
                                                No athletes found matching your search criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* 👈 Componente de Paginación al pie de la tabla */}
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </>
                )}
            </div>

            {/* Modal para Crear Staff / Editar */}
            <UserModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSaveStaff={async (data) => {
                    await UserService.createStaffUser(data);
                    await fetchUsers();
                }}
                onUpdateRole={async (userId, newRole) => {
                    await UserService.updateUserRole(userId, { newRole: newRole });
                    await fetchUsers();
                }}
                initialData={selectedUser}
            />
        </div>
    );
}