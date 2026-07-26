import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SubmitEvent } from 'react';
import { setUserStats } from '../../services/onboardingService';

export function UserStatsStep() {
    const navigate = useNavigate();

    const [height, setHeight] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Guardando estadísticas iniciales:', { height, weight });

            await setUserStats({
                height: height !== '' ? Number(height) : 0,
                weight: weight !== '' ? Number(weight) : 0,
                measureAt: new Date().toISOString().split('T')[0]
            });

            setLoading(false);
            navigate('/home-user');
        } catch (err) {
            setLoading(false);
            console.error('Error al guardar estadísticas:', err);
        }
    }

    // Omitir este paso y finalizar onboarding
    const handleSkip = () => {
        navigate('/home-user');
    };

    return (
        <div className="register-bg min-vh-100 d-flex flex-column align-items-center justify-content-center p-3">
            <div className="register-card-container w-100" style={{ maxWidth: '460px' }}>
                <div className="register-card p-4 p-sm-5 rounded-4 border-neon-subtle shadow-neon-lg">
                
                    {/* Header Step 2 */}
                    <div className="text-center mb-4">
                        <span className="badge bg-neon-subtle text-neon mb-2 px-3 py-1 rounded-pill fw-semibold">
                            Step 2 of 2
                        </span>
                        <h2 className="fs-3 text-white fw-bold m-0">
                            Hero's Attributes ⚡
                        </h2>
                        <p className="text-secondary small mt-1">
                            Set your starting physical stats to track your progress over time.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Height Input */}
                        <div className="mb-3">
                            <label className="form-label text-neon small fw-semibold">Height (m)</label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark border-secondary text-white">📏</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control quest-input"
                                    placeholder="e.g. 1.75"
                                    min="0.5"
                                    max="2.8"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Weight Input */}
                        <div className="mb-4">
                            <label className="form-label text-neon small fw-semibold">Weight (kg)</label>
                            <div className="input-group">
                                <span className="input-group-text bg-dark border-secondary text-white">⚖️</span>
                                <input
                                    type="number"
                                    className="form-control quest-input"
                                    placeholder="e.g. 70"
                                    min="20"
                                    max="300"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value === '' ? '' : String(Math.max(1, Math.min(300, Number(e.target.value)))))}
                                />
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="d-flex flex-column gap-2 mt-4">
                            <button
                                type="submit"
                                className="btn btn-neon w-100 py-2.5 rounded-pill fw-bold text-uppercase shadow-neon"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Saving Attributes...
                                    </span>
                                ) : (
                                    'Complete Quest ⚔️'
                                )}
                            </button>

                            <button
                                type="button"
                                className="btn btn-link text-secondary text-decoration-none small fw-semibold py-1 hover-white"
                                onClick={handleSkip}
                            >
                                Skip & Finish
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}