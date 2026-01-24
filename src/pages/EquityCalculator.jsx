import { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
    LineChart, Line
} from 'recharts';
import {
    Download, FileText, HelpCircle, ChevronLeft,
    DollarSign, Clock, Zap, Shield, TrendingUp,
    Briefcase, AlertCircle, FileCheck, RefreshCcw,
    Users, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function EquityCalculator() {
    const navigate = useNavigate();

    // --- State ---
    const [founderA, setFounderA] = useState({
        name: 'Louis',
        cash: 50000,
        salary: 150000,
        hours: 40,
        discount: 100, // % of salary sacrificed
        assets: ['MVP Codebase', 'Domain Expertise'],
        isCEO: true
    });

    const [founderB, setFounderB] = useState({
        name: 'Alex',
        cash: 0,
        salary: 200000,
        hours: 20,
        discount: 50,
        assets: ['Network/Access'],
        isTechnical: true
    });

    const [config, setConfig] = useState({
        vesting: 'standard', // standard, milestone
        ceoPremium: 5,
        techPremium: 5,
        slicingPie: false
    });

    const [split, setSplit] = useState([
        { name: 'Louis', value: 65, color: '#6366F1' },
        { name: 'Alex', value: 35, color: '#10B981' }
    ]);

    // --- Logic ---
    useEffect(() => {
        calculateSplit();
    }, [founderA, founderB, config]);

    const calculateSplit = () => {
        // Mock Algorithm representing the "Fairness" math
        // If Slicing Pie (Dynamic) is on, time/risk is weighted higher than cash
        const cashWeight = config.slicingPie ? 1 : 4;
        const timeWeight = config.slicingPie ? 10 : 1;

        const f1CapitalScore = founderA.cash * cashWeight;
        const f2CapitalScore = founderB.cash * cashWeight;

        const f1SweatScore = (founderA.salary * (founderA.discount / 100)) * (founderA.hours / 40) * timeWeight;
        const f2SweatScore = (founderB.salary * (founderB.discount / 100)) * (founderB.hours / 40) * timeWeight;

        const f1AssetScore = founderA.assets.length * 10000;
        const f2AssetScore = founderB.assets.length * 10000;

        let f1Total = f1CapitalScore + f1SweatScore + f1AssetScore;
        let f2Total = f2CapitalScore + f2SweatScore + f2AssetScore;

        // Apply Premiums
        if (founderA.isCEO) f1Total *= (1 + config.ceoPremium / 100);
        if (founderB.isTechnical) f2Total *= (1 + config.techPremium / 100);

        const total = f1Total + f2Total;
        const f1Percent = Math.round((f1Total / total) * 100);
        const f2Percent = 100 - f1Percent;

        setSplit([
            { name: founderA.name, value: f1Percent, color: '#6366F1' },
            { name: founderB.name, value: f2Percent, color: '#10B981' }
        ]);
    };

    // --- Mock Data for Charts ---
    const capTableData = [
        { name: 'Today', Louis: 65, Alex: 35, Investors: 0, Pool: 0 },
        { name: 'Seed', Louis: 45, Alex: 25, Investors: 20, Pool: 10 },
        { name: 'Series A', Louis: 35, Alex: 18, Investors: 35, Pool: 12 },
    ];

    const breakupData = [
        { month: 0, Louis: 0, Alex: 0 },
        { month: 12, Louis: 16.25, Alex: 8.75 }, // Cliff hit
        { month: 24, Louis: 32.5, Alex: 17.5 },
        { month: 36, Louis: 48.75, Alex: 26.25 },
        { month: 48, Louis: 65, Alex: 35 },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 850, marginBottom: '8px' }}>Equity Fairness Calculator</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Replace awkward negotiations with mathematics and risk analysis.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '24px', alignItems: 'start' }}>

                {/* 1. Inputs Panel (Contributions) */}
                <div className="saas-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <TrendingUp size={20} color="var(--accent-primary)" />
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Contributions</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <ContributionCard
                            founder={founderA}
                            setFounder={setFounderA}
                            color="#6366F1"
                            title="Founder 1 (You)"
                        />
                        <ContributionCard
                            founder={founderB}
                            setFounder={setFounderB}
                            color="#10B981"
                            title="Founder 2 (Partner)"
                        />
                    </div>
                </div>

                {/* 2. Configuration Panel (The Prenup) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <section className="saas-panel" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <Shield size={20} color="var(--accent-primary)" />
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Configuration</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label className="input-label">Vesting Schedule</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                                    <button
                                        className={config.vesting === 'standard' ? 'btn-primary' : 'btn-ghost'}
                                        style={{ fontSize: '0.8rem' }}
                                        onClick={() => setConfig({ ...config, vesting: 'standard' })}
                                    >Standard (4yr/1yr)</button>
                                    <button
                                        className={config.vesting === 'milestone' ? 'btn-primary' : 'btn-ghost'}
                                        style={{ fontSize: '0.8rem' }}
                                        onClick={() => setConfig({ ...config, vesting: 'milestone' })}
                                    >Milestone Based</button>
                                </div>
                            </div>

                            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>CEO Premium</span>
                                    <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{config.ceoPremium}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="20" value={config.ceoPremium}
                                    onChange={(e) => setConfig({ ...config, ceoPremium: parseInt(e.target.value) })}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Technical Premium</span>
                                    <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{config.techPremium}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="20" value={config.techPremium}
                                    onChange={(e) => setConfig({ ...config, techPremium: parseInt(e.target.value) })}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '16px', borderRadius: '12px', background: config.slicingPie ? 'rgba(99,102,241,0.05)' : 'transparent', border: '1px solid ' + (config.slicingPie ? 'rgba(99,102,241,0.3)' : 'var(--border-subtle)') }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Slicing Pie Model</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Dynamic equity for "Nights & Weekends"</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={config.slicingPie}
                                    onChange={(e) => setConfig({ ...config, slicingPie: e.target.checked })}
                                    style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)' }}
                                />
                            </label>
                        </div>
                    </section>

                    <div className="saas-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), transparent)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Recommended Split</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 850, color: 'var(--accent-primary)', marginBottom: '16px' }}>{split[0].value} / {split[1].value}</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            <strong>Analysis:</strong> {founderA.name} is contributing higher capital risk (${founderA.cash}) + full-time sweat. {founderB.name} provides technical execution value.
                        </p>
                    </div>
                </div>

                {/* 3. Visualizations (Simulators) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <section className="saas-panel" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <Zap size={20} color="var(--accent-primary)" />
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Cap Table Simulator</h2>
                        </div>
                        <div style={{ height: '220px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={capTableData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} />
                                    <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} />
                                    <Tooltip contentStyle={{ background: '#1c1c24', border: 'none', borderRadius: '8px' }} />
                                    <Legend wrapperStyle={{ fontSize: 10 }} />
                                    <Bar dataKey="Louis" stackId="a" fill="#6366F1" />
                                    <Bar dataKey="Alex" stackId="a" fill="#10B981" />
                                    <Bar dataKey="Investors" stackId="a" fill="#F59E0B" />
                                    <Bar dataKey="Pool" stackId="a" fill="#94A3B8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>Ownership dilution across funding rounds.</p>
                    </section>

                    <section className="saas-panel" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <AlertCircle size={20} color="#ef4444" />
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Breakup Simulator</h2>
                        </div>
                        <div style={{ height: '180px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={breakupData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: 'var(--text-tertiary)', fontSize: 10 }} />
                                    <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} />
                                    <Tooltip contentStyle={{ background: '#1c1c24', border: 'none', borderRadius: '8px' }} />
                                    <Line type="monotone" dataKey="Louis" stroke="#6366F1" strokeWidth={3} dot={false} />
                                    <Line type="monotone" dataKey="Alex" stroke="#10B981" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            If Alex leaves after 18 months, he keeps <strong>9.3%</strong> (of his 35%) due to vesting.
                        </p>
                    </section>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-primary" style={{ flex: 1, height: '54px' }}>
                            <FileCheck size={18} /> Generate FAST Summary
                        </button>
                        <button className="btn-ghost" style={{ width: '54px', height: '54px', padding: 0 }}>
                            <Download size={20} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

function ContributionCard({ founder, setFounder, color, title }) {
    return (
        <div style={{
            padding: '20px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-subtle)',
            borderLeft: `4px solid ${color}`
        }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                {title}
                {founder.isCEO && <Award size={16} title="CEO" color="#F59E0B" />}
                {founder.isTechnical && <Zap size={16} title="Technical" color="#3B82F6" />}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="input-field">
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Cash Contribution ($)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <DollarSign size={14} color="var(--text-tertiary)" />
                        <input
                            type="number"
                            className="saas-input"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                width: '100%',
                                fontSize: '0.9rem',
                                outline: 'none',
                                padding: 0
                            }}
                            value={founder.cash}
                            onChange={(e) => setFounder({ ...founder, cash: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                </div>

                <div className="input-field">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Discount Rate (Risk)</label>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{founder.discount}%</span>
                    </div>
                    <input
                        type="range" min="0" max="100" value={founder.discount}
                        onChange={(e) => setFounder({ ...founder, discount: parseInt(e.target.value) })}
                        style={{ width: '100%', marginTop: '4px' }}
                    />
                </div>

                <div className="input-field">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Work Commitment</label>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{founder.hours}h/wk</span>
                    </div>
                    <input
                        type="range" min="0" max="80" value={founder.hours}
                        onChange={(e) => setFounder({ ...founder, hours: parseInt(e.target.value) })}
                        style={{ width: '100%', marginTop: '4px' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {founder.assets.map((asset, i) => (
                        <div key={i} className="tag tag-blue" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>{asset}</div>
                    ))}
                    <button className="tag" style={{ fontSize: '0.7rem', padding: '4px 8px', border: '1px dashed var(--border-subtle)', background: 'transparent' }}>+ Add Asset</button>
                </div>
            </div>
        </div>
    )
}
