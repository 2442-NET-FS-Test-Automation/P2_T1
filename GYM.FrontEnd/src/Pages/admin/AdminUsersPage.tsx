import { useState } from 'react';

// Interfaz para la lista de usuarios
interface UserItem {
    id: number;
    name: string;
    email: string;
    role: 'User' | 'Trainer' | 'Admin';
    status: 'Active' | 'Inactive';
    createdAt: string;
}

// Datos de prueba
const MOCK_USERS: UserItem[] = [
    { id: 1, name: 'Alex Turner', email: 'alex@gymquest.com', role: 'User', status: 'Active', createdAt: '2026-07-20' },
    { id: 2, name: 'Sarah Connor', email: 'sarah@gymquest.com', role: 'Trainer', status: 'Active', createdAt: '2026-06-15' },
    { id: 3, name: 'Alan Smith', email: 'alan@gymquest.com', role: 'User', status: 'Active', createdAt: '2026-07-24' },
    { id: 4, name: 'Viktor Arcane', email: 'viktor@gymquest.com', role: 'Trainer', status: 'Active', createdAt: '2026-05-10' },
];

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'All' | 'User' | 'Trainer'>('All');

  // Función para cambiar el rol de un usuario (Toggle entre User y Trainer)
  const handleToggleRole = (userId: number) => {
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.id === userId && user.role !== 'Admin') {
          const newRole = user.role === 'User' ? 'Trainer' : 'User';
          return { ...user, role: newRole };
        }
        return user;
      })
    );
  };

  // Filtrado dinámico por búsqueda y rol
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === 'All' || user.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header del Módulo */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
            <h1 className="h3 fw-bold text-white mb-1">
                Users & Roles <span className="text-aqua">Management</span> 👥
            </h1>
            <p className="small mb-0 text-muted">
                Inspect accounts, manage privileges, and promote athletes to Trainers.
            </p>
        </div>
        <button className="btn btn-gq-purple px-3 py-2 d-flex align-items-center gap-2">
            ➕ <span>Create User</span>
        </button>
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
                {(['All', 'User', 'Trainer'] as const).map((role) => (
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

        {/* Tabla de Usuarios */}
        <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                <thead>
                <tr className="text-muted border-bottom border-secondary small">
                    <th scope="col">ATHLETE</th>
                    <th scope="col">EMAIL</th>
                    <th scope="col">ROLE</th>
                    <th scope="col">JOINED DATE</th>
                    <th scope="col" className="text-end">ACTIONS</th>
                </tr>
                </thead>
                <tbody className="border-0">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                    <tr key={user.id}>
                        <td>
                        <div className="d-flex align-items-center gap-3">
                            <div 
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{ 
                                width: '38px', 
                                height: '38px', 
                                backgroundColor: user.role === 'Trainer' ? 'var(--gq-purple)' : '#2A2C49',
                                border: `1px solid ${user.role === 'Trainer' ? 'var(--gq-aqua)' : 'transparent'}`
                            }}
                            >
                            {user.name.charAt(0)}
                            </div>
                            <span className="fw-semibold text-white">{user.name}</span>
                        </div>
                        </td>
                        <td className="text-muted small">{user.email}</td>
                        <td>
                        {user.role === 'Trainer' ? (
                            <span 
                            className="badge px-2 py-1 fw-semibold" 
                            style={{ backgroundColor: 'var(--gq-purple)', color: '#fff', boxShadow: '0 0 8px var(--gq-purple-glow)' }}
                            >
                            🏋️‍♂️ Trainer
                            </span>
                        ) : (
                            <span className="badge bg-secondary text-white">
                            🛡️ User
                            </span>
                        )}
                        </td>
                        <td className="text-muted small">{user.createdAt}</td>
                        <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                            {/* Botón para Promover / Demoler Rol */}
                            <button 
                            className="btn btn-sm px-2 py-1"
                            style={{ 
                                backgroundColor: 'rgba(70, 240, 210, 0.1)', 
                                color: 'var(--gq-aqua)', 
                                border: '1px solid var(--gq-aqua)' 
                            }}
                            title={user.role === 'User' ? 'Promote to Trainer' : 'Demote to User'}
                            onClick={() => handleToggleRole(user.id)}
                            >
                            {user.role === 'User' ? '👑 Promote' : '⬇️ Demote'}
                            </button>

                            {/* Botón Eliminar */}
                            <button 
                            className="btn btn-sm btn-outline-danger px-2 py-1"
                            title="Delete User"
                            >
                            🗑️
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">
                        No athletes found matching your search criteria.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
    );
};