import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, GitPullRequest, Search, FileText, Settings, Zap, Brain, User, Scale, TrendingUp, Sparkles, CreditCard, LogOut, ChevronUp, MessageSquare, Lock, Trash2, X, Bell, Mail } from 'lucide-react';
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
    const profileMenuRef = useRef(null);

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
                    <img src="/logo-full.png" alt="CoVibr" style={{ height: '110px', display: 'block' }} />
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
                    <Link to="/billing" style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                        borderRadius: '8px', textDecoration: 'none',
                        color: location.pathname === '/upgrade' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                        background: location.pathname === '/upgrade' ? 'rgba(236, 72, 153, 0.05)' : 'transparent',
                        fontWeight: location.pathname === '/upgrade' ? 600 : 500, fontSize: '0.9rem'
                    }}>
                        <Zap size={18} color={location.pathname === '/upgrade' ? 'var(--accent-secondary)' : 'var(--text-tertiary)'} /> Unlock Pro
                    </Link>
                </nav>

                {/* User Profile Snippet with Dropdown */}
                <div style={{ position: 'relative' }} ref={profileMenuRef}>
                    <div
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        style={{
                            marginTop: 'auto',
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
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #EC4899)' }}></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Louis L.</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Builder Plan</div>
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
                            <button
                                onClick={() => {
                                    setShowAccountModal(true);
                                    setShowProfileMenu(false);
                                }}
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
                                onClick={() => window.location.href = '/login'}
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
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Founder</div>
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
                                            <div style={{ fontWeight: 700, color: 'white', marginBottom: '4px' }}>Free Plan</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>You are on the basic tier.</div>
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
                                        {['Email Digests', 'New Matches', 'Product Updates'].map((item, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                    {i === 0 ? <Mail size={16} /> : i === 1 ? <Zap size={16} /> : <Bell size={16} />}
                                                    {item}
                                                </div>
                                                <div style={{ width: '36px', height: '20px', background: '#334155', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                                                    <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                                                </div>
                                            </div>
                                        ))}
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
