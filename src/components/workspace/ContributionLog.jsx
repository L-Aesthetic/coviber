import { GitCommit, Calendar, MessageSquare, Plus, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ContributionLog({ team }) {
    const [activeType, setActiveType] = useState('all');

    const contributions = [
        { id: 1, type: 'code', user: 'Louis L.', title: 'Implemented Authentication', description: 'Added JWT auth flow with refresh tokens', value: 'High', date: '2 hours ago', icon: GitCommit },
        { id: 2, type: 'meeting', user: 'Sarah K.', title: 'Investor Pitch', description: 'Met with Sequoia scout for initial screening', value: 'High', date: '5 hours ago', icon: Calendar },
        { id: 3, type: 'strategy', user: 'Team', title: 'Product Roadmap Q1', description: 'Finalized feature set for MVP launch', value: 'Medium', date: '1 day ago', icon: MessageSquare },
        { id: 4, type: 'code', user: 'Louis L.', title: 'Bug Fixes', description: 'Fixed navigation glitch on mobile', value: 'Low', date: '1 day ago', icon: GitCommit },
    ];

    const filteredContributions = activeType === 'all'
        ? contributions
        : contributions.filter(c => c.type === activeType);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>
            <div className="saas-panel" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Contribution Log
                    </h2>
                    <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                        <Plus size={14} />
                        Log Contribution
                    </button>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    {['all', 'code', 'meeting', 'strategy'].map(type => (
                        <button
                            key={type}
                            onClick={() => setActiveType(type)}
                            className={activeType === type ? 'btn-primary' : 'btn-ghost'}
                            style={{
                                padding: '6px 12px',
                                fontSize: '0.8rem',
                                textTransform: 'capitalize',
                                borderRadius: '20px'
                            }}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredContributions.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.id} className="saas-panel hover-glass" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.02)', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Icon size={18} color="var(--text-secondary)" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</h3>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{item.date}</span>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                            <strong style={{ color: 'var(--accent-primary)' }}>{item.user}</strong> • {item.description}
                                        </p>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                                            Impact: {item.value}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Sidebar Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="saas-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                        Impact Distribution
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {team.members.map((member, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{member.name}</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{50}%</span>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: '50%', height: '100%', background: i === 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Based on logged contributions over the last 30 days.
                    </div>
                </div>
            </div>
        </div>
    );
}
