// ... imports
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Import supabase
import { useAuth } from '../context/AuthProvider'; // Import auth
import {
    Check, Zap, Shield, Rocket, Lock,
    CreditCard, Info, Star, ChevronRight,
    X, Sparkles, Globe, Heart, Layout, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function UpgradePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState('founder');
    const [founderCount, setFounderCount] = useState(0);
    const isSoldOut = founderCount >= 100;

    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    // Removed mock cardData
    const billingCycle = 'yearly';

    useEffect(() => {
        const init = async () => {
            // Check for success param
            if (searchParams.get('success') === 'true' && user) {
                const tier = searchParams.get('tier');
                if (tier) {
                    await supabase.from('profiles').update({ subscription_tier: tier }).eq('id', user.id);
                    setIsSuccess(true);
                }
            }

            // Fetch founder count
            const { count, error } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('subscription_tier', 'founder');

            if (!error && count !== null) {
                setFounderCount(count);
                if (count >= 100) setSelectedPlan('pro');
            }
        };
        init();
    }, [searchParams, user]);

    const plans = {
        founder: {
            name: isSoldOut ? 'Founding Member (Sold Out)' : 'Founding Member',
            price: 49,
            isOneTime: true,
            features: ['Vibe Quiz Profile', 'Search Matches', 'Basic Stats', 'Early Access Badge']
        },
        pro: {
            name: 'Pro Member',
            price: 49,
            billingCycle: '/mo',
            features: ['Unlimited Matches', 'Full Chemistry Tests', 'Deep Vibe Analytics', 'Priority Support']
        },
        expert: { name: 'Expert Review', price: 499, isOneTime: true, features: ['48-Hour Chemistry Test', 'Official Chemistry Report', 'IP Assignment Docs', 'Investor-Ready Certificate'] }
    };

    const [errorMsg, setErrorMsg] = useState(null);

    const handleUpgrade = async (planKey) => {
        setLoading(true);
        setErrorMsg(null);

        // Special handling for Founder plan (Free switch)
        if (planKey === 'founder') {
            if (!user) {
                setErrorMsg("Please log in to join the Founder's Club.");
                setLoading(false);
                return;
            }

            try {
                const { error } = await supabase.from('profiles').update({ subscription_tier: 'founder' }).eq('id', user.id);
                if (error) throw error;

                // Notify app of tier change
                window.dispatchEvent(new Event('tier-change'));

                // Success
                navigate('/billing');
                return;
            } catch (err) {
                console.error(err);
                setErrorMsg("Failed to switch plan: " + err.message);
                setLoading(false);
                return;
            }
        }

        if (!user) {
            setErrorMsg("Please log in to purchase a subscription.");
            setLoading(false);
            return;
        }

        try {
            const stripe = await stripePromise;

            // Call API to create session
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tier: planKey,
                    userId: user.id,
                    email: user.email,
                    returnUrl: window.location.origin + '/upgrade' // Return to this page
                })
            });

            const { sessionId, error } = await response.json();

            if (error) {
                setErrorMsg("Payment Error: " + error);
                setLoading(false);
                return;
            }

            // Redirect
            const result = await stripe.redirectToCheckout({ sessionId });
            if (result.error) {
                setErrorMsg(result.error.message);
                setLoading(false);
            }

        } catch (err) {
            console.error(err);
            setErrorMsg("Unexpected error: " + err.message);
            setLoading(false);
        }
    };

    if (isSuccess) {
        return <SuccessView onFinish={() => navigate('/chemistry')} user={user} />;
    }

    // Determine current plan locally for button logic (mock or rely on profile check if we had it in context)
    // For now assuming passed 'user' context doesn't have live tier update without refresh, 
    // but the button text logic requested was "current plan but its the free plan... should say switch plan"
    // We'll trust the button click handler to do the right thing.



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
                            <Zap size={14} fill="var(--accent-primary)" /> Co-Founder Compatibility Platform
                        </div>
                        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.1 }}>Validate Your<br />Partnership.</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.5 }}>Generate an empirical Compatibility Report for investors. Prove you can ship together.</p>
                    </div>

                    {/* Plan Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Founding Member Card (Lifetime Deal) */}
                        <PlanCard
                            active={!isSoldOut && selectedPlan === 'founder'}
                            onClick={() => !isSoldOut && setSelectedPlan('founder')}
                            title="Founding Member (Gold Card)"
                            price="$49"
                            billingCycle="one-time"
                            originalPrice="$49/mo"
                            description={isSoldOut ? "Sold Out. Improve your odds with a Pro Plan." : "Lifetime Access. 50% Off. First 100 Users Only."}
                            limited
                            soldOut={isSoldOut}
                            isGold={!isSoldOut}
                        />

                        {/* Pro Member Card (Fallback when sold out) */}
                        {isSoldOut && (
                            <div style={{ marginTop: '12px' }}>
                                <div style={{ textAlign: 'center', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                    Standard Membership
                                </div>
                                <PlanCard
                                    active={selectedPlan === 'pro'}
                                    onClick={() => setSelectedPlan('pro')}
                                    title="Pro Member"
                                    price="$49"
                                    billingCycle="/mo"
                                    description="Standard monthly subscription. Cancel anytime."
                                    popular
                                />
                            </div>
                        )}

                        <div style={{ textAlign: 'center', margin: '8px 0', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                            Or
                        </div>
                        <PlanCard
                            active={selectedPlan === 'expert'}
                            onClick={() => setSelectedPlan('expert')}
                            title="Expert Review"
                            price="$499"
                            description="Have a real human expert review your partnership agreement."
                            muted
                        />
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '48px', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>Order Summary</h3>

                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', marginBottom: '16px', fontWeight: 600 }}>
                                <span>{plans[selectedPlan].name}</span>
                                <span>${plans[selectedPlan].price === 'Custom' ? 'Custom' : plans[selectedPlan].price}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                {selectedPlan === 'pro' ? 'Billed Monthly. Cancel anytime.' :
                                    selectedPlan === 'certified' ? 'One-time payment for full report.' :
                                        selectedPlan === 'accelerator' ? 'Contact us for enterprise pricing.' :
                                            selectedPlan === 'founder' && isSoldOut ? 'Plan Unavailable.' : 'Free tier.'}
                            </div>

                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '16px 0' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800 }}>
                                <span>Total Due</span>
                                <span>${plans[selectedPlan].price === 'Custom' ? 'Custom' : plans[selectedPlan].price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Error Message Display */}
                    {errorMsg && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#EF4444',
                            padding: '12px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <AlertCircle size={16} /> {errorMsg}
                        </div>
                    )}

                    {/* Trust Signals */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <Shield size={16} color="#10B981" />
                            <span>Payments secured by <strong>Stripe</strong></span>
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={() => {
                            if (plans[selectedPlan].price === 'Custom') {
                                window.location.href = "mailto:sales@covibr.com?subject=Accelerator Plan Inquiry";
                            } else {
                                handleUpgrade(selectedPlan);
                            }
                        }}
                        className="btn-primary"
                        disabled={loading || (selectedPlan === 'founder' && isSoldOut)}
                        style={{
                            width: '100%',
                            height: '56px',
                            fontSize: '1.1rem',
                            justifyContent: 'center',
                            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
                            marginBottom: '16px',
                            opacity: loading || (selectedPlan === 'founder' && isSoldOut) ? 0.7 : 1,
                            cursor: loading || (selectedPlan === 'founder' && isSoldOut) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Processing...' :
                            plans[selectedPlan].price === 'Custom' ? 'Contact Sales' :
                                selectedPlan === 'founder' && isSoldOut ? 'Founders Sold Out!' :
                                    selectedPlan === 'founder' ? 'Switch to Founder Plan' : 'Proceed to Payment'}
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

function PlanCard({ active, onClick, title, price, originalPrice, billingCycle, description, popular, limited, isOneTime, muted, soldOut, isGold }) {
    return (
        <motion.div
            whileHover={!soldOut ? { y: -4 } : {}}
            onClick={!soldOut ? onClick : undefined}
            style={{
                padding: '24px',
                borderRadius: '16px',
                border: isGold ? '1px solid #F59E0B' : (active ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)'),
                background: isGold ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05))' : (active ? 'rgba(99, 102, 241, 0.08)' : soldOut ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.02)'),
                cursor: soldOut ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                opacity: muted || soldOut ? 0.6 : 1,
                position: 'relative',
                paddingTop: popular || limited || isOneTime ? '36px' : '24px',
                minHeight: '120px',
                filter: soldOut ? 'grayscale(1)' : 'none',
                boxShadow: isGold ? '0 0 30px rgba(245, 158, 11, 0.1)' : 'none'
            }}
        >
            {popular && (
                <div style={{
                    position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--accent-primary)', color: 'white', fontSize: '0.6rem', fontWeight: 900,
                    padding: '3px 10px', borderRadius: '4px', textTransform: 'uppercase', whiteSpace: 'nowrap'
                }}>Most Popular</div>
            )}
            {limited && !soldOut && (
                <div style={{
                    position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)',
                    background: '#EF4444', color: 'white', fontSize: '0.6rem', fontWeight: 900,
                    padding: '3px 10px', borderRadius: '4px', textTransform: 'uppercase', whiteSpace: 'nowrap'
                }}>First 100 Only</div>
            )}
            {soldOut && (
                <div style={{
                    position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)',
                    background: '#334155', color: '#94a3b8', fontSize: '0.6rem', fontWeight: 900,
                    padding: '3px 10px', borderRadius: '4px', textTransform: 'uppercase', whiteSpace: 'nowrap',
                    border: '1px solid #475569'
                }}>Sold Out</div>
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

function SuccessView({ onFinish, user }) {
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
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }}>You're in, {user?.name?.split(' ')[0] || 'Founder'}.</h1>
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
