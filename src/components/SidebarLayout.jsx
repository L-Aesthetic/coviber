import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, GitPullRequest, Search, FileText, Settings, Zap, Brain, User, Scale, TrendingUp, Sparkles, CreditCard, LogOut, ChevronUp, MessageSquare, Lock, Trash2, X, Bell, Mail, ShieldCheck, Rocket } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';

export default function SidebarLayout({ children }) {
    const { user } = useAuth();
    const location = useLocation();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const [showAccountModal, setShowAccountModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [passLoading, setPassLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user) return;

            try {
                const { data } = await supabase
                    .from('profiles')

                    .select('subscription_tier, notification_prefs, avatar_url, name, email')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setProfileData(data);
                }
            } catch (e) {
                console.error("Profile fetch error:", e);
            }
        };

        if (user) {
            fetchProfileData();
            window.addEventListener('tier-change', fetchProfileData);
            window.addEventListener('profile-updated', fetchProfileData);

            // Realtime Subscription
            const channel = supabase
                .channel('profile_changes')
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'profiles',
                        filter: `id=eq.${user.id}`
                    },
                    (payload) => {
                        setProfileData(prev => ({
                            ...prev,
                            ...payload.new
                        }));
                    }
                )
                .subscribe();

            return () => {
                window.removeEventListener('tier-change', fetchProfileData);
                window.removeEventListener('profile-updated', fetchProfileData);
                supabase.removeChannel(channel);
            };
        }
    }, [user, showAccountModal, location.pathname]);

    const handleToggleNotif = async (key) => {
        if (!profileData) return;
        const currentPrefs = profileData.notification_prefs || { email_digest: true, new_matches: true, product_updates: true };
        const newPrefs = { ...currentPrefs, [key]: !currentPrefs[key] };

        // Optimistic update
        setProfileData({ ...profileData, notification_prefs: newPrefs });

        await supabase.from('profiles').update({ notification_prefs: newPrefs }).eq('id', user.id);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Teams', path: '/teams' },
        { icon: Search, label: 'Find Candidates', path: '/search' },
        { icon: GitPullRequest, label: 'Pipeline', path: '/pipeline' },
        { icon: FileText, label: 'Alignment Audit', path: '/audit' },
        { icon: Brain, label: 'Vibe Quiz', path: '/quiz' },
        { icon: User, label: 'My Profile', path: '/profile' },
        { icon: Scale, label: 'Equity Split', path: '/equity' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
            {/* Animated Background Orbs */}
            <div className="bg-orb orb-1"></div>
            <div className="bg-orb orb-2"></div>
            <div className="bg-orb orb-3"></div>

            {/* Sidebar */}
            <aside className="glass-sidebar" style={{
                width: 'var(--sidebar-width)',
                position: 'fixed',
                height: '100vh',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 50
            }}>
                {/* Logo */}
                <div style={{ marginBottom: '40px', paddingLeft: '8px' }}>
                    <img src="/logo-full.png" alt="CoVibr" className="app-logo" style={{ height: '110px', display: 'block' }} />
                </div>

                {/* Navigation */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, padding: '0 12px 8px', letterSpacing: '0.05em' }}>
                        SOURCING
                    </div>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link key={item.path} to={item.path} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                background: isActive ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                                fontWeight: isActive ? 600 : 500,
                                fontSize: '0.9rem',
                                transition: 'all 0.2s',
                            }}>
                                <Icon size={18} color={isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)'} />
                                {item.label}
                            </Link>
                        );
                    })}

                    <div style={{ height: '32px' }}></div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, padding: '0 12px 8px', letterSpacing: '0.05em' }}>
                        WORKSPACE
                    </div>
                    {/* Dynamic Pro Link */}
                    {(profileData?.subscription_tier || '').toLowerCase() === 'founder' ? (
                        <Link to="/billing" style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                            borderRadius: '8px', textDecoration: 'none',
                            color: '#F59E0B', // Gold/Amber
                            background: 'rgba(245, 158, 11, 0.1)',
                            fontWeight: 600, fontSize: '0.9rem',
                            border: '1px solid rgba(245, 158, 11, 0.2)'
                        }}>
                            <Sparkles size={18} color="#F59E0B" fill="#F59E0B" fillOpacity={0.2} /> Founder's Club
                        </Link>
                    ) : (profileData?.subscription_tier || '').toLowerCase() === 'pro' ? (
                        <Link to="/billing" style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                            borderRadius: '8px', textDecoration: 'none',
                            color: 'var(--accent-primary)',
                            background: 'rgba(99, 102, 241, 0.1)',
                            fontWeight: 600, fontSize: '0.9rem'
                        }}>
                            <Zap size={18} fill="currentColor" fillOpacity={0.2} /> Pro Member
                        </Link>
                    ) : (profileData?.subscription_tier || '').toLowerCase() === 'certified' ? (
                        <Link to="/billing" style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                            borderRadius: '8px', textDecoration: 'none',
                            color: '#0D9488', // Teal
                            background: 'rgba(13, 148, 136, 0.1)',
                            fontWeight: 600, fontSize: '0.9rem',
                            border: '1px solid rgba(13, 148, 136, 0.2)'
                        }}>
                            <ShieldCheck size={18} color="#0D9488" fill="#0D9488" fillOpacity={0.2} /> Certified Pair
                        </Link>
                    ) : (profileData?.subscription_tier || '').toLowerCase() === 'accelerator' ? (
                        <Link to="/billing" style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                            borderRadius: '8px', textDecoration: 'none',
                            color: '#7C3AED', // Violet
                            background: 'rgba(124, 58, 237, 0.1)',
                            fontWeight: 600, fontSize: '0.9rem',
                            border: '1px solid rgba(124, 58, 237, 0.2)'
                        }}>
                            <Rocket size={18} color="#7C3AED" fill="#7C3AED" fillOpacity={0.2} /> Accelerator
                        </Link>
                    ) : (
                        <Link to="/upgrade" style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                            borderRadius: '8px', textDecoration: 'none',
                            color: location.pathname === '/upgrade' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                            background: location.pathname === '/upgrade' ? 'rgba(236, 72, 153, 0.05)' : 'transparent',
                            fontWeight: location.pathname === '/upgrade' ? 600 : 500, fontSize: '0.9rem'
                        }}>
                            <Zap size={18} color={location.pathname === '/upgrade' ? 'var(--accent-secondary)' : 'var(--text-tertiary)'} /> Unlock Pro
                        </Link>
                    )}
                </nav>

                {/* Notifications & Profile Section */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>

                    {/* Notification Bell */}
                    <NotificationBell user={user} />

                    <div style={{ position: 'relative' }} ref={profileMenuRef}>
                        <div
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            style={{
                                padding: '12px',
                                borderTop: '1px solid var(--border-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                borderRadius: '8px',
                                background: showProfileMenu ? 'rgba(255,255,255,0.05)' : 'transparent'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = showProfileMenu ? 'rgba(255,255,255,0.05)' : 'transparent'}
                        >

                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: profileData?.avatar_url ? 'none' : 'linear-gradient(135deg, #6366F1, #EC4899)',
                                flexShrink: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                {profileData?.avatar_url ? (
                                    <img src={profileData.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : null}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                                    {profileData?.full_name || user?.email || 'User'}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                    {profileData?.subscription_tier === 'founder' ? 'Founding Member' :
                                        profileData?.subscription_tier === 'pro' ? 'Pro Member' : 'Builder Plan'}
                                </div>
                            </div>
                            <ChevronUp size={16} style={{
                                color: 'var(--text-tertiary)',
                                transform: showProfileMenu ? 'rotate(0deg)' : 'rotate(180deg)',
                                transition: 'transform 0.2s'
                            }} />
                        </div>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div
                                className="saas-panel"
                                style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    left: 0,
                                    right: 0,
                                    marginBottom: '8px',
                                    padding: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                    animation: 'slideUp 0.2s ease-out',
                                    backdropFilter: 'blur(40px) saturate(180%)',
                                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                                    background: 'rgba(13, 15, 25, 0.95)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                                    zIndex: 1000
                                }}
                            >
                                <Link to="/settings" style={{ textDecoration: 'none' }}>
                                    <button
                                        onClick={() => setShowProfileMenu(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: 'transparent',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            width: '100%',
                                            textAlign: 'left'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                                            e.currentTarget.style.color = 'var(--accent-primary)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                        }}
                                    >
                                        <Settings size={16} />
                                        Account Settings
                                    </button>
                                </Link>
                                <Link to="/billing" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                                        e.currentTarget.style.color = 'var(--accent-primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                    }}
                                >
                                    <CreditCard size={16} />
                                    Billing & Plan
                                </Link>
                                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }}></div>
                                <button
                                    onClick={async () => {
                                        try {
                                            await supabase.auth.signOut();
                                            window.location.href = '/login';
                                        } catch (error) {
                                            console.error('Error logging out:', error);
                                            window.location.href = '/login';
                                        }
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: 'transparent',
                                        color: '#EF4444',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        width: '100%',
                                        textAlign: 'left'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <style>{`
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </aside>

            {/* Main Content Area */}
            <main style={{
                marginLeft: 'var(--sidebar-width)',
                flex: 1,
                padding: '32px 40px',
                maxWidth: '1200px'
            }}>
                {children}
            </main>
            {/* Account Settings Modal */}
            <AnimatePresence>
                {showAccountModal && (
                    <div
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                        }}
                        onClick={() => setShowAccountModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="saas-panel"
                            style={{ width: '400px', padding: '32px', border: '1px solid var(--border-subtle)', position: 'relative' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowAccountModal(false)}
                                style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>

                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Settings size={22} color="var(--accent-primary)" /> Account Settings
                            </h3>

                            <div style={{ marginBottom: '32px' }}>
                                {/* Identity Section */}
                                <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        My Account
                                    </h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={16} color="white" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.email || 'user@example.com'}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                {profileData?.subscription_tier === 'founder' ? 'Founding Member' :
                                                    profileData?.subscription_tier === 'pro' ? 'Pro Member' : 'Free User'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Subscription */}
                                <div style={{ marginBottom: '24px' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Subscription
                                    </h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(45deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))', padding: '16px', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.2)' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, color: 'white', marginBottom: '4px', textTransform: 'capitalize' }}>
                                                {profileData?.subscription_tier || 'Free'} Plan
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                {profileData?.subscription_tier === 'pro' ? 'You have full access.' : 'Upgrade to unlock features.'}
                                            </div>
                                        </div>
                                        <Link
                                            to="/billing"
                                            onClick={() => setShowAccountModal(false)} // Close modal on nav
                                            className="btn-primary"
                                            style={{ fontSize: '0.8rem', padding: '6px 12px', height: 'auto' }}
                                        >
                                            Manage
                                        </Link>
                                    </div>
                                </div>

                                {/* Notifications */}
                                <div style={{ marginBottom: '24px' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Notifications
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {[
                                            { key: 'email_digest', label: 'Email Digests', icon: Mail },
                                            { key: 'new_matches', label: 'New Matches', icon: Zap },
                                            { key: 'product_updates', label: 'Product Updates', icon: Bell }
                                        ].map((item, i) => {
                                            const isActive = profileData?.notification_prefs ? profileData.notification_prefs[item.key] : true;
                                            return (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                        <item.icon size={16} />
                                                        {item.label}
                                                    </div>
                                                    <div
                                                        onClick={() => handleToggleNotif(item.key)}
                                                        style={{ width: '36px', height: '20px', background: isActive ? '#10B981' : '#334155', borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}
                                                    >
                                                        <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: isActive ? '18px' : '2px', transition: 'left 0.2s' }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Security
                                </h4>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                        <Lock size={18} color="var(--text-primary)" />
                                        <span style={{ fontWeight: 600 }}>Update Password</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="password"
                                            placeholder="New Password"
                                            className="glass-input"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            style={{ flex: 1, padding: '8px 12px', fontSize: '0.9rem' }}
                                        />
                                        <button
                                            className="btn-secondary"
                                            disabled={!newPassword || passLoading}
                                            onClick={async () => {
                                                setPassLoading(true);
                                                const { error } = await supabase.auth.updateUser({ password: newPassword });
                                                if (error) alert(error.message);
                                                else {
                                                    alert("Password updated successfully!");
                                                    setNewPassword('');
                                                }
                                                setPassLoading(false);
                                            }}
                                            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                                        >
                                            {passLoading ? '...' : 'Update'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#EF4444', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Danger Zone
                                </h4>
                                <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Trash2 size={18} color="#EF4444" />
                                            <span style={{ fontWeight: 600, color: '#EF4444' }}>Delete Account</span>
                                        </div>
                                        <button
                                            className="btn-ghost"
                                            style={{ color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' }}
                                            onClick={() => {
                                                if (confirm("Deleting your account is permanent. Contact support to proceed?")) {
                                                    window.location.href = "mailto:support@covibr.com?subject=Delete Account Request";
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '8px', lineHeight: 1.4 }}>
                                        Permanently remove your profile, equity agreements, and all data.
                                    </p>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function NotificationBell({ user }) {
    const [notifications, setNotifications] = useState([]);
    const [showPopover, setShowPopover] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const popoverRef = useRef(null);
    const navigate = useNavigate();

    // Fetch Notifications (Pending Intros & Unread Messages & Accepted Intros)
    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            // 1. Pending Intros (Received)
            const { data: intros } = await supabase
                .from('intro_requests')
                .select(`
                    id,
                    created_at,
                    message,
                    status,
                    from_user:from_user_id(name, avatar_url)
                `)
                .eq('to_user_id', user.id)
                .eq('status', 'pending');

            // 2. Unread Messages
            // Note: Grouping by sender would be ideal, but for MVP we list individual unread messages or just recent ones.
            // Let's list simplified: "X sent you a message"
            const { data: msgs } = await supabase
                .from('messages')
                .select(`
                    id,
                    created_at,
                    content,
                    sender:sender_id(name, avatar_url)
                `)
                .eq('receiver_id', user.id)
                .eq('read', false);

            // 3. Accepted Intros (Sent by me, accepted by them)
            // We need a way to filter "seen" ones. For MVP, we'll just show them.
            // In a real app, we'd add 'sender_read' column.
            const { data: accepted } = await supabase
                .from('intro_requests')
                .select(`
                    id,
                    created_at,
                    updated_at,
                    status,
                    to_user:to_user_id(name, avatar_url)
                `)
                .eq('from_user_id', user.id)
                .eq('status', 'accepted')
                // .gt('updated_at', someDate) // Optional: only show recent?
                .limit(5); // Limit to avoid clutter for now

            const newNotifs = [];

            // Format Intros
            (intros || []).forEach(i => {
                newNotifs.push({
                    id: `intro-${i.id}`,
                    type: 'intro_request',
                    avatar: i.from_user?.avatar_url,
                    name: i.from_user?.name || 'Someone',
                    text: 'requested an intro',
                    timestamp: i.created_at,
                    link: '/pipeline?tab=intros'
                });
            });

            // Format Messages
            (msgs || []).forEach(m => {
                newNotifs.push({
                    id: `msg-${m.id}`,
                    type: 'message',
                    avatar: m.sender?.avatar_url,
                    name: m.sender?.name || 'Someone',
                    text: `sent you a message`,
                    subtext: m.content,
                    timestamp: m.created_at,
                    link: '/pipeline?tab=conversations' // Or specific chat if possible
                });
            });

            // Format Accepted
            (accepted || []).forEach(a => {
                newNotifs.push({
                    id: `accepted-${a.id}`,
                    type: 'intro_accepted',
                    avatar: a.to_user?.avatar_url,
                    name: a.to_user?.name || 'Someone',
                    text: `accepted your intro!`,
                    timestamp: a.updated_at || a.created_at,
                    link: '/pipeline?tab=conversations'
                });
            });

            // Sort by time
            newNotifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setNotifications(newNotifs);
            setUnreadCount(newNotifs.length); // Aggregated count
        };

        fetchNotifications();

        // Realtime Subscriptions
        const channel = supabase.channel('global_notifications')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'intro_requests', filter: `to_user_id=eq.${user.id}` }, () => fetchNotifications())
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'intro_requests', filter: `from_user_id=eq.${user.id}` }, () => fetchNotifications()) // Accepted
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, () => fetchNotifications())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    // Click Outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setShowPopover(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div style={{ position: 'relative' }} ref={popoverRef}>
            <div
                onClick={() => setShowPopover(!showPopover)}
                style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    color: showPopover ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: showPopover ? 'rgba(255,255,255,0.05)' : 'transparent',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = showPopover ? 'rgba(255,255,255,0.05)' : 'transparent'}
            >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#EF4444',
                            border: '1px solid var(--bg-primary)'
                        }} />
                    )}
                </div>
                <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>Notifications</div>
                {unreadCount > 0 && (
                    <span style={{
                        background: '#EF4444',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '10px',
                        lineHeight: 1
                    }}>
                        {unreadCount}
                    </span>
                )}
            </div>

            <AnimatePresence>
                {showPopover && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: 0,
                            right: 0,
                            marginBottom: '8px',
                            background: 'rgba(13, 15, 25, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                            padding: '16px',
                            zIndex: 1000,
                            width: '300px'
                        }}
                    >
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
                            Notifications
                        </h4>

                        {notifications.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem', padding: '12px 0' }}>
                                No new notifications
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                                {notifications.map(notif => (
                                    <div
                                        key={notif.id}
                                        onClick={() => {
                                            setShowPopover(false);
                                            navigate(notif.link);
                                        }}
                                        style={{
                                            display: 'flex',
                                            gap: '12px',
                                            padding: '8px',
                                            borderRadius: '8px',
                                            background: 'rgba(255,255,255,0.03)',
                                            cursor: 'pointer',
                                            alignItems: 'center'
                                        }}
                                        className="hover-glass"
                                    >
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: notif.type === 'message' ? 'var(--accent-primary)' :
                                                notif.type === 'intro_accepted' ? '#10B981' :
                                                    'linear-gradient(135deg, #6366F1, #A855F7)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0, fontWeight: 700, color: 'white', fontSize: '0.8rem',
                                            overflow: 'hidden'
                                        }}>
                                            {notif.avatar ? (
                                                <img src={notif.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                notif.type === 'message' ? <MessageSquare size={14} /> :
                                                    notif.type === 'intro_accepted' ? <CheckCircle2 size={14} /> :
                                                        notif.name?.[0] || '?'
                                            )}
                                        </div>
                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '2px', lineHeight: 1.3 }}>
                                                <span style={{ fontWeight: 600 }}>{notif.name}</span> {notif.text}
                                            </div>
                                            {notif.subtext && (
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {notif.subtext}
                                                </div>
                                            )}
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                                                {new Date(notif.timestamp).toLocaleDateString()}
                                            </div>
                                        </div>
                                        {notif.type === 'message' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)' }}></div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
