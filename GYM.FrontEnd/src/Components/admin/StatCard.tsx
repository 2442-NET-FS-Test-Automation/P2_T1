import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: string;
  accentColor?: 'purple' | 'aqua' | 'magenta' | 'blue';
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    icon,
    accentColor = 'purple',}) => {
    // Mapeo dinámico de colores de resplandor usando nuestras variables CSS
    const colorMap = {
        purple: { color: 'var(--gq-purple)', glow: 'var(--gq-purple-glow)' },
        aqua: { color: 'var(--gq-aqua)', glow: 'var(--gq-aqua-glow)' },
        magenta: { color: 'var(--gq-magenta)', glow: 'var(--gq-magenta-glow)' },
        blue: { color: 'var(--gq-blue)', glow: 'rgba(0, 210, 255, 0.4)' },
    };

    const selectedColor = colorMap[accentColor];

    return (
        <div className="card gq-card p-3 h-100 position-relative overflow-hidden">
        {/* Indicador de acento lateral */}
        <div 
            className="position-absolute top-0 start-0 bottom-0" 
            style={{ width: '4px', backgroundColor: selectedColor.color }}
        />
        
        <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-muted small text-uppercase fw-semibold tracking-wider" style={{ color: '#B0B5C0' }}>
                {title}
            </span>
            <div 
            className="rounded-circle d-flex align-items-center justify-content-center p-2"
            style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                fontSize: '1.2rem',
                border: `1px solid ${selectedColor.color}`,
                boxShadow: `0 0 10px ${selectedColor.glow}`
            }}
            >
            {icon}
            </div>
        </div>

        <div className="d-flex align-items-baseline justify-content-between mt-1">
            <h2 className="display-6 fw-bold text-white mb-0">{value}</h2>
            {change && (
            <small className="fw-semibold" style={{ color: selectedColor.color }}>
                {change}
            </small>
            )}
        </div>
        </div>
    );
};