// ...imports
import { Users, Plus, Mail, Settings as SettingsIcon, Crown, Zap, Calendar, TrendingUp, AlertCircle, MoreVertical, Trash2, LogOut, Edit3, X, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';

export default function Teams() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('my-teams');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Pro Tier check
    const [tier, setTier] = useState('founder');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchTier = async () => {
            const { data } = await supabase.from('profiles').select('subscription_tier').eq('id', user.id).single();
            if (data?.subscription_tier) setTier(data.subscription_tier);
            setLoading(false);
        };
        fetchTier();
    }, [user]);

    const isPro = ['founder', 'pro', 'certified', 'accelerator'].includes(tier);

    // Create Team Form State
    const [newTeamName, setNewTeamName] = useState('');
    const [newTeamDesc, setNewTeamDesc] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteList, setInviteList] = useState([]);

    const [myTeams, setMyTeams] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [loadingTeams, setLoadingTeams] = useState(true);

    // Fetch user's teams
    useEffect(() => {
        if (!user) {
            setLoadingTeams(false); // User not loaded yet, stop loading
            return;
        }

        const fetchTeams = async () => {
            setLoadingTeams(true);

            try {
                // Fetch teams where user is a member
                const { data: memberships, error } = await supabase
                    .from('team_members')
                    .select(`
                        *,
                        team:team_id (
                            id,
                            name,
                            description,
                            created_at
                        )
                    `)
                    .eq('user_id', user.id);

                if (error) {
                    console.error('Error fetching teams:', error);
                    setLoadingTeams(false);
                    return;
                }

                if (!memberships || memberships.length === 0) {
                    setMyTeams([]);
                    setLoadingTeams(false);
                    return;
                }

                // Transform into teams format
                const teams = await Promise.all(memberships.map(async (m) => {
                    // Get member count for each team
                    const { count } = await supabase
                        .from('team_members')
                        .select('*', { count: 'exact', head: true })
                        .eq('team_id', m.team_id);

                    // Calculate last active (simplified)
                    const lastActivity = await supabase
                        .from('activity_logs')
                        .select('created_at')
                        .eq('team_id', m.team_id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .single();

                    const getRelativeTime = (date) => {
                        if (!date) return 'No activity';
                        const now = new Date();
                        const past = new Date(date);
                        const diffHours = Math.floor((now - past) / (1000 * 60 * 60));
                        const diffDays = Math.floor(diffHours / 24);
                        if (diffHours < 1) return 'Just now';
                        if (diffHours < 24) return `${diffHours}h ago`;
                        if (diffDays < 7) return `${diffDays}d ago`;
                        return past.toLocaleDateString();
                    };

                    return {
                        id: m.team.id,
                        name: m.team.name,
                        role: m.role || 'Member',
                        members: count || 1,
                        status: 'active',
                        vesting: Math.min(m.equity * 0.65, m.equity || 0), // Simple calculation
                        lastActive: getRelativeTime(lastActivity?.data?.created_at),
                        avatar: '🚀',
                        description: m.team.description || 'No description'
                    };
                }));

                setMyTeams(teams);
            } catch (error) {
                console.error('Error in fetchTeams:', error);
            } finally {
                setLoadingTeams(false);
            }
        };

        fetchTeams();
    }, [user]);

    const handleAccept = (inv) => {
        // TODO: Accept invitation logic when we implement invitations table
        setInvitations(invitations.filter(i => i.id !== inv.id));
        setActiveTab('my-teams');
    };

    const handleDecline = (id) => {
        // TODO: Decline invitation logic
        setInvitations(invitations.filter(i => i.id !== id));
    };

    const handleCreateTeam = () => {
        if (!isPro) {
            if (window.confirm("Team Creation is a Pro feature. Upgrade to unlock?")) {
                navigate('/upgrade');
            }
            return;
        }
        setNewTeamName('');
        setNewTeamDesc('');
        setInviteList([]);
        setIsModalOpen(true);
    };

    const addInvite = () => {
        if (inviteEmail && !inviteList.includes(inviteEmail)) {
            setInviteList([...inviteList, inviteEmail]);
            setInviteEmail('');
        }
    };

    const removeInvite = (email) => {
        setInviteList(inviteList.filter(e => e !== email));
    };

    const submitCreateTeam = async () => {
        if (!newTeamName.trim()) return;

        try {
            // 1. Create team
            const { data: newTeam, error: teamError } = await supabase
                .from('teams')
                .insert([{
                    name: newTeamName,
                    description: newTeamDesc || null
                }])
                .select()
                .single();

            if (teamError) throw teamError;

            // 2. Add creator as first member
            const { error: memberError } = await supabase
                .from('team_members')
                .insert([{
                    team_id: newTeam.id,
                    user_id: user.id,
                    role: 'Founder',
                    equity: 100 - (inviteList.length * 25) // Simple: split among invites
                }]);

            if (memberError) throw memberError;

            // 3. Log activity
            await supabase.from('activity_logs').insert([{
                team_id: newTeam.id,
                user_id: user.id,
                action_type: 'team_created',
                description: `Created team "${newTeamName}"`
            }]);

            // 4. TODO: Send invitations (if we implement team_invitations table)
            // For now, just refresh teams list
            setMyTeams([...myTeams, {
                id: newTeam.id,
                name: newTeamName,
                role: 'Founder',
                members: 1,
                status: 'active',
                vesting: 0,
                lastActive: 'Just now',
                avatar: '🌱',
                description: newTeamDesc || 'No description'
            }]);

            setIsModalOpen(false);
            setNewTeamName('');
            setNewTeamDesc('');
            setInviteList([]);
        } catch (error) {
            console.error('Error creating team:', error);
            alert('Failed to create team. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Your Teams
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Manage your founding teams and collaborations.
                    </p>
                </div>
                <button
                    className={isPro ? "btn-primary" : "btn-ghost"}
                    onClick={handleCreateTeam}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: isPro ? 1 : 0.7 }}
                >
                    {isPro ? <Plus size={18} /> : <Lock size={16} />}
                    {isPro ? "Create Team" : "Unlock Team Creation"}
                </button>
            </header>

            {/* Tabs */}
            <div className="saas-panel" style={{ padding: '4px', display: 'inline-flex', gap: '4px', marginBottom: '32px' }}>
                <TabButton
                    active={activeTab === 'my-teams'}
                    onClick={() => setActiveTab('my-teams')}
                    label="My Teams"
                    count={myTeams.length}
                />
                <TabButton
                    active={activeTab === 'invitations'}
                    onClick={() => setActiveTab('invitations')}
                    label="Invitations"
                    count={invitations.length}
                />
            </div>

            {/* Content */}
            {activeTab === 'my-teams' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {loadingTeams ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
                            Loading your teams...
                        </div>
                    ) : myTeams.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            title="No teams yet"
                            description="Create your first team or accept an invitation to get started."
                            action="Create Team"
                            onAction={handleCreateTeam}
                        />
                    ) : (
                        myTeams.map(team => <TeamCard key={team.id} team={team} />)
                    )}
                </div>
            )}

            {activeTab === 'invitations' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {invitations.length === 0 ? (
                        <EmptyState
                            icon={Mail}
                            title="No pending invitations"
                            description="When other founders invite you to join their team, they'll appear here."
                        />
                    ) : (
                        invitations.map(inv => (
                            <InvitationCard
                                key={inv.id}
                                invitation={inv}
                                onAccept={() => handleAccept(inv)}
                                onDecline={() => handleDecline(inv.id)}
                            />
                        ))
                    )}
                </div>
            )}

            {/* Create Team Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                    }} onClick={() => setIsModalOpen(false)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="saas-panel"
                            style={{ width: '500px', padding: '32px', border: '1px solid var(--border-subtle)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Users size={24} color="var(--accent-primary)" />
                                Create New Team
                            </h3>

                            {/* Team Name */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Team Name *</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="glass-input"
                                    placeholder="e.g. Stealth AI, Project X..."
                                    value={newTeamName}
                                    onChange={e => setNewTeamName(e.target.value)}
                                    style={{ width: '100%', fontSize: '1rem' }}
                                />
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Pitch / Description</label>
                                <textarea
                                    className="glass-input"
                                    placeholder="What are you building? Keep it short."
                                    value={newTeamDesc}
                                    onChange={e => setNewTeamDesc(e.target.value)}
                                    style={{ width: '100%', fontSize: '0.9rem', minHeight: '80px', fontFamily: 'inherit' }}
                                />
                            </div>

                            {/* Invite Members */}
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Invite Co-Founders</label>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                    <input
                                        type="email"
                                        className="glass-input"
                                        placeholder="founder@email.com"
                                        value={inviteEmail}
                                        onChange={e => setInviteEmail(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && addInvite()}
                                        style={{ flex: 1, fontSize: '0.9rem' }}
                                    />
                                    <button className="btn-secondary" onClick={addInvite}>
                                        Add
                                    </button>
                                </div>
                                {/* Invite List */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {inviteList.map(email => (
                                        <div key={email} className="tag" style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '6px' }}>
                                            {email}
                                            <div onClick={() => removeInvite(email)} style={{ cursor: 'pointer', display: 'flex' }}>
                                                <X size={12} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={submitCreateTeam}>
                                    Launch Team
                                </button>
                                <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TabButton({ active, onClick, label, count }) {
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
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}
        >
            {label}
            <span style={{
                background: active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700
            }}>
                {count}
            </span>
        </button>
    );
}

function TeamCard({ team }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <Link to={`/studio/${team.id}`} style={{ textDecoration: 'none' }}>
            <motion.div
                className="saas-panel hover-glass"
                style={{ padding: '24px', cursor: 'pointer', position: 'relative' }}
                whileHover={{ x: 4 }}
            >
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    {/* Team Avatar */}
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

                    {/* Team Info */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {team.name}
                            </h3>
                            {team.status === 'active' && (
                                <span style={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    color: '#10B981',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase'
                                }}>
                                    Active
                                </span>
                            )}
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px', fontStyle: 'italic' }}>
                            {team.description}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <Crown size={14} color="var(--accent-primary)" />
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{team.role}</span>
                            <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                            <Users size={14} color="var(--text-tertiary)" />
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{team.members} members</span>
                            <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                            <Calendar size={14} color="var(--text-tertiary)" />
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Active {team.lastActive}</span>
                        </div>

                        {/* Vesting Progress */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                                    VESTING PROGRESS
                                </span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                                    {team.vesting}%
                                </span>
                            </div>
                            <div style={{
                                height: '6px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '3px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${team.vesting}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Link to={`/studio/${team.id}`}>
                            <button
                                className="btn-primary"
                                style={{ padding: '10px 20px', height: '40px' }}
                            >
                                <Zap size={16} style={{ marginRight: '8px' }} />
                                Studio
                            </button>
                        </Link>

                        {/* Settings Menu Trigger */}
                        <div style={{ position: 'relative' }} onClick={e => e.preventDefault()}>
                            <button
                                className="btn-ghost"
                                style={{ padding: '10px 12px', height: '40px' }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsSettingsOpen(!isSettingsOpen);
                                }}
                            >
                                <SettingsIcon size={16} />
                            </button>

                            {/* Dropdown */}
                            <AnimatePresence>
                                {isSettingsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            marginTop: '8px',
                                            background: '#1c1c24',
                                            border: '1px solid var(--border-subtle)',
                                            borderRadius: '12px',
                                            width: '180px',
                                            zIndex: 50,
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                                            overflow: 'hidden'
                                        }}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <div className="menu-item" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <Edit3 size={14} /> Rename
                                        </div>
                                        <div className="menu-item" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <Users size={14} /> Manage Members
                                        </div>
                                        <div className="menu-item" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer', color: '#EF4444' }}>
                                            <LogOut size={14} /> Leave Team
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

function InvitationCard({ invitation, onAccept, onDecline }) {
    return (
        <div className="saas-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {invitation.teamName}
                    </h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        <strong>{invitation.inviterName}</strong> invited you to join as <strong>{invitation.role}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TrendingUp size={14} color="var(--accent-primary)" />
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {invitation.equity} equity
                            </span>
                        </div>
                        <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            Sent {invitation.sentDate}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={onAccept}>
                            Accept Invitation
                        </button>
                        <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onDecline}>
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="saas-panel" style={{ padding: '60px 40px', textAlign: 'center' }}>
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
            }}>
                <Icon size={32} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                {title}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                {description}
            </p>
            {action && (
                <button className="btn-primary">
                    <Plus size={16} />
                    {action}
                </button>
            )}
        </div>
    );
}
