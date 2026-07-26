import React, { useState, useEffect } from 'react';
import type { TrainingItem } from '../../../pages/admin/AdminTrainingsPage';
import type { ExerciseItem } from '../../../pages/admin/AdminExercisesPage';

interface TrainingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (trainingData: any) => void;
    initialData?: TrainingItem | null;
    availableExercises: ExerciseItem[]; // Ejercicios disponibles para vincular
}

export const TrainingModal: React.FC<TrainingModalProps> = ({ isOpen, onClose, onSave, initialData, availableExercises }) => {
    const [formData, setFormData] = useState({
        trainingName: '',
        description: '',
        difficulty: 'Medium',
        calories: 300,
        place: 'GYM' as 'Home' | 'GYM' | 'Outdoors',
        estimatedTime: '00:45:00',
        selectedExerciseIds: [] as number[],
    });

    useEffect(() => {
        if (initialData) {
        setFormData({
            trainingName: initialData.trainingName,
            description: initialData.description,
            difficulty: initialData.difficulty,
            calories: initialData.calories,
            place: initialData.place,
            estimatedTime: initialData.estimatedTime,
            selectedExerciseIds: [], // Aquí vendrían los IDs de TrainingExercises al conectar la API
        });
        } else {
        setFormData({
            trainingName: '',
            description: '',
            difficulty: 'Medium',
            calories: 300,
            place: 'GYM',
            estimatedTime: '00:45:00',
            selectedExerciseIds: [],
        });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const toggleExerciseSelection = (exerciseId: number) => {
        setFormData((prev) => {
        const exists = prev.selectedExerciseIds.includes(exerciseId);
        return {
            ...prev,
            selectedExerciseIds: exists
            ? prev.selectedExerciseIds.filter((id) => id !== exerciseId)
            : [...prev.selectedExerciseIds, exerciseId],
        };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(initialData ? { ...formData, id: initialData.id } : formData);
        onClose();
    };

    return (
        <div 
        className="modal d-block" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)' }}
        >
        <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content gq-card text-white border-0">
            <div className="modal-header border-bottom border-secondary">
                <h5 className="modal-title fw-bold">
                {initialData ? '✏️ Edit Training Routine' : '➕ Create Training Routine'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={onClose} />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="modal-body d-flex flex-column gap-3">
                {/* Routine Name */}
                <div>
                    <label className="form-label small fw-semibold text-aqua">Routine Name</label>
                    <input
                    type="text"
                    className="form-control gq-input text-white"
                    placeholder="e.g. Upper Body Destruction"
                    value={formData.trainingName}
                    onChange={(e) => setFormData({ ...formData, trainingName: e.target.value })}
                    required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="form-label small fw-semibold text-aqua">Description</label>
                    <textarea
                    className="form-control gq-input text-white"
                    rows={2}
                    placeholder="Short explanation of this workout routine..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    />
                </div>

                {/* Grid: Place, Difficulty, Calories, Time */}
                <div className="row g-3">
                    <div className="col-12 col-md-3">
                    <label className="form-label small fw-semibold text-aqua">Place</label>
                    <select
                        className="form-select gq-input text-white"
                        value={formData.place}
                        onChange={(e) => setFormData({ ...formData, place: e.target.value as any })}
                    >
                        <option value="GYM">GYM</option>
                        <option value="Home">Home</option>
                        <option value="Outdoors">Outdoors</option>
                    </select>
                    </div>

                    <div className="col-12 col-md-3">
                    <label className="form-label small fw-semibold text-aqua">Difficulty</label>
                    <select
                        className="form-select gq-input text-white"
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    </div>

                    <div className="col-12 col-md-3">
                    <label className="form-label small fw-semibold text-aqua">Calories (kcal)</label>
                    <input
                        type="number"
                        className="form-control gq-input text-white"
                        value={formData.calories}
                        onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
                    />
                    </div>

                    <div className="col-12 col-md-3">
                    <label className="form-label small fw-semibold text-aqua">Est. Time (HH:MM:SS)</label>
                    <input
                        type="text"
                        className="form-control gq-input text-white"
                        value={formData.estimatedTime}
                        onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                    />
                    </div>
                </div>

                {/* Exercise Selector (Many-to-Many Pivot) */}
                <div className="mt-2">
                    <label className="form-label small fw-semibold text-aqua d-block">
                    Attach Exercises from Catalog
                    </label>
                    <div 
                    className="p-3 rounded border border-secondary d-flex flex-column gap-2" 
                    style={{ maxHeight: '180px', overflowY: 'auto', backgroundColor: '#161729' }}
                    >
                    {availableExercises.map((ex) => {
                        const isSelected = formData.selectedExerciseIds.includes(ex.id);
                        return (
                        <div 
                            key={ex.id}
                            className={`d-flex justify-content-between align-items-center p-2 rounded cursor-pointer border ${
                            isSelected ? 'border-info' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: isSelected ? 'rgba(70, 240, 210, 0.1)' : 'transparent', cursor: 'pointer' }}
                            onClick={() => toggleExerciseSelection(ex.id)}
                        >
                            <div>
                            <span className="fw-semibold text-white d-block">{ex.name}</span>
                            <small className="text-muted">{ex.sets} sets × {ex.reps} reps</small>
                            </div>
                            <span className={`badge ${isSelected ? 'btn-gq-aqua' : 'bg-secondary'}`}>
                            {isSelected ? '✓ Linked' : '+ Link'}
                            </span>
                        </div>
                        );
                    })}
                    </div>
                </div>
                </div>

                <div className="modal-footer border-top border-secondary">
                <button type="button" className="btn btn-outline-secondary text-white" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-gq-purple">
                    {initialData ? 'Save Changes' : 'Create Routine'}
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
};