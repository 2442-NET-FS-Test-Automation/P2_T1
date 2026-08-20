import React, { useState, useEffect } from 'react';
import { TrainingService } from '../../services/adminServices'; // O donde tengas tu servicio
import { ExerciseService } from '../../services/adminServices';
import { TrainingModal } from '../../Components/admin/modals/TrainingModal';
import { ViewExercisesModal } from '../../Components/admin/modals/ViewExercisesModal';
import type { TrainingDTO, TrainingCreateDTO } from '../../types/trainingDTO';
import type { exerciseDTO } from '../../types/exerciseDTO';
import {Pagination} from '../../Components/Pagination';
import { StatCard } from '../../Components/admin/StatCard';

export const AdminTrainingsPage: React.FC = () => {
    const [trainings, setTrainings] = useState<TrainingDTO[]>([]);
    const [availableExercises, setAvailableExercises] = useState<exerciseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Filtro por Dificultad
    const [selectedFilter, setSelectedFilter] = useState<'All' | 'Easy' | 'Intermediate' | 'Advanced'>('All');

    // Estados para Modal de Edición/Creación
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedTraining, setSelectedTraining] = useState<TrainingDTO | null>(null);

    // Estados para Modal de Visualización de Ejercicios
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [viewingTrainingName, setViewingTrainingName] = useState<string>('');
    const [viewingExercises, setViewingExercises] = useState<exerciseDTO[]>([]);

    //Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Resetear página al cambiar filtros o búsqueda
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedFilter]);

    // Cargar datos iniciales
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
        setLoading(true);
        // Ejecutamos ambas peticiones en paralelo para mayor velocidad
        const [trainingsData, exercisesData] = await Promise.all([
            TrainingService.getAllTrainings(),
            ExerciseService.getAllExercises(),
        ]);
        setTrainings(trainingsData);
        setAvailableExercises(exercisesData);
        } catch (error) {
        console.error('Error loading trainings or exercises:', error);
        alert('Error al cargar la información de rutinas desde el servidor.');
        } finally {
        setLoading(false);
        }
    };

    // Métricas para las StatCards
    const countTotal = trainings.length;
    const countEasy = trainings.filter(t => t.difficulty?.toLowerCase() === 'easy').length;
    const countIntermediate = trainings.filter(t => t.difficulty?.toLowerCase() === 'intermediate').length;
    const countAdvanced = trainings.filter(t => t.difficulty?.toLowerCase() === 'advanced').length;

    // Helper para interactuar con las StatCards
    const handleStatCardClick = (filter: 'Easy' | 'Intermediate' | 'Advanced') => {
        if (selectedFilter === filter) {
            setSelectedFilter('All');
        } else {
            setSelectedFilter(filter);
        }
    };

    // Abrir Modal para Crear
    const handleOpenCreateModal = () => {
        setSelectedTraining(null);
        setIsEditModalOpen(true);
    };

    // Abrir Modal para Editar
    const handleOpenEditModal = (training: TrainingDTO) => {
        setSelectedTraining(training);
        setIsEditModalOpen(true);
    };

    // Abrir Modal para Ver Ejercicios Vinculados
    const handleOpenViewExercises = (training: TrainingDTO) => {
        setViewingTrainingName(training.trainingName);
        setViewingExercises(training.exercises || []);
        setIsViewModalOpen(true);
    };

    // Guardar (Crear o Editar en BD)
    const handleSaveTraining = async (trainingData: TrainingCreateDTO | TrainingDTO) => {
        try {
            if (trainingData.id) {
                await TrainingService.updateTraining(trainingData as TrainingDTO);
            } else {
                await TrainingService.createTraining(trainingData as TrainingCreateDTO);
            }
            setIsEditModalOpen(false);
            loadData(); 
        } catch (error) {
            console.error('Error saving training:', error);
            alert('an error occurred while saving the training. Please try again.');
        }
    };

    // Eliminar Rutina
    const handleDeleteTraining = async (id?: number) => {
        if (!id) return;
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta rutina? (Los ejercicios base de la librería NO se borrarán).')) return;

        try {
        await TrainingService.deleteTraining(id);
        loadData();
        } catch (error) {
        console.error('Error deleting training:', error);
        alert('No se pudo eliminar el entrenamiento.');
        }
    };

    // (Búsqueda + Dificultad)
    const filteredTrainings = trainings.filter((tr) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            tr.trainingName?.toLowerCase().includes(search) ||
            tr.description?.toLowerCase().includes(search);

        let matchesFilter = true;
        if (selectedFilter !== 'All') {
            matchesFilter = tr.difficulty?.toLowerCase() === selectedFilter.toLowerCase();
        }

        return matchesSearch && matchesFilter;
    });

    //Paginación
    const totalPages = Math.ceil(filteredTrainings.length / itemsPerPage);
    const paginatedTrainings = filteredTrainings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="d-flex flex-column gap-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center">
            <div>
                <h1 className="h3 fw-bold text-white mb-1">
                    Training <span className="text-aqua">Routines</span> 🏋️‍♂️
                </h1>
                <p className="small mb-0 text-muted">
                    Manage global training routines, difficulty levels, and exercise assignments.
                </p>
            </div>
            <button
                className="btn btn-gq-purple px-3 py-2 d-flex align-items-center gap-2"
                onClick={handleOpenCreateModal}
                >
                ➕ <span>Create Training</span>
            </button>
        </div>
        {/* Grid de StatCards / Métricas por Dificultad */}
        <div className="row g-3">
            <div className="col-12 col-sm-6 col-xl-3">
                <div 
                    onClick={() => setSelectedFilter('All')} 
                    style={{ cursor: 'pointer' }}
                    className={`rounded-3 transition-all ${selectedFilter === 'All' ? 'ring-active' : ''}`}
                >
                    <StatCard 
                        title="Total Routines" 
                        value={loading ? "..." : countTotal.toString()} 
                        change="Active Routines" 
                        icon="📋" 
                        accentColor="aqua" 
                    />
                </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
                <div 
                    onClick={() => handleStatCardClick('Easy')} 
                    style={{ cursor: 'pointer' }}
                    className={`rounded-3 transition-all ${selectedFilter === 'Easy' ? 'ring-active' : ''}`}
                >
                    <StatCard 
                        title="Easy Level" 
                        value={loading ? "..." : countEasy.toString()} 
                        change="Beginner Friendly" 
                        icon="🌱" 
                        accentColor="purple" 
                    />
                </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
                <div 
                    onClick={() => handleStatCardClick('Intermediate')} 
                    style={{ cursor: 'pointer' }}
                    className={`rounded-3 transition-all ${selectedFilter === 'Intermediate' ? 'ring-active' : ''}`}
                >
                    <StatCard 
                        title="Intermediate" 
                        value={loading ? "..." : countIntermediate.toString()} 
                        change="Moderate Level" 
                        icon="⚡" 
                        accentColor="blue" 
                    />
                </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
                <div 
                    onClick={() => handleStatCardClick('Advanced')} 
                    style={{ cursor: 'pointer' }}
                    className={`rounded-3 transition-all ${selectedFilter === 'Advanced' ? 'ring-active' : ''}`}
                >
                    <StatCard 
                        title="Advanced" 
                        value={loading ? "..." : countAdvanced.toString()} 
                        change="High Intensity" 
                        icon="🔥" 
                        accentColor="magenta" 
                    />
                </div>
            </div>
        </div>

        {/* Card Principal */}
        <div className="card gq-card p-4">
            {/* Search Bar + Filtros de Dificultad Alineados */}
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
                                placeholder="Search training..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-7 d-flex justify-content-md-end gap-2 flex-wrap align-items-center">
                        {(['All', 'Easy', 'Intermediate', 'Advanced'] as const).map((filter) => (
                            <button
                                key={filter}
                                className={`btn btn-sm px-3 fw-semibold transition-all ${
                                    selectedFilter === filter ? 'btn-gq-aqua' : 'btn-outline-secondary text-white'
                                }`}
                                onClick={() => setSelectedFilter(filter)}
                            >
                                {filter === 'All' ? 'All Difficulties' : filter}
                            </button>
                        ))}
                    </div>
                </div>

            {/* Tabla / Loading State */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-aqua" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-2 small">Cargando rutinas desde la base de datos...</p>
                </div>
                ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                            <thead>
                                <tr className="text-muted border-bottom border-secondary small">
                                    <th scope="col">ROUTINE NAME</th>
                                    <th scope="col">PLACE / DIFFICULTY</th>
                                    <th scope="col">EST. TIME / KCAL</th>
                                    <th scope="col">LINKED EXERCISES</th>
                                    <th scope="col" className="text-end">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="border-0">
                                {paginatedTrainings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-muted">
                                        No se encontraron rutinas en la base de datos.
                                    </td>
                                </tr>
                            ) : ( paginatedTrainings.map((tr) => (
                                <tr key={tr.id}>
                                    <td>
                                        <div className="fw-semibold text-white">{tr.trainingName}</div>
                                            <div className="text-muted small" style={{ maxWidth: '280px' }}>
                                                {tr.description}
                                            </div>
                                        </td>
                                    <td>
                                        <span className="badge bg-secondary me-2">{tr.place}</span>
                                        <span className="badge bg-outline-info text-aqua border border-info">
                                            {tr.difficulty}
                                        </span>
                                    </td>
                                    <td className="small text-muted">
                                        ⏱️ {tr.estimatedTime || 'N/A'} <br />
                                        🔥 {tr.calories || 0} kcal
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-link text-aqua text-decoration-none p-0 fw-semibold"
                                            onClick={() => handleOpenViewExercises(tr)}
                                        >
                                            🔗 {tr.exercises?.length || 0} Exercises Linked
                                        </button>
                                    </td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-info px-2 py-1"
                                                title="Edit"
                                                onClick={() => handleOpenEditModal(tr)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger px-2 py-1"
                                                title="Delete"
                                                onClick={() => handleDeleteTraining(tr.id)}
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
        </div>

        {/* Modal de Creación / Edición */}
        <TrainingModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveTraining}
            initialData={selectedTraining}
            availableExercises={availableExercises}
        />

        {/* Modal de Visualización de Ejercicios */}
        <ViewExercisesModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            trainingName={viewingTrainingName}
            exercises={viewingExercises}
        />
        </div>
    );
};