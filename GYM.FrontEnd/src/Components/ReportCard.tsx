interface ReportCardProps {
  date: string;
  weight: string;
  height: string;
  strength: string;
  mileTime: string;
  age: string;
}

export function ReportCard({ date, weight, height, strength, mileTime, age }: ReportCardProps) {
  return (
    <section className="exercise-card">
      <div className="exercise-card-details">
        <div className="detail-a">
          <h3>Measurement: {date}</h3>
          <h4>Biometrics: {weight} / {height} ({age})</h4>
        </div>
        <div className="detail-b">
          <p>{strength}</p>
          <p>{mileTime}</p>
        </div>
      </div>
    </section>
  );
}
