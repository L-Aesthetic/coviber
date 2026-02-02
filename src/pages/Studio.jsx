import { ArrowLeft, Users, Zap, Settings, Calendar } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Sub-components
import EquityTracker from '../components/workspace/EquityTracker';
import LegalVault from '../components/workspace/LegalVault';
import ContributionLog from '../components/workspace/ContributionLog';
import TeamFeed from '../components/workspace/TeamFeed';

export default function Studio() {
    const { teamId } = useParams();
    const [activeView, setActiveView] = useState('overview');
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        docsCount: 0,
        docsSigned: 0,
        contributionsCount: 0,
        activitiesCount: 0
    });

    // Fetch team data and stats
    useEffect(() => {
        const fetchTeamData = async () => {
            setLoading(true);

            // Fetch team info
            const { data: teamData } = await supabase
                .from('teams')
                .select('*')
                .eq('id', teamId)
                .single();

            // Fetch team members with profiles
            const { data: membersData } = await supabase
                .from('team_members')
                .select(`*, profile:user_id(name, avatar_url)`)
                .eq('team_id', teamId);

            // Fetch stats for overview
            const [docsRes, contribsRes, activitiesRes] = await Promise.all([
                supabase.from('legal_documents').select('id, status', { count: 'exact' }).eq('team_id', teamId),
                supabase.from('contributions').select('id', { count: 'exact' }).eq('team_id', teamId),
                supabase.from('activity_logs').select('id', { count: 'exact' }).eq('team_id', teamId).limit(5)
            ]);

            const docsSigned = docsRes.data?.filter(d => d.status === 'signed').length || 0;

            setStats({
                docsCount: docsRes.data?.length || 0,
                docsSigned,
                contributionsCount: contribsRes.data?.length || 0,
                activitiesCount: activitiesRes.data?.length || 0
            });

            // Build team object
            if (teamData && membersData) {
                setTeam({
                    id: teamData.id,
                    name: teamData.name,
                    avatar: '🚀',
                    foundedDate: new Date(teamData.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    members: membersData.map(m => {
                        const equityVal = parseFloat(m.equity) || 0;
                        return {
                            name: m.profile?.name || 'Unknown',
                            role: m.role || 'Co-Founder',
                            equity: equityVal,
                            vested: (equityVal * 0.65).toFixed(1), // Simple calculation, formatted
                            avatar: m.profile?.avatar_url || '👤',
                            active: true
                        };
                    })
                });
            }

            setLoading(false);
        };

        fetchTeamData();
    }, [teamId]);

    if (loading) {
        return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                Loading team data...
            </div>
        );
    }

    if (!team) {
        return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                Team not found
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <Link to="/teams" className="btn-ghost" style={{ marginBottom: '16px', padding: '8px 16px', display: 'inline-flex' }}>
                    <ArrowLeft size={16} />
                    Back to Teams
                </Link>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{
                            fontSize: '3rem',
                            width: '80px',
                            height: '80px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(99, 102, 241, 0.2)'
                        }}>
                            {team.avatar}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                                {team.name}
                            </h1>
                            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Users size={14} /> {team.members.length} co-founders
                                </span>
                                <span>•</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={14} /> Founded {team.foundedDate}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to={`/session/${teamId}`} style={{ textDecoration: 'none' }}>
                            <button className="btn-primary">
                                <Zap size={16} />
                                Enter War Room
                            </button>
                        </Link>
                        <Link to={`/studio/${teamId}/settings`} className="btn-ghost" style={{ padding: '10px 12px' }}>
                            <Settings size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="saas-panel" style={{ padding: '4px', display: 'inline-flex', gap: '4px', marginBottom: '32px', overflowX: 'auto', maxWidth: '100%' }}>
                <TabButton active={activeView === 'overview'} onClick={() => setActiveView('overview')} label="Overview" />
                <TabButton active={activeView === 'equity'} onClick={() => setActiveView('equity')} label="Equity Tracker" />
                <TabButton active={activeView === 'legal'} onClick={() => setActiveView('legal')} label="Legal Vault" />
                <TabButton active={activeView === 'contributions'} onClick={() => setActiveView('contributions')} label="Contribution Log" />
                <TabButton active={activeView === 'activity'} onClick={() => setActiveView('activity')} label="Activity" />
            </div>

            {/* Content */}
            {activeView === 'overview' && <WorkspaceOverview team={team} setActiveView={setActiveView} stats={stats} />}
            {activeView === 'equity' && <EquityTracker team={team} />}
            {activeView === 'legal' && <LegalVault team={team} />}
            {activeView === 'contributions' && <ContributionLog team={team} />}
            {activeView === 'activity' && <TeamFeed team={team} />}
        </div>
    );
}

function TabButton({ active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                background: active ? 'var(--accent-primary)' : 'transparent',
                color: active ? 'white' : 'var(--text-tertiary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
            }}
        >
            {label}
        </button>
    );
}

function WorkspaceOverview({ team, setActiveView, stats }) {
    // Calculate equity health (simple algorithm: check if split is fair)
    const equityVariance = team.members.reduce((acc, m) => acc + Math.abs(m.equity - (100 / team.members.length)), 0);
    const equityHealth = equityVariance < 10 ? 'Fair' : equityVariance < 30 ? 'Review' : 'Imbalanced';
    const equityStatus = equityHealth === 'Fair' ? 'good' : equityHealth === 'Review' ? 'warning' : 'bad';

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="saas-panel" style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                        Workspace Overview
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Welcome to your team's operating system. Track equity, manage legal docs, and log contributions here.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <OverviewCard
                            title="Equity Health"
                            value={equityHealth}
                            status={equityStatus}
                            action={() => setActiveView('equity')}
                        />
                        <OverviewCard
                            title="Legal Status"
                            value={`${stats.docsSigned}/${stats.docsCount} Signed`}
                            status={stats.docsSigned === stats.docsCount ? 'good' : 'warning'}
                            action={() => setActiveView('legal')}
                        />
                        <OverviewCard
                            title="Contributions Logged"
                            value={`${stats.contributionsCount}`}
                            status="good"
                            action={() => setActiveView('contributions')}
                        />
                        <OverviewCard
                            title="Recent Activity"
                            value={`${stats.activitiesCount} items`}
                            status="good"
                            action={() => setActiveView('activity')}
                        />
                    </div>
                </div>

                {/* Mini Activity Feed */}
                <div className="saas-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            Recent Updates
                        </h2>
                        <button className="btn-ghost" onClick={() => setActiveView('activity')} style={{ fontSize: '0.85rem' }}>
                            View All
                        </button>
                    </div>
                    {/* Render a simplified version of TeamFeed here or import it if desired, 
                        for now just a placeholder to keep it clean */}
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Check the <button className="btn-link" onClick={() => setActiveView('activity')}>Activity Feed</button> for full details.
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="saas-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                        War Room Status
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
                        Operational
                    </div>
                    <Link to={`/session/${team.id}`} style={{ width: '100%' }}>
                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            <Zap size={16} />
                            Enter Session
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function OverviewCard({ title, value, status, action }) {
    return (
        <div
            onClick={action}
            className="saas-panel hover-glass"
            style={{ padding: '20px', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}
        >
            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '8px' }}>{title}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: status === 'good' ? '#10B981' : status === 'warning' ? '#F59E0B' : 'var(--text-primary)' }}>
                {value}
            </div>
        </div>
    );
}
