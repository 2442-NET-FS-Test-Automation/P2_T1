import React from 'react';
import type { exerciseDTO } from '../../../types/exerciseDTO';

interface ViewExercisesModalProps {
    isOpen: boolean;
    onClose: () => void;
    trainingName: string;
    exercises: exerciseDTO[];
}

export const ViewExercisesModal: React.FC<ViewExercisesModalProps> = ({ isOpen, onClose, trainingName, exercises, }) => {
    
    if (!isOpen) return null;

    return (
        <div
        className="modal d-block"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(4px)' }}
        >
        <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content gq-card text-white border-0">
            <div className="modal-header border-bottom border-secondary">
                <h5 className="modal-title fw-bold">
                💪 Linked Exercises: <span className="text-aqua">{trainingName}</span>
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={onClose} />
            </div>

            <div className="modal-body">
                {exercises.length === 0 ? (
                <p className="text-muted text-center my-3">
                    No exercises are linked to this training routine.
                </p>
                ) : (
                <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle mb-0">
                    <thead>
                        <tr className="text-muted small">
                        <th>NAME</th>
                        <th>SETS x REPS</th>
                        <th>DESCRIPTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exercises.map((ex, index) => (
                        <tr key={ex.id || index}>
                            <td className="fw-semibold text-white">{ex.name}</td>
                            <td>
                            <span className="badge bg-purple px-2 py-1">
                                {ex.sets} Sets × {ex.reps} Reps
                            </span>
                            </td>
                            <td className="text-muted small">{ex.description}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}
            </div>

            <div className="modal-footer border-top border-secondary">
                <button type="button" className="btn btn-outline-secondary text-white" onClick={onClose}>
                Close
                </button>
            </div>
            </div>
        </div>
        </div>
    );
};