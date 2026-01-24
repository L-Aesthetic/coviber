import { useState } from 'react';
import { ChevronRight, Save, CheckCircle2, Zap, Brain, Shield, Rocket, Target, Users, MapPin, DollarSign, PieChart, Activity, AlertOctagon, Hammer, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BriefBuilder() {
    const [equityRange, setEquityRange] = useState(25);
    const [riskAppetite, setRiskAppetite] = useState(50);
    const [decisionMode, setDecisionMode] = useState('data'); // 'gut' or 'data'
    const [testType, setTestType] = useState('builder');

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '100px' }}>
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px', background: 'linear-gradient(135deg, var(--text-primary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    The Brief Specification
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Configure the matching engine. High-specificity leads to high-friction, high-quality matches.
                </p>
            </header>

            <div className="saas-panel" style={{ padding: '48px', position: 'relative' }}>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

                    {/* Section 1: Role & Gaps */}
                    <Section icon={<Target size={20} />} title="1. The Role & Gaps (Technical Fit)">
                        <div className="form-grid">
                            <SelectGroup
                                label="Target Role"
                                options={["Technical Co-Founder", "Founding Product Designer", "Head of Growth", "Operations Lead"]}
                            />
                            <InputGroup
                                label="Key Responsibility (The 'One Thing')"
                                placeholder="e.g. Ship the MVP in 30 days"
                            />
                        </div>
                        <div className="form-grid">
                            <div>
                                <label className="input-label">Must-Have Skills (Top 3)</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                                    {['React', 'Rust', 'Fundraising', 'Enterprise Sales', 'Community Building', 'AI/ML'].map(skill => (
                                        <Chip key={skill} label={skill} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Domain Expertise</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                                    {['Fintech', 'PropTech', 'Generative AI', 'Health Compliance', 'Web3', 'E-commerce'].map(domain => (
                                        <Chip key={domain} label={domain} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Divider />

                    {/* Section 2: Operating System */}
                    <Section icon={<Activity size={20} />} title="2. Operating System (Vibe Fit)">
                        <div className="form-grid">
                            <div>
                                <label className="input-label">Work Rhythm</label>
                                <div className="radio-group">
                                    <label className="radio-btn">
                                        <input type="radio" name="rhythm" defaultChecked />
                                        <div className="radio-content">
                                            <span className="radio-title">Synchronous</span>
                                            <span className="radio-desc">Office hours, constant Slack, 'War Room'</span>
                                        </div>
                                    </label>
                                    <label className="radio-btn">
                                        <input type="radio" name="rhythm" />
                                        <div className="radio-content">
                                            <span className="radio-title">Asynchronous</span>
                                            <span className="radio-desc">Deep work, written updates, minimal syncs</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <SelectGroup
                                label="Conflict Style"
                                options={["Brutal Honesty (Radical Candor)", "Diplomatic & Consensus-Driven", "Data-First (Show metrics)"]}
                            />
                        </div>

                        <div className="form-grid">
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label className="input-label">Risk Appetite</label>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                                        {riskAppetite < 30 ? 'Conservative' : riskAppetite > 70 ? 'Moonshot' : 'Balanced'}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    className="custom-range"
                                    value={riskAppetite}
                                    onChange={(e) => setRiskAppetite(e.target.value)}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                                    <span>Sustainable</span>
                                    <span>High Burn</span>
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Decision Framework</label>
                                <div className="toggle-switch-container">
                                    <span style={{ fontSize: '0.8rem', color: decisionMode === 'gut' ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: decisionMode === 'gut' ? 600 : 400 }}>Gut/Intuition</span>
                                    <div className="toggle-switch" onClick={() => setDecisionMode(decisionMode === 'gut' ? 'data' : 'gut')}>
                                        <motion.div
                                            animate={{ x: decisionMode === 'data' ? 24 : 0 }}
                                            className="toggle-knob"
                                        />
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: decisionMode === 'data' ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: decisionMode === 'data' ? 600 : 400 }}>Data/Empirical</span>
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Divider />

                    {/* Section 3: Logistics & Equity */}
                    <Section icon={<PieChart size={20} />} title="3. Logistics & Equity (The 'Deal')">
                        <div className="form-grid">
                            <SelectGroup
                                label="Location Preference"
                                options={["Remote-First (Global)", "Remote (Timezone +/- 3h)", "In-Person (San Francisco)", "In-Person (NYC)"]}
                            />
                            <SelectGroup
                                label="Time Commitment"
                                options={["Full-Time (Imminent jump)", "Nights & Weekends", "Full-Time (Unemployed)"]}
                            />
                        </div>
                        <div className="form-grid">
                            <SelectGroup
                                label="Financial Expectations (Runway)"
                                options={["Need Salary Day 1", "Can go unpaid 3 months", "Can go unpaid 6-12 months"]}
                            />
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label className="input-label">Proposed Equity Range</label>
                                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{equityRange}% — 50%</span>
                                </div>
                                <input
                                    type="range"
                                    className="custom-range"
                                    min="5"
                                    max="50"
                                    value={equityRange}
                                    onChange={(e) => setEquityRange(e.target.value)}
                                />
                                <div style={{ marginTop: '4px', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                                    {equityRange < 20 ? 'Employee/Early Hire Signal' : 'True Partner Signal'}
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Divider />

                    {/* Section 4: Chemistry Test */}
                    <Section icon={<Users size={20} />} title="4. Pre-Selection (Chemistry Test)">
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '-16px', marginBottom: '8px' }}>
                            Define how you want to validate potential partners upfront.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <div
                                className={`card-selector ${testType === 'builder' ? 'active' : ''}`}
                                onClick={() => setTestType('builder')}
                            >
                                <Hammer size={24} className="icon" />
                                <h4>The Builder</h4>
                                <p>Ship a feature (48h Sprint)</p>
                            </div>
                            <div
                                className={`card-selector ${testType === 'strategist' ? 'active' : ''}`}
                                onClick={() => setTestType('strategist')}
                            >
                                <Lightbulb size={24} className="icon" />
                                <h4>The Strategist</h4>
                                <p>GTM Plan / Case Study</p>
                            </div>
                            <div
                                className={`card-selector ${testType === 'fixer' ? 'active' : ''}`}
                                onClick={() => setTestType('fixer')}
                            >
                                <Brain size={24} className="icon" />
                                <h4>The Fixer</h4>
                                <p>Audit code/deck flaws</p>
                            </div>
                        </div>
                        <SelectGroup label="Test Duration" options={["4 Hours", "1 Weekend", "1 Week"]} />
                    </Section>

                    <Divider />

                    {/* Section 5: Anti-Persona */}
                    <Section icon={<AlertOctagon size={20} />} title="5. The Anti-Persona (Dealbreakers)">
                        <div className="checkbox-grid">
                            {[
                                "Have never launched a product before",
                                "Are non-technical (for CTO searches)",
                                "Require visa sponsorship",
                                "Want to outsource development",
                                "Remote work only",
                                "Founder without exits"
                            ].map(breaken => (
                                <label key={breaken} className="checkbox-item">
                                    <input type="checkbox" />
                                    <span>Auto-Reject if {breaken}</span>
                                </label>
                            ))}
                        </div>
                    </Section>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px', paddingTop: '32px', borderTop: '1px solid var(--border-subtle)' }}>
                        <button type="button" className="btn-ghost" onClick={() => window.history.back()}>Discard</button>
                        <button type="button" className="btn-ghost">Save as Template</button>
                        <button type="button" className="btn-primary" style={{ height: '50px', padding: '0 32px', fontSize: '1rem' }}>
                            <CheckCircle2 size={20} /> Deploy Specification
                        </button>
                    </div>

                </form>
            </div>

            <style>{`
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 32px;
                }
                .input-label {
                    display: block;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-secondary);
                    margin-bottom: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .radio-group {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .radio-btn {
                    cursor: pointer;
                    display: flex;
                    gap: 12px;
                    padding: 12px;
                    border-radius: 12px;
                    border: 1px solid var(--border-subtle);
                    background: rgba(255,255,255,0.1);
                    transition: all 0.2s;
                }
                .radio-btn:hover {
                    background: rgba(255,255,255,0.2);
                }
                .radio-btn input {
                    margin-top: 4px;
                }
                .radio-content {
                    display: flex;
                    flex-direction: column;
                }
                .radio-title {
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: var(--text-primary);
                }
                .radio-desc {
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                }
                .custom-range {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 6px;
                    border-radius: 3px;
                    background: rgba(255,255,255,0.1);
                    outline: none;
                }
                .custom-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: var(--accent-primary);
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(99, 102, 241, 0.4);
                }
                .toggle-switch-container {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: rgba(255,255,255,0.05);
                    padding: 12px;
                    border-radius: 12px;
                    border: 1px solid var(--border-subtle);
                }
                .toggle-switch {
                    width: 48px;
                    height: 24px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px;
                    padding: 2px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }
                .toggle-knob {
                    width: 20px;
                    height: 20px;
                    background: var(--accent-primary);
                    border-radius: 50%;
                }
                .card-selector {
                    padding: 20px;
                    border-radius: 16px;
                    border: 1px solid var(--border-subtle);
                    background: rgba(255,255,255,0.05);
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.2s;
                }
                .card-selector:hover {
                    background: rgba(255,255,255,0.1);
                    transform: translateY(-2px);
                }
                .card-selector.active {
                    border-color: var(--accent-primary);
                    background: rgba(99, 102, 241, 0.1);
                    box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
                }
                .card-selector .icon {
                    margin-bottom: 12px;
                    color: var(--text-tertiary);
                }
                .card-selector.active .icon {
                    color: var(--accent-primary);
                }
                .card-selector h4 {
                    font-size: 0.95rem;
                    font-weight: 700;
                    margin-bottom: 4px;
                }
                .card-selector p {
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                }
                .checkbox-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                .checkbox-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    border-radius: 8px;
                    background: rgba(239, 68, 68, 0.05);
                    border: 1px solid rgba(239, 68, 68, 0.1);
                    cursor: pointer;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                }
                .checkbox-item:hover {
                    background: rgba(239, 68, 68, 0.08);
                }
            `}</style>
        </div>
    );
}

function Section({ icon, title, children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                    {icon}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingLeft: '48px' }}>{children}</div>
        </div>
    )
}

function InputGroup({ label, placeholder }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="input-label">{label}</label>
            <input type="text" className="glass-input" placeholder={placeholder} style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>
    )
}

function SelectGroup({ label, options }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="input-label">{label}</label>
            <select className="glass-input" style={{ background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                {options.map(opt => <option key={opt} style={{ background: '#1c1c24' }}>{opt}</option>)}
            </select>
        </div>
    )
}

function Chip({ label }) {
    const [active, setActive] = useState(false);
    return (
        <button
            type="button"
            onClick={() => setActive(!active)}
            style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                background: active ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.03)',
                color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                transition: 'all 0.2s'
            }}
        >
            {label}
        </button>
    )
}

function Divider() {
    return <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-subtle), transparent)', margin: '0' }}></div>
}
