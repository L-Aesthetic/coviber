import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [sentMessage, setSentMessage] = useState({ title: 'Check your email', sub: '' });
    const [mode, setMode] = useState('password'); // 'magic', 'password', 'signup'
    const { signIn, signInWithPassword, signUp, user } = useAuth();

    // Redirect when user state confirms login (fixes race condition)
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'magic') {
                await signIn(email);
                setSentMessage({ title: 'Check your email', sub: `We sent a magic link to ${email}` });
                setSent(true);
            } else if (mode === 'password') {
                await signInWithPassword(email, password);
                // Session update handled by AuthProvider -> triggers useEffect -> redirects
            } else if (mode === 'signup') {
                await signUp(email, password, {
                    full_name: email.split('@')[0] // Default name
                });
                setSentMessage({ title: 'Account Created', sub: `Please check ${email} to verify your account.` });
                setSent(true);
            }
        } catch (error) {
            console.error("Login error:", error);
            if (error.message.includes('Email not confirmed')) {
                alert('Your email is not confirmed. Please check your inbox (and spam) for the confirmation link.');
            } else if (error.message.includes('Invalid login credentials')) {
                alert('Invalid email or password. Please try again.');
            } else {
                alert('Error: ' + error.message);
            }
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
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>{sentMessage.title}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>{sentMessage.sub}</p>
                    </div>
                ) : (
                    <div>
                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px' }}>
                            {['password', 'signup', 'magic'].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    style={{
                                        flex: 1,
                                        background: mode === m ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        border: 'none',
                                        color: mode === m ? 'white' : 'var(--text-tertiary)',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        textTransform: 'capitalize',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {m === 'magic' ? 'Magic Link' : m === 'password' ? 'Log In' : 'Sign Up'}
                                </button>
                            ))}
                        </div>

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

                            {mode !== 'magic' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
                                    <input
                                        type="password"
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
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            )}

                            <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }} disabled={loading}>
                                {loading && <Loader2 className="animate-spin" size={20} style={{ marginRight: '8px' }} />}
                                {mode === 'magic' ? 'Send Magic Link' : mode === 'signup' ? 'Create Account' : 'Sign In'}
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                {mode === 'signup' ? 'By signing up, you agree to the Protocol.' : 'Secured by Supabase Auth'}
                            </p>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
