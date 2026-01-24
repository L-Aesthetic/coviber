import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, ArrowRight, Activity, Copy, Check } from 'lucide-react';
import { PROTOCOL_QUESTIONS } from '../lib/protocol_questions';

export default function AlignmentAudit() {
    const navigate = useNavigate();
    const [auditState, setAuditState] = useState('setup'); // setup, userA, transition, userB, complete
    const [founderA, setFounderA] = useState('');
    const [founderB, setFounderB] = useState('');
    const [answersA, setAnswersA] = useState({});
    const [answersB, setAnswersB] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleStart = () => {
        if (founderA && founderB) {
            setAuditState('userA');
        }
    };

    const handleAnswer = (answerId) => {
        if (auditState === 'userA') {
            setAnswersA({ ...answersA, [PROTOCOL_QUESTIONS[currentQuestionIndex].id]: answerId });
        } else {
            setAnswersB({ ...answersB, [PROTOCOL_QUESTIONS[currentQuestionIndex].id]: answerId });
        }

        if (currentQuestionIndex < PROTOCOL_QUESTIONS.length - 1) {
            setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 300);
        } else {
            // End of quiz for current user
            if (auditState === 'userA') {
                setAuditState('transition');
                setCurrentQuestionIndex(0);
            } else {
                setAuditState('complete');
                setTimeout(() => {
                    navigate('/audit-results', {
                        state: { founderA, founderB, answersA, answersB: { ...answersB, [PROTOCOL_QUESTIONS[currentQuestionIndex].id]: answerId } }
                    });
                }, 1000);
            }
        }
    };

    const currentQ = PROTOCOL_QUESTIONS[currentQuestionIndex];
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
                    </div>

                    <button
                        className="btn-primary"
                        style={{ width: '100%', height: '56px', fontSize: '1.2rem', justifyContent: 'center' }}
                        disabled={!founderA || !founderB}
                        onClick={handleStart}
                    >
                        Start Audit <ArrowRight size={20} />
                    </button>
                    <p style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
                        Takes ~5 minutes per founder.
                    </p>
                </motion.div>
            )}

            {/* TRANSITION SCREEN */}
            {auditState === 'transition' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="saas-panel" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔒</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Answers Locked.</h2>
                    </div>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
                        Great job, <strong>{founderA}</strong>. Now hand the device to <strong>{founderB}</strong> (or send them the link).
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
                </motion.div>
            )}

            {/* QUESTIONS SCREEN (Used by both A and B) */}
            {(auditState === 'userA' || auditState === 'userB') && currentQ && (
                <div>
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User size={16} />
                                {auditState === 'userA' ? founderA : founderB}'s Turn
                            </span>
                            <span>{currentQ.module} • {currentQuestionIndex + 1}/{PROTOCOL_QUESTIONS.length}</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentQuestionIndex + 1) / PROTOCOL_QUESTIONS.length) * 100}%` }}
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
