import React, { useState, useEffect } from 'react';
import type { SubmitEvent } from "react";
import type { ExerciseItem } from '../../../pages/admin/AdminExercisesPage';
import type { exerciseDTO } from '../../../types/ExerciseDTO';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Omit<ExerciseItem, 'id'> | ExerciseItem) => void;
  initialData?: exerciseDTO | null;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({isOpen, onClose, onSave, initialData,}) => {
   
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        visualReferenceUrl: '',
        sets: 3,
        reps: 10,
    });

    useEffect(() => {
        if (initialData) {
        setFormData(initialData);
        } else {
        setFormData({
            name: '',
            description: '',
            visualReferenceUrl: '',
            sets: 3,
            reps: 10,
        });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave(initialData?.id ? { ...formData, id: initialData.id } : formData);
        onClose();
    };

    return (
        <div 
        className="modal d-block" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)' }}
        >
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content gq-card text-white border-0">
            <div className="modal-header border-bottom border-secondary">
                <h5 className="modal-title fw-bold">
                {initialData ? '✏️ Edit Exercise' : '➕ Create New Exercise'}
                </h5>
                <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="modal-body d-flex flex-column gap-3">
                {/* Name */}
                <div>
                    <label className="form-label small fw-semibold text-aqua">Exercise Name</label>
                    <input
                    type="text"
                    className="form-control gq-input text-white"
                    placeholder="e.g. Barbell Squat"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="form-label small fw-semibold text-aqua">Description</label>
                    <textarea
                    className="form-control gq-input text-white"
                    rows={3}
                    placeholder="Describe the proper technique or muscle focus..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    />
                </div>

                {/* Sets & Reps */}
                <div className="row g-3">
                    <div className="col-6">
                    <label className="form-label small fw-semibold text-aqua">Default Sets</label>
                    <input
                        type="number"
                        min={1}
                        className="form-control gq-input text-white"
                        value={formData.sets}
                        onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) || 0 })}
                        required
                    />
                    </div>
                    <div className="col-6">
                    <label className="form-label small fw-semibold text-aqua">Default Reps</label>
                    <input
                        type="number"
                        min={1}
                        className="form-control gq-input text-white"
                        value={formData.reps}
                        onChange={(e) => setFormData({ ...formData, reps: parseInt(e.target.value) || 0 })}
                        required
                    />
                    </div>
                </div>

                {/* Visual Reference URL */}
                <div>
                    <label className="form-label small fw-semibold text-aqua">Visual Reference (GIF/Image URL)</label>
                    <input
                    type="url"
                    className="form-control gq-input text-white"
                    placeholder="https://example.com/demo.gif"
                    value={formData.visualReferenceUrl}
                    onChange={(e) => setFormData({ ...formData, visualReferenceUrl: e.target.value })}
                    />
                </div>
                </div>

                <div className="modal-footer border-top border-secondary">
                <button type="button" className="btn btn-outline-secondary text-white" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-gq-purple">
                    {initialData ? 'Save Changes' : 'Create Exercise'}
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
};