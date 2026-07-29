import React, { useState, useEffect, } from 'react';
import type { SubmitEvent } from "react";
import type { TrainingDTO, Place, TrainingCreateDTO } from '../../../types/trainingDTO';
import type { exerciseDTO } from '../../../types/exerciseDTO';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { toast } from 'react-toastify';

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TrainingCreateDTO | TrainingDTO) => void;
  initialData?: TrainingDTO | null;
  availableExercises: exerciseDTO[]; 
}

export const TrainingModal: React.FC<TrainingModalProps> = ({ isOpen, onClose, onSave, initialData, availableExercises, }) => {
    const [formData, setFormData] = useState<{
        trainingName: string;
        description: string;
        difficulty: string;
        place: Place;
        calories: number;
        estimatedTime: string;
    }>({
        trainingName: '',
        description: '',
        difficulty: 'Beginner',
        place: 'Gym',
        calories: 300,
        estimatedTime: '00:45:00',
    });

    // Array de IDs de los ejercicios seleccionados
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);

    useEffect(() => {
        if (initialData) {
        setFormData({
            ...(initialData?.id ? { id: initialData.id } : {}), 
            trainingName: initialData.trainingName || '',
            description: initialData.description || '',
            difficulty: initialData.difficulty || 'Beginner',
            place: (initialData.place as Place) || 'Gym',
            calories: initialData.calories || 300,
            estimatedTime: initialData.estimatedTime || '00:45:00',
        });
        // Mapeamos los IDs de los ejercicios vinculados si existen
        const ids = initialData.exercises?.map((ex) => ex.id!).filter(Boolean) || [];
        setSelectedExerciseIds(ids);
        } else {
        setFormData({
            trainingName: '',
            description: '',
            difficulty: 'Beginner',
            place: 'Gym',
            calories: 300,
            estimatedTime: '00:45:00',
        });
        setSelectedExerciseIds([]);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    // Manejador del cambio de hora con react-time-picker
    const handleTimeChange = (value: string | null) => {
        const newTime = value || '00:00:00';

        // Validación para no permitir más de 5 horas
        if (newTime <= '05:00:00') {
        setFormData((prev) => ({ ...prev, estimatedTime: newTime }));
        }
    };

    const handleToggleExercise = (id: number) => {
        setSelectedExerciseIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Mapeo del enum de Place según la definición en C#
        const placeEnumMap: Record<Place, number> = {
            Home: 0,
            Gym: 1,
            Outdoor: 2,
        };

        // Filtramos los objetos completos de exercises basados en los IDs seleccionados
        const selectedExerciseObjects = availableExercises.filter(
            (ex) => ex.id !== undefined && selectedExerciseIds.includes(ex.id)
        );

        if (initialData?.id) {
            // PAYLOAD PARA UPDATE (PUT)
            const updatePayload: TrainingDTO = {
                id: initialData.id,
                trainingName: formData.trainingName,
                description: formData.description,
                difficulty: formData.difficulty,
                place: placeEnumMap[formData.place] ?? 0,
                calories: formData.calories,
                estimatedTime: formData.estimatedTime,
                createdAt: initialData.createdAt || new Date().toISOString(),
                exercises: selectedExerciseObjects,
            };
            onSave(updatePayload);
        } else {
            // PAYLOAD PARA CREATE (POST)
            const createPayload: TrainingCreateDTO = {
                trainingName: formData.trainingName,
                description: formData.description,
                difficulty: formData.difficulty,
                place: placeEnumMap[formData.place] ?? 0,
                calories: formData.calories,
                estimatedTime: formData.estimatedTime,
                exercisesIDs: selectedExerciseIds, 
            };
            onSave(createPayload);
        }
        onClose();
    };

    return (
        <div
        className="modal d-block"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(4px)' }}
        >
        <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content gq-card text-white border-0">
            <div className="modal-header border-bottom border-secondary">
                <h5 className="modal-title fw-bold">
                {initialData ? '✏️ Edit Training Routine' : '➕ Create New Training'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={onClose} />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="modal-body d-flex flex-column gap-3">
                {/* Name */}
                <div>
                    <label className="form-label small fw-semibold text-aqua">Training Name</label>
                    <input
                    type="text"
                    className="form-control gq-input text-white"
                    placeholder="e.g. Upper Body Blast"
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
                    placeholder="Focus on chest, back and shoulders..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    />
                </div>

                {/* Grid: Place, Difficulty, Calories, Estimated Time */}
                <div className="row g-3">
                    <div className="col-md-3">
                    <label className="form-label small fw-semibold text-aqua">Place</label>
                    <select
                        className="form-select gq-input text-white"
                        value={formData.place}
                        onChange={(e) => setFormData({ ...formData, place: e.target.value as Place })}
                    >
                        <option value="Gym">Gym</option>
                        <option value="Home">Home</option>
                        <option value="Outdoor">Outdoor</option>
                    </select>
                    </div>

                    <div className="col-md-3">
                    <label className="form-label small fw-semibold text-aqua">Difficulty</label>
                    <input
                        type="text"
                        className="form-control gq-input text-white"
                        placeholder="Easy, Medium..."
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    />
                    </div>

                    <div className="col-md-3">
                    <label className="form-label small fw-semibold text-aqua">Calories (kcal)</label>
                    <input
                        type="number"
                        className="form-control gq-input text-white"
                        value={formData.calories}
                        onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                    />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label small fw-semibold text-aqua">Est. Time (HH:mm:ss)</label>
                        <TimePicker
                        onChange={handleTimeChange}
                        value={formData.estimatedTime}
                        format="HH:mm:ss"
                        maxDetail="second"
                        disableClock={true} // Desactiva el reloj análogo desplegable si solo quieres entrada numérica
                        clearIcon={null}
                        className="gq-input w-100"
                        />
                    </div>
                </div>

                {/* Checkboxes de ejercicios */}
                <div>
                    <label className="form-label small fw-semibold text-aqua">
                    Select Exercises ({selectedExerciseIds.length} selected)
                    </label>
                    <div
                    className="p-3 border rounded border-secondary overflow-auto"
                    style={{ maxHeight: '180px', backgroundColor: '#111222' }}
                    >
                    {availableExercises.length === 0 ? (
                        <p className="text-muted small mb-0">No hay ejercicios en la base de datos.</p>
                    ) : (
                        availableExercises.map((ex) => (
                        <div key={ex.id} className="form-check mb-2">
                            <input
                            className="form-check-input"
                            type="checkbox"
                            id={`ex-check-${ex.id}`}
                            checked={ex.id !== undefined && selectedExerciseIds.includes(ex.id)}
                            onChange={() => ex.id !== undefined && handleToggleExercise(ex.id)}
                            />
                            <label
                            className="form-check-label text-white small d-flex justify-content-between pe-2"
                            htmlFor={`ex-check-${ex.id}`}
                            >
                            <span>{ex.name}</span>
                            <span className="text-muted">
                                ({ex.sets}x{ex.reps})
                            </span>
                            </label>
                        </div>
                        ))
                    )}
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