import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <header className="glass-panel" style={{
            padding: '20px 32px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            position: 'sticky',
            top: '20px',
            zIndex: 50
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                <div style={{
                    width: '24px',
                    height: '24px',
                    background: 'var(--gradient-glow)',
                    borderRadius: '50%'
                }}></div>
                <h1 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                    CoVibr
                </h1>
            </Link>

            <nav style={{ display: 'flex', gap: '32px' }}>
                <Link to="/discovery" className="nav-link" style={navLinkStyle}>Discover</Link>
                <Link to="/signals" className="nav-link" style={navLinkStyle}>Signals</Link>
                <Link to="/chat" className="nav-link" style={navLinkStyle}>Chat</Link>
                <Link to="/profile" className="nav-link" style={navLinkStyle}>Profile</Link>
            </nav>

            <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                Connect Wallet
            </button>
        </header>
    );
}

const navLinkStyle = {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
    transition: 'color 0.2s',
};
