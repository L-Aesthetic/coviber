import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, ArrowRight, Activity, Copy, Check } from 'lucide-react';
import { ALIGNMENT_QUESTIONS } from '../lib/alignment_questions';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';

export default function AlignmentAudit() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();

    // State
    const [auditState, setAuditState] = useState('setup'); // setup, userA, transition, userB, complete
    const [mode, setMode] = useState('local'); // 'local' or 'remote'

    const [auditId, setAuditId] = useState(null);
    const [founderA, setFounderA] = useState('');
    const [founderB, setFounderB] = useState('');
    const [answersA, setAnswersA] = useState({});
    const [answersB, setAnswersB] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Invitee State
    const inviteRef = searchParams.get('ref');
    const inviterName = searchParams.get('from');

    useEffect(() => {
        const init = async () => {
            if (inviteRef) {
                // Determine if we are Founder B
                setMode('remote');
                setAuditId(inviteRef);

                // Fetch existing session
                const { data, error } = await supabase
                    .from('founder_audits')
                    .select('*')
                    .eq('id', inviteRef)
                    .single();

                if (data) {
                    setFounderA(data.founder_a_name);
                    setAnswersA(data.answers_a);

                    if (data.status === 'complete') {
                        // If already done, go to results
                        // We might need to load B's answers too if re-visiting
                        if (data.answers_b) setAnswersB(data.answers_b);
                        navigate('/audit-results', {
                            state: {
                                founderA: data.founder_a_name,
                                founderB: data.founder_b_name,
                                answersA: data.answers_a,
                                answersB: data.answers_b
                            }
                        });
                    } else {
                        setAuditState('userB_intro'); // Special intro for invitee
                    }
                }
            } else if (user) {
                // Auto-fill Founder A (You)
                const { data } = await supabase.from('profiles').select('name').eq('id', user.id).single();
                if (data?.name) setFounderA(data.name);
                else if (user.email) setFounderA(user.email.split('@')[0]);
            }
        };
        init();
    }, [user, inviteRef]);

    // Real-time Subscription for Founder A (Waiting for B)
    useEffect(() => {
        if (!auditId || auditState !== 'transition') return;

        console.log("Listening for updates on audit:", auditId);
        const channel = supabase
            .channel(`audit_${auditId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'founder_audits',
                    filter: `id=eq.${auditId}`
                },
                (payload) => {
                    console.log("Realtime Update Received:", payload);
                    if (payload.new.status === 'complete') {
                        setAuditState('complete');
                        navigate('/audit-results', {
                            state: {
                                founderA: payload.new.founder_a_name,
                                founderB: payload.new.founder_b_name,
                                answersA: payload.new.answers_a,
                                answersB: payload.new.answers_b
                            }
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [auditId, auditState]);

    const handleStart = () => {
        if (founderA && founderB) {
            setAuditState('userA');
        } else if (mode === 'remote' && founderA) {
            // If remote, we might not know Founder B's name yet, that's fine
            setAuditState('userA');
        }
    };

    const handleAnswer = async (answerId) => {
        let newAnswers;
        if (auditState === 'userA') {
            newAnswers = { ...answersA, [ALIGNMENT_QUESTIONS[currentQuestionIndex].id]: answerId };
            setAnswersA(newAnswers);
        } else {
            newAnswers = { ...answersB, [ALIGNMENT_QUESTIONS[currentQuestionIndex].id]: answerId };
            setAnswersB(newAnswers);
        }

        if (currentQuestionIndex < ALIGNMENT_QUESTIONS.length - 1) {
            setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 300);
        } else {
            // End of quiz for current user
            if (auditState === 'userA') {
                if (mode === 'remote') {
                    // Create session in DB
                    const { data, error } = await supabase
                        .from('founder_audits')
                        .insert({
                            founder_a_name: founderA,
                            answers_a: newAnswers,
                            status: 'pending_b'
                        })
                        .select()
                        .single();

                    if (data) setAuditId(data.id);
                }
                setAuditState('transition');
                setCurrentQuestionIndex(0);
            } else {
                // User B Finished
                if (mode === 'remote' && auditId) {
                    await supabase
                        .from('founder_audits')
                        .update({
                            founder_b_name: founderB,
                            answers_b: newAnswers,
                            status: 'complete'
                        })
                        .eq('id', auditId);
                }

                setAuditState('complete');
                setTimeout(() => {
                    navigate('/audit-results', {
                        state: {
                            founderA,
                            founderB: founderB || 'Partner',
                            answersA: mode === 'remote' ? answersA : answersA, // Ensure consistent access
                            answersB: newAnswers
                        }
                    });
                }, 1000);
            }
        }
    };

    const checkStatus = async () => {
        if (!auditId) return;
        const { data } = await supabase.from('founder_audits').select('*').eq('id', auditId).single();
        if (data && data.status === 'complete') {
            setAuditState('complete');
            navigate('/audit-results', {
                state: {
                    founderA: data.founder_a_name,
                    founderB: data.founder_b_name,
                    answersA: data.answers_a,
                    answersB: data.answers_b
                }
            });
        }
    };

    // Polling Backup (Every 10s)
    useEffect(() => {
        if (auditState === 'transition' && mode === 'remote') {
            const interval = setInterval(checkStatus, 10000);
            return () => clearInterval(interval);
        }
    }, [auditState, mode, auditId]);

    const copyInviteLink = () => {
        if (!auditId) {
            alert("Error: No audit session found. Please try again.");
            return;
        }
        const url = `${window.location.origin}/audit?ref=${auditId}`;
        navigator.clipboard.writeText(url);
        alert("Invite link copied!");
    };

    const currentQ = ALIGNMENT_QUESTIONS[currentQuestionIndex];
    const Icon = currentQ?.icon;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>

            {/* SETUP SCREEN */}
            {auditState === 'setup' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="saas-panel" style={{ padding: '48px', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', margin: '0 auto 24px auto', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={40} color="var(--accent-primary)" />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>Founder Alignment Audit</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
                        The "Prenup" for your startup. Both founders answer independently to reveal hidden misalignments in vision, risk, and equity.
                    </p>

                    {/* Mode Toggle */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px', gap: '16px' }}>
                        <button
                            onClick={() => setMode('local')}
                            style={{
                                padding: '12px 24px', borderRadius: '12px', border: '1px solid',
                                borderColor: mode === 'local' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                                background: mode === 'local' ? 'rgba(99,102,241,0.1)' : 'transparent',
                                color: mode === 'local' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                            }}
                        >
                            Pass the Device
                        </button>
                        <button
                            onClick={() => setMode('remote')}
                            style={{
                                padding: '12px 24px', borderRadius: '12px', border: '1px solid',
                                borderColor: mode === 'remote' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                                background: mode === 'remote' ? 'rgba(99,102,241,0.1)' : 'transparent',
                                color: mode === 'remote' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                            }}
                        >
                            Remote Invite (Send Link)
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                        <div className="input-field">
                            <label className="input-label" style={{ marginBottom: '8px', display: 'block', color: 'var(--text-secondary)' }}>Founder 1 (You)</label>
                            <input
                                className="saas-input glass-input"
                                placeholder="Enter Name"
                                value={founderA}
                                onChange={e => setFounderA(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        {mode === 'local' && (
                            <div className="input-field">
                                <label className="input-label" style={{ marginBottom: '8px', display: 'block', color: 'var(--text-secondary)' }}>Founder 2 (Partner)</label>
                                <input
                                    className="saas-input glass-input"
                                    placeholder="Enter Name"
                                    value={founderB}
                                    onChange={e => setFounderB(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        )}
                        {mode === 'remote' && (
                            <div className="input-field" style={{ opacity: 0.5 }}>
                                <label className="input-label" style={{ marginBottom: '8px', display: 'block', color: 'var(--text-secondary)' }}>Founder 2</label>
                                <div style={{
                                    padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)',
                                    border: '1px dashed var(--border-subtle)', color: 'var(--text-tertiary)', fontStyle: 'italic'
                                }}>
                                    Will join via link...
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        className="btn-primary"
                        style={{ width: '100%', height: '56px', fontSize: '1.2rem', justifyContent: 'center' }}
                        disabled={!founderA || (mode === 'local' && !founderB)}
                        onClick={handleStart}
                    >
                        Start My Section <ArrowRight size={20} />
                    </button>
                    <p style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
                        Takes ~5 minutes per founder.
                    </p>
                </motion.div>
            )}

            {/* INVITEE INTRO SCREEN */}
            {auditState === 'userB_intro' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="saas-panel" style={{ padding: '48px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>Ready to Sync with {founderA}?</h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                            {founderA} has completed their part of the Founder Alignment Audit. Now it's your turn.
                        </p>
                        <div style={{ maxWidth: '400px', margin: '0 auto 32px' }}>
                            <label className="input-label" style={{ marginBottom: '8px', display: 'block', color: 'var(--text-secondary)', textAlign: 'left' }}>Your Name</label>
                            <input
                                className="saas-input glass-input"
                                placeholder="Enter Your Name"
                                value={founderB}
                                onChange={e => setFounderB(e.target.value)}
                                style={{ width: '100%', padding: '12px 16px', fontSize: '1.1rem' }}
                                autoFocus
                            />
                        </div>
                        <button
                            className="btn-primary"
                            style={{ width: '100%', height: '56px', fontSize: '1.2rem', justifyContent: 'center' }}
                            disabled={!founderB}
                            onClick={() => setAuditState('userB')}
                        >
                            Start Audit <ArrowRight size={20} />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* TRANSITION SCREEN */}
            {auditState === 'transition' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="saas-panel" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔒</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Answers Locked.</h2>
                    </div>

                    {mode === 'local' ? (
                        <>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
                                Great job, <strong>{founderA}</strong>. Now hand the device to <strong>{founderB}</strong>.
                            </p>
                            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', marginBottom: '40px' }}>
                                <p style={{ color: '#F59E0B', fontWeight: 600 }}>
                                    ⚠️ Do not discuss your answers yet! Independent thinking is critical.
                                </p>
                            </div>
                            <button
                                className="btn-primary"
                                style={{ width: '100%', height: '56px', justifyContent: 'center' }}
                                onClick={() => setAuditState('userB')}
                            >
                                I am {founderB}, let's go <ArrowRight size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                                Great job, <strong>{founderA}</strong>. Your answers are saved.
                            </p>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                                Send this link to your partner to complete their section:
                            </p>

                            <div style={{
                                display: 'flex', gap: '12px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px',
                                border: '1px solid var(--border-subtle)', marginBottom: '32px', alignItems: 'center'
                            }}>
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                                    {auditId ? `${window.location.origin}/audit?ref=${auditId}` : 'Generating link...'}
                                </span>
                                <button className="btn-secondary" onClick={copyInviteLink}>
                                    <Copy size={16} style={{ marginRight: '8px' }} /> Copy
                                </button>
                            </div>

                            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    className="btn-ghost"
                                    onClick={checkStatus}
                                    style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}
                                >
                                    <Activity size={16} style={{ marginRight: '8px' }} /> Check for Updates
                                </button>
                                <button
                                    className="btn-ghost"
                                    onClick={() => navigate('/dashboard')}
                                    style={{ color: 'var(--text-tertiary)' }}
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        </>
                    )}
                </motion.div>
            )}

            {/* QUESTIONS SCREEN (Used by both A and B) */}
            {(auditState === 'userA' || auditState === 'userB') && currentQ && (
                <div>
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User size={16} />
                                {auditState === 'userA' ? founderA : (founderB || 'Partner')}'s Turn
                            </span>
                            <span>{currentQ.module} • {currentQuestionIndex + 1}/{ALIGNMENT_QUESTIONS.length}</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentQuestionIndex + 1) / ALIGNMENT_QUESTIONS.length) * 100}%` }}
                                style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), #818cf8)', borderRadius: '3px' }}
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQ.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                                <div style={{
                                    width: '64px', height: '64px', margin: '0 auto 24px auto',
                                    background: 'rgba(99, 102, 241, 0.1)', borderRadius: '20px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--accent-primary)'
                                }}>
                                    <Icon size={32} />
                                </div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.3 }}>{currentQ.question}</h2>
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '1.1rem', fontStyle: 'italic' }}>
                                    "{currentQ.subtext}"
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                                {currentQ.options.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleAnswer(opt.id)}
                                        className="saas-panel vibe-option"
                                        style={{
                                            padding: '24px 32px',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px',
                                            border: '1px solid var(--border-subtle)',
                                            background: 'rgba(255,255,255,0.03)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{opt.label}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{opt.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            <style>{`
                .vibe-option:hover {
                    background: rgba(255,255,255,0.08) !important;
                    transform: translateX(4px);
                    border-color: var(--accent-primary) !important;
                }
            `}</style>
        </div>
    );
}
