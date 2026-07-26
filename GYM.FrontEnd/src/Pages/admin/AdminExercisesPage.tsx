import { useState } from 'react';

export interface ExerciseItem {
    id: number;
    name: string;
    description: string;
    visualReferenceUrl: string;
    sets: number;
    reps: number;
}

const MOCK_EXERCISES: ExerciseItem[] = [
    {
        id: 1,
        name: 'Push Ups',
        description: 'Classic chest exercise targeting pectorals and triceps.',
        visualReferenceUrl: 'https://example.com/pushup.gif',
        sets: 4,
        reps: 12,
    },
    {
        id: 2,
        name: 'Barbell Squat',
        description: 'Heavy compound leg exercise for quadriceps and glutes.',
        visualReferenceUrl: 'https://example.com/squat.jpg',
        sets: 3,
        reps: 10,
    },
];

export function AdminExercisesPage() {
    const [exercises, setExercises] = useState<ExerciseItem[]>(MOCK_EXERCISES);
    const [searchTerm, setSearchTerm] = useState('');

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
                <button className="btn btn-gq-purple px-3 py-2 d-flex align-items-center gap-2">
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
                            <button className="btn btn-sm btn-outline-info px-2 py-1" title="Edit">✏️</button>
                            <button className="btn btn-sm btn-outline-danger px-2 py-1" title="Delete">🗑️</button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
};