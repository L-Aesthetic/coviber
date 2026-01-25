// ... imports
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
    LineChart, Line
} from 'recharts';
import {
    Download, FileText, HelpCircle, ChevronLeft,
    DollarSign, Clock, Zap, Shield, TrendingUp,
    Briefcase, AlertCircle, FileCheck, RefreshCcw,
    Users, Award, Printer, X, Copy, ChevronDown, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function EquityCalculator() {
    const navigate = useNavigate();
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

    const [showSummaryModal, setShowSummaryModal] = useState(false);

    useEffect(() => {
        calculateSplit();
    }, [founderA, founderB, config]);

    const calculateSplit = () => {
        // ... existing logic ...
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
        // Avoid NaN
        const f1Percent = total > 0 ? Math.round((f1Total / total) * 100) : 50;
        const f2Percent = 100 - f1Percent;

        setSplit([
            { name: founderA.name, value: f1Percent, color: '#6366F1' },
            { name: founderB.name, value: f2Percent, color: '#10B981' }
        ]);
    };

    // ... Mock data ...
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

    // const handlePrint = () => { // Removed
    //     window.print();
    // };

    // Signing State (Legacy - Removed)
    // const [signData, setSignData] = useState({ // Removed
    //     companyName: '',
    //     companyAddress: '',
    //     govLaw: 'Delaware',
    //     founderASign: '',
    //     founderBSign: ''
    // });
    const [killSwitchActive, setKillSwitchActive] = useState(false); // Kept for now, but will be removed from UI
    const [creating, setCreating] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // EASE Agreement Creation Logic (DB)
    const handleCreateAgreement = async () => {
        setCreating(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setShowAuthModal(true);
                setCreating(false);
                return;
            }

            const { data, error } = await supabase
                .from('agreements')
                .insert({
                    founder_a_id: user.id,
                    founder_b_email: 'founder_b@example.com', // In real app, prompt for email or use founderB state if relevant
                    status: 'draft',
                    // kill_switch_active: killSwitchActive, // Removed
                    content_data: {
                        founderA,
                        founderB,
                        split: { founderA: split[0].value, founderB: split[1].value },
                        config
                    }
                })
                .select()
                .single();

            if (error) throw error;
            navigate(`/agreement/${data.id}`);

        } catch (err) {
            alert('Error creating agreement: ' + err.message);
        } finally {
            setCreating(false);
        }
    };

    // EASE Agreement Generation Logic (Removed)
    // const generateEASEAgreement = () => {
    //     // Use the component's founderA, founderB, and split state variables
    //     const founderAPercent = split[0].value;
    //     const founderBPercent = split[1].value;

    //     // This is a simplified generation based on the inputs
    //     // In a real app, you would likely map the "Role" and "Contribution" to the EASE tables
    //     // For now, we will fill in the placeholders using the provided data

    //     return `Equity Agreement for Service (EASE)
    // Version 1.0

    // ${killSwitchActive ? '*** CONDITIONAL PROBATIONARY AGREEMENT ***\n*** SUBJECT TO IMMEDIATE TERMINATION (SECTION 4) ***\n' : ''}
    // This Equity Agreement for Service (this "Agreement") is entered into as of ${new Date().toLocaleDateString()} by and between the undersigned company (the "Company") and the undersigned service provider (the "Consultant").

    // The parties agree as follows:

    // 1. Services. Consultant agrees to act as a consultant to the Company and provide services to the Company as further described on the signature page hereto or as otherwise mutually agreed to by the parties (collectively, the "Services").

    // 2. Compensation. Calculated based on the contributions detailed in Exhibit A. The Company will take the requisite actions to authorize any equity compensation within 30 days from the date of this Agreement. 

    // 3. Expenses. The Company shall reimburse reasonable travel and related expenses incurred by Consultant in the course of performing services hereunder, provided that Consultant obtains prior written approval of any such expenditures in sufficient detail and indicates a maximum reimbursable amount for each such approval.

    // 4. Term and Termination. The term of this Agreement shall continue until the completion of the Services, provided that this Agreement may be terminated at any time by either party for any reason upon five (5) days prior written notice. Upon termination the Company shall have no further obligation or liability except for the compensation earned by Consultant through the date of termination. The obligations of Consultant in Sections 6 through 9 shall survive the termination of this Agreement.
    // ${killSwitchActive ? '   \n   **[CRITICAL: 48-HOUR KILL SWITCH ACTIVE]**\n   Notwithstanding the foregoing, the Company reserves the absolute right to terminate this Agreement immediately (VOIDING ALL EQUITY) if the Consultant fails to deliver the initial "Proof of Work" within 48 hours of the Effective Date.' : ''}

    // 5. Independent Contractor. Consultant’s relationship with the Company will be that of an independent contractor and not that of an employee. Consultant will not be eligible for any employee benefits, nor will the Company make deductions from payments made to Consultant for employment or income taxes, all of which will be Consultant’s responsibility. Consultant will have no authority to enter into contracts that bind the Company or create obligations on the part of the Company without the prior written authorization of the Company.

    // 6. Nondisclosure of Confidential Information.
    //    1. Agreement Not to Disclose. Consultant agrees not to use any Confidential Information (as defined below) disclosed to Consultant by the Company for Consultant’s own use or for any purpose other than to carry out discussions concerning, and the undertaking of, the Services. Consultant agrees to take all reasonable measures to protect the secrecy of, and avoid disclosure or use of, Confidential Information of the Company in order to prevent it from falling into the public domain or the possession of persons other than agents of the Company or persons to whom the Company consents to such disclosure. Upon request by the Company, any materials or documents that have been furnished by the Company to Consultant in connection with the Services shall be promptly returned by Consultant to the Company.
    //    2. Definition of Confidential Information. “Confidential Information” means any information, technical data or know-how (whether disclosed before or after the date of this Agreement), including, but not limited to, information relating to business and product or service plans, financial projections, customer lists, business forecasts, sales and merchandising, human resources, patents, patent applications, computer object or source code, research, inventions, processes, designs, drawings, engineering, marketing or finance information to be confidential or proprietary or which information would, under the circumstances, appear to a reasonable person to be confidential or proprietary. Confidential Information does not include information, technical data or know-how that, not as a direct or indirect result of any improper inaction or action of Consultant: (i) is in the possession of Consultant at the time of disclosure, as shown by Consultant’s files and records immediately prior to the time of disclosure; or (ii) becomes part of the public knowledge. Notwithstanding the foregoing, Consultant may disclose Confidential Information with the prior written approval of the Company or pursuant to the order or requirement of a court, administrative agency or other governmental body, provided that Consultant use reasonable efforts to limit any such disclosures as permitted by law.

    // 7. No Rights Granted. Nothing in this Agreement shall be construed as granting any rights under any patent, copyright or other intellectual property right of the Company, nor shall this Agreement grant Consultant any rights in or to the Company’s Confidential Information, except the limited right to use the Confidential Information in connection with the Services. 

    // 8. Assignment of Intellectual Property. Consultant hereby irrevocably assigns to the Company all right, title and interest in and to any information (including, without limitation, business plans and/or business information), technology, know-how, materials, notes, records, designs, ideas, inventions, improvements, devices, developments, discoveries, compositions, trade secrets, processes, methods and/or techniques, whether or not patentable or copyrightable, that are conceived, reduced to practice or made by Consultant alone or jointly with others in the course of performing the Services or through the use of Confidential Information (collectively, "Inventions"). Consultant agrees that if, in the course of performing the Services, Consultant incorporates into any Invention developed hereunder any invention, improvement, development concept, discovery or other proprietary subject matter owned by Consultant or in which Consultant has an interest ("Item"), Consultant will inform Company in writing thereof, and Company is hereby granted and shall have a non-exclusive, royalty-free, perpetual, irrevocable, worldwide license to make, have made, modify, reproduce, display, use and sell such Item as part of or in connection with the exploitation of such Invention.

    // 9. Duty to Assist. Consultant agrees to sign without any further remuneration, but with any out-of-pocket expenses paid by the Company, any and all documents and to perform such acts as may be necessary, useful or convenient for the purposes of perfecting the foregoing assignments and obtaining, enforcing and defending intellectual property rights in any and all countries with respect to Inventions. It is understood and agreed that Company or Company’s designee shall have the sole right, but not the obligation, to prepare, file, prosecute and maintain patent applications and patents worldwide with respect to Inventions. Consultant’s obligation to assist the Company shall continue beyond the termination of Consultant’s relationship with the Company. 

    // 10. Company’s Right to Disclose. During the term of this Agreement, the Company shall have the right to disclose the existence of this Agreement, Consultant’s status as a Consultant, and to include Consultant’s name, image and profile in various promotional materials, including, but not limited to, private placement memos or other offering materials, executive summaries and the Company’s world wide web page.

    // 11. No Conflicts. Consultant represents that Consultant’s compliance with the terms of this Agreement and provision of Services hereunder will not violate any duty which Consultant may have to any other person or entity (such as a present or former employer), and Consultant agrees that Consultant will not do anything in the performance of Services hereunder that would violate any such duty. In addition, Consultant agrees that, during the term of this Agreement, Consultant shall promptly notify the Company in writing of any competitor of the Company which Consultant is also performing services. It is understood that in such an event, the Company will review whether Consultant’s activities are consistent with remaining as a consultant of the Company. 

    // 12. Miscellaneous. Any term of this Agreement may be amended or waived only with the written consent of both parties. This Agreement, including any schedules hereto, constitute the sole agreement of the parties and supersedes all oral negotiations and prior writings with respect to the subject matter hereof. The validity, interpretation, construction and performance of this Agreement shall be governed by the laws of the jurisdiction listed on the signature page, without giving effect to the principles of conflict of laws. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together will constitute one and the same instrument.

    // -----------------------------------------------------------

    // SIGNATURE PAGE TO EQUITY AGREEMENT FOR SERVICE

    // Effective Date: ${new Date().toLocaleDateString()}
    // Governing Law: ${signData.govLaw || '__________________________'}

    // Description of Services:
    // - Role A (${founderA.name}): ${founderA.isCEO ? 'CEO/Founder - Strategy, Management, Fundraising' : 'Co-Founder - Product, Operations'}
    // - Role B (${founderB.name}): ${founderB.isTechnical ? 'CTO/Technical - Engineering, Architecture, Development' : 'Co-Founder - Marketing, Sales'}

    // Expected Term of Services and Equity Vesting Term:
    // ${config.vesting === 'standard' ? 'Standard 4-year vesting with 1-year cliff' : 'Milestone-based vesting (to be defined in definitives)'}

    // Consultant Equity Compensation:
    // - ${founderA.name}: ${founderAPercent}%
    // - ${founderB.name}: ${founderBPercent}%

    // Total Number of Shares of Common Stock: TBD
    // Type of Security: Restricted Common Stock
    // Exercise/Purchase Price: Fair Market Value

    // Vesting:
    // [X] Monthly: All shares shall vest on a pro rata basis monthly at the end of each full month of services during the Expected Term of Services.
    // [ ] Completion: All shares shall vest upon the completion of the Services, subject to written confirmation by the Company.
    // [ ] Custom Vesting: ${config.vesting === 'standard' ? 'Standard 4-year vesting with 1-year cliff' : 'Milestone-based'}

    // -----------------------------------------------------------

    // COMPANY: ${signData.companyName || '________________________'}
    // Signature: ${signData.founderASign ? `/s/ ${signData.founderASign}` : '________________________'}
    // Name: ${signData.founderASign || '________________________'}
    // Title: CEO
    // Address: ${signData.companyAddress || '________________________'}

    // CONSULTANT: ${founderB.name}
    // Signature: ${signData.founderBSign ? `/s/ ${signData.founderBSign}` : '________________________'}
    // Name: ${founderB.name}
    // Title: ${founderB.isTechnical ? 'CTO' : 'Co-Founder'}
    // ADDRESS: ${signData.companyAddress || '________________________'}

    // -----------------------------------------------------------

    // EXHIBIT A: CoVibr Equity Audit
    // Date: ${new Date().toLocaleDateString()}

    // 1. FOUNDER CONTRIBUTIONS

    //    A. ${founderA.name} (${split[0].value}%)
    //       - Role: ${founderA.isCEO ? 'CEO' : 'Co-Founder'}
    //       - Cash Contribution: $${founderA.cash.toLocaleString()}
    //       - Sweat Equity: ${founderA.hours} hrs/week @ $${founderA.salary.toLocaleString()}/yr (Discounted ${founderA.discount}%)
    //       - Assets: ${founderA.assets.join(', ') || 'None'}
    //       - Risk Factor: ${config.slicingPie ? 'High (Slicing Pie Model)' : 'Standard'}

    //    B. ${founderB.name} (${split[1].value}%)
    //       - Role: ${founderB.isTechnical ? 'CTO' : 'Co-Founder'}
    //       - Cash Contribution: $${founderB.cash.toLocaleString()}
    //       - Sweat Equity: ${founderB.hours} hrs/week @ $${founderB.salary.toLocaleString()}/yr (Discounted ${founderB.discount}%)
    //       - Assets: ${founderB.assets.join(', ') || 'None'}
    //       - Risk Factor: ${config.slicingPie ? 'High (Slicing Pie Model)' : 'Standard'}

    // 2. EQUITY SPLIT CALCULATION
    //    The equity split determined above is based on the relative weight of cash, time, and intellectual property contributions as of the Effective Date.

    //    - Total Valuation Proxy: $${(founderA.cash + founderB.cash + ((founderA.salary * (founderA.discount / 100)) + (founderB.salary * (founderB.discount / 100)))).toLocaleString()} (Estimated Contribution Value)

    // 3. VESTING SCHEDULE DETAILS
    //    ${config.vesting === 'standard' ? 'Standard 4-year vesting with 1-year cliff.' : 'Milestone-based vesting.'}
    //    If the Relationship is terminated before the Cliff Date, all unvested shares shall be forfeited to the Company.
    // ${killSwitchActive ? '\n4. SPECIAL CONDITIONS\n   **This Agreement is subject to a 48-Hour Probationary Period. Failure to deliver initial requirements results in immediate nullification.**' : ''}
    // `;
    // };

    // const copyToClipboard = () => { // Removed
    //     navigator.clipboard.writeText(generateEASEAgreement());
    //     alert("Summary copied to clipboard!");
    // };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }} className="equity-calculator-page">
            {/* Print Styles (Removed) */}
            {/* <style>{`
                @media print {
                    @page { margin: 2cm; size: portrait; } 
                    
                    body * {
                        visibility: hidden;
                    }

                    #print-area, #print-area * {
                        visibility: visible;
                    }

                    #print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        border: none;
                        box-shadow: none;
                        background: white;
                        color: black;
                        color: black;
                        font-family: 'Times New Roman', serif;
                        max-height: none !important;
                        overflow: visible !important;
                        height: auto !important;
                    } 

                    .print-overlay {
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        background: white !important;
                        display: block !important;
                        z-index: 9999 !important;
                        visibility: visible !important;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .agreement-text {
                        color: black;
                        font-size: 11pt;
                        line-height: 1.4;
                        white-space: pre-wrap;
                    }
                    
                    input {
                        border: none;
                        background: transparent;
                        font-weight: bold;
                    }
                }
            `}</style> */}

            <header style={{ marginBottom: '40px', textAlign: 'center' }} >
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
                        {/* ... Config inputs remain same, just ensuring correct state binding ... */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="config-toggles">
                                <label className="input-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Vesting Schedule</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    <button
                                        className={config.vesting === 'standard' ? 'btn-primary' : 'btn-ghost'}
                                        style={{ fontSize: '0.8rem', justifyContent: 'center' }}
                                        onClick={() => setConfig({ ...config, vesting: 'standard' })}
                                    >Standard (4yr/1yr)</button>
                                    <button
                                        className={config.vesting === 'milestone' ? 'btn-primary' : 'btn-ghost'}
                                        style={{ fontSize: '0.8rem', justifyContent: 'center' }}
                                        onClick={() => setConfig({ ...config, vesting: 'milestone' })}
                                    >Milestone Based</button>
                                </div>
                            </div>

                            {/* Sliders for premiums - hide slider input in print, show value */}
                            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>CEO Premium</span>
                                    <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{config.ceoPremium}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="20" value={config.ceoPremium}
                                    onChange={(e) => setConfig({ ...config, ceoPremium: parseInt(e.target.value) })}
                                    style={{ width: '100%' }}
                                // className="no-print" // Removed
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
                                // className="no-print" // Removed
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
                                // className="no-print" // Removed
                                />
                                {/* Print fallback (Removed) */}
                                {/* <span className="only-print" style={{ display: 'none' }}>{config.slicingPie ? 'Yes' : 'No'}</span> */}
                            </label>
                        </div>
                    </section>

                    <div className="saas-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), transparent)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Recommended Split</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 850, color: 'var(--accent-primary)', marginBottom: '16px' }}>{split[0].value} / {split[1].value}</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            <strong>Analysis:</strong> {
                                split[0].value > 50
                                    ? `${founderA.name} is leading with ${split[0].value}% due to ${founderA.cash > founderB.cash ? 'higher capital risk' : 'stronger contribution'}.`
                                    : `${founderB.name} has the edge with ${split[1].value}%.`
                            } {
                                (Math.abs(split[0].value - 50) < 5)
                                    ? "It's a fairly balanced partnership."
                                    : "Make sure to discuss the disparity in risk/reward."
                            }
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

                    <div style={{ display: 'flex', gap: '12px' }} >
                        <button
                            className="btn-primary"
                            style={{ flex: 1, height: '54px' }}
                            onClick={handleCreateAgreement}
                            disabled={creating}
                        >
                            <FileCheck size={18} /> {creating ? 'Creating...' : 'Create & Send Agreement'}
                        </button>
                        {/* <button className="btn-ghost" style={{ width: '54px', height: '54px', padding: 0, justifyContent: 'center' }} onClick={handlePrint} title="Save as PDF"> // Removed
                            <Printer size={20} />
                        </button> */}
                    </div>
                </div>
            </div>

            {/* Fast Summary Modal (Removed) */}
            {/* <AnimatePresence>
                {showSummaryModal && (
                    <div
                        className="print-overlay"
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                        }} onClick={() => setShowSummaryModal(false)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            id="print-area"
                            className="saas-panel"
                            style={{ width: '600px', padding: '32px', border: '1px solid var(--border-subtle)', maxHeight: '90vh', overflowY: 'auto' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }} className="no-print">
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Sign EASE Agreement</h3>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        className="btn-secondary"
                                        style={{
                                            padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700,
                                            borderColor: killSwitchActive ? '#EF4444' : 'var(--text-tertiary)',
                                            color: killSwitchActive ? 'white' : 'var(--text-secondary)',
                                            background: killSwitchActive ? '#EF4444' : 'rgba(255,255,255,0.05)',
                                            transition: 'all 0.2s',
                                            boxShadow: killSwitchActive ? '0 0 20px rgba(239, 68, 68, 0.4)' : 'none',
                                            display: 'flex', alignItems: 'center', gap: '8px'
                                        }}
                                        }}
                                        onClick={() => setKillSwitchActive(!killSwitchActive)}
                                    >
                                        <AlertTriangle size={16} />
                                        {killSwitchActive ? 'KILL SWITCH: ACTIVE' : 'Arm Kill Switch'}
                                    </button>
                                    <button className="btn-ghost" style={{ padding: '8px' }} onClick={() => setShowSummaryModal(false)}>
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }} className="no-print">
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Company Legal Name</label>
                                    <input className="glass-input" style={{ width: '100%' }} placeholder="e.g. Acme Corp Inc." value={signData.companyName} onChange={e => handleSignChange('companyName', e.target.value)} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Company Address</label>
                                    <input className="glass-input" style={{ width: '100%' }} placeholder="123 Startup Way, SF, CA" value={signData.companyAddress} onChange={e => handleSignChange('companyAddress', e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Company Signatory ({founderA.name})</label>
                                    <input className="glass-input" style={{ width: '100%', fontFamily: 'Caveat, cursive', fontSize: '1.2rem', color: 'var(--accent-primary)' }} placeholder="Type to sign..." value={signData.founderASign} onChange={e => handleSignChange('founderASign', e.target.value)} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Consultant ({founderB.name})</label>
                                    <input className="glass-input" style={{ width: '100%', fontFamily: 'Caveat, cursive', fontSize: '1.2rem', color: 'var(--accent-primary)' }} placeholder="Type to sign..." value={signData.founderBSign} onChange={e => handleSignChange('founderBSign', e.target.value)} />
                                </div>
                            </div>

                            <div
                                className="agreement-text"
                                style={{
                                    background: 'white', color: 'black', borderRadius: '4px', padding: '40px',
                                    fontFamily: 'Times New Roman, serif', fontSize: '0.85rem', lineHeight: 1.4, whiteSpace: 'pre-wrap',
                                    marginBottom: '24px', border: '1px solid #ccc', maxHeight: '400px', overflowY: 'auto'
                                }}
                            >
                                {generateEASEAgreement()}
                                <div className="page-break" /> 
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={copyToClipboard}>
                                    <Copy size={16} /> Copy to Clipboard
                                </button>
                                <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowSummaryModal(false)}>
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence> */}

            {/* Auth Required Modal */}
            <AnimatePresence>
                {showAuthModal && (
                    <div
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                        }}
                        onClick={() => setShowAuthModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="saas-panel"
                            style={{ width: '400px', padding: '32px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{
                                    width: '64px', height: '64px', background: 'rgba(99,102,241,0.1)',
                                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 16px', border: '1px solid rgba(99,102,241,0.2)'
                                }}>
                                    <Shield size={32} color="var(--accent-primary)" />
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>Account Required</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    You must be logged in to create legally binding agreements and save them to your secure vault.
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    className="btn-primary"
                                    style={{ justifyContent: 'center', height: '48px', fontSize: '1rem' }}
                                    onClick={() => navigate('/login')}
                                >
                                    Log In / Sign Up
                                </button>
                                <button
                                    className="btn-ghost"
                                    style={{ justifyContent: 'center' }}
                                    onClick={() => setShowAuthModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div >
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
                    <button
                        className="tag"
                        onClick={() => {
                            const newAsset = prompt("Enter asset name (e.g., 'Patents', 'Existing Userbase'):");
                            if (newAsset) setFounder({ ...founder, assets: [...founder.assets, newAsset] });
                        }}
                        style={{ fontSize: '0.7rem', padding: '4px 8px', border: '1px dashed var(--border-subtle)', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', height: '26px' }}
                    >
                        + Add Asset
                    </button>
                </div>
            </div>
        </div>
    )
}
