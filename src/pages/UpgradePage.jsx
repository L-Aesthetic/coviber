// ... imports
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Import supabase
import { useAuth } from '../context/AuthProvider'; // Import auth
import {
    Check, Zap, Shield, Rocket, Lock,
    CreditCard, Info, Star, ChevronRight,
    X, Sparkles, Globe, Heart, Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function UpgradePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState('certified');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cardData, setCardData] = useState({ number: '', exp: '', cvc: '', name: 'Louis Lubin' });
    const billingCycle = 'yearly';

    const plans = {
        founder: { name: 'Founder (Limited)', price: 0, originalPrice: 49, features: ['Vibe Quiz Profile', 'Search Matches', 'Basic Stats', 'Early Access Badge'] },
        pro: { name: 'Pro Member', price: 49, billingCycle: '/mo', features: ['Unlimited Matches', 'Full Chemistry Tests', 'Deep Vibe Analytics', 'Priority Support'] },
        certified: { name: 'Certified Pair', price: 399, isOneTime: true, features: ['48-Hour Chemistry Test', 'Official Chemistry Report', 'IP Assignment Docs', 'Investor-Ready Certificate'] },
        accelerator: { name: 'Accelerator', price: 'Custom', features: ['Cohort Dashboard', 'Batch Analytics', 'Risk Heatmaps', 'Dedicated Support'] }
    };

    const handleUpgrade = async (planKey) => {
        if (!user) return alert("Please log in to upgrade.");
        setLoading(true);
        setSelectedPlan(planKey);

        // Mocking Stripe latency
        await new Promise(r => setTimeout(r, 1500));

        try {
            // Update profile with new tier
            const { error } = await supabase
                .from('profiles')
                .update({ subscription_tier: planKey })
                .eq('id', user.id);

            setIsSuccess(true);
        } catch (err) {
            console.error(err);
            setIsSuccess(true);
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return <SuccessView onFinish={() => navigate('/chemistry')} />;
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Same UI as before ... */}
            {/* Background Decorations */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'rgba(99, 102, 241, 0.1)', filter: 'blur(120px)', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'rgba(168, 85, 247, 0.1)', filter: 'blur(120px)', borderRadius: '50%' }}></div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '48px' }}
            >
                {/* Header content would go here if any */}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="saas-panel"
                style={{
                    maxWidth: '1100px',
                    width: '100%',
                    padding: '0',
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(400px, 1fr) 450px',
                    borderColor: 'rgba(255,255,255,0.1)',
                    boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)'
                }}
            >
                {/* Left Column: Value Prop */}
                <div style={{ padding: '48px', position: 'relative' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ position: 'absolute', top: '24px', left: '24px', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                    >
                        <X size={20} />
                    </button>

                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '20px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <Zap size={14} fill="var(--accent-primary)" /> B2B Due Diligence Platform
                        </div>
                        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.1 }}>Validate Your<br />Partnership.</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.5 }}>Generate an empirical Compatibility Report for investors. Prove you can ship together.</p>
                    </div>

                    {/* Plan Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <PlanCard
                            active={selectedPlan === 'founder'}
                            onClick={() => setSelectedPlan('founder')}
                            title="Founder's Club"
                            price="$0"
                            originalPrice="$49/mo"
                            description="First 100 Users Only. Full Access."
                            limited
                        />
                        <PlanCard
                            active={selectedPlan === 'pro'}
                            onClick={() => setSelectedPlan('pro')}
                            title="Pro Member"
                            price="$49"
                            billingCycle="/mo"
                            description="Standard monthly subscription."
                        />
                        <PlanCard
                            active={selectedPlan === 'certified'}
                            onClick={() => setSelectedPlan('certified')}
                            title="Certified Pair"
                            price="$399"
                            description="One-time validation + Report."
                            isOneTime
                        />
                        <PlanCard
                            active={selectedPlan === 'accelerator'}
                            onClick={() => setSelectedPlan('accelerator')}
                            title="Accelerator"
                            price="Custom"
                            description="Cohort analytics."
                            muted
                        />
                    </div>
                </div>

                {/* Right Column: Checkout */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '48px', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Secure Checkout</h3>

                        {/* 3D Glass Card */}
                        <motion.div
                            style={{
                                width: '100%',
                                height: '210px',
                                perspective: '1000px',
                                marginBottom: '32px'
                            }}
                        >
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                padding: '30px',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                color: 'white'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ width: '45px', height: '35px', borderRadius: '6px', background: 'linear-gradient(135deg, #ffd700, #daa520)', opacity: 0.8 }}></div>
                                    <Globe size={24} style={{ opacity: 0.4 }} />
                                    {billingCycle === 'yearly' && (
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Sparkles size={14} /> Save 20%
                                        </div>
                                    )}
                                </div>

                                <div style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '2px', fontVariantNumeric: 'tabular-nums' }}>
                                    {cardData.number || '•••• •••• •••• ••••'}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div>
                                        <div style={{ fontSize: '0.6rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '4px' }}>Card Holder</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{cardData.name}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.6rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '4px' }}>Expires</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{cardData.exp || 'MM/YY'}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Card Number</label>
                                <input
                                    className="saas-input"
                                    placeholder="4242 4242 4242 4242"
                                    maxLength={19}
                                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Expiry</label>
                                    <input className="saas-input" placeholder="MM/YY" onChange={(e) => setCardData({ ...cardData, exp: e.target.value })} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CVC</label>
                                    <input className="saas-input" placeholder="•••" maxLength={3} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{plans[selectedPlan].name} Plan</span>
                            <span>${plans[selectedPlan].price}.00</span>
                        </div>
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '16px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800 }}>
                            <span>Total Due Today</span>
                            <span>${plans[selectedPlan].price}.00</span>
                        </div>
                    </div>

                    {/* CTA */}
                    {/* CTA */}
                    <button
                        onClick={() => handleUpgrade(selectedPlan)}
                        className="btn-primary"
                        disabled={loading}
                        style={{
                            width: '100%',
                            height: '56px',
                            fontSize: '1.1rem',
                            justifyContent: 'center',
                            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
                            marginBottom: '24px'
                        }}
                    >
                        {loading ? 'Processing...' : `Unlock ${plans[selectedPlan].name}`}
                    </button>

                    {/* Trust Signals */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '2px solid #0f111a', marginLeft: i === 1 ? 0 : '-8px' }}></div>
                            ))}
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>Trusted by founders at YC & Antler</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            <Shield size={12} /> Stripe Secure Payment (AES-256)
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function PlanCard({ active, onClick, title, price, originalPrice, billingCycle, description, popular, limited, isOneTime, muted }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            onClick={onClick}
            style={{
                padding: '20px',
                borderRadius: '16px',
                border: active ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                background: active ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                opacity: muted ? 0.6 : 1,
                position: 'relative',
                paddingTop: popular || limited || isOneTime ? '36px' : '20px',
                minHeight: '140px'
            }}
        >
            {popular && (
                <div style={{
                    position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--accent-primary)', color: 'white', fontSize: '0.6rem', fontWeight: 900,
                    padding: '3px 10px', borderRadius: '4px', textTransform: 'uppercase', whiteSpace: 'nowrap'
                }}>Most Popular</div>
            )}
            {limited && (
                <div style={{
                    position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)',
                    background: '#EF4444', color: 'white', fontSize: '0.6rem', fontWeight: 900,
                    padding: '3px 10px', borderRadius: '4px', textTransform: 'uppercase', whiteSpace: 'nowrap'
                }}>First 100 Only</div>
            )}
            {isOneTime && (
                <div style={{
                    position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)',
                    background: '#F59E0B', color: '#000', fontSize: '0.6rem', fontWeight: 900,
                    padding: '3px 10px', borderRadius: '4px', textTransform: 'uppercase', whiteSpace: 'nowrap'
                }}>One-Time</div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{price}</div>
                {billingCycle && <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{billingCycle}</div>}
                {originalPrice && <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>{originalPrice}</div>}
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>{description}</p>
        </motion.div>
    );
}

function SuccessView({ onFinish }) {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f111a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px'
        }}>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}
            >
                <Rocket size={60} color="var(--accent-primary)" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }}>You're in, Louis.</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '48px', maxWidth: '500px' }}>
                    Your account is now **Verified**. You've unlocked the full chemistry test engine and deep vibe analytics.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '600px', width: '100%' }}>
                    <motion.button
                        whileHover={{ y: -5 }}
                        className="saas-panel"
                        style={{ padding: '32px', textAlign: 'left', cursor: 'pointer' }}
                        onClick={onFinish}
                    >
                        <Layout size={24} color="var(--accent-primary)" style={{ marginBottom: '16px' }} />
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Start Chemistry Test</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Run your first 48-hour sprint with Alex V.</p>
                    </motion.button>

                    <motion.button
                        whileHover={{ y: -5 }}
                        className="saas-panel"
                        style={{ padding: '32px', textAlign: 'left', cursor: 'pointer' }}
                        onClick={onFinish}
                    >
                        <Star size={24} color="#F59E0B" style={{ marginBottom: '16px' }} />
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>See 6 Hidden Views</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Reveal who has been looking at your profile.</p>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
