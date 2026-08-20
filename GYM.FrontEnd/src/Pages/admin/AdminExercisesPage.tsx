import { useState, useEffect } from 'react';
import { ExerciseModal } from '../../Components/admin/modals/ExerciseModal';
import { ExerciseService } from '../../services/adminServices';
import type { exerciseDTO } from '../../types/exerciseDTO';
import { Pagination } from '../../Components/Pagination';
import { StatCard } from '../../Components/admin/StatCard';

export interface ExerciseItem {
    id: number;
    name: string;
    description: string;
    visualReferenceUrl: string;
    sets: number;
    reps: number;
}

export function AdminExercisesPage() {
    const [exercises, setExercises] = useState<exerciseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Filtro de Categoría/Tipo
    const [selectedFilter, setSelectedFilter] = useState<'All' | 'With Media' | 'High Volume' | 'Low Volume'>('All');

    // Modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<exerciseDTO | null>(null);

    // Estado de Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Resetear a la página 1 cuando el usuario busca un ejercicio
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedFilter]);

    // Cargar ejercicios al montar el componente
    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            setLoading(true);
            const data = await ExerciseService.getAllExercises();
            setExercises(data);
        } catch (error) {
            console.error('Error loading exercises from API:', error);
            alert('Error al cargar la lista de ejercicios desde el servidor.');
        } finally {
            setLoading(false);
        }
    };

    // Métricas calculadas para las StatCards
    const countTotal = exercises.length;
    const countWithMedia = exercises.filter(e => e.visualReferenceUrl && e.visualReferenceUrl.trim() !== '').length;
    const countHighVolume = exercises.filter(e => e.sets >= 4).length;
    const countLowVolume = exercises.filter(e => e.sets < 4).length;

    // Modal Handlers
    const handleOpenCreateModal = () => {
        setSelectedExercise(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (exercise: exerciseDTO) => {
        setSelectedExercise(exercise);
        setIsModalOpen(true);
    };

    const handleSaveExercise = async (exerciseData: exerciseDTO) => {
        try {
            if (exerciseData.id) {
                await ExerciseService.updateExercise(exerciseData);
            } else {
                await ExerciseService.createExercise(exerciseData);
            }
            setIsModalOpen(false);
            fetchExercises();
        } catch (error) {
            console.error('Error saving exercise:', error);
            alert('An error occurred while saving the exercise. Please try again.');
        }
    };

    const handleDeleteExercise = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this exercise from the database?')) return;

        try {
            await ExerciseService.deleteExercise(id);
            fetchExercises();
        } catch (error) {
            console.error('Error deleting exercise:', error);
            alert('Cannot delete the exercise. It might be linked to existing training routines.');
        }
    };

    // Helper para alternar filtros al hacer click en las StatCards
    const handleStatCardClick = (filter: 'With Media' | 'High Volume' | 'Low Volume') => {
        if (selectedFilter === filter) {
        setSelectedFilter('All');
        } else {
        setSelectedFilter(filter);
        }
    };

    // Filtro compuesto (Búsqueda por texto + Filtro de StatCards/Pestañas)
    const filteredExercises = exercises.filter(ex => {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
        ex.name.toLowerCase().includes(search) ||
        ex.description.toLowerCase().includes(search);

        let matchesFilter = true;
        if (selectedFilter === 'With Media') {
        matchesFilter = Boolean(ex.visualReferenceUrl && ex.visualReferenceUrl.trim() !== '');
        } else if (selectedFilter === 'High Volume') {
        matchesFilter = ex.sets >= 4;
        } else if (selectedFilter === 'Low Volume') {
        matchesFilter = ex.sets < 4;
        }

        return matchesSearch && matchesFilter;
    });

    // Paginación derivada
    const totalPages = Math.ceil(filteredExercises.length / itemsPerPage);
    const paginatedExercises = filteredExercises.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="d-flex flex-column gap-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="h3 fw-bold text-white mb-1">
                        Global Exercises <span className="text-aqua">Library</span> 💪
                    </h1>
                    <p className="small mb-0 text-muted">
                        Manage individual exercises, visual guides, sets, and default reps.
                    </p>
                </div>
                <button className="btn btn-gq-purple px-3 py-2 d-flex align-items-center gap-2" onClick={handleOpenCreateModal}>
                    ➕ <span>Create Exercise</span>
                </button>
            </div>

            {/* Grid de Tarjetas KPI / Métricas Rápidas */}
                <div className="row g-3">
                    <div className="col-12 col-sm-6 col-xl-3">
                        <div 
                            onClick={() => setSelectedFilter('All')} 
                            style={{ cursor: 'pointer' }}
                            className={`rounded-3 transition-all ${selectedFilter === 'All' ? 'ring-active' : ''}`}
                        >
                        <StatCard 
                        title="Total Library" 
                        value={loading ? "..." : countTotal.toString()} 
                        change="Active Database" 
                        icon="📚" 
                        accentColor="aqua" 
                        />
                    </div>
                </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                        <div 
                            onClick={() => handleStatCardClick('With Media')} 
                            style={{ cursor: 'pointer' }}
                            className={`rounded-3 transition-all ${selectedFilter === 'With Media' ? 'ring-active' : ''}`}
                        >
                        <StatCard 
                        title="Visual Guides" 
                        value={loading ? "..." : countWithMedia.toString()} 
                        change="Media Attached" 
                        icon="🔗" 
                        accentColor="purple" 
                        />
                    </div>
                </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                        <div 
                            onClick={() => handleStatCardClick('High Volume')} 
                            style={{ cursor: 'pointer' }}
                            className={`rounded-3 transition-all ${selectedFilter === 'High Volume' ? 'ring-active' : ''}`}
                        >
                        <StatCard 
                            title="High Volume" 
                            value={loading ? "..." : countHighVolume.toString()} 
                            change="4+ Sets Routine" 
                            icon="🔥" 
                            accentColor="blue" 
                        />
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div 
                        onClick={() => handleStatCardClick('Low Volume')} 
                        style={{ cursor: 'pointer' }}
                        className={`rounded-3 transition-all ${selectedFilter === 'Low Volume' ? 'ring-active' : ''}`}
                    >
                    <StatCard 
                        title="Light / Accessory" 
                        value={loading ? "..." : countLowVolume.toString()} 
                        change="1-3 Sets Routine" 
                        icon="⚡" 
                        accentColor="magenta" 
                    />
                    </div>
                </div>
            </div>

            {/* Main Card */}
            <div className="card gq-card p-4">
                {/* Barra de Búsqueda + Filtros Alineados */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-md-5">
                        <div className="input-group">
                            <span className="input-group-text border-end-0 text-aqua" style={{ backgroundColor: '#161729', borderColor: 'var(--gq-surface-border)' }}>
                                🔍
                            </span>
                            <input 
                                type="text" 
                                className="form-control gq-input border-start-0 text-white" 
                                placeholder="Search exercise by name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-7 d-flex justify-content-md-end gap-2 flex-wrap align-items-center">
                        {(['All', 'With Media', 'High Volume', 'Low Volume'] as const).map((filter) => (
                        <button
                            key={filter}
                            className={`btn btn-sm px-3 fw-semibold transition-all ${
                            selectedFilter === filter ? 'btn-gq-aqua' : 'btn-outline-secondary text-white'
                            }`}
                            onClick={() => setSelectedFilter(filter)}
                        >
                            {filter === 'All' ? 'All Exercises' : filter}
                        </button>
                        ))}
                    </div>
                </div>

                {/* State: Loading */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-aqua" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted mt-2 small">Cargando ejercicios desde el servidor...</p>
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <div className="table-responsive">
                            <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                                <thead>
                                    <tr className="text-muted border-bottom border-secondary small">
                                        <th scope="col">NAME</th>
                                        <th scope="col">DESCRIPTION</th>
                                        <th scope="col">SETS x REPS</th>
                                        <th scope="col">REFERENCE URL</th>
                                        <th scope="col" className="text-end">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="border-0">
                                    {paginatedExercises.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4 text-muted">
                                                No exercises found.
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedExercises.map((ex) => (
                                            <tr key={ex.id}>
                                                <td className="fw-semibold text-white">{ex.name}</td>
                                                <td className="text-muted small" style={{ maxWidth: '280px' }}>{ex.description}</td>
                                                <td>
                                                    <span className="badge px-2 py-1" style={{ backgroundColor: 'var(--gq-purple)' }}>
                                                        {ex.sets} Sets × {ex.reps} Reps
                                                    </span>
                                                </td>
                                                <td className="text-muted small">
                                                    {ex.visualReferenceUrl ? (
                                                        <a href={ex.visualReferenceUrl} target="_blank" rel="noreferrer" className="text-aqua text-decoration-none">
                                                            View Media 🔗
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted">—</span>
                                                    )}
                                                </td>
                                                <td className="text-end">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <button 
                                                            className="btn btn-sm btn-outline-info px-2 py-1" 
                                                            title="Edit" 
                                                            onClick={() => handleOpenEditModal(ex)}
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger px-2 py-1" 
                                                            title="Delete" 
                                                            onClick={() => ex.id && handleDeleteExercise(ex.id)}
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Componente de Paginación */}
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </>
                )}

                {/* Modal */}
                <ExerciseModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveExercise}
                    initialData={selectedExercise}
                />
            </div>
        </div>
    );
}