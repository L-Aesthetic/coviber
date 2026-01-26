import { useLocation, useNavigate } from 'react-router-dom';
import { ALIGNMENT_QUESTIONS } from '../lib/alignment_questions';
import { CheckCircle, AlertTriangle, MessageSquare, ArrowRight } from 'lucide-react';

export default function AuditResults() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) return <div style={{ padding: 40 }}>No data found. Please take the audit first.</div>;

    const { founderA, founderB, answersA, answersB, founderBData } = state;

    // Calculate Alignment Score
    let matches = 0;
    const total = ALIGNMENT_QUESTIONS.length;

    ALIGNMENT_QUESTIONS.forEach(q => {
        if (answersA[q.id] === answersB[q.id]) matches++;
    });

    const alignmentScore = Math.round((matches / total) * 100);

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px 80px 20px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div style={{
                    fontSize: '4rem', fontWeight: 800,
                    background: alignmentScore > 75 ? 'linear-gradient(to right, #10B981, #34D399)' : (alignmentScore > 50 ? 'linear-gradient(to right, #F59E0B, #FBBF24)' : 'linear-gradient(to right, #EF4444, #F87171)'),
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    marginBottom: '16px'
                }}>
                    {alignmentScore}% Match
                </div>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Co-Founder Compatibility Report</h1>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '24px' }}>
                    {/* Founder A (Usually Self - we could fetch their avatar too, but for now stick to text or placeholder) */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.5rem', fontWeight: 700, border: '2px solid rgba(255,255,255,0.1)' }}>
                            {founderA.charAt(0)}
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{founderA}</div>
                    </div>

                    <div style={{ fontSize: '1.5rem', color: 'var(--text-tertiary)' }}>&</div>

                    {/* Founder B */}
                    <div style={{ textAlign: 'center' }}>
                        {founderBData?.avatar_url ? (
                            <img
                                src={founderBData.avatar_url}
                                alt={founderB}
                                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', border: '2px solid rgba(255,255,255,0.1)' }}
                            />
                        ) : (
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.5rem', fontWeight: 700, border: '2px solid rgba(255,255,255,0.1)' }}>
                                {founderB.charAt(0)}
                            </div>
                        )}
                        <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{founderB}</div>
                    </div>
                </div>
            </div>

            {/* Red Flags / Misalignments Section */}
            <div style={{ marginBottom: '60px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <AlertTriangle color="#EF4444" size={24} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Critical Divergences</h2>
                </div>

                <div style={{ display: 'grid', gap: '20px' }}>
                    {ALIGNMENT_QUESTIONS.map(q => {
                        const ansA = q.options.find(opt => opt.id === answersA[q.id]);
                        const ansB = q.options.find(opt => opt.id === answersB[q.id]);
                        const isMatch = answersA[q.id] === answersB[q.id];

                        if (isMatch) return null; // Only show mismatches here

                        return (
                            <div key={q.id} className="saas-panel" style={{ padding: '24px', borderLeft: '4px solid #EF4444' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'flex-start', gap: '16px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px', lineHeight: 1.4 }}>{q.question}</h3>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{q.module}</div>
                                    </div>
                                    {/* <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{q.module}</span> */}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', position: 'relative', marginBottom: '24px' }}>
                                    {/* Divider Line */}
                                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.1)', transform: 'translateX(-50%)' }}></div>

                                    <div style={{ paddingRight: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>A</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>{founderA} said:</div>
                                        </div>
                                        <div style={{ fontWeight: 700, color: '#EF4444', marginBottom: '8px', fontSize: '1.1rem', lineHeight: 1.3 }}>{ansA?.label}</div>
                                        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'rgba(239, 68, 68, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>"{ansA?.desc}"</div>
                                    </div>

                                    <div style={{ paddingLeft: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>B</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>{founderB} said:</div>
                                        </div>
                                        <div style={{ fontWeight: 700, color: '#EF4444', marginBottom: '8px', fontSize: '1.1rem', lineHeight: 1.3 }}>{ansB?.label}</div>
                                        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'rgba(239, 68, 68, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>"{ansB?.desc}"</div>
                                    </div>
                                </div>
                                <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <MessageSquare size={18} color="var(--accent-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                                    <div>
                                        <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>Discussion Point</strong>
                                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                            {q.subtext}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Alignments Section */}
            <div style={{ marginBottom: '60px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <CheckCircle color="#10B981" size={24} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Shared Vision</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {ALIGNMENT_QUESTIONS.map(q => {
                        const ansA = q.options.find(opt => opt.id === answersA[q.id]);
                        const isMatch = answersA[q.id] === answersB[q.id];

                        if (!isMatch) return null;

                        return (
                            <div key={q.id} className="saas-panel" style={{ padding: '20px', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.02)' }}>
                                <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Aligned</div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>{q.question}</h3>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    Both agreed: <strong>{ansA?.label}</strong>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }} className="no-print">
                <style>{`
                    @media print {
                        .no-print { display: none !important; }
                        .saas-panel { border: 1px solid #ccc !important; box-shadow: none !important; }
                        body { background: white !important; color: black !important; }
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    }
                `}</style>
                <button className="btn-ghost" onClick={() => window.print()}>Download Report</button>
                <button className="btn-ghost" onClick={() => navigate('/audit')}>Retake Audit</button>
                <button className="btn-primary" onClick={() => navigate('/equity')}>
                    Go to Equity Calculator <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
