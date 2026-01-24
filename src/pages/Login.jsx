import { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { signIn } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signIn(email);
            setSent(true);
        } catch (error) {
            alert('Error logging in: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-page)',
            padding: '20px'
        }}>
            {/* Abstract orbs for background */}
            <div className="bg-orb orb-1" style={{ top: '-20%', left: '-10%' }}></div>
            <div className="bg-orb orb-2" style={{ bottom: '-20%', right: '-10%' }}></div>

            <div className="saas-panel" style={{ width: '100%', maxWidth: '400px', padding: '40px', borderRadius: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>CoVibr</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Build together. Ship faster. Split fairly.</p>
                </div>

                {sent ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{
                            width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)',
                            color: '#10B981', borderRadius: '50%', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto'
                        }}>
                            <ArrowRight size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>Check your email</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>We sent a magic link to <b>{email}</b></p>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Email</label>
                            <input
                                type="email"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                                placeholder="founder@startup.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Magic Link'}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                            Powered by Supabase Auth
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
