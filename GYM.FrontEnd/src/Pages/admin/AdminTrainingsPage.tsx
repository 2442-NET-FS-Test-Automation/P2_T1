import { useState } from 'react';

export interface TrainingItem {
    id: number;
    trainingName: string;
    description: string;
    difficulty: string;
    calories: number;
    place: 'Home' | 'GYM' | 'Outdoors';
    estimatedTime: string;
    createdAt: string;
    exerciseCount: number;
}

const MOCK_TRAININGS: TrainingItem[] = [
    {
        id: 101,
        trainingName: 'Upper Body Destruction',
        description: 'High intensity upper body workout for strength.',
        difficulty: 'Hard',
        calories: 450,
        place: 'GYM',
        estimatedTime: '00:45:00',
        createdAt: '2026-07-25',
        exerciseCount: 5,
    },
    {
        id: 102,
        trainingName: 'Home Core & Cardio',
        description: 'No equipment needed. Burn fat quickly at home.',
        difficulty: 'Medium',
        calories: 300,
        place: 'Home',
        estimatedTime: '00:30:00',
        createdAt: '2026-07-20',
        exerciseCount: 4,
    },
];

export function AdminTrainingsPage() {
  const [trainings, setTrainings] = useState<TrainingItem[]>(MOCK_TRAININGS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrainings = trainings.filter(tr => 
    tr.trainingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tr.place.toLowerCase().includes(searchTerm.toLowerCase())
  );

    return (
        <div className="d-flex flex-column gap-4">
        {/* Header */}
            <div className="d-flex justify-content-between align-items-center">
                <div>
                <h1 className="h3 fw-bold text-white mb-1">
                    Training Routines <span className="text-aqua">Management</span> 🏋️‍♂️
                </h1>
                <p className="small mb-0 text-muted">
                    Create and organize routine presets for users (Gym, Home, Outdoors).
                </p>
                </div>
                <button className="btn btn-gq-purple px-3 py-2 d-flex align-items-center gap-2">
                ➕ <span>Create Training Routine</span>
                </button>
            </div>

            {/* Main Card */}
            <div className="card gq-card p-4">
                {/* Search */}
                <div className="mb-4">
                <div className="input-group" style={{ maxWidth: '400px' }}>
                    <span className="input-group-text border-end-0 text-aqua" style={{ backgroundColor: '#161729', borderColor: 'var(--gq-surface-border)' }}>
                    🔍
                    </span>
                    <input 
                    type="text" 
                    className="form-control gq-input border-start-0 text-white" 
                    placeholder="Search routine by name or place..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                </div>

                {/* Trainings Table */}
                <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                    <thead>
                    <tr className="text-muted border-bottom border-secondary small">
                        <th scope="col">ROUTINE NAME</th>
                        <th scope="col">PLACE</th>
                        <th scope="col">DIFFICULTY</th>
                        <th scope="col">CALORIES</th>
                        <th scope="col">EST. TIME</th>
                        <th scope="col">EXERCISES</th>
                        <th scope="col" className="text-end">ACTIONS</th>
                    </tr>
                    </thead>
                    <tbody className="border-0">
                    {filteredTrainings.map((tr) => (
                        <tr key={tr.id}>
                        <td>
                            <div>
                            <span className="fw-semibold d-block text-white">{tr.trainingName}</span>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>{tr.description}</small>
                            </div>
                        </td>
                        <td>
                            <span className="badge border border-info text-aqua px-2 py-1">
                            📍 {tr.place}
                            </span>
                        </td>
                        <td>
                            <span 
                            className="badge px-2 py-1"
                            style={{ 
                                backgroundColor: tr.difficulty === 'Hard' ? 'var(--gq-magenta)' : 'var(--gq-purple)' 
                            }}
                            >
                            {tr.difficulty}
                            </span>
                        </td>
                        <td className="text-white fw-bold">🔥 {tr.calories} kcal</td>
                        <td className="text-muted small">⏱️ {tr.estimatedTime}</td>
                        <td>
                            <span className="badge bg-secondary text-white">
                            {tr.exerciseCount} Exercises Linked
                            </span>
                        </td>
                        <td className="text-end">
                            <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-sm btn-outline-info px-2 py-1" title="View / Edit Routine">👁️ Edit</button>
                            <button className="btn btn-sm btn-outline-danger px-2 py-1" title="Delete Routine Only (Keeps Exercises)">🗑️</button>
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