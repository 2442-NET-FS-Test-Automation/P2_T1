import React, { useState, useEffect } from 'react';
import { TrainingService } from '../../services/adminServices'; // O donde tengas tu servicio
import { ExerciseService } from '../../services/adminServices';
import {TrainingModal} from '../../Components/admin/modals/TrainingModal';
import { ViewExercisesModal } from '../../Components/admin/modals/ViewExercisesModal';
import type { TrainingDTO, TrainingCreateDTO } from '../../types/trainingDTO';
import type { exerciseDTO } from '../../types/exerciseDTO';

export const AdminTrainingsPage: React.FC = () => {
    const [trainings, setTrainings] = useState<TrainingDTO[]>([]);
    const [availableExercises, setAvailableExercises] = useState<exerciseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Estados para Modal de Edición/Creación
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedTraining, setSelectedTraining] = useState<TrainingDTO | null>(null);

    // Estados para Modal de Visualización de Ejercicios
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [viewingTrainingName, setViewingTrainingName] = useState<string>('');
    const [viewingExercises, setViewingExercises] = useState<exerciseDTO[]>([]);

    // 1. Cargar datos iniciales
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

    // 2. Abrir Modal para Crear
    const handleOpenCreateModal = () => {
        setSelectedTraining(null);
        setIsEditModalOpen(true);
    };

    // 3. Abrir Modal para Editar
    const handleOpenEditModal = (training: TrainingDTO) => {
        setSelectedTraining(training);
        setIsEditModalOpen(true);
    };

    // 4. Abrir Modal para Ver Ejercicios Vinculados
    const handleOpenViewExercises = (training: TrainingDTO) => {
        setViewingTrainingName(training.trainingName);
        setViewingExercises(training.exercises || []);
        setIsViewModalOpen(true);
    };

    // 5. Guardar (Crear o Editar en BD)
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

    // 6. Eliminar Rutina
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

    // Filtro de búsqueda
    const filteredTrainings = trainings.filter(
        (tr) =>
        tr.trainingName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tr.description?.toLowerCase().includes(searchTerm.toLowerCase())
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

        {/* Card Principal */}
        <div className="card gq-card p-4">
            {/* Search Bar */}
            <div className="mb-4">
            <div className="input-group" style={{ maxWidth: '400px' }}>
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

            {/* Tabla / Loading State */}
            {loading ? (
            <div className="text-center py-5">
                <div className="spinner-border text-aqua" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2 small">Cargando rutinas desde la base de datos...</p>
            </div>
            ) : (
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
                    {filteredTrainings.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="text-center py-4 text-muted">
                        No se encontraron rutinas en la base de datos.
                        </td>
                    </tr>
                    ) : (
                    filteredTrainings.map((tr) => (
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
                            {/* Botón interactivo para ver los ejercicios vinculados */}
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