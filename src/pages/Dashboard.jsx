import { Users, GitPullRequest, Zap, TrendingUp, Plus, Sun, Moon, Calendar, Bell, ArrowRight, CheckCircle2, AlertCircle, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeProvider';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const [teams, setTeams] = useState([]);
    const [stats, setStats] = useState({
        teamCount: 0,
        activeSessions: 0,
        openMatches: 0,
        avgVesting: 0
    });
    const [loading, setLoading] = useState(true);

    // Mock Milestones Data (In real app, fetch from 'milestones' table)
    const [milestones, setMilestones] = useState([
        { id: 1, icon: CheckCircle2, label: "FlowState 1-year cliff", date: "In 2 months", color: "#10B981" },
        { id: 2, icon: Calendar, label: "DevTool X vesting", date: "In 9 months", color: "var(--accent-primary)" },
        { id: 3, icon: AlertCircle, label: "83(b) deadline", date: "In 12 days", color: "#F59E0B" }
    ]);

    useEffect(() => {
        if (!user) return;

        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Teams
                const { data: teamData, error: teamError } = await supabase
                    .from('team_members')
                    .select(`
                        team_id,
                        role,
                        teams (
                            id,
                            name,
                            avatar_url,
                            created_at
                        )
                    `)
                    .eq('user_id', user.id);

                if (teamError) throw teamError;

                // Format teams for display
                const formattedTeams = teamData.map(item => {
                    // Calculate mock vesting based on created_at
                    const createdAt = new Date(item.teams.created_at);
                    const now = new Date();
                    const diffTime = Math.abs(now - createdAt);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const vesting = Math.min(100, Math.floor((diffDays / 365) * 25)); // 4 year vesting assumption

                    return {
                        id: item.teams.id,
                        name: item.teams.name,
                        avatar: item.teams.avatar_url || '🚀',
                        members: 1, // Placeholder until we count members per team
                        vesting: vesting,
                        lastActive: new Date(item.teams.created_at).toLocaleDateString(),
                        status: 'active'
                    };
                });

                setTeams(formattedTeams);

                // 2. Fetch Pipeline Count (Open Matches)
                const { count: matchesCount } = await supabase
                    .from('pipeline_items')
                    .select('*', { count: 'exact', head: true })
                    .eq('owner_id', user.id);

                // Calculate Avg Vesting
                const totalVesting = formattedTeams.reduce((acc, curr) => acc + curr.vesting, 0);
                const avgVesting = formattedTeams.length > 0 ? Math.floor(totalVesting / formattedTeams.length) : 0;

                setStats({
                    teamCount: formattedTeams.length,
                    activeSessions: formattedTeams.length > 0 ? 1 : 0,
                    openMatches: matchesCount || 0,
                    avgVesting: avgVesting
                });

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    // Derived active sessions for UI (mocked based on real teams if any)
    const activeSessions = teams.length > 0 ? [
        { team: teams[0].name, participants: ['You', 'Partner'], started: 'Now', type: 'coding' }
    ] : [];

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Good afternoon, {user?.email?.split('@')[0] || 'Builder'}. Your teams are building.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button
                        onClick={toggleTheme}
                        className="btn-ghost"
                        style={{
                            width: '44px',
                            height: '44px',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px'
                        }}
                        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <Link to="/teams" style={{ textDecoration: 'none' }}>
                        <button className="btn-primary">
                            <Plus size={16} /> Create Team
                        </button>
                    </Link>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                    <StatCard icon={Users} label="Your Teams" value={stats.teamCount.toString()} linkTo="/teams" />
                    <StatCard icon={Zap} label="Active Sessions" value={stats.activeSessions.toString()} linkTo={teams.length > 0 ? `/session/${teams[0].id}` : '/teams'} />
                    <StatCard icon={GitPullRequest} label="Open Matches" value={stats.openMatches.toString()} linkTo="/pipeline?tab=matches" />
                    <StatCard icon={TrendingUp} label="Avg. Vesting" value={`${stats.avgVesting}%`} linkTo="/teams" />
                </div>

                {/* Main Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Your Teams */}
                        <section>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Your Teams</h3>
                                <Link to="/teams" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
                                    View All <ArrowRight size={14} style={{ display: 'inline', marginLeft: '4px' }} />
                                </Link>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {teams.length > 0 ? teams.map(team => (
                                    <TeamQuickCard key={team.id} team={team} />
                                )) : (
                                    <div className="saas-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No active teams found. <Link to="/teams" style={{ color: 'var(--accent-primary)' }}>Create one</Link>.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Active Sessions */}
                        {activeSessions.length > 0 && (
                            <section>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                                    Active Sessions
                                </h3>
                                <div className="saas-panel" style={{ padding: '24px' }}>
                                    {activeSessions.map((session, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                                    {session.team}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    {session.participants.join(', ')} • Started {session.started}
                                                </div>
                                            </div>
                                            <Link to={`/session/${teams[0]?.id || 'demo'}`}>
                                                <button className="btn-primary">
                                                    <Zap size={14} />
                                                    Join
                                                </button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Quick Actions for Finding */}
                        <section>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                                Looking for a Co-Founder?
                            </h3>
                            <div className="saas-panel" style={{ padding: '32px', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                                    {stats.openMatches} new matches waiting
                                </h4>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
                                    Based on your vibe quiz and skills, we found potential co-founders.
                                </p>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                    <Link to="/search">
                                        <button className="btn-primary">Browse Candidates</button>
                                    </Link>
                                    <Link to="/pipeline">
                                        <button className="btn-ghost">View Pipeline</button>
                                    </Link>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Team Health */}
                        <section>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                                Team Health
                            </h3>
                            <div className="saas-panel" style={{ padding: '24px' }}>
                                <HealthMetric
                                    label="Overall Vesting Progress"
                                    value={`${stats.avgVesting}%`}
                                    color="#10B981"
                                />
                                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '16px 0' }} />
                                <HealthMetric
                                    label="Contributions This Week"
                                    value={`${healthMetrics.contributionsThisWeek}/${healthMetrics.totalContributions}`}
                                    color="var(--accent-primary)"
                                />
                                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '16px 0' }} />
                                <HealthMetric
                                    label="Legal Documents Signed"
                                    value={healthMetrics.totalLegalDocs > 0 ? `${healthMetrics.legalDocsSigned}/${healthMetrics.totalLegalDocs}` : 'None'}
                                    color={healthMetrics.legalDocsSigned === healthMetrics.totalLegalDocs && healthMetrics.totalLegalDocs > 0 ? '#10B981' : '#F59E0B'}
                                />
                            </div>
                        </section>

                        {/* Upcoming Milestones */}
                        <section>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                                Upcoming Milestones
                            </h3>
                            <div className="saas-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {milestones.map(m => (
                                    <MilestoneItem key={m.id} icon={m.icon} label={m.label} date={m.date} color={m.color} />
                                ))}
                            </div>
                        </section>


                    </div>
                </div>
            </div>
        </div>
    );
}

function TeamQuickCard({ team }) {
    return (
        <Link to={`/studio/${team.id}`} style={{ textDecoration: 'none' }}>
            <motion.div
                className="saas-panel hover-glass"
                style={{ padding: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                whileHover={{ x: 4 }}
            >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                    <div style={{ fontSize: '2.5rem' }}>{team.avatar}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {team.name}
                            </h4>
                            {team.status === 'active' && (
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                            )}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {team.members} members • Active {team.lastActive}
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'right', paddingLeft: '16px' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                        {team.vesting}%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                        Vested
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

function StatCard({ icon: Icon, label, value, linkTo = '/' }) {
    return (
        <Link to={linkTo} style={{ textDecoration: 'none' }}>
            <motion.div
                className="saas-panel"
                style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                    height: '100%'
                }}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
            >
                <div style={{ marginBottom: '12px', background: 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color="var(--accent-primary)" />
                </div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: 800, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{value}</div>
            </motion.div>
        </Link>
    );
}

function HealthMetric({ label, value, color }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color }}>{value}</span>
            </div>
        </div>
    );
}

function MilestoneItem({ icon: Icon, label, date, color }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: `${color}15`, padding: '8px', borderRadius: '8px', display: 'flex' }}>
                <Icon size={16} color={color} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{date}</div>
            </div>
        </div>
    );
}
