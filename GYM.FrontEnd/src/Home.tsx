import Navbar from './components/Navbar';

interface Training {
  id: number;
  title: string;
  difficulty: string;
  description: string;
}

export default function Home() {
  // Datos de prueba basados en tu diseño
  const trainings: Training[] = [
    { id: 1, title: 'Training 1', difficulty: '[Difficulty]', description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    { id: 2, title: 'Training 1', difficulty: '[Difficulty]', description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    { id: 3, title: 'Training 1', difficulty: '[Difficulty]', description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    { id: 4, title: 'Training 1', difficulty: '[Difficulty]', description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaa' },
  ];

  return (
    <div style={{ backgroundColor: '#121321', minHeight: '100vh', color: '#FFFFFF' }}>
      {/* Menu Superior */}
      <Navbar onLogout={() => console.log('Cerrando sesión...')} />

      <div className="container py-4">
        {/* Mensaje de Bienvenida */}
        <h4 className="fw-semibold mb-5" style={{ color: '#00E5FF' }}>
          Welcome [User name]
        </h4>

        {/* Título Central */}
        <div className="text-center mb-5">
          <h2 className="fw-bold" style={{ letterSpacing: '0.5px' }}>Start With The Right Leg</h2>
        </div>

        {/* Grid de Entrenamientos */}
        <div className="row g-4 justify-content-center">
          {trainings.map((item) => (
            <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 border-0 bg-transparent text-start">
                
                {/* Cuadro de la imagen/entrenamiento */}
                <div 
                  className="rounded p-3 d-flex flex-column justify-content-start align-items-start"
                  style={{ 
                    backgroundColor: '#1E4646', 
                    height: '220px',
                    border: '1px solid #285a5a'
                  }}
                >
                  <h4 className="fw-bold text-white m-0">{item.title}</h4>
                </div>

                {/* Textos inferiores de la card */}
                <div className="pt-2 px-1">
                  <div className="fw-bold" style={{ color: '#00E5FF', fontSize: '0.95rem' }}>{item.difficulty}</div>
                  <div style={{ color: '#A0A5B5', fontSize: '0.85rem', lineHeight: '1.3' }}>
                    <span className="fw-semibold">[Description] :</span> <br />
                    {item.description}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Botón Inferior "More Trainings" */}
        <div className="d-flex justify-content-center mt-5">
          <button 
            className="btn rounded-pill px-5 py-2 fw-bold border-0 text-dark"
            style={{ 
              background: 'linear-gradient(90deg, #3EFFD4 0%, #00E5FF 100%)',
              fontSize: '0.9rem',
              letterSpacing: '0.5px'
            }}
          >
            MORE TRAININGS
          </button>
        </div>

      </div>
    </div>
  );
}