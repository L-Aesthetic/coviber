import { useLocation, useNavigate } from 'react-router-dom';
import { PROTOCOL_QUESTIONS } from '../lib/protocol_questions';
import { CheckCircle, AlertTriangle, MessageSquare, ArrowRight } from 'lucide-react';

export default function AuditResults() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) return <div style={{ padding: 40 }}>No data found. Please take the audit first.</div>;

    const { founderA, founderB, answersA, answersB } = state;

    // Calculate Alignment Score
    let matches = 0;
    const total = PROTOCOL_QUESTIONS.length;

    PROTOCOL_QUESTIONS.forEach(q => {
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
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    {founderA} & {founderB}
                </p>
            </div>

            {/* Red Flags / Misalignments Section */}
            <div style={{ marginBottom: '60px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <AlertTriangle color="#EF4444" size={24} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Critical Divergences</h2>
                </div>

                <div style={{ display: 'grid', gap: '20px' }}>
                    {PROTOCOL_QUESTIONS.map(q => {
                        const ansA = q.options.find(opt => opt.id === answersA[q.id]);
                        const ansB = q.options.find(opt => opt.id === answersB[q.id]);
                        const isMatch = answersA[q.id] === answersB[q.id];

                        if (isMatch) return null; // Only show mismatches here

                        return (
                            <div key={q.id} className="saas-panel" style={{ padding: '24px', borderLeft: '4px solid #EF4444' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{q.question}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{q.module}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '24px', position: 'relative' }}>
                                    {/* Divider */}
                                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', height: '100%' }}></div>

                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginBottom: '8px' }}>{founderA} said:</div>
                                        <div style={{ fontWeight: 700, color: '#EF4444', marginBottom: '4px' }}>{ansA?.label}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>"{ansA?.desc}"</div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginBottom: '8px' }}>{founderB} said:</div>
                                        <div style={{ fontWeight: 700, color: '#EF4444', marginBottom: '4px' }}>{ansB?.label}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>"{ansB?.desc}"</div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <MessageSquare size={16} color="var(--accent-primary)" style={{ marginTop: '4px', flexShrink: 0 }} />
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                        <strong>Discussion Point:</strong> {q.subtext}
                                    </p>
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
                    {PROTOCOL_QUESTIONS.map(q => {
                        const ansA = q.options.find(opt => opt.id === answersA[q.id]);
                        const isMatch = answersA[q.id] === answersB[q.id];

                        if (!isMatch) return null;

                        return (
                            <div key={q.id} className="saas-panel" style={{ padding: '20px', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.02)' }}>
                                <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Allowed</div>
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
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                <button className="btn-ghost" onClick={() => navigate('/audit')}>Retake Audit</button>
                <button className="btn-primary" onClick={() => navigate('/equity')}>
                    Go to Equity Calculator <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
