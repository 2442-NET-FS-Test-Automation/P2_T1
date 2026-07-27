import { useState, useEffect } from 'react';
import { ExerciseModal } from '../../Components/admin/modals/ExerciseModal';
import { ExerciseService } from '../../services/adminServices';
import type {exerciseDTO} from '../../types/exerciseDTO';

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

    //Modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<exerciseDTO | null>(null);

    //Load exercises from API on component mount
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

    //Modal Handlers ==========================================================
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
                // Editar en BD
                await ExerciseService.updateExercise(exerciseData);
            } else {
                // Crear en BD
                await ExerciseService.createExercise(exerciseData);
            }
            setIsModalOpen(false);
            fetchExercises(); // Recargamos la lista actualizada desde C#
        } catch (error) {
            console.error('Error saving exercise:', error);
            alert('an error occurred while saving the exercise. Please try again.');
        }
    };

    const handleDeleteExercise = async (id: number) => {
        if (!window.confirm('¿Are you sure you want to delete this exercise from the database?')) return;

        try {
            await ExerciseService.deleteExercise(id);
            fetchExercises(); // Recargamos la lista desde C#
        } catch (error) {
            console.error('Error deleting exercise:', error);
            alert('Cannot delete the exercise. It might be linked to existing training routines.');
        }
    };
    //End of Modal Handlers ==========================================================

    const filteredExercises = exercises.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchTerm.toLowerCase())
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

            {/* Main Card */}
            <div className="card gq-card p-4">
                {/* Search */}
                <div className="mb-4">
                <div className="input-group style-search" style={{ maxWidth: '400px' }}>
                    <span className="input-group-text border-end-0 text-aqua" style={{ backgroundColor: '#161729', borderColor: 'var(--gq-surface-border)' }}>
                    🔍
                    </span>
                    <input 
                    type="text" 
                    className="form-control gq-input border-start-0 text-white" 
                    placeholder="Search exercise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                </div>

                {/* Exercises Table */}
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
                    {filteredExercises.map((ex) => (
                        <tr key={ex.id}>
                        <td className="fw-semibold text-white">{ex.name}</td>
                        <td className="text-muted small" style={{ maxWidth: '280px' }}>{ex.description}</td>
                        <td>
                            <span className="badge px-2 py-1" style={{ backgroundColor: 'var(--gq-purple)' }}>
                            {ex.sets} Sets × {ex.reps} Reps
                            </span>
                        </td>
                        <td className="text-muted small">
                            <a href={ex.visualReferenceUrl} target="_blank" rel="noreferrer" className="text-aqua text-decoration-none">
                            View Media 🔗
                            </a>
                        </td>
                        <td className="text-end">
                            <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-sm btn-outline-info px-2 py-1" title="Edit" 
                            onClick={() => handleOpenEditModal(ex)}>
                                ✏️
                            </button>
                            <button className="btn btn-sm btn-outline-danger px-2 py-1" title="Delete" 
                            onClick={() => ex.id && handleDeleteExercise(ex.id)}>
                                🗑️
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                <ExerciseModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveExercise}
                    initialData={selectedExercise}
                />
            </div>
        </div>
    );
};