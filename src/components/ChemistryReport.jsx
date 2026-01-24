import { motion } from 'framer-motion';
import { Activity, Zap, MessageSquare, Award, CheckCircle, Share2, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ChemistryReport({ metrics, challenge }) {
    // Mock Data if not passed
    const score = 88;
    const velocityData = metrics?.velocity || [
        { time: 'Start', score: 20 },
        { time: '4h', score: 45 },
        { time: '8h', score: 70 },
        { time: '12h', score: 65 },
        { time: 'End', score: 88 }
    ];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="saas-panel"
                style={{ padding: '48px', position: 'relative', overflow: 'hidden' }}
            >
                {/* Background Decor */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '20px', color: '#10B981', fontSize: '0.8rem', fontWeight: 700, marginBottom: '24px' }}>
                        <CheckCircle size={16} /> CERTIFIED PARTNERSHIP
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Chemistry Report
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        Performance analysis for <strong>{challenge?.title || "Standard Protocol"}</strong>
                    </p>
                </div>

                {/* Score Hero */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '48px' }}>
                    <div className="saas-panel" style={{ background: 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--accent-primary)', lineHeight: 1 }}>
                            {score}
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '8px' }}>
                            COMPATIBILITY SCORE
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <MetricRow icon={<Zap size={20} color="#F59E0B" />} label="Execution Velocity" value="Top 5%" desc="Faster than 95% of tested pairs." />
                        <MetricRow icon={<MessageSquare size={20} color="#6366F1" />} label="Communication Clarity" value="High" desc="Direct, low-latency exchanges." />
                        <MetricRow icon={<Activity size={20} color="#EF4444" />} label="Stress Resilience" value="Strong" desc="Recovered from pivot in 45 mins." />
                    </div>
                </div>

                {/* Visualization */}
                <div style={{ marginBottom: '48px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Velocity Consistency</h3>
                    <div style={{ height: '200px', width: '100%', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '16px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={velocityData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" hide />
                                <Tooltip contentStyle={{ background: '#1c1c24', border: 'none', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Action Footer */}
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '40px' }}>
                    <button className="btn-primary" style={{ height: '56px', padding: '0 32px' }}>
                        <Share2 size={20} /> Share Certification
                    </button>
                    <button className="btn-ghost" style={{ height: '56px', padding: '0 32px' }}>
                        <Download size={20} /> Download PDF
                    </button>
                </div>

            </motion.div>
        </div>
    );
}

function MetricRow({ icon, label, value, desc }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{desc}</div>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
        </div>
    )
}
