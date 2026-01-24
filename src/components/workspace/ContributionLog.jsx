import { GitCommit, Calendar, MessageSquare, Plus, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ContributionLog({ team }) {
    const [activeType, setActiveType] = useState('all');
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newContribution, setNewContribution] = useState({
        type: 'code',
        title: '',
        description: '',
        impact_level: 'medium'
    });

    // Fetch contributions
    useEffect(() => {
        const fetchContributions = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('contributions')
                .select(`*, user:user_id(name)`)
                .eq('team_id', team.id)
                .order('created_at', { ascending: false });

            if (data) {
                setContributions(data.map(c => ({
                    ...c,
                    user: c.user?.name || 'Unknown',
                    date: new Date(c.created_at).toLocaleDateString()
                })));
            }
            setLoading(false);
        };

        fetchContributions();

        // Realtime subscription
        const channel = supabase
            .channel('contributions-updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'contributions',
                filter: `team_id=eq.${team.id}`
            }, () => {
                fetchContributions();
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [team.id]);

    const handleAddContribution = async (e) => {
        e.preventDefault();
        if (!newContribution.title) return;

        await supabase.from('contributions').insert([{
            team_id: team.id,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            ...newContribution
        }]);

        // Log activity
        await supabase.from('activity_logs').insert([{
            team_id: team.id,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            action_type: 'contribution_logged',
            description: `Logged contribution: "${newContribution.title}"`
        }]);

        setNewContribution({ type: 'code', title: '', description: '', impact_level: 'medium' });
        setIsAdding(false);
    };

    // Icon mapping
    const getIcon = (type) => {
        const icons = {
            code: GitCommit,
            meeting: Calendar,
            strategy: MessageSquare,
            design: MessageSquare,
            sales: MessageSquare
        };
        return icons[type] || MessageSquare;
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>
            <div className="saas-panel" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Contribution Log
                    </h2>
                    <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }} onClick={() => setIsAdding(true)}>
                        <Plus size={14} />
                        Log Contribution
                    </button>
                </div>

                {/* Add Contribution Form */}
                {isAdding && (
                    <div className="saas-panel" style={{ padding: '20px', marginBottom: '20px', border: '1px solid var(--accent-primary)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Log New Contribution</h3>
                        <form onSubmit={handleAddContribution}>
                            <select
                                className="glass-input"
                                value={newContribution.type}
                                onChange={e => setNewContribution({ ...newContribution, type: e.target.value })}
                                style={{ marginBottom: '12px' }}
                            >
                                <option value="code">Code</option>
                                <option value="meeting">Meeting</option>
                                <option value="strategy">Strategy</option>
                                <option value="design">Design</option>
                                <option value="sales">Sales</option>
                            </select>
                            <input
                                autoFocus
                                className="glass-input"
                                placeholder="Title (e.g. Implemented Authentication)"
                                value={newContribution.title}
                                onChange={e => setNewContribution({ ...newContribution, title: e.target.value })}
                                style={{ marginBottom: '12px' }}
                            />
                            <textarea
                                className="glass-input"
                                placeholder="Description (optional)"
                                value={newContribution.description}
                                onChange={e => setNewContribution({ ...newContribution, description: e.target.value })}
                                style={{ marginBottom: '12px', minHeight: '80px', resize: 'vertical' }}
                            />
                            <select
                                className="glass-input"
                                value={newContribution.impact_level}
                                onChange={e => setNewContribution({ ...newContribution, impact_level: e.target.value })}
                                style={{ marginBottom: '12px' }}
                            >
                                <option value="low">Low Impact</option>
                                <option value="medium">Medium Impact</option>
                                <option value="high">High Impact</option>
                            </select>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn-ghost" onClick={() => setIsAdding(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Log Contribution</button>
                            </div>
                        </form>
                    </div>
                )}

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
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                            Loading contributions...
                        </div>
                    ) : contributions.length === 0 && !isAdding ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                            No contributions logged yet. Click "Log Contribution" to add one.
                        </div>
                    ) : (
                        (activeType === 'all' ? contributions : contributions.filter(c => c.type === activeType))
                            .map((item) => {
                                const Icon = getIcon(item.type);
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
                                                <div style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
                                                    Impact: {item.impact_level}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                    )}
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
