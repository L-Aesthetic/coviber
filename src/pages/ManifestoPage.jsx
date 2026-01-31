import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ReportOne from '../components/manifesto/ReportOne';
import ReportTwo from '../components/manifesto/ReportTwo';

const ManifestoPage = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div style={{ background: '#09090b', minHeight: '100vh', color: '#e4e4e7', fontFamily: 'Georgia, serif' }}>
            {/* Reading Progress Bar */}
            <motion.div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: '#6366f1',
                    transformOrigin: '0%',
                    scaleX,
                    zIndex: 100
                }}
            />

            {/* Navigation Header */}
            <nav style={{
                position: 'fixed', top: 0, width: '100%', padding: '16px 24px',
                background: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(12px)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                zIndex: 90, borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <button
                    onClick={() => navigate('/landing')}
                    style={{
                        background: 'transparent', border: 'none', color: '#a1a1aa',
                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif', fontSize: '0.9rem'
                    }}
                >
                    <ArrowLeft size={16} /> Back to CoVibr
                </button>
                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem' }}>
                    Strategic Intelligence Report
                </div>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        background: '#fff', color: '#000', border: 'none',
                        padding: '8px 16px', borderRadius: '4px', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem'
                    }}
                >
                    Join Beta
                </button>
            </nav>

            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 60px' }}>

                {/* Title Section */}
                <header style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <div style={{
                        display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                        background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8',
                        fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, marginBottom: '24px'
                    }}>
                        2026 MARKET THESIS
                    </div>
                    <h1 style={{
                        fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '24px',
                        background: 'linear-gradient(180deg, #fff 0%, #a1a1aa 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        fontFamily: 'Inter, sans-serif', letterSpacing: '-0.03em'
                    }}>
                        The Vibe Coding Manifesto
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#a1a1aa', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                        Why the era of the "Technical Co-Founder" is over, and how the Vibe Coder + Vibe Marketer will build the next generation of unicorns.
                    </p>
                </header>

                {/* Table of Contents */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px', padding: '24px', marginBottom: '60px', fontFamily: 'Inter, sans-serif'
                }}>
                    <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a', marginBottom: '16px' }}>
                        Contents
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li
                            onClick={() => scrollToSection('part-1')}
                            style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: '#e4e4e7' }}
                        >
                            <span>01. The Vibe Coding Ecosystem</span>
                            <span style={{ color: '#71717a' }}>Report I</span>
                        </li>
                        <li
                            onClick={() => scrollToSection('part-2')}
                            style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: '#e4e4e7' }}
                        >
                            <span>02. The Great Inversion</span>
                            <span style={{ color: '#71717a' }}>Report II</span>
                        </li>
                    </ul>
                </div>

                {/* REPORT I */}
                <div id="part-1" style={{ marginBottom: '120px' }}>
                    <div style={{ fontFamily: 'Inter, sans-serif', color: '#818cf8', fontWeight: 700, marginBottom: '16px' }}>PART I</div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                        The Vibe Coding Ecosystem: Co-Founder Displacement & SEO
                    </h2>
                    <ReportOne />
                </div>

                <hr style={{ border: 'none', height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '120px' }} />

                {/* REPORT II */}
                <div id="part-2">
                    <div style={{ fontFamily: 'Inter, sans-serif', color: '#F97316', fontWeight: 700, marginBottom: '16px' }}>PART II</div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                        The Great Inversion: The Vibe Coder & The Distribution Crisis
                    </h2>
                    <ReportTwo />
                </div>

                {/* Footer CTA */}
                <section style={{
                    marginTop: '120px', padding: '60px', borderRadius: '24px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
                    border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center'
                }}>
                    <h3 style={{ fontSize: '2rem', fontFamily: 'Inter, sans-serif', marginBottom: '16px', fontWeight: 800 }}>
                        Find Your Other Half. A.I. Assisted.
                    </h3>
                    <p style={{ color: '#a1a1aa', maxWidth: '500px', margin: '0 auto 32px', fontSize: '1.1rem' }}>
                        Whether you are a Vibe Coder looking for distribution, or a Marketer looking for a product. CoVibr scans for the traits that matter.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            background: '#fff', color: '#000', border: 'none',
                            padding: '16px 32px', borderRadius: '50px', fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '1rem',
                            boxShadow: '0 10px 30px rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        Start Founder Diagnostic
                    </button>
                </section>

                <footer style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: '#52525b', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem' }}>
                    <p>© 2026 CoVibr Inc. All vibes reserved.</p>
                </footer>

            </main>

            <style>{`
                .prose h3 {
                    font-family: 'Inter', sans-serif;
                    font-size: 1.5rem;
                    margin-top: 48px;
                    margin-bottom: 24px;
                    color: #fff;
                    letter-spacing: -0.01em;
                }
                .prose h4 {
                    font-family: 'Inter', sans-serif;
                    font-size: 1.2rem;
                    margin-top: 32px;
                    margin-bottom: 16px;
                    color: #fff;
                    letter-spacing: -0.01em;
                }
                .prose p {
                    font-size: 1.15rem;
                    line-height: 1.8;
                    margin-bottom: 24px;
                    color: #d4d4d8;
                }
                .prose ul {
                    margin-bottom: 24px;
                    padding-left: 20px;
                }
                .prose li {
                    font-size: 1.1rem;
                    line-height: 1.7;
                    margin-bottom: 12px;
                    color: #d4d4d8;
                }
                .prose blockquote {
                    border-left: 4px solid #6366f1;
                    padding-left: 24px;
                    font-size: 1.4rem;
                    font-style: italic;
                    color: #a1a1aa;
                    margin: 40px 0;
                    line-height: 1.5;
                }
                .prose strong {
                    color: #fff;
                    font-weight: 600;
                }
                .prose em {
                    color: #fff;
                    font-style: italic;
                }
            `}</style>
        </div>
    );
};

export default ManifestoPage;
