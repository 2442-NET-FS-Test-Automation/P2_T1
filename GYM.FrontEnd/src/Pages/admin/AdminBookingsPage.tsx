import { useEffect, useState } from 'react';
import { Pagination } from '../../Components/Pagination';
import type { AdminBookingDTO, BookingStatus } from '../../types/BookingDTO';
import { StatCard } from '../../Components/admin/StatCard';
// MOCK DATA TEMPORAL
const MOCK_BOOKINGS: AdminBookingDTO[] = [
{ id: 1, trainingName: 'Cyber Hypertrophy', status: 'Booked', doneAt: '2026-03-30T10:00:00', email: 'alex.v@neon.com', name: 'Alex', surname: 'Vance' },
  { id: 2, trainingName: 'Neon Cardio Blitz', status: 'Working', doneAt: '2026-03-29T14:30:00', email: 'sarah.k@cyber.io', name: 'Sarah', surname: 'Kerrigan' },
  { id: 3, trainingName: 'Iron Core Protocol', status: 'Completed', doneAt: '2026-03-28T18:00:00', email: 'john.d@spartan.net', name: 'John', surname: 'Doe' },
  { id: 4, trainingName: 'Shadow HIIT Quest', status: 'Cancelled', doneAt: '2026-03-27T09:15:00', email: 'elena.r@matrix.org', name: 'Elena', surname: 'Rostova' },
  { id: 5, trainingName: 'Powerlifting Alpha', status: 'Booked', doneAt: '2026-03-31T11:00:00', email: 'marcus.f@gears.com', name: 'Marcus', surname: 'Fenix' },
  { id: 6, trainingName: 'Agility Speed Run', status: 'Completed', doneAt: '2026-03-26T16:45:00', email: 'faith.c@runners.net', name: 'Faith', surname: 'Connors' },
];

export function AdminBookingsPage() {
    const [bookings, setBookings] = useState<AdminBookingDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | BookingStatus>('All');

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Carga de datos
    const fetchBookings = async () => {
        try {
        setIsLoading(true);
        setError(null);
        
        // Simulamos retraso de red con la Mock Data
        await new Promise(resolve => setTimeout(resolve, 600));
        setBookings(MOCK_BOOKINGS);

        } catch (err: any) {
        console.error("Error fetching bookings:", err);
        setError("Could not load bookings list. Please try again later.");
        } finally {
        setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // Reset de página al filtrar
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatusFilter]);

    // Contadores dinámicos calculados del listado completo
    const countBooked = bookings.filter(b => b.status === 'Booked').length;
    const countWorking = bookings.filter(b => b.status === 'Working').length;
    const countCompleted = bookings.filter(b => b.status === 'Completed').length;
    const countCancelled = bookings.filter(b => b.status === 'Cancelled').length;

    // Lógica de Filtrado
    const filteredBookings = bookings.filter(booking => {
        const fullName = `${booking.name} ${booking.surname || ''}`.toLowerCase();
        const search = searchTerm.toLowerCase();

        const matchesSearch = 
        fullName.includes(search) ||
        booking.email.toLowerCase().includes(search) ||
        booking.trainingName.toLowerCase().includes(search);

        const matchesStatus = 
        selectedStatusFilter === 'All' || 
        booking.status.toLowerCase() === selectedStatusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    // Cálculo de Paginación
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Helper para alternar filtros al pulsar las StatCards
    const handleStatCardClick = (status: BookingStatus) => {
        if (selectedStatusFilter === status) {
        setSelectedStatusFilter('All'); // Si vuelve a pulsar la misma, quita el filtro
        } else {
        setSelectedStatusFilter(status);
        }
    };

    // Helper para renderizar Badges de Status
    const renderStatusBadge = (status: BookingStatus) => {
        switch (status) {
        case 'Booked':
            return <span className="badge bg-info text-dark">Booked</span>;
        case 'Working':
            return <span className="badge bg-warning text-dark">Working</span>;
        case 'Completed':
            return <span className="badge bg-success text-white">Completed</span>;
        case 'Cancelled':
            return <span className="badge bg-danger text-white">Cancelled</span>;
        default:
            return <span className="badge bg-secondary">{status}</span>;
        }
    };

    return (
        <div className="d-flex flex-column gap-4">
        {/* Header del Módulo */}
        <div className="d-flex justify-content-between align-items-center">
            <div>
            <h1 className="h3 fw-bold text-white mb-1">
                Bookings <span className="text-aqua">Overview</span> 🗓️
            </h1>
            <p className="small mb-0 text-muted">
                Inspect athlete training reservations, active sessions, and completion logs.
            </p>
            </div>
        </div>

{/* Grid de Tarjetas KPI / Contadores Rápidos */}
        <div className="row g-3">
            <div className="col-12 col-sm-6 col-xl-3">
                <div 
                    onClick={() => handleStatCardClick('Booked')} 
                    style={{ cursor: 'pointer' }}
                    className={`rounded-3 transition-all ${selectedStatusFilter === 'Booked' ? 'ring-active' : ''}`}
                >
                <StatCard 
                title="Booked Sessions" 
                value={isLoading ? "..." : countBooked.toString()} 
                change="Pending Start" 
                icon="📅" 
                accentColor="blue" 
                />
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
            <div 
                onClick={() => handleStatCardClick('Working')} 
                style={{ cursor: 'pointer' }}
                className={`rounded-3 transition-all ${selectedStatusFilter === 'Working' ? 'ring-active' : ''}`}
            >
                <StatCard 
                title="In Progress" 
                value={isLoading ? "..." : countWorking.toString()} 
                change="Active Workout" 
                icon="⚡" 
                accentColor="purple" 
                />
            </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
            <div 
                onClick={() => handleStatCardClick('Completed')} 
                style={{ cursor: 'pointer' }}
                className={`rounded-3 transition-all ${selectedStatusFilter === 'Completed' ? 'ring-active' : ''}`}
            >
                <StatCard 
                title="Completed" 
                value={isLoading ? "..." : countCompleted.toString()} 
                change="Finished Quests" 
                icon="✅" 
                accentColor="aqua" 
                />
            </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
            <div 
                onClick={() => handleStatCardClick('Cancelled')} 
                style={{ cursor: 'pointer' }}
                className={`rounded-3 transition-all ${selectedStatusFilter === 'Cancelled' ? 'ring-active' : ''}`}
            >
                <StatCard 
                title="Cancelled" 
                value={isLoading ? "..." : countCancelled.toString()} 
                change="User Cancelled" 
                icon="❌" 
                accentColor="magenta" 
                />
            </div>
        </div>
      </div>

        {/* Contenedor Principal / Tabla + Filtros */}
        <div className="card gq-card p-4">
            {/* Barra de Filtros */}
            <div className="row g-3 mb-4">
            <div className="col-12 col-md-5">
                <div className="input-group">
                <span 
                    className="input-group-text border-end-0 text-aqua" 
                    style={{ backgroundColor: '#161729', borderColor: 'var(--gq-surface-border)' }}
                >
                    🔍
                </span>
                <input 
                    type="text" 
                    className="form-control gq-input border-start-0 text-white" 
                    placeholder="Search athlete, email or training..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
            </div>

            <div className="col-12 col-md-7 d-flex justify-content-md-end gap-2 flex-wrap">
                {(['All', 'Booked', 'Working', 'Completed', 'Cancelled'] as const).map((status) => (
                <button
                    key={status}
                    className={`btn btn-sm px-3 fw-semibold transition-all ${
                    selectedStatusFilter === status ? 'btn-gq-aqua' : 'btn-outline-secondary text-white'
                    }`}
                    onClick={() => setSelectedStatusFilter(status)}
                >
                    {status === 'All' ? 'All Status' : status}
                </button>
                ))}
            </div>
            </div>

            {/* Mensajes de Carga o Error */}
            {isLoading && (
            <div className="text-center py-5 text-aqua">
                <div className="spinner-border text-info mb-2" role="status"></div>
                <p className="mb-0">Loading booking records...</p>
            </div>
            )}

            {error && !isLoading && (
            <div className="alert alert-danger text-center my-3" role="alert">
                {error}
            </div>
            )}

            {/* Tabla de Bookings */}
            {!isLoading && !error && (
            <>
                <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                    <thead>
                    <tr className="text-muted border-bottom border-secondary small">
                        <th scope="col">ATHLETE</th>
                        <th scope="col">EMAIL</th>
                        <th scope="col">TRAINING QUEST</th>
                        <th scope="col">STATUS</th>
                        <th scope="col">DONE AT</th>
                    </tr>
                    </thead>
                    <tbody className="border-0">
                    {paginatedBookings.length > 0 ? (
                        paginatedBookings.map((booking, idx) => (
                        <tr key={booking.id || idx}>
                            <td>
                            <div className="d-flex align-items-center gap-3">
                                <div 
                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                style={{ 
                                    width: '38px', 
                                    height: '38px', 
                                    backgroundColor: '#2A2C49',
                                    border: '1px solid var(--gq-aqua)'
                                }}
                                >
                                {booking.name.charAt(0)}
                                </div>
                                <div>
                                <span className="fw-semibold text-white d-block">
                                    {booking.name} {booking.surname || ''}
                                </span>
                                </div>
                            </div>
                            </td>
                            <td className="text-muted small">{booking.email}</td>
                            <td className="fw-semibold style-training-name" style={{ color: 'var(--gq-aqua)' }}>
                                {booking.trainingName}
                            </td>
                            <td>
                            {renderStatusBadge(booking.status)}
                            </td>
                            <td className="text-muted small">
                            {booking.doneAt ? new Date(booking.doneAt).toLocaleString() : '—'}
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan={5} className="text-center py-4 text-muted">
                            No bookings found matching your search criteria.
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>

                {/* Componente de Paginación al pie de la tabla */}
                <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                />
            </>
            )}
        </div>
        </div>
    );
}