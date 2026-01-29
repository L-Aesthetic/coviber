import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Ghost, TrendingDown, Scale, ArrowRight, Zap, Shield, Users, CheckCircle, AlertTriangle, AlertOctagon, Lock } from 'lucide-react';
import { quizQuestions, determineArchetype } from '../data/quizQuestions';
import { supabase } from '../lib/supabaseClient';

const LandingPage = () => {
    const navigate = useNavigate();

    const scrollToQuiz = () => {
        document.getElementById('quiz-section').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="landing-page" style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff', overflowX: 'hidden' }}>

            {/* --- NAVBAR --- */}
            {/* --- NAVBAR --- */}
            <nav className="landing-nav">
                {/* Left: Logo */}
                <div className="landing-logo-container">
                    <img src="/logo-full.png" alt="CoVibr" className="landing-logo" />
                </div>

                {/* Center: Links */}
                <div className="landing-nav-links">
                    <a href="#why" className="nav-link" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }}>Manifesto</a>
                    <a href="#protocol" className="nav-link" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }}>The Protocol</a>
                    <button onClick={() => navigate('/login')} style={{ color: '#d1d5db', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }}>Login</button>
                </div>

                {/* Right: CTA */}
                <div className="landing-cta-container">
                    <button onClick={scrollToQuiz}
                        className="landing-cta-btn"
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            padding: '10px 24px',
                            borderRadius: '50px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.color = 'black';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.1)';
                            e.target.style.color = 'white';
                        }}
                    >
                        Join Founding 100
                    </button>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="landing-hero" style={{ paddingTop: '140px' }}>
                {/* Urgency Badge (Purple) */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '50px', padding: '6px 16px', marginBottom: '32px',
                        color: '#818cf8', fontSize: '0.9rem', fontWeight: 600
                    }}
                >
                    <Zap size={14} fill="#818cf8" />
                    <span>86 Spots Left (Founding 100)</span>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', alignItems: 'center' }}>
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="landing-hero-title"
                            style={{ fontSize: '3.5rem', marginBottom: '24px' }}
                        >
                            Find the 3 Personality Traits<br />
                            <span className="text-gradient">Killing Your Startup.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="landing-hero-desc"
                            style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}
                        >
                            The free founder diagnostic. We scan for Dark Triad traits, equity misalignment, and "Idea Guy" syndrome. Get your Chemistry Score in 2 minutes.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <button
                                onClick={scrollToQuiz}
                                style={{
                                    background: 'linear-gradient(135deg, var(--landing-purple), #6366f1)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '16px 40px',
                                    borderRadius: '50px',
                                    fontSize: '1.2rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    marginBottom: '16px',
                                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)',
                                    display: 'flex', alignItems: 'center', gap: '12px', margin: '0 auto 16px auto'
                                }}
                            >
                                Start Free Diagnostic <ArrowRight size={20} />
                            </button>
                            <p style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>
                                Diagnosis is <strong>Free</strong>. The "Founding 100" get <span style={{ color: '#F97316', fontWeight: 600 }}>60% OFF</span> Lifetime Access ($19) with code <span className="tag tag-purple">COVIBR</span>. Others pay $49/mo.
                            </p>
                            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.8rem', color: '#71717a' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} color="#818cf8" /> Instant Archetype</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Lock size={14} color="#F97316" /> Full Legal Report ($49 Lifetime)</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Report Preview Card (Purple Glass Style) */}
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                        <SampleReportCard />
                    </div>
                </div>
            </header>

            {/* --- PROBLEM SECTION --- */}
            <section id="why" className="landing-section-pad">
                <div className="landing-grid">
                    <ProblemCard
                        icon={<Ghost color="#ef4444" size={32} />}
                        title="The Ghoster"
                        desc="Great vibes on Zoom. Disappears when you send the Git repo."
                    />
                    <ProblemCard
                        icon={<TrendingDown color="#f59e0b" size={32} />}
                        title="The Idea Guy"
                        desc="Wants 50% equity for the 'vision'. Has never opened a terminal."
                    />
                    <ProblemCard
                        icon={<Scale color="#a1a1aa" size={32} />}
                        title="The Equity Fight"
                        desc="Splitting 50/50 blindly, then realizing one person does 90% of the work."
                    />
                </div>
            </section>

            {/* --- SOLUTION SECTION (CHECKLIST STYLE) --- */}
            <section id="protocol" className="landing-section-pad">
                <h2 className="landing-section-title">
                    The Founder Audit Protocol
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                    {/* Column 1 */}
                    <div className="saas-panel" style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', items: 'center', gap: '8px' }}>
                            <Shield size={20} color="#F97316" />
                            <span>Risk Assessment</span>
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <CheckListItem text="Dark Triad Personality Scan" />
                            <CheckListItem text="Equity Vesting & Cliff Alignment" />
                            <CheckListItem text="Runway & Financial Risk Sync" />
                            <CheckListItem text="Legal Entity Structure Check" />
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="saas-panel" style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', items: 'center', gap: '8px' }}>
                            <Zap size={20} color="#F97316" />
                            <span>Chemistry Validation</span>
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <CheckListItem text="48-Hour Code Simulation" />
                            <CheckListItem text="Communication Style Match" />
                            <CheckListItem text="Conflict Resolution War Game" />
                            <CheckListItem text="Ambition Level (Rich vs. King)" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- QUIZ SECTION --- */}
            <section id="quiz-section" style={{
                padding: '100px 20px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(139, 92, 246, 0.05) 100%)',
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    <InteractiveQuiz />
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer style={{ padding: '60px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#52525b' }}>
                <p>© 2026 CoVibr Inc. All vibes reserved.</p>
            </footer>

            {/* Background Orbs */}
            <div className="bg-orb orb-1" />
            <div className="bg-orb orb-2" />
        </div>
    );
};

// --- SUBCOMPONENTS ---

const ProblemCard = ({ icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="saas-card" // Back to generic glass card
        style={{
            display: 'flex', flexDirection: 'column', gap: '16px',
            background: 'rgba(255,255,255,0.02)', // Lighter glass
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)', borderRadius: '16px', padding: '0', overflow: 'hidden'
        }}
    >
        <div style={{
            background: 'rgba(255,255,255,0.03)', width: '100%', padding: '24px',
            display: 'flex', alignItems: 'center', gap: '12px',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
            {icon}
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DETECTED ISSUE</span>
        </div>
        <div style={{ padding: '0 24px 24px 24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'Outfit', marginBottom: '8px' }}>{title}</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '0.95rem' }}>{desc}</p>
        </div>
    </motion.div>
);

// --- SAMPLE REPORT CARD (REALISTIC PRODUCT MOCKUP) ---
const SampleReportCard = () => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        style={{
            width: '100%', maxWidth: '500px', // Wider to fit content
            background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            position: 'relative',
            overflow: 'hidden'
        }}
    >
        {/* Background Glow */}
        <div style={{ position: 'absolute', top: '-10%', left: '20%', width: '60%', height: '40%', background: '#ef4444', filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none' }}></div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#ef4444', margin: 0, letterSpacing: '-1px' }}>9% Match</h2>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>Full Compatibility Audit</h3>
            <div style={{ position: 'absolute', top: 0, right: -40, background: '#F97316', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '4px 20px', transform: 'rotate(45deg)', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>PREMIUM</div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Day & Dawn</p>
        </div>

        {/* Section Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#fff', fontWeight: 700 }}>
            <AlertOctagon size={20} color="#ef4444" />
            <span>Critical Divergences</span>
        </div>

        {/* Card: Survival Number */}
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderLeft: '4px solid #ef4444',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '16px'
        }}>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '6px', lineHeight: 1.4, fontWeight: 600 }}>
                What is your 'Survival Number' (minimum monthly income)?
            </h4>
            <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', fontWeight: 700 }}>
                MODULE 1: FINANCIAL & RISK
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {/* User A */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#334155', color: '#fff', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Day said:</span>
                    </div>
                    <p style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px' }}>Low (&#60;$4k/mo).</p>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: '#cbd5e1', fontStyle: 'italic', lineHeight: 1.5 }}>
                        "I can survive on very little. Ramen profitability."
                    </div>
                </div>

                {/* User B */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#334155', color: '#fff', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>B</div>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Dawn said:</span>
                    </div>
                    <p style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px' }}>Medium ($5k-$10k/mo).</p>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: '#cbd5e1', fontStyle: 'italic', lineHeight: 1.5 }}>
                        "I have standard obligations (mortgage/rent)."
                    </div>
                </div>
            </div>

            {/* Discussion Point */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ color: '#8b5cf6' }}>💬</div>
                    <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>Discussion Point</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    If one founder needs $3k and the other needs $15k, resentment builds.
                </p>
            </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', background: 'rgba(249, 115, 22, 0.1)', borderTop: '1px solid rgba(249, 115, 22, 0.2)', color: '#F97316', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Lock size={12} /> Included in Founding 100 Membership
        </div>
    </motion.div>
);

const RiskItem = ({ status, title, desc }) => {
    const color = status === 'CRITICAL' ? '#ef4444' : status === 'WARNING' ? '#f59e0b' : '#10b981';
    return (
        <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ marginTop: '2px' }}>
                {status === 'CRITICAL' ? <AlertOctagon size={16} color={color} /> :
                    status === 'WARNING' ? <AlertTriangle size={16} color={color} /> :
                        <CheckCircle size={16} color={color} />}
            </div>
            <div>
                <div style={{ display: 'flex', items: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: `${color}20`, color: color }}>{status}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{title}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#a1a1aa', lineHeight: 1.4 }}>{desc}</p>
            </div>
        </div>
    )
}

const CheckListItem = ({ text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <CheckCircle size={18} color="#10b981" />
        <span style={{ fontSize: '1rem', color: '#d4d4d8' }}>{text}</span>
    </div>
);

// --- INTERACTIVE QUIZ MOCK ---

const questions = [
    { id: 1, text: "When a project is failing, I usually...", options: ["Take control immediately", "Analyze what went wrong", "Look for consensus", "Start a new project"] },
    { id: 2, text: "My ideal Friday night is...", options: ["Coding till 3AM", "Networking mixer", "Reading whitepapers", "Gaming with squad"] },
    { id: 3, text: "Equity should be split based on...", options: ["Future potential", "Current contribution", "Risk capital", "Equal shares always"] },
    { id: 4, text: "I prefer working with...", options: ["Chaos and speed", "Structure and clarity", "Vision and passion", "Data and metrics"] },
];



const InteractiveQuiz = () => {
    const [step, setStep] = useState(0); // 0 = start, 1-N = questions, 99 = email, 100 = result
    const [selectedOpt, setSelectedOpt] = useState(null); // Track visually selected option
    const [result, setResult] = useState(null);
    const [answers, setAnswers] = useState({});
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const totalQuestions = quizQuestions.length;

    const handleOptionClick = (type, optionId) => {


        // 0. Prevent double clicks
        if (selectedOpt) return;

        // 1. Highlight Selection
        setSelectedOpt(optionId);

        // 2. Wait and Advance
        setTimeout(() => {

            setAnswers(prev => {
                const newAnswers = { ...prev, [step]: type };
                return newAnswers;
            });

            setStep(prevStep => {
                const nextStep = prevStep + 1;
                if (prevStep < totalQuestions) {
                    return nextStep;
                } else {
                    return 99; // Go to email capture
                }
            });

            setSelectedOpt(null); // Reset selection for next Q
        }, 600);
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);

        // 1. Calculate Result (Synchronous)
        let archetype;
        try {
            archetype = determineArchetype(answers);
        } catch (err) {
            console.error("Archetype calculation error, using fallback:", err);
            // Fallback to prevent crash
            archetype = { name: 'Sovereign', desc: 'High Risk • High Vision • Empire Builder' };
        }
        setResult(archetype);

        // 2. Fire-and-Forget Backend Operations (Don't await these for UI)
        (async () => {
            try {
                // Save to LocalStorage for robust carry-over to Auth
                localStorage.setItem('covibr_archetype', archetype.name);
                if (name) localStorage.setItem('covibr_name', name);

                console.log("Saving lead in background...");
                // Save to DB
                const { error: dbError } = await supabase
                    .from('leads')
                    .upsert([
                        { email: email, archetype: archetype.name, name: name }
                    ], { onConflict: 'email' });

                if (dbError) console.error("Background DB Save Error:", dbError);

                // Send Email
                const emailResponse = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, archetype: archetype.name }),
                });
                if (!emailResponse.ok) console.warn("Background Email failed (likely Sandbox)");

            } catch (bgError) {
                console.error("Background task error:", bgError);
            }
        })();

        // 3. Simulated Delay for "Analysis" Effect -> Then Show Result safely
        setTimeout(() => {
            console.log("Analysis complete. Showing result.");
            setIsLoading(false);
            setStep(100);
        }, 1500);
    };

    // Start Screen
    if (step === 0) {
        return (
            <div className="saas-panel" style={{ padding: '40px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '16px', fontFamily: 'Outfit' }}>What Kind of Builder Are You?</h3>
                <p style={{ color: '#a1a1aa', marginBottom: '32px', fontSize: '1.1rem' }}>
                    The Architect, The Operator, or The Sovereign? Take the diagnostic.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px' }}>
                    <div className="tag tag-purple">12 Questions</div>
                    <div className="tag tag-blue">Psychometric AI</div>
                </div>
                <button
                    onClick={() => setStep(1)}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem' }}
                >
                    Start Diagnostic
                </button>
            </div>
        );
    }

    // Question Screen
    if (step > 0 && step <= totalQuestions) {
        const q = quizQuestions[step - 1];
        return (
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="saas-panel"
                style={{ padding: '40px' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: '#52525b', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>
                    <span>{q.category.toUpperCase()}</span>
                    <span>{step} / {totalQuestions}</span>
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '32px', minHeight: '80px', lineHeight: 1.5, fontFamily: 'Outfit' }}>{q.text}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {q.options.map((opt, i) => {
                        const isSelected = selectedOpt === opt.id;
                        return (
                            <button
                                key={i}
                                onClick={() => handleOptionClick(opt.type, opt.id)}
                                className="hover-glass"
                                style={{
                                    padding: '20px',
                                    borderRadius: '16px',
                                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.08)',
                                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                                    color: '#fff',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                    boxShadow: isSelected ? '0 0 20px rgba(99, 102, 241, 0.2)' : 'none'
                                }}
                            >
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    color: isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.5)',
                                    flexShrink: 0,
                                    fontWeight: isSelected ? 700 : 400
                                }}>
                                    {opt.id}
                                </div>
                                <span style={{ lineHeight: 1.4 }}>{opt.text}</span>
                            </button>
                        );
                    })}
                </div>
            </motion.div>
        );
    }

    // Email Capture
    if (step === 99) {
        return (
            <div className="saas-panel" style={{ padding: '40px', textAlign: 'center' }}>
                {isLoading ? (
                    <div>
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                border: '3px solid rgba(255,255,255,0.1)',
                                borderTopColor: 'var(--landing-purple)',
                                borderRadius: '50%',
                                margin: '0 auto',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                        </div>
                        <h3 style={{ fontFamily: 'Outfit' }}>Analyzing Psychometrics...</h3>
                        <p style={{ color: '#a1a1aa' }}>Mapping chaos vectors...</p>
                    </div>
                ) : (
                    <form onSubmit={handleEmailSubmit}>
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔒</div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '12px', fontFamily: 'Outfit' }}>Analysis Complete.</h3>
                            <p style={{ color: '#a1a1aa' }}>Enter your details to reveal your Founder Archetype and unlock the waiting list.</p>
                        </div>
                        <input
                            type="text"
                            required
                            placeholder="Your Name (e.g. Alex)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="glass-input"
                            style={{ marginBottom: '12px', background: 'rgba(0,0,0,0.3)', textAlign: 'center' }}
                        />
                        <input
                            type="email"
                            required
                            placeholder="you@builder.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="glass-input"
                            style={{ marginBottom: '16px', background: 'rgba(0,0,0,0.3)', textAlign: 'center' }}
                        />
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', border: 'none' }}
                        >
                            Reveal My Result
                        </button>
                        <p style={{ fontSize: '0.8rem', color: '#52525b', marginTop: '16px' }}>
                            We respect the protocol. No spam.
                        </p>
                    </form>
                )}
            </div>
        );
    }

    // Result Screen
    if (step === 100 && result) {
        return (
            <div className="saas-panel" style={{ padding: '48px', textAlign: 'center', borderColor: 'var(--landing-purple)' }}>
                <div style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    color: 'var(--landing-purple)',
                    display: 'inline-block',
                    padding: '8px 16px',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    marginBottom: '32px',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                    ARCHETYPE DETECTED
                </div>

                <h2 className="landing-hero-title">
                    THE {result.name.toUpperCase()}
                </h2>
                <p style={{ color: '#a1a1aa', marginBottom: '40px', fontSize: '1.2rem' }}>{result.desc}</p>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', marginBottom: '32px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ marginBottom: '16px', lineHeight: 1.6 }}>
                        <strong>The Diagnosis:</strong> You need a co-founder who balances your risk profile.
                        {result.name === 'Sovereign' && " Look for an Operator to build the rails while you build the vision."}
                        {result.name === 'Architect' && " Look for a Sovereign to sell the vision while you ensure it scales."}
                        {result.name === 'Operator' && " Look for a Sovereign to break the rules you're trying to enforce."}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
                        <CheckCircle size={18} />
                        <span>We have 7 compatible matches on the waitlist.</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/login?ref=report')}
                    style={{
                        background: '#F97316',
                        color: 'white',
                        padding: '16px 32px',
                        borderRadius: '50px',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        marginBottom: '16px',
                        boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                    }}
                >
                    Unlock Full Report
                </button>
                <p style={{ color: '#52525b', fontSize: '0.9rem' }}>Check your email ({email}) for your summary.</p>
            </div>
        );
    }
};

export default LandingPage;
