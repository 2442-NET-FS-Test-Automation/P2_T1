
export function AdminTopbar() {
    return (
        <header 
        className="navbar px-4 py-3 d-flex justify-content-between align-items-center gq-card rounded-0 border-top-0 border-start-0 border-end-0"
        style={{ backgroundColor: 'var(--gq-surface)' }}
        >
        {/* Global Search Input (Text in English & Fixed Text Visibility) */}
        <div className="w-50">
            <div className="input-group">
            <span 
                className="input-group-text border-end-0 text-aqua" 
                style={{ backgroundColor: '#161729', borderColor: 'var(--gq-surface-border)' }}
            >
                🔍
            </span>
            <input 
                type="text" 
                className="form-control gq-input border-start-0 text-white" 
                placeholder="Search users, exercises, or workouts in the Realm..."
            />
            </div>
        </div>

        {/* Quick Actions / System Status */}
        <div className="d-flex align-items-center gap-3">
            {/* System Online Status Badge */}
            <span 
            className="badge px-3 py-2 fw-semibold d-flex align-items-center gap-2"
            style={{ 
                backgroundColor: 'rgba(70, 240, 210, 0.1)', 
                color: 'var(--gq-aqua)', 
                border: '1px solid var(--gq-aqua)',
                boxShadow: '0 0 10px var(--gq-aqua-glow)'
            }}
            >
            <span style={{ fontSize: '0.6rem' }}>●</span> System Online
            </span>

            {/* Logout Button */}
            <button 
            className="btn btn-sm px-3 py-1 fw-semibold transition-all"
            style={{ 
                backgroundColor: 'transparent',
                color: 'var(--gq-magenta)',
                border: '1px solid var(--gq-magenta)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--gq-magenta)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.boxShadow = '0 0 12px var(--gq-magenta-glow)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--gq-magenta)';
                e.currentTarget.style.boxShadow = 'none';
            }}
            >
            Log Out
            </button>
        </div>
        </header>
    );
};