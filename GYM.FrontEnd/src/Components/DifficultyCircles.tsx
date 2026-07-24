// 1. Define the allowed difficulty levels
type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface DifficultyProps {
  level: DifficultyLevel; // Restricts string values
}

export function DifficultyCircles({ level }: DifficultyProps) {
  // 2. Strongly type the map keys to match
  const countMap: Record<DifficultyLevel, number> = { 
    easy: 1, 
    medium: 2, 
    hard: 3 
  };
  
  const circlesCount = countMap[level];

  return (
    <div 
      className="difficulty-circles-container" 
      style={{ display: "flex", gap: "6px", alignItems: "center" }}
      title={`Difficulty: ${level}`}
    >
      {Array.from({ length: circlesCount }).map((_, index) => (
        <svg key={index} width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#46f0d2" stroke-width="2" />
        </svg>
      ))}
    </div>
  );
}