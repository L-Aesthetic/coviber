import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TIME_SLOTS = [
    "09:00 AM", "09:30 AM", "10:00 AM", "11:00 AM",
    "01:00 PM", "01:30 PM", "02:00 PM", "03:30 PM", "04:00 PM"
];

export default function Scheduling() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(15);
    const [selectedTime, setSelectedTime] = useState(null);
    const [booked, setBooked] = useState(false);

    const dates = [
        { day: "Mon", date: 14 },
        { day: "Tue", date: 15, active: true },
        { day: "Wed", date: 16 },
        { day: "Thu", date: 17 },
        { day: "Fri", date: 18 },
    ];

    if (booked) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'var(--bg-page)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px'
            }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="saas-panel"
                    style={{ padding: '60px 40px', maxWidth: '500px', width: '100%', textAlign: 'center' }}
                >
                    <div style={{
                        width: '80px', height: '80px', margin: '0 auto 24px auto',
                        background: 'var(--accent-success)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
                    }}>
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '12px' }}>Vibe Check Confirmed!</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                        You are booked with <b>Alex V.</b> for<br />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Tuesday, Oct {selectedDate} at {selectedTime}</span>
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button className="btn-ghost" onClick={() => navigate('/pipeline')}>View Pipeline</button>
                        <button className="btn-primary" onClick={() => navigate('/')}>Dashboard</button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at 50% 50%, #1a1c2e 0%, #0f111a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            position: 'relative'
        }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    position: 'absolute', top: '40px', left: '40px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                <X size={20} />
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ maxWidth: '1000px', width: '100%', display: 'grid', gridTemplateColumns: '350px 1fr', gap: '48px' }}
            >
                {/* Sidebar info */}
                <div style={{ padding: '20px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '20px', color: 'var(--accent-primary)', fontSize: '0.7rem', fontWeight: 800, marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <CalendarIcon size={14} /> Schedule Vibe Check
                    </div>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.1 }}>Find Your<br />Frequency.</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6, fontSize: '1.1rem' }}>
                        15 minute intro call to see if there's chemistry. No agenda, just vibes.
                    </p>

                    <div className="saas-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(45deg, #6366F1, #EC4899)', padding: '2px' }}>
                            <div style={{ width: '100%', height: '100%', borderRadius: '14px', background: '#1a1c2e', overflow: 'hidden' }}>
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" style={{ width: '100%', height: '100%' }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Alex V.</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Stack Engineer • 142 Vibe Score</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-tertiary)', fontSize: '0.95rem' }}>
                            <Clock size={18} color="var(--accent-primary)" /> 15 min chemistry test
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-tertiary)', fontSize: '0.95rem' }}>
                            <CalendarIcon size={18} color="var(--accent-primary)" /> Video Call (Google Meet)
                        </div>
                    </div>
                </div>

                {/* Calendar & Time Slots */}
                <div className="saas-panel" style={{ padding: '40px', background: 'rgba(255,255,255,0.02)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Select a Date & Time
                    </h3>

                    {/* Date Strip */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px' }}>
                        <button className="btn-ghost" style={{ padding: '8px', minWidth: '40px' }}><ChevronLeft size={20} /></button>
                        <div style={{ display: 'flex', gap: '8px', flex: 1, justifyContent: 'center' }}>
                            {dates.map(d => (
                                <button
                                    key={d.date}
                                    onClick={() => setSelectedDate(d.date)}
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                                        padding: '12px', borderRadius: '12px', minWidth: '65px',
                                        border: '1px solid',
                                        borderColor: selectedDate === d.date ? 'var(--accent-primary)' : 'transparent',
                                        background: selectedDate === d.date ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                        color: selectedDate === d.date ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>{d.day}</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{d.date}</span>
                                </button>
                            ))}
                        </div>
                        <button className="btn-ghost" style={{ padding: '8px', minWidth: '40px' }}><ChevronRight size={20} /></button>
                    </div>

                    {/* Time Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
                        {TIME_SLOTS.map(time => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                style={{
                                    padding: '18px',
                                    borderRadius: '16px',
                                    border: '1px solid',
                                    borderColor: selectedTime === time ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                    background: selectedTime === time ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                                    color: selectedTime === time ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '0.95rem'
                                }}
                            >
                                {time}
                            </button>
                        ))}
                    </div>

                    {/* Confirm Button */}
                    <AnimatePresence>
                        {selectedTime ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <button
                                    className="btn-primary shimmer"
                                    style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '18px' }}
                                    onClick={() => setBooked(true)}
                                >
                                    Confirm Chemistry Test
                                </button>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '16px' }}>
                                    30-day money-back guarantee on all vibe matches.
                                </p>
                            </motion.div>
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem', padding: '20px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                                Select a time to unlock confirmation
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
