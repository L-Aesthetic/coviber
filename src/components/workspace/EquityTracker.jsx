import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Users, Clock, AlertCircle } from 'lucide-react';

export default function EquityTracker({ team }) {
    const [activeTab, setActiveTab] = useState('overview'); // overview, simulator

    const data = team.members.map(m => ({
        name: m.name,
        value: m.equity,
        color: m.name === 'Louis L.' ? '#6366f1' : '#a855f7' // Simplified for MVP
    }));

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>
            {/* Main Equity Chart */}
            <div className="saas-panel" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Cap Table Overview
                    </h2>
                    <div className="saas-panel" style={{ padding: '4px', display: 'inline-flex', gap: '4px' }}>
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        >
                            Current
                        </button>
                        <button
                            onClick={() => setActiveTab('simulator')}
                            className={activeTab === 'simulator' ? 'btn-primary' : 'btn-ghost'}
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        >
                            Simulator
                        </button>
                    </div>
                </div>

                <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(23, 23, 23, 0.95)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {team.members.map((member, i) => (
                        <div key={i} className="saas-panel" style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.5rem', overflow: 'hidden'
                                }}>
                                    {member.avatar && member.avatar.startsWith('http') ? (
                                        <img src={member.avatar} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        member.avatar
                                    )}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{member.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{member.role}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Ownership</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{member.equity}%</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Vested</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#10B981' }}>{member.vested}%</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Side Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="saas-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Clock size={16} color="var(--accent-primary)" />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>NEXT VESTING CLIFF</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        Jan 15, 2027
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                        In 11 months, 25% of equity will vest for all founders tailored to the standard 4-year schedule.
                    </div>
                </div>

                <div className="saas-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Users size={16} color="#10B981" />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>OPTION POOL</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        10.0%
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                        Reserved for future employees and advisors.
                    </div>
                </div>
            </div>
        </div>
    );
}
