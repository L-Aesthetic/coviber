// ... imports
import { useState, useEffect } from 'react';
import { CreditCard, Calendar, Download, AlertCircle, CheckCircle2, Zap, ArrowUpRight, Crown, Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { motion } from 'framer-motion';

export default function Billing() {
    const { user } = useAuth();
    const [tier, setTier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [memberNumber, setMemberNumber] = useState(1);

    useEffect(() => {
        if (!user) {
            setTier('free');
            setLoading(false);
            return;
        }
        const fetchTier = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('subscription_tier, created_at')
                .eq('id', user.id)
                .single();

            if (data?.subscription_tier) {
                setTier(data.subscription_tier);

                // Calculate Member Number if Founder
                if (data.subscription_tier === 'founder' && data.created_at) {
                    const { count, error } = await supabase
                        .from('profiles')
                        .select('id', { count: 'exact', head: true })
                        .eq('subscription_tier', 'founder')
                        .lt('created_at', data.created_at);

                    if (!error) {
                        setMemberNumber((count || 0) + 1);
                    }
                }
            } else {
                setTier('free');
            }
            setLoading(false);
        };
        fetchTier();
    }, [user]);

    const isPro = ['founder', 'pro', 'certified', 'accelerator'].includes(tier) && tier !== 'free'; // 'free' or undefined is regular free user? No, 'founder' is now a Pro tier.

    let planConfig = { name: 'Free', price: 0, cycle: 'forever' };
    if (tier === 'founder') planConfig = { name: 'Founder\'s Club', price: 0, cycle: 'Lifetime' };
    if (tier === 'pro') planConfig = { name: 'Pro Member', price: 49, cycle: '/mo' };
    if (tier === 'certified') planConfig = { name: 'Certified Pair', price: 399, cycle: 'One-time' };
    if (tier === 'accelerator') planConfig = { name: 'Accelerator', price: 999, cycle: 'Custom' };

    const subscription = {
        plan: planConfig.name,
        status: tier === 'founder' ? 'active (early bird)' : 'active',
        price: planConfig.price,
        billingCycle: planConfig.cycle,
        nextBilling: tier === 'pro' ? 'March 21, 2026' : 'Lifetime Access',
        card: {
            brand: 'Visa',
            last4: '4242', // Mock
            exp: '12/28'
        }
    };

    const invoices = isPro ? [
        { id: 'INV-2026-001', date: new Date().toLocaleDateString(), amount: 399, status: 'paid', pdf: '#' }
    ] : [];

    const handleCancel = () => {
        if (window.confirm("Are you sure you want to cancel?")) {
            alert("This is a demo. Cancellation logic would go here.");
        }
    };

    const handleUpdateCard = () => {
        alert("Stripe Elements modal would open here to update card details.");
    };

    const handleAddPayment = () => {
        alert("Stripe Elements modal would open here to add a new payment method.");
    };

    // FOUNDER'S CLUB (GOLD CARD)
    if (tier === 'founder') {
        return (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <header style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Membership Status
                    </h1>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 20%, #9E7D28 50%, #FDB931 80%, #FFD700 100%)',
                        borderRadius: '24px',
                        padding: '40px',
                        boxShadow: '0 20px 50px rgba(253, 185, 49, 0.15)',
                        color: '#422a03',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 215, 0, 0.5)'
                    }}
                >
                    {/* Shine Effect */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(45deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 60%)',
                        pointerEvents: 'none'
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '10px', background: 'rgba(66, 42, 3, 0.1)', borderRadius: '12px' }}>
                                    <Crown size={32} color="#422a03" strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#422a03' }}>
                                        Founder's Club
                                    </h2>
                                    <p style={{ fontWeight: 600, opacity: 0.8 }}>Lifetime Member</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7 }}>
                                    Member Since
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>2024</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                            {[
                                { icon: Star, label: "VIP Access", desc: "Priority matching & events" },
                                { icon: ShieldCheck, label: "Verified Status", desc: "Gold verification badge" },
                                { icon: Zap, label: "Full Suite", desc: "All current & future features" }
                            ].map((item, i) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '16px', backdropFilter: 'blur(5px)' }}>
                                    <item.icon size={24} color="#422a03" style={{ marginBottom: '12px' }} />
                                    <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '4px' }}>{item.label}</div>
                                    <div style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.3 }}>{item.desc}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', opacity: 0.7 }}>
                                    Authorized Holder
                                </div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                                    {user?.email || 'LOUIS L.'}
                                </div>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, opacity: 0.2 }}>
                                #{String(memberNumber).padStart(4, '0')}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div style={{ marginTop: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Thank you for being one of our first believers. You have full access forever.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Billing & Subscription
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Manage your subscription, payment methods, and invoices.
                </p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Current Plan */}
                <div className="saas-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {subscription.plan} Plan
                                </h2>
                                <span style={{
                                    background: isPro ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                                    color: isPro ? '#10B981' : 'var(--text-tertiary)',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    {isPro ? <CheckCircle2 size={12} /> : null}
                                    {subscription.status}
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {isPro ? "Full access to Chemistry Engine & Investor Reports" : "Basic profile & limited search visibility"}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                                ${subscription.price}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                                {subscription.billingCycle}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(99, 102, 241, 0.05)',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '24px'
                    }}>
                        <Calendar size={20} color="var(--accent-primary)" />
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Renewal Status</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {subscription.nextBilling}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        {!isPro && (
                            <Link to="/upgrade" style={{ width: '100%', maxWidth: '400px', textDecoration: 'none' }}>
                                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '16px' }}>
                                    Unlock Pro Membership - $49/mo
                                </button>
                            </Link>
                        )}
                        {isPro && (
                            <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={handleCancel}>
                                Cancel Subscription
                            </button>
                        )}
                    </div>
                </div>

                {/* Payment Method - Only show if Pro */}
                {isPro && (
                    <div className="saas-panel" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <CreditCard size={20} color="var(--accent-primary)" />
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Payment Method</h2>
                        </div>

                        <div style={{
                            padding: '20px',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
                            borderRadius: '16px',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            marginBottom: '20px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '32px',
                                        background: 'white',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '0.75rem',
                                        color: '#1434CB'
                                    }}>
                                        {subscription.card.brand.toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                            •••• •••• •••• {subscription.card.last4}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                            Expires {subscription.card.exp}
                                        </div>
                                    </div>
                                </div>
                                <button className="btn-ghost" style={{ padding: '8px 16px' }} onClick={handleUpdateCard}>
                                    Update
                                </button>
                            </div>
                        </div>

                        <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={handleAddPayment}>
                            <CreditCard size={16} />
                            Add New Payment Method
                        </button>
                    </div>
                )}

                {/* Billing History */}
                {isPro && (
                    <div className="saas-panel" style={{ padding: '32px' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>
                            Billing History
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {invoices.map((invoice, index) => (
                                <div
                                    key={invoice.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px 0',
                                        borderBottom: index < invoices.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Download size={18} color="var(--accent-primary)" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                                {invoice.id}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                {invoice.date}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                ${invoice.amount}.00
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#10B981', textTransform: 'uppercase', fontWeight: 700 }}>
                                                {invoice.status}
                                            </div>
                                        </div>
                                        <button
                                            className="btn-ghost"
                                            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                                        >
                                            <Download size={14} />
                                            PDF
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Billing Info */}
                <div className="saas-panel" style={{ padding: '24px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <AlertCircle size={20} color="#F59E0B" style={{ flexShrink: 0 }} />
                        <div>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                                Need help with billing?
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                Contact our support team for questions about charges, refunds, or plan changes.
                            </p>
                            <a
                                href="mailto:covibr@gmail.com"
                                style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--accent-primary)',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    textDecoration: 'none'
                                }}
                            >
                                Contact Support <ArrowUpRight size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
