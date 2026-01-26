import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Zap, TrendingUp, AlertTriangle, CheckCircle, FileText, Download, Scale } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabaseClient';

const FullReport = () => {
    const [loading, setLoading] = useState(true);
    const [archetype, setArchetype] = useState(null);
    const [isPremium, setIsPremium] = useState(false); // Mock for now

    const { user } = useAuth();

    useEffect(() => {
        const fetchArchetype = async () => {
            // 1. Try LocalStorage (fastest)
            const savedArch = localStorage.getItem('covibr_archetype');
            if (savedArch) {
                setArchetype(savedArch);
                setLoading(false);
                return;
            }

            // 2. Try Supabase (if logged in)
            if (user && user.email) {
                try {
                    const { data, error } = await supabase
                        .from('leads')
                        .select('archetype')
                        .eq('email', user.email)
                        .single();

                    if (data && data.archetype) {
                        setArchetype(data.archetype);
                        localStorage.setItem('covibr_archetype', data.archetype);
                    } else {
                        // Fallback / No Data
                        setArchetype('Sovereign');
                    }
                } catch (err) {
                    console.error("Error fetching archetype:", err);
                    setArchetype('Sovereign');
                }
            } else {
                setArchetype('Sovereign');
            }
            setLoading(false);
        };

        fetchArchetype();
    }, [user]);

    if (loading) return <div className="p-10 text-center" style={{ color: 'white' }}>Loading Report...</div>;

    const data = getArchetypeData(archetype);

    return (
        <div className="report-container" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', color: 'white', background: '#09090b', minHeight: '100vh' }}>

            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>Founder Risk Audit</h1>
                    <p style={{ color: '#a1a1aa', marginTop: '8px' }}>Generated for {localStorage.getItem('covibr_name') || 'Founder'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-block' }}>CONFIDENTIAL</div>
                    <p style={{ fontSize: '0.8rem', color: '#52525b', marginTop: '4px' }}>{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* EXECUTIVE SUMMARY */}
            <section style={{ marginBottom: '80px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                    <Zap color="#F97316" /> Executive Summary
                </h2>
                <div className="glass-panel" style={{ padding: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '60px' }}>
                        <div>
                            <h3 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', color: data.color, letterSpacing: '-1px' }}>{archetype?.toUpperCase()}</h3>
                            <p style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '24px', fontWeight: 500 }}>"{data.headline}"</p>
                            <p style={{ lineHeight: 1.6, color: '#a1a1aa', fontSize: '1.05rem' }}>{data.summary}</p>
                        </div>
                        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Primary Risk</div>
                                <div style={{ fontSize: '1.4rem', color: '#ef4444', fontWeight: 700 }}>{data.risk}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Required Counter-Balance</div>
                                <div style={{ fontSize: '1.4rem', color: '#10b981', fontWeight: 700 }}>{data.match}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LOCKED SECTIONS MOCK */}
            <SectionLocked title="The Fatal Flaw Analysis" icon={<AlertTriangle color="#ef4444" />} color="#ef4444" />
            <SectionLocked title="Co-Founder Legal Protocol" icon={<Scale color="#a1a1aa" />} color="#a1a1aa" />
            <SectionLocked title="Equity Split Calculator" icon={<TrendingUp color="#10b981" />} color="#10b981" />

            {/* CTA FOR UPGRADE */}
            {!isPremium && (
                <div style={{ marginTop: '80px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(249, 115, 22, 0.1) 0%, rgba(0,0,0,0) 100%)', padding: '60px', borderRadius: '24px', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', fontWeight: 800, letterSpacing: '-1px' }}>Unlock Full Report</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto 32px auto', color: '#d1d5db', fontSize: '1.2rem', lineHeight: 1.6 }}>
                        You have only seen the summary. The full audit includes your customized legal framework, equity calculator, and specific psychological triggers to avoid co-founder conflict.
                    </p>
                    <button className="btn-primary" style={{
                        padding: '18px 48px',
                        fontSize: '1.2rem',
                        background: '#F97316',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)'
                    }}>
                        Upgrade for $49 (Lifetime)
                    </button>
                    <p style={{ marginTop: '24px', fontSize: '1rem', color: '#71717a' }}>Includes "The Founding 100" Membership</p>
                </div>
            )}

        </div>
    );
};

const SectionLocked = ({ title, icon, color }) => (
    <div style={{ marginBottom: '40px', position: 'relative' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: '#52525b' }}>
            {icon} {title}
        </h2>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>

            {/* Blurry Content */}
            <div style={{ filter: 'blur(8px)', opacity: 0.3, background: 'rgba(255,255,255,0.02)', padding: '40px', userSelect: 'none' }}>
                <h3 style={{ color: 'white', marginBottom: '16px' }}>Analysis Vector Alpha</h3>
                <p style={{ color: 'grey', marginBottom: '16px' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                <p style={{ color: 'grey' }}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                <div style={{ height: '100px', background: 'rgba(255,255,255,0.05)', marginTop: '24px', borderRadius: '8px' }}></div>
            </div>

            {/* Lock Overlay */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ background: '#18181b', padding: '12px 24px', borderRadius: '50px', border: '1px solid #27272a', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <Lock size={16} color="#d4d4d8" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#d4d4d8' }}>LOCKED CONTENT</span>
                </div>
            </div>
        </div>
    </div>
);

const getArchetypeData = (name) => {
    const db = {
        Sovereign: {
            color: '#F97316',
            headline: "The Empire Builder",
            summary: "You are a visionary who thrives on high risk and high reward. You see what others don't, but you struggle with the 'boring' execution details that actually build a sustainable business.",
            risk: "Premature Scaling & Burnout",
            match: "The Operator"
        },
        Architect: {
            color: '#8B5CF6',
            headline: "The Master Builder",
            summary: "You are obsessed with quality, product, and legacy. You will delay a launch for 6 months to fix a pixel. You need someone to push you to ship.",
            risk: "Perfectionism Paralysis",
            match: "The Sovereign"
        },
        Operator: {
            color: '#10B981',
            headline: "The Engine",
            summary: "You are the glue that holds everything together. You optimize, you scale, and you ensure nobody dies. But you differ to others on vision, often building someone else's dream.",
            risk: "Getting Steamrolled",
            match: "The Sovereign"
        }
    };
    return db[name] || db.Sovereign;
};

export default FullReport;
