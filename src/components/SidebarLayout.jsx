import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, GitPullRequest, Search, FileText, Settings, Zap, Brain, User, Scale, TrendingUp, Sparkles, CreditCard, LogOut, ChevronUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function SidebarLayout({ children }) {
    const location = useLocation();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
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
                    <img src="/logo-full.png" alt="CoVibr" style={{ height: '48px', display: 'block' }} />
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
                            <Link to="/profile" style={{
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
                                <User size={16} />
                                My Profile
                            </Link>
                            <Link to="/profile" style={{
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
                                <Settings size={16} />
                                Account Settings
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
        </div>
    );
}
