import { useState, useEffect } from 'react';
import {
    FileText, Video,
    Zap, CheckCircle2, Github as GithubIcon,
    Activity, ShieldCheck,
    Layout, Send,
    ExternalLink, HardDrive, MoreVertical, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';

export default function LiveSession() {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tasks');
    const [timeLeft, setTimeLeft] = useState(38 * 3600 + 12 * 60 + 5); // 38:12:05
    const [vibeScore, setVibeScore] = useState(85);

    // --- Timer Logic ---
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // --- Mock Data ---
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Setup Postgres Database (Supabase)', type: 'Tech', assignee: 'Alex V.', status: 'todo' },
        { id: 2, title: 'Finalize Brand Colors (Figma)', type: 'Design', assignee: 'You', status: 'todo' },
        { id: 3, title: 'Agree on Delaware C-Corp vs. LLC', type: 'Legal', assignee: 'Shared', status: 'todo' },
        { id: 4, title: 'Build Login Component (Next.js 14)', type: 'Frontend', assignee: 'You', status: 'progress', liveStatus: 'Editing auth.tsx' },
        { id: 5, title: "Draft 'Problem Slide' for Pitch Deck", type: 'Strategy', assignee: 'Shared', status: 'progress' },
        { id: 6, title: 'Repo Initialized (GitHub)', type: 'Infra', assignee: 'Alex V.', status: 'shipped', time: '2h ago' },
        { id: 7, title: 'Domain Purchased (lemonpay.io)', type: 'Marketing', assignee: 'You', status: 'shipped', time: '1h ago' },
    ]);

    const [feed, setFeed] = useState([
        { id: 1, type: 'system', user: 'System', content: '🎉 Milestone Unlocked: "First Feature Shipped"', time: '10:22 AM', icon: Zap, color: '#F59E0B' },
        { id: 2, type: 'chat', user: 'You', content: 'We are live. Login works.', time: '10:21 AM' },
        { id: 3, type: 'system', user: 'Vercel', content: '🚀 Deployment Successful (preview-8a7d)', time: '10:20 AM', icon: ExternalLink, color: '#10B981' },
        { id: 4, type: 'chat', user: 'You', content: 'On it. Checking Vercel logs.', time: '10:18 AM' },
        { id: 5, type: 'chat', user: 'Alex V.', content: 'Yo, check the PR. I think the middleware is blocking the dashboard route.', time: '10:17 AM' },
        { id: 6, type: 'system', user: 'GitHub', content: '🐙 Alex V. pushed to main: "feat: added supabase auth hooks"', meta: '+120 / -45 lines', time: '10:15 AM', icon: GithubIcon, color: '#6366F1' },
    ]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)', gap: '20px' }}>

            {/* 1. HUD (Heads-Up Display) */}
            <header className="saas-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(90deg, rgba(99,102,241,0.05), transparent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Sprint</div>
                        <h1 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Project Alpha: Stripe for Lemons</h1>
                    </div>
                    <div style={{ width: '1px', height: '30px', background: 'var(--border-subtle)' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <PresenceIndicator user="You" status="online" sub="Focus Mode" />
                        <PresenceIndicator user="Alex V." status="away" sub="VS Code (15m)" />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    {/* Vibe Meter */}
                    <div style={{ width: '200px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px', fontWeight: 700 }}>
                            <span style={{ color: 'var(--text-secondary)' }}>MOMENTUM</span>
                            <span style={{ color: 'var(--accent-primary)' }}>{vibeScore}% HIGH VELOCITY</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${vibeScore}%` }}
                                style={{ height: '100%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }}
                            />
                        </div>
                    </div>

                    {/* Timer */}
                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                        <div style={{ fontSize: '0.7rem', color: timeLeft < 3600 * 4 ? '#EF4444' : 'var(--text-tertiary)', fontWeight: 700 }}>REMAINING</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: timeLeft < 3600 * 4 ? '#EF4444' : 'var(--text-primary)', letterSpacing: '-1px' }}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', flex: 1, minHeight: 0 }}>

                {/* Left Side: Workspace & Tabs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: 0 }}>
                    {/* Navigation Tabs */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <ModuleTab active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon={Layout} label="Task Board" />
                        <ModuleTab active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} icon={FileText} label="Shared Brain" />
                        <ModuleTab active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} icon={ShieldCheck} label="Credentials" />
                        <ModuleTab active={activeTab === 'video'} onClick={() => setActiveTab('video')} icon={Video} label="Video Room" />
                    </div>

                    {/* Main Stage */}
                    <div className="saas-panel" style={{ flex: 1, padding: '24px', overflowY: 'auto', position: 'relative' }}>
                        <AnimatePresence mode="wait">
                            {activeTab === 'tasks' && (
                                <motion.div
                                    key="tasks"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', height: '100%' }}
                                >
                                    <KanbanColumn title="To Do" tasks={tasks.filter(t => t.status === 'todo')} color="var(--text-tertiary)" />
                                    <KanbanColumn title="In Progress" tasks={tasks.filter(t => t.status === 'progress')} color="var(--accent-primary)" active />
                                    <KanbanColumn title="Shipped" tasks={tasks.filter(t => t.status === 'shipped')} color="#10B981" />
                                </motion.div>
                            )}

                            {activeTab === 'notes' && (
                                <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Product Requirements Document (Live)</h2>
                                    <textarea
                                        className="glass-input"
                                        style={{ flex: 1, resize: 'none', lineHeight: 1.6, fontSize: '0.95rem' }}
                                        defaultValue={`# MVP Requirements (LemonPay.io)\n\n1. User can sign up via Supabase Auth.\n2. User can add a credit card (Stripe Elements).\n3. User sees 'Success' screen/dog animation.\n\n## Constraints\n- NO landing page builder (hand-code).\n- NO extra features (no search, no profile).\n- MUST be mobile responsive.`}
                                    />
                                </motion.div>
                            )}

                            {activeTab === 'vault' && (
                                <motion.div key="vault" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                        <VaultCard title="Stripe Public Key" value="pk_test_51Mz..." />
                                        <VaultCard title="Supabase URL" value="https://xyz.supabase.co" />
                                        <VaultCard title="Figma Design File" value="figma.com/file/..." isLink />
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'video' && (
                                <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                        <Video size={40} color="var(--accent-primary)" />
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Deep Sync Room</h3>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Always-on audio channel for the sprint.</p>
                                    <button className="btn-primary" style={{ padding: '12px 32px' }}>Hop in Voice</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Side: Live Feed & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: 0 }}>
                    {/* Live Feed Panel */}
                    <div className="saas-panel" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Activity size={18} color="var(--accent-primary)" />
                            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Pulse Feed</h2>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
                            {feed.map(item => (
                                <FeedItem key={item.id} item={item} />
                            ))}
                        </div>

                        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                            <input
                                className="glass-input"
                                placeholder="Message Alex..."
                                style={{ flex: 1, fontSize: '0.85rem' }}
                            />
                            <button className="btn-primary" style={{ width: '40px', height: '40px', padding: 0, justifyContent: 'center' }}>
                                <Send size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="saas-panel" style={{ padding: '20px' }}>
                        <button className="btn-primary" style={{ width: '100%', height: '54px', justifyContent: 'center', marginBottom: '12px', background: 'var(--accent-primary)' }}>
                            <CheckCircle2 size={18} /> Submit MVP for Review
                        </button>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <button className="btn-ghost" style={{ fontSize: '0.8rem', justifyContent: 'center' }}>Need Extension?</button>
                            <button className="btn-ghost" style={{ fontSize: '0.8rem', justifyContent: 'center', color: '#EF4444' }}>Abort Mission</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- Sub-Components ---

function PresenceIndicator({ user, status, sub }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, border: '1px solid var(--border-subtle)' }}>
                    {user[0]}
                </div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', background: status === 'online' ? '#10B981' : '#F59E0B', border: '2px solid #0f111a' }}></div>
            </div>
            <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{sub}</div>
            </div>
        </div>
    )
}

function ModuleTab({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                border: active ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
        >
            <Icon size={16} />
            {label}
        </button>
    )
}

function KanbanColumn({ title, tasks, color, active }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: `2px solid ${active ? color : 'var(--border-subtle)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{title.toUpperCase()}</h3>
                    <div style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-tertiary)' }}>{tasks.length}</div>
                </div>
                <button style={{ color: 'var(--text-tertiary)', border: 'none', background: 'none' }}><Plus size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tasks.map(task => (
                    <motion.div
                        key={task.id}
                        whileHover={{ x: 4 }}
                        style={{
                            padding: '16px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--border-subtle)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-tertiary)' }}>{task.type}</span>
                            <MoreVertical size={14} color="var(--text-tertiary)" />
                        </div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', lineHeight: 1.4 }}>{task.title}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{task.assignee[0]}</div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{task.assignee}</span>
                            </div>
                            {task.liveStatus && (
                                <motion.div
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{ fontSize: '0.65rem', color: '#3B82F6', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#3B82F6' }}></div>
                                    {task.liveStatus}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

function FeedItem({ item }) {
    if (item.type === 'system') {
        const Icon = item.icon;
        return (
            <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '2px' }}>{item.content}</div>
                    {item.meta && <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{item.meta}</div>}
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{item.time}</div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', flexShrink: 0 }}>
                {item.user[0]}
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '0 12px 12px 12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '4px' }}>{item.user}</div>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{item.content}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginTop: '6px', textAlign: 'right' }}>{item.time}</div>
            </div>
        </div>
    )
}

function VaultCard({ title, value, isLink }) {
    return (
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>{title}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <code style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{value}</code>
                {isLink ? <ExternalLink size={14} color="var(--accent-primary)" /> : <HardDrive size={14} color="var(--text-tertiary)" />}
            </div>
        </div>
    )
}
