import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {SubmitEvent} from 'react';
import type { UserDetailData } from '../../types/user';
import { setUserDetails } from '../../services/onboardingService';

export function UserDetailsStep() {

    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(false);
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>("Other");

    async function handleSubmit (e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        //Crear dto
        const userDetail: UserDetailData = {
            name: firstName,
            surname: lastName,
            joinAt: new Date().toISOString(),
            gender: gender,
            age: age !== '' ? Number(age) : undefined,
        };

        try {
            console.log('Guardando detalles de usuario:', userDetail);
            await setUserDetails(userDetail);

            //Respuesta positiva = navegar a la siguiente página
            setLoading(false);
            navigate('/onboarding/stats');
        } catch (err) {
            setLoading(false);
            console.error('Error al guardar datos:', err);
        }
    };

    // Omitir este paso
    const handleSkip = () => {
        navigate('/onboarding/stats');
    };

    return (
        <div className="register-bg min-vh-100 d-flex flex-column align-items-center justify-content-center p-3">
        <div className="register-card-container w-100" style={{ maxWidth: '460px' }}>
            <div className="register-card p-4 p-sm-5 rounded-4 border-neon-subtle shadow-neon-lg">
            
            <div className="text-center mb-4">
                <span className="badge bg-neon-subtle text-neon mb-2 px-3 py-1 rounded-pill fw-semibold">
                Step 1 of 2
                </span>
                <h2 className="fs-3 text-white fw-bold m-0">
                Who is this Hero? 🛡️
                </h2>
                <p className="text-secondary small mt-1">
                Tell us a bit about yourself to personalize your quest.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-3">
                <label className="form-label text-neon small fw-semibold">Name</label>
                <input
                    type="text"
                    className="form-control quest-input"
                    placeholder="Your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                </div>

                {/* Surname */}
                <div className="mb-3">
                <label className="form-label text-neon small fw-semibold">Surname</label>
                <input
                    type="text"
                    className="form-control quest-input"
                    placeholder="Your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                </div>

                {/* Gender */}
                <div className="mb-3">
                    <label className="form-label text-neon small fw-semibold">Gender (Optional)</label>
                    <select
                    className="form-select quest-input text-white bg-dark"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other / Prefer not to say</option>
                    </select>
                </div>

                {/* Age */}
                <div className="mb-4">
                <label className="form-label text-neon small fw-semibold">Age (Optional)</label>
                <input
                    type="number"
                    className="form-control quest-input"
                    placeholder="e.g. 25"
                    min="10"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : String(Math.max(10, Math.min(120, Number(e.target.value)))))}
                />
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
                        Saving...
                    </span>
                    ) : (
                    'Continue →'
                    )}
                </button>

                <button
                    type="button"
                    className="btn btn-link text-secondary text-decoration-none small fw-semibold py-1 hover-white"
                    onClick={handleSkip}
                >
                    Skip for now
                </button>
                </div>
            </form>

            </div>
        </div>
        </div>
    );
}