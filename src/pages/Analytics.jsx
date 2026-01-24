import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell } from 'recharts';
import { Eye, Search, MousePointer, TrendingUp, Users, MessageCircle, Zap, AlertCircle, Ghost, MessageSquare, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DATA_FUNNEL = [
    { step: 'Impressions', value: 1400, fill: 'var(--accent-primary)' },
    { step: 'Profile Clicks', value: 259, fill: 'var(--accent-primary)', opacity: 0.8 },
    { step: 'Initials Requests', value: 18, fill: 'var(--accent-primary)', opacity: 0.6 },
    { step: 'Meetings Booked', value: 3, fill: 'var(--accent-primary)', opacity: 0.4 },
];

const DATA_RADAR = [
    { subject: 'Equity %', A: 20, B: 35, fullMark: 100 },
    { subject: 'Exp. (Years)', A: 8, B: 6, fullMark: 15 },
    { subject: 'Response (Hrs)', A: 48, B: 4, fullMark: 72 },
    { subject: 'Technical Debt', A: 4, B: 7, fullMark: 10 },
    { subject: 'Weekly Hours', A: 20, B: 40, fullMark: 60 },
];

const DATA_PASS_REASONS = [
    { name: 'Location', value: 60, color: '#6366F1' },
    { name: 'Equity Mismatch', value: 25, color: '#F59E0B' },
    { name: 'Skill Gap', value: 10, color: '#10B981' },
    { name: 'Vibe Mismatch', value: 5, color: '#EC4899' },
];

const KEYWORDS = [
    { text: "Fintech", size: "1.8rem", color: "var(--accent-primary)" },
    { text: "Rust", size: "1.4rem", color: "var(--text-secondary)" },
    { text: "Bootstrapped", size: "1.2rem", color: "var(--text-tertiary)" },
    { text: "NYC", size: "1.5rem", color: "var(--accent-primary)" },
    { text: "SaaS", size: "1.1rem", color: "var(--text-secondary)" },
    { text: "Series A", size: "1.3rem", color: "var(--text-tertiary)" },
    { text: "Next.js", size: "1.6rem", color: "var(--accent-primary)" },
];

export default function Analytics() {
    const navigate = useNavigate();
    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Market Feedback & Calibration</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Understand how the market perceives your offer and profile.</p>
                </div>
            </div>

            {/* Conversation Health Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <MetricCard icon={MessageSquare} label="Avg Message Length" value="142 words" change="High Quality" color="#6366F1" />
                <MetricCard icon={Users} label="Turn-taking Ratio" value="45 / 55" change="Balanced" color="#10B981" />
                <MetricCard icon={Ghost} label="Ghost Rate" value="12%" change="-5%" color="#EC4899" isNegative />
                <MetricCard icon={AlertCircle} label="Calibration" value="Critical" change="Action Needed" color="#F59E0B" isNegative />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

                {/* Top Left: Conversion Funnel */}
                <div className="saas-panel" style={{ padding: '32px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>The 漏 (Leak) Detector</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            <span style={{ color: '#EF4444', fontWeight: 600 }}>Low Conversion Rate (1.2%).</span> Your headline might be weak.
                        </p>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={DATA_FUNNEL} margin={{ left: 10, right: 40 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="step" type="category" axisLine={false} tickLine={false} fontSize={12} width={100} tick={{ fill: 'var(--text-secondary)' }} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(15, 17, 26, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {DATA_FUNNEL.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={entry.opacity || 1} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Right: Market Calibration */}
                <div className="saas-panel" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px' }}>Market Calibration</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius="80%" data={DATA_RADAR}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                                <Radar name="You" dataKey="A" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.6} />
                                <Radar name="Market Avg" dataKey="B" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(15, 17, 26, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '12px' }}>
                        <span style={{ color: '#F59E0B' }}>●</span> Market Average vs <span style={{ color: 'var(--accent-primary)' }}>●</span> You
                    </div>
                </div>

                {/* Bottom Left: Feedback Loop */}
                <div className="saas-panel" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px' }}>Why They Passed</h3>
                    <div style={{ height: '240px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={DATA_PASS_REASONS}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {DATA_PASS_REASONS.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: 'rgba(15, 17, 26, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                        {DATA_PASS_REASONS.map(reason => (
                            <div key={reason.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: reason.color }}></div>
                                <span style={{ color: 'var(--text-secondary)' }}>{reason.name} ({reason.value}%)</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Right: Keyword Cloud */}
                <div className="saas-panel" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px' }}>Search Intent (SEO)</h3>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '240px',
                        padding: '20px'
                    }}>
                        {KEYWORDS.map((tag, i) => (
                            <motion.span
                                key={tag.text}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    fontSize: tag.size,
                                    color: tag.color,
                                    fontWeight: 600,
                                    cursor: 'default'
                                }}
                            >
                                {tag.text}
                            </motion.span>
                        ))}
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                        Targeting <b>Healthtech</b>? Your keywords suggest <b>Fintech/Crypto</b>.
                    </p>
                </div>

            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value, change, color, isNegative }) {
    return (
        <div className="saas-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: `${color}20`, color: color }}>
                    <Icon size={20} />
                </div>
                <div style={{
                    fontSize: '0.8rem', fontWeight: 600,
                    color: isNegative ? '#EF4444' : '#10B981',
                    display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                    {change} <TrendingUp size={14} style={{ transform: isNegative ? 'rotate(180deg)' : 'none' }} />
                </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' }}>{value}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</div>
        </div>
    )
}

function ViewerRow({ name, role, time, isBlur }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: isBlur ? 0.6 : 1, filter: isBlur ? 'blur(3px)' : 'none' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #ddd, #999)' }}></div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{role}</div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{time}</div>
        </div>
    )
}
