import { CreditCard, Calendar, Download, AlertCircle, CheckCircle2, Zap, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Billing() {
    const subscription = {
        plan: 'Builder',
        status: 'active',
        price: 49,
        billingCycle: 'monthly',
        nextBilling: 'February 21, 2026',
        card: {
            brand: 'Visa',
            last4: '4242',
            exp: '12/27'
        }
    };

    const invoices = [
        { id: 'INV-001', date: 'Jan 21, 2026', amount: 49, status: 'paid', pdf: '#' },
        { id: 'INV-002', date: 'Dec 21, 2025', amount: 49, status: 'paid', pdf: '#' },
        { id: 'INV-003', date: 'Nov 21, 2025', amount: 49, status: 'paid', pdf: '#' }
    ];

    const handleCancel = () => {
        if (window.confirm("Are you sure you want to cancel your subscription? You will lose access to premium features at the end of the billing cycle.")) {
            alert("Subscription scheduled for cancellation.");
        }
    };

    const handleUpdateCard = () => {
        alert("Stripe Elements modal would open here to update card details.");
    };

    const handleAddPayment = () => {
        alert("Stripe Elements modal would open here to add a new payment method.");
    };

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
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    color: '#10B981',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <CheckCircle2 size={12} />
                                    Active
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Full access to all features
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                                ${subscription.price}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                                per {subscription.billingCycle === 'monthly' ? 'month' : 'year'}
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
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Next billing date</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {subscription.nextBilling}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to="/upgrade" style={{ textDecoration: 'none', flex: 1 }}>
                            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                <Zap size={16} />
                                Upgrade Plan
                            </button>
                        </Link>
                        <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={handleCancel}>
                            Cancel Subscription
                        </button>
                    </div>
                </div>

                {/* Payment Method */}
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

                {/* Billing History */}
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
                                href="mailto:billing@covibr.com"
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
