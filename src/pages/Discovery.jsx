import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Check, X, Code2, BrainCircuit, Rocket } from 'lucide-react';

const MOCK_PROFILES = [
    {
        id: 1,
        name: "Alex V.",
        role: "Full Stack Wizard",
        vibe: "Chaos Engineering",
        skills: ["React", "Rust", "Systems"],
        bio: "Building the future of decentralized compute. Need a visionary operator.",
        color: "#00f3ff"
    },
    {
        id: 2,
        name: "Sarah K.",
        role: "Growth Hacker",
        vibe: "Strategic Minimalist",
        skills: ["GTM", "Sales", "Data"],
        bio: "Scaling products to 1M users. I handle the noise, you handle the code.",
        color: "#9d00ff"
    },
    {
        id: 3,
        name: "Jordan T.",
        role: "AI Architect",
        vibe: "Neural Flow",
        skills: ["PyTorch", "LLMs", "Math"],
        bio: "Training models that dream. Looking for a frontend artisan to visualize the latent space.",
        color: "#ff0099"
    }
];

export default function Discovery() {
    const [cards, setCards] = useState(MOCK_PROFILES);

    const removeCard = (id) => {
        setCards((prev) => prev.filter((card) => card.id !== id));
    };

    return (
        <div style={{ height: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <AnimatePresence>
                {cards.map((card, index) => (
                    <Card key={card.id} data={card} index={index} onRemove={removeCard} total={cards.length} />
                ))}
            </AnimatePresence>
            {cards.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                    <BrainCircuit size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <h3>No more signals in range.</h3>
                    <button className="btn-primary" onClick={() => setCards(MOCK_PROFILES)} style={{ marginTop: '20px' }}>
                        Reset Radar
                    </button>
                </div>
            )}
        </div>
    );
}

function Card({ data, index, onRemove, total }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Color feedback overlays
    const rotateY = useTransform(x, [-200, 200], [0, 0]); // Just placeholder
    const likeOpacity = useTransform(x, [10, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [-10, -100], [0, 1]);

    const handleDragEnd = (event, info) => {
        if (info.offset.x > 100) {
            onRemove(data.id); // Swipe Right (Like)
        } else if (info.offset.x < -100) {
            onRemove(data.id); // Swipe Left (Pass)
        }
    };

    // Stack effect: cards behind are smaller and lower
    const isFront = index === total - 1;
    const scale = isFront ? 1 : 1 - (total - 1 - index) * 0.05;
    const yOffset = isFront ? 0 : (total - 1 - index) * 10;

    // Only render top 3 cards for performance
    if (index < total - 3) return null;

    return (
        <motion.div
            style={{
                width: '340px',
                height: '500px',
                position: 'absolute',
                top: 0,
                x: isFront ? x : 0,
                y: yOffset,
                rotate: isFront ? rotate : 0,
                scale,
                zIndex: index
            }}
            drag={isFront ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: "grabbing" }}
            className="glass-panel"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale, opacity: 1 }}
            exit={{ x: 300, opacity: 0, transition: { duration: 0.2 } }}
        >
            <div style={{ height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>

                {/* Status indicators */}
                <motion.div style={{ position: 'absolute', top: 20, right: 20, opacity: likeOpacity, color: '#00ff99', border: '2px solid #00ff99', padding: '5px 10px', borderRadius: '8px', fontWeight: 'bold' }}>
                    MATCH
                </motion.div>
                <motion.div style={{ position: 'absolute', top: 20, left: 20, opacity: nopeOpacity, color: '#ff0055', border: '2px solid #ff0055', padding: '5px 10px', borderRadius: '8px', fontWeight: 'bold' }}>
                    PASS
                </motion.div>

                {/* Avatar / Color Block */}
                <div style={{
                    height: '200px',
                    background: `linear-gradient(135deg, ${data.color}, transparent)`,
                    borderRadius: '16px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{ width: '80px', height: '80px', background: 'rgba(0,0,0,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                        {data.name[0]}
                    </div>
                </div>

                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 4px 0' }}>{data.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Rocket size={16} color="var(--primary-cyan)" />
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{data.role}</span>
                </div>

                <div style={{ flex: 1 }}>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '20px' }}>
                        "{data.bio}"
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {data.skills.map(skill => (
                            <span key={skill} style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: data.vibe === 'Chaos Engineering' ? '#ff0055' : '#00ff99'
                    }}></div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Vibe: <b>{data.vibe}</b></span>
                </div>
            </div>
        </motion.div>
    );
}
