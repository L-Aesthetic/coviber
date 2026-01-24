import { GitCommit, FileText, TrendingUp, Zap, Users, Calendar, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function TeamFeed({ team }) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');

    // Fetch all activities and merge them
    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);

            // Fetch from all sources
            const [logsRes, eventsRes, contribsRes] = await Promise.all([
                supabase
                    .from('activity_logs')
                    .select('*, user:user_id(name)')
                    .eq('team_id', team.id)
                    .order('created_at', { ascending: false })
                    .limit(50),
                supabase
                    .from('equity_events')
                    .select('*, user:user_id(name)')
                    .eq('team_id', team.id)
                    .order('created_at', { ascending: false })
                    .limit(20),
                supabase
                    .from('contributions')
                    .select('*, user:user_id(name)')
                    .eq('team_id', team.id)
                    .order('created_at', { ascending: false })
                    .limit(30)
            ]);

            // Map each source to unified format
            const logs = (logsRes.data || []).map(log => ({
                id: `log-${log.id}`,
                type: log.action_type || 'commit',
                user: log.user?.name || 'System',
                action: log.description,
                details: null,
                time: new Date(log.created_at),
                icon: getIconForType(log.action_type),
                color: getColorForType(log.action_type),
                category: 'activity'
            }));

            const events = (eventsRes.data || []).map(event => ({
                id: `event-${event.id}`,
                type: 'milestone',
                user: event.user?.name || 'Team',
                action: event.description,
                details: event.event_type,
                time: new Date(event.created_at),
                icon: TrendingUp,
                color: '#F59E0B',
                category: 'equity'
            }));

            const contribs = (contribsRes.data || []).map(contrib => ({
                id: `contrib-${contrib.id}`,
                type: contrib.type,
                user: contrib.user?.name || 'Unknown',
                action: `logged contribution: ${contrib.title}`,
                details: contrib.description,
                time: new Date(contrib.created_at),
                icon: getIconForType(contrib.type),
                color: 'var(--accent-primary)',
                category: 'development'
            }));

            // Merge and sort by time
            const merged = [...logs, ...events, ...contribs].sort((a, b) => b.time - a.time);

            setActivities(merged);
            setLoading(false);
        };

        fetchActivities();

        // Realtime subscriptions
        const channel = supabase
            .channel('activity-updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs', filter: `team_id=eq.${team.id}` }, fetchActivities)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'equity_events', filter: `team_id=eq.${team.id}` }, fetchActivities)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'contributions', filter: `team_id=eq.${team.id}` }, fetchActivities)
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [team.id]);

    // Helper functions
    const getIconForType = (type) => {
        const icons = {
            commit: GitCommit,
            code: GitCommit,
            legal: FileText,
            legal_doc_added: FileText,
            milestone: TrendingUp,
            task_created: Zap,
            contribution_logged: Calendar,
            meeting: Calendar,
            strategy: MessageSquare,
            member: Users
        };
        return icons[type] || Zap;
    };

    const getColorForType = (type) => {
        const colors = {
            legal: '#10B981',
            legal_doc_added: '#10B981',
            milestone: '#F59E0B',
            equity: '#F59E0B',
            task_created: 'var(--accent-primary)',
            contribution_logged: 'var(--accent-secondary)'
        };
        return colors[type] || 'var(--accent-primary)';
    };

    const formatTime = (date) => {
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    // Filter activities
    const filteredActivities = activeFilter === 'All'
        ? activities
        : activities.filter(a => {
            const filterMap = {
                'Legal': a.category === 'activity' && a.type.includes('legal'),
                'Equity': a.category === 'equity',
                'Development': a.category === 'development' || a.type === 'code',
                'Product': a.type === 'strategy' || a.type === 'meeting'
            };
            return filterMap[activeFilter];
        });

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>
            <div className="saas-panel" style={{ padding: '32px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '32px' }}>
                    Activity Feed
                </h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                        Loading activity...
                    </div>
                ) : filteredActivities.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                        No activity yet. Start working to populate the feed!
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {filteredActivities.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.id} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                                    {/* Connector Line */}
                                    {filteredActivities.indexOf(item) !== filteredActivities.length - 1 && (
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
                                        background: `rgba(28, 28, 28, 1)`,
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
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{formatTime(item.time)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="saas-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                        Filters
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['All', 'Legal', 'Equity', 'Development', 'Product'].map((filter) => (
                            <button
                                key={filter}
                                className={activeFilter === filter ? 'btn-primary' : 'btn-ghost'}
                                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
