import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    Shield,
    Flame,
    Users,
    Brain,
    PieChart,
    Target,
    Zap,
    Lock,
    RefreshCw,
    Phone,
    MessageCircle,
    Lightbulb,
    MessageSquare,
    Home,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { PROTOCOL_QUESTIONS } from '../lib/protocol_questions';

const QUESTIONS = PROTOCOL_QUESTIONS;

export default function VibeQuiz() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [completed, setCompleted] = useState(false);

    const handleSelect = (optionId) => {
        setAnswers({ ...answers, [QUESTIONS[step].id]: optionId });
        if (step < QUESTIONS.length - 1) {
            setTimeout(() => setStep(step + 1), 400);
        } else {
            setTimeout(() => setCompleted(true), 400);
        }
    };

    if (completed) {
        return <ResultsView answers={answers} />;
    }

    const currentQ = QUESTIONS[step];
    const Icon = currentQ.icon;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span>{currentQ.module}</span>
                    <span>Step {step + 1} of {QUESTIONS.length}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                        style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), #818cf8)', borderRadius: '3px' }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <div style={{
                            width: '72px', height: '72px', margin: '0 auto 28px auto',
                            background: 'rgba(99, 102, 241, 0.1)', borderRadius: '24px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--accent-primary)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                        }}>
                            <Icon size={36} />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.3 }}>{currentQ.question}</h2>

                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                        {currentQ.options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleSelect(opt.id)}
                                className="saas-panel vibe-option"
                                style={{
                                    padding: '24px 32px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    border: answers[currentQ.id] === opt.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                                    background: opt.color || 'rgba(255,255,255,0.03)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{opt.label}</div>
                                    <div className="radio-circle" style={{
                                        width: '20px', height: '20px', borderRadius: '50%',
                                        border: '2px solid var(--border-subtle)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {answers[currentQ.id] === opt.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)' }} />}
                                    </div>
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.4 }}>{opt.desc}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                                    {opt.signal}
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            <style>{`
                .vibe-option:hover {
                    background: rgba(255,255,255,0.08) !important;
                    transform: translateY(-4px);
                    border-color: var(--accent-primary);
                }
                .radio-circle {
                    transition: all 0.2s;
                }
                .vibe-option:hover .radio-circle {
                    border-color: var(--accent-primary);
                }
            `}</style>
        </div>
    );
}

function ResultsView({ answers }) {
    const navigate = useNavigate();

    // Scoring Logic based on the user's detailed framework
    const calculateProfile = (ans) => {
        let scores = {
            rich: 0,
            king: 0,
            action: 0,
            conscientious: 0,
            rainmaker: 0,
            expert: 0,
            conductor: 0,
            resilience: 0
        };

        // Q1: Rich vs King
        if (ans.king_rich_dilemma === 'rich') scores.rich += 2;
        if (ans.king_rich_dilemma === 'king') scores.king += 2;
        if (ans.king_rich_dilemma === 'ambition') scores.rich += 3;

        // Q3: Exit Horizon
        if (ans.exit_horizon === 'venture') scores.rich += 2;
        if (ans.exit_horizon === 'lifestyle') scores.king += 2;

        // Q4: Velocity (Tech Debt)
        if (ans.tech_debt === 'hack') scores.action += 2;
        if (ans.tech_debt === 'proper') scores.conscientious += 2;

        // Q5: Ethics
        if (ans.ethics === 'do_it') scores.action += 2;
        if (ans.ethics === 'dont') scores.conscientious += 2;

        // Q7: Sales Role
        if (ans.sales_role === 'me') scores.rainmaker += 2;
        if (ans.sales_role === 'hire') scores.expert += 1;

        // Q11: Hiring
        if (ans.hiring === 'senior') scores.delegator = (scores.delegator || 0) + 1; // Assuming delegator maps to conductor loosely or trust
        if (ans.hiring === 'juniors') scores.king += 1;

        // Q12: Risk
        if (ans.risk_guarantee === 'sign') scores.action += 1;
        if (ans.risk_guarantee === 'refuse') scores.king += 1;

        // Determine Profile
        let title = "The Prudent Operator";
        let description = "You value stability and control.";

        if (scores.rich > scores.king && scores.action > scores.conscientious) {
            title = "The Venture Architect";
            description = "You are built for high-growth, venture-backed scaling. You prioritize speed and market capture over control.";
        } else if (scores.king > scores.rich) {
            title = "The Sovereign Founder";
            description = "You value independence and ownership above all. You are best suited for bootstrapping or lifestyle businesses.";
        } else if (scores.conscientious > scores.action) {
            title = "The Diligent Architect";
            description = "You build robust, scalable systems. You need a partner who can push for speed and sales.";
        }

        // Insights
        const insights = {
            stress: ans.stress_response === 'confront' ? "You tend to confront stress directly (Pursuer). Avoid avoidant partners." : (ans.stress_response === 'space' ? "You withdraw under stress (Distancer). You need space to process." : "You have a balanced, supportive stress response (Secure)."),
            power: ans.equity_split === 'equal' ? "You value relational harmony over transactional fairness." : "You view equity as a tool for performance and fairness.",
            risk: ans.pivot === 'pivot' ? "You are highly adaptable and willing to kill your darlings (High Openness)." : "You prefer to persist and optimize rather than pivot (High Persistence).",
            dialect: ans.tech_debt === 'hack' ? "Your work dialect is 'Speed'. You view code as a means to an end." : "Your work dialect is 'Quality'. You view code as an asset."
        };

        return { title, description, insights };
    };

    const profile = calculateProfile(answers);

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <header style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div style={{
                        width: '80px', height: '80px', margin: '0 auto 32px auto',
                        background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)'
                    }}>
                        <Activity size={40} />
                    </div>
                    <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px' }}>{profile.title}</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        {profile.description}
                    </p>
                </header>

                <div className="saas-panel" style={{ padding: '48px', textAlign: 'left', marginBottom: '40px' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>Diagnostic Insights</h2>
                        <div style={{ width: '40px', height: '4px', background: 'var(--accent-primary)', borderRadius: '2px' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <AnalysisCard
                            title="STRESS REPONSE"
                            text={profile.insights.stress}
                            icon={<Flame size={18} />}
                        />
                        <AnalysisCard
                            title="POWER & EQUITY"
                            text={profile.insights.power}
                            icon={<PieChart size={18} />}
                        />
                        <AnalysisCard
                            title="RISK & ADAPTABILITY"
                            text={profile.insights.risk}
                            icon={<RefreshCw size={18} />}
                        />
                        <AnalysisCard
                            title="WORK DIALECT"
                            text={profile.insights.dialect}
                            icon={<Brain size={18} />}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button className="btn-ghost" onClick={() => window.location.reload()}>Retake Diagnostic</button>
                    <button className="btn-primary" onClick={() => navigate('/')} style={{ padding: '0 32px', height: '56px', fontSize: '1.1rem' }}>
                        Sync Profile to Search <ArrowRight size={20} />
                    </button>
                </div>

                <div className="saas-panel" style={{ marginTop: '48px', padding: '32px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-subtle)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Share Your Vibe Code</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Founders with shared public profiles get 3x more inbound interest.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button className="btn-ghost" style={{ background: '#1DA1F2', color: 'white', border: 'none' }} onClick={() => window.open(`https://twitter.com/intent/tweet?text=I%27m%20a%20${encodeURIComponent(profile.title)}%20on%20CoVibr.%20${encodeURIComponent(profile.description)}%20Find%20your%20co-founder%20match:%20https://covibr.com`, '_blank')}>
                            Share on Twitter
                        </button>
                        <button className="btn-ghost" style={{ background: '#0A66C2', color: 'white', border: 'none' }} onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://covibr.com`, '_blank')}>
                            Share on LinkedIn
                        </button>
                    </div>
                </div>
            </motion.div >
        </div >
    )
}

function AnalysisCard({ title, text, icon, color = 'rgba(255,255,255,0.03)' }) {
    return (
        <div style={{
            padding: '24px',
            borderRadius: '16px',
            background: color,
            border: '1px solid var(--border-subtle)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: 'var(--accent-primary)' }}>
                {icon}
                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h4>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</p>
        </div>
    )
}
