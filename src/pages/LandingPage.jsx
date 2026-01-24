import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Ghost, TrendingDown, Scale, ArrowRight, Zap, Shield, Users, CheckCircle } from 'lucide-react';
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
            <nav style={{
                display: 'flex',
                alignItems: 'center',
                padding: '24px 40px',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                backdropFilter: 'blur(12px)',
                background: 'rgba(15, 15, 15, 0.6)',
                borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
                {/* Left: Logo */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.4rem', color: '#fff', letterSpacing: '-0.5px' }}>
                    <div style={{ background: 'linear-gradient(135deg, var(--landing-purple), #6366F1)', borderRadius: '8px', padding: '4px' }}>
                        <Zap size={20} color="white" fill="white" />
                    </div>
                    CoVibr
                </div>

                {/* Center: Links */}
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center', justifyContent: 'center' }}>
                    <a href="#why" className="nav-link" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }}>Manifesto</a>
                    <a href="#protocol" className="nav-link" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }}>The Protocol</a>
                    <button onClick={() => navigate('/login')} style={{ color: '#d1d5db', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }}>Login</button>
                </div>

                {/* Right: CTA */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={scrollToQuiz} style={{
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
            <header style={{
                paddingTop: '160px',
                paddingBottom: '100px',
                textAlign: 'center',
                maxWidth: '800px',
                margin: '0 auto',
                paddingLeft: '20px',
                paddingRight: '20px'
            }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '24px', fontFamily: 'Outfit, sans-serif' }}
                >
                    Stop Networking.<br />
                    <span className="text-gradient">Start Shipping.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ fontSize: '1.25rem', color: '#a1a1aa', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: 1.6 }}
                >
                    The first co-founder platform that replaces "coffee chats" with a 48-hour code test. Don't tell us you're a good partner. Prove it.
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
                            padding: '16px 32px',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginBottom: '16px',
                            boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)',
                            animation: 'pulse 2s infinite'
                        }}
                    >
                        Find Your Founder Archetype
                    </button>
                    <p style={{ fontSize: '0.85rem', color: '#52525b' }}>
                        Accepting the first 100 "Founding Members" for free.
                    </p>
                </motion.div>
            </header>

            {/* --- PROBLEM SECTION --- */}
            <section id="why" style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
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

            {/* --- SOLUTION SECTION --- */}
            <section id="protocol" style={{ padding: '100px 20px', maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '60px', fontFamily: 'Outfit, sans-serif' }}>
                    The CoVibr Protocol
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', position: 'relative' }}>
                    {/* Vertical Line */}
                    <div style={{ position: 'absolute', left: '24px', top: '20px', bottom: '20px', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>

                    <ProtocolStep
                        number="01"
                        title="The Diagnostic"
                        desc="We map your Founder Archetype using the Big Five, Dark Triad, and 'Rich vs. King' frameworks."
                    />
                    <ProtocolStep
                        number="02"
                        title="The Chemistry Test"
                        desc="A 48-hour work simulation. If you don't ship, the match self-destructs. No hard feelings."
                    />
                    <ProtocolStep
                        number="03"
                        title="The Deal Room"
                        desc="Equity splits based on risk and contribution, not ego. Sign the pact and build an empire."
                        isLast
                    />
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
        className="saas-card-dark"
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'Outfit' }}>{title}</h3>
        <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{desc}</p>
    </motion.div>
);

const ProtocolStep = ({ number, title, desc, isLast }) => (
    <div style={{ display: 'flex', gap: '32px', position: 'relative' }}>
        <div style={{
            width: '50px',
            height: '50px',
            background: '#0f111a',
            border: '1px solid var(--landing-purple)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--landing-purple)',
            fontWeight: 'bold',
            zIndex: 1,
            flexShrink: 0
        }}>
            {number}
        </div>
        <div style={{ paddingTop: '10px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#fff' }}>{title}</h3>
            <p style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: 1.6 }}>{desc}</p>
        </div>
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

    const totalQuestions = quizQuestions.length;

    const handleOptionClick = (type, optionId) => {
        // 1. Highlight Selection
        setSelectedOpt(optionId);

        // 2. Wait and Advance
        setTimeout(() => {
            setAnswers(prev => ({ ...prev, [step]: type }));
            if (step < totalQuestions) {
                setStep(step + 1);
            } else {
                setStep(99); // Go to email capture
            }
            setSelectedOpt(null); // Reset selection for next Q
        }, 600);
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Calculate result
        const archetype = determineArchetype(answers);
        setResult(archetype);

        try {
            // Insert into Supabase
            const { error } = await supabase
                .from('leads')
                .insert([
                    { email: email, archetype: archetype.name }
                ]);

            if (error) {
                console.error('Error saving lead:', error);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }

        setTimeout(() => {
            setIsLoading(false);
            setStep(100);
        }, 1500); // Small fake delay
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
                            <p style={{ color: '#a1a1aa' }}>Enter your email to reveal your Founder Archetype and unlock the waiting list.</p>
                        </div>
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

                <h2 style={{ fontSize: '3.5rem', marginBottom: '16px', color: '#fff', fontFamily: 'Outfit' }}>
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

                <p style={{ color: '#52525b', fontSize: '0.9rem' }}>Check your email ({email}) for your detailed match report.</p>
            </div>
        );
    }
};

export default LandingPage;
