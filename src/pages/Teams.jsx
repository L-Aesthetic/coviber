import { Users, Plus, Mail, Settings as SettingsIcon, Crown, Zap, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Teams() {
    const [activeTab, setActiveTab] = useState('my-teams'); // 'my-teams' or 'invitations'
    const [myTeams, setMyTeams] = useState([
        {
            id: '1',
            name: 'FlowState',
            role: 'Co-Founder',
            members: 2,
            status: 'active',
            vesting: 65, // percentage vested
            lastActive: '2 hours ago',
            avatar: '🚀'
        },
        {
            id: '2',
            name: 'DevTool X',
            role: 'Technical Lead',
            members: 3,
            status: 'active',
            vesting: 25,
            lastActive: '1 day ago',
            avatar: '🛠️'
        }
    ]);

    const [invitations, setInvitations] = useState([
        {
            id: 'inv1',
            teamName: 'AI Startup',
            inviterName: 'Sarah K.',
            role: 'Technical Co-Founder',
            equity: '30%',
            sentDate: '2 days ago',
            avatar: '🤖'
        }
    ]);

    const handleAccept = (inv) => {
        setMyTeams([...myTeams, {
            id: Date.now().toString(),
            name: inv.teamName,
            role: inv.role,
            members: 2,
            status: 'active',
            vesting: 0,
            lastActive: 'Just now',
            avatar: inv.avatar || '✨'
        }]);
        setInvitations(invitations.filter(i => i.id !== inv.id));
        setActiveTab('my-teams');
    };

    const handleDecline = (id) => {
        setInvitations(invitations.filter(i => i.id !== id));
    };

    const handleCreateTeam = () => {
        const name = prompt("Enter Team Name:");
        if (name) {
            setMyTeams([...myTeams, {
                id: Date.now().toString(),
                name: name,
                role: 'Founder',
                members: 1,
                status: 'active',
                vesting: 0,
                lastActive: 'Just now',
                avatar: '🌱'
            }]);
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
                <button className="btn-primary" onClick={handleCreateTeam} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} />
                    Create Team
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
                    {myTeams.length === 0 ? (
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
    return (
        <Link to={`/studio/${team.id}`} style={{ textDecoration: 'none' }}>
            <motion.div
                className="saas-panel hover-glass"
                style={{ padding: '24px', cursor: 'pointer' }}
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
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to={`/studio/${team.id}`}>
                            <button
                                className="btn-primary"
                                style={{ padding: '10px 20px', height: '100%' }}
                            >
                                <Zap size={16} style={{ marginRight: '8px' }} />
                                Open Studio
                            </button>
                        </Link>
                        <button
                            className="btn-ghost"
                            style={{ padding: '10px 12px' }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                alert('Settings panel would open here');
                            }}
                        >
                            <SettingsIcon size={16} />
                        </button>
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
