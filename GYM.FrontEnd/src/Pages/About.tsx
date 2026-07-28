import "../css/About.css";

export function About() {
  return (
    <div className="about-view">
      <section className="about-container">
        
        {/* Header Static Row */}
        <div className="about-header-row">
          <h2>About GYM Sync</h2>
          <button className="sort-dropdown">← Return</button>
        </div>

        {/* Static Mission Statement Block */}
        <article className="exercise-card platform-mission">
          <div className="exercise-card-details">
            <div className="detail-a">
              <h3>Next-Gen Athlete Infrastructure</h3>
              <h4>
                GYM Sync provides the digital architecture to power your physical transformation. 
                Our platform delivers seamless schedule management, integrated progress telemetry tracking, 
                and automated achievement triggers to keep your workout tracking precise, reliable, 
                and high-performance.
              </h4>
            </div>
          </div>
        </article>

        {/* System Capabilities Static Elements */}
        <h3 className="section-subtitle">System Capabilities</h3>
        <div className="features-stack">
          
          <section className="exercise-card">
            <div className="exercise-card-details">
              <div className="detail-a">
                <h3>Asynchronous Session Allocation</h3>
                <h4>Secure immediate reservations for tailored high-intensity training regimes with transactional safety.</h4>
              </div>
              <div className="detail-b">
                <p>Real-time</p>
              </div>
            </div>
          </section>

          <section className="exercise-card">
            <div className="exercise-card-details">
              <div className="detail-a">
                <h3>Biometric Shift Telemetry</h3>
                <h4>Log vital mass, physical status, and run timings over time to construct trend lines without data loss.</h4>
              </div>
              <div className="detail-b">
                <p>Analytics</p>
              </div>
            </div>
          </section>

          <section className="exercise-card">
            <div className="exercise-card-details">
              <div className="detail-a">
                <h3>Milestone Engine Architecture</h3>
                <h4>Process completed training sessions to automatically unlock server-side rewards and achievements.</h4>
              </div>
              <div className="detail-b">
                <p>Gamified</p>
              </div>
            </div>
          </section>

        </div>

      </section>
    </div>
  );
}
