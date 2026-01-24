import { GitCommit, FileText, TrendingUp, Zap, Users } from 'lucide-react';

export default function TeamFeed({ team }) {
    const activities = [
        { type: 'commit', user: 'Louis L.', action: 'pushed 3 commits to main', details: 'Added authentication flow', time: '2 hours ago', icon: GitCommit, color: 'var(--accent-primary)' },
        { type: 'legal', user: 'Sarah K.', action: 'signed FAST Agreement', details: null, time: '1 day ago', icon: FileText, color: '#10B981' },
        { type: 'milestone', user: 'Team', action: 'reached 25% vesting milestone', details: '1-year cliff passed', time: '3 days ago', icon: TrendingUp, color: '#F59E0B' },
        { type: 'commit', user: 'Louis L.', action: 'deployed to production', details: 'v1.2.0', time: '5 days ago', icon: Zap, color: 'var(--accent-secondary)' },
        { type: 'member', user: 'Louis L.', action: 'invited Sarah K. to the team', details: null, time: '7 days ago', icon: Users, color: 'var(--accent-primary)' }
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>
            <div className="saas-panel" style={{ padding: '32px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '32px' }}>
                    Activity Feed
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {activities.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                                {/* Connector Line */}
                                {i !== activities.length - 1 && (
                                    <div style={{
                                        position: 'absolute',
                                        left: '20px',
                                        top: '40px',
                                        bottom: '-24px',
                                        width: '2px',
                                        background: 'rgba(255, 255, 255, 0.05)'
                                    }} />
                                )}

                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: `rgba(28, 28, 28, 1)`, // Dark background to cover line
                                    border: `1px solid ${item.color}40`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    zIndex: 1
                                }}>
                                    <Icon size={18} color={item.color || 'var(--accent-primary)'} />
                                </div>
                                <div style={{ flex: 1, paddingBottom: '8px' }}>
                                    <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                                        <strong>{item.user}</strong> {item.action}
                                    </div>
                                    {item.details && (
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px', display: 'inline-block' }}>
                                            {item.details}
                                        </div>
                                    )}
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{item.time}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="saas-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                        Filters
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['All', 'Legal', 'Equity', 'Development', 'Product'].map((filter, i) => (
                            <button key={i} className="btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
