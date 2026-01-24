import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
    return (
        <div style={{ textAlign: 'center', marginTop: '80px', marginBottom: '60px' }}>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-gradient"
                style={{
                    fontSize: '4rem',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    marginBottom: '24px'
                }}
            >
                Find Your<br />Frequency
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.25rem',
                    maxWidth: '600px',
                    margin: '0 auto 40px'
                }}
            >
                The vibe-coded social graph for entrepreneurs. Match on mindset, build on complimentary skills.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}
            >
                <Link to="/discovery" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    Start Matching
                </Link>
                <button className="glass glow-hover" style={{
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-full)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    background: 'rgba(255,255,255,0.03)'
                }}>
                    Explore Signals
                </button>
            </motion.div>
        </div>
    );
}
