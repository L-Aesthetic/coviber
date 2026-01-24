import { ArrowLeft, Users, Clock, GitCommit, CheckSquare, Zap, Activity, ThumbsUp, ThumbsDown, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import ChemistryReport from '../components/ChemistryReport';

export default function ChemistryRoom() {
    const { sessionId } = useParams();
    const [timeRemaining, setTimeRemaining] = useState(48 * 60 * 60); // 48 hours in seconds
    const [hasVoted, setHasVoted] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [momentum, setMomentum] = useState(35); // 0-100
    const [stressMode, setStressMode] = useState(false); // Pivot Protocol
    const [reviewSentiment, setReviewSentiment] = useState(50); // 0-100

    // Mock DORA Metrics Data
    const velocityData = [
        { time: 'Day 1 AM', deploys: 2, leadTime: 4 },
        { time: 'Day 1 PM', deploys: 5, leadTime: 2 },
        { time: 'Day 2 AM', deploys: 8, leadTime: 1.5 },
        { time: 'Day 2 PM', deploys: 12, leadTime: 1 },
    ];

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    // Mock data
    const participants = [
        { name: 'Louis L.', avatar: '👨‍💻', lastActive: '2 min ago', isOnline: true },
        { name: 'Sarah K.', avatar: '👩‍💼', lastActive: '15 min ago', isOnline: false }
    ];

    const recentActivity = [
        { user: 'Louis L.', action: 'moved task to Done', time: '2 min ago', type: 'task' },
        { user: 'Sarah K.', action: 'pushed 2 commits', time: '15 min ago', type: 'code' },
        { user: 'Louis L.', action: 'added new task', time: '1 hour ago', type: 'task' }
    ];

    // State for Challenge Selection
    const [activeChallenge, setActiveChallenge] = useState(null); // 'stripe', 'api_race', 'refactor'
    const [isSetupOpen, setIsSetupOpen] = useState(true);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // Initial Tasks based on Challenge
    const [tasks, setTasks] = useState({ todo: [], doing: [], done: [] });

    const CHALLENGES = {
        stripe: {
            title: "The Stripe Integration",
            desc: "Build a subscription checkout flow using Stripe Elements.",
            tasks: [
                { id: '1', title: 'Setup Stripe Secret Keys (Env)', assignee: 'Unassigned' },
                { id: '2', title: 'Create Checkout Session API', assignee: 'Unassigned' },
                { id: '3', title: 'Build Pricing UI Component', assignee: 'Unassigned' },
                { id: '4', title: 'Handle Webhooks', assignee: 'Unassigned' }
            ]
        },
        api_race: {
            title: "The API Wrapper Race",
            desc: "Build a fully typed SDK for the PokeAPI.",
            tasks: [
                { id: '1', title: 'Design Interface Types', assignee: 'Unassigned' },
                { id: '2', title: 'Implement GET /pokemon', assignee: 'Unassigned' },
                { id: '3', title: 'Implement Caching Layer', assignee: 'Unassigned' },
                { id: '4', title: 'Write Tests', assignee: 'Unassigned' }
            ]
        }
    };

    const handleStartChallenge = (challengeKey) => {
        setActiveChallenge(CHALLENGES[challengeKey]);
        setTasks({
            todo: CHALLENGES[challengeKey].tasks,
            doing: [],
            done: []
        });
        setIsSetupOpen(false);
    };

    const totalTasks = Object.values(tasks).flat().length;
    const completedTasks = tasks.done.length;

    if (showReport) {
        return <ChemistryReport challenge={activeChallenge} />;
    }

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

            {/* Challenge Selection Modal */}
            <AnimatePresence>
                {isSetupOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 100,
                            background: 'rgba(15, 17, 26, 0.95)', backdropFilter: 'blur(10px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <div className="saas-panel" style={{ maxWidth: '800px', width: '90%', padding: '40px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px', textAlign: 'center' }}>Select Your Chemistry Test</h2>
                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>
                                Choose a standardized challenge to benchmark your partnership velocity.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <button
                                    className="saas-panel hover-glass"
                                    onClick={() => handleStartChallenge('stripe')}
                                    style={{ padding: '24px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
                                >
                                    <div style={{ marginBottom: '12px', color: '#635BFF' }}><Zap size={32} /></div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>The Stripe Integration</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Build a subscription checkout flow. Tests full-stack speed and documentation reading.</p>
                                </button>
                                <button
                                    className="saas-panel hover-glass"
                                    onClick={() => handleStartChallenge('api_race')}
                                    style={{ padding: '24px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
                                >
                                    <div style={{ marginBottom: '12px', color: '#F59E0B' }}><GitCommit size={32} /></div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>The API Wrapper Race</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Build a typed SDK. Tests architecture, typing discipline, and testing culture.</p>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <Link to="/teams" className="btn-ghost" style={{ marginBottom: '16px', padding: '8px 16px', display: 'inline-flex' }}>
                    <ArrowLeft size={16} />
                    Exit Room
                </Link>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {activeChallenge ? activeChallenge.title : "Chemistry Test (Setup)"}
                            </h1>
                            {activeChallenge && <span className="tag tag-purple">Live Scenario</span>}
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {activeChallenge ? activeChallenge.desc : "Waiting for challenge selection..."}
                        </p>
                    </div>

                    {/* Countdown Timer */}
                    <div className="saas-panel" style={{ padding: '24px', textAlign: 'center', minWidth: '200px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>
                            Time Remaining
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: timeRemaining < 3600 ? '#EF4444' : 'var(--accent-primary)', fontFamily: 'monospace', letterSpacing: '-0.05em' }}>
                            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </div>
                        {timeRemaining < 3600 && (
                            <div style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '8px', fontWeight: 600 }}>
                                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                Final hour!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 300px', gap: '24px' }}>
                {/* Left Sidebar - Participants */}
                <div>
                    <div className="saas-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                            Participants
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {participants.map((p, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ fontSize: '2rem', position: 'relative' }}>
                                        {p.avatar}
                                        {p.isOnline && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                width: '12px',
                                                height: '12px',
                                                background: '#10B981',
                                                border: '2px solid var(--bg-primary)',
                                                borderRadius: '50%'
                                            }} />
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {p.name}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: p.isOnline ? '#10B981' : 'var(--text-tertiary)' }}>
                                            {p.isOnline ? 'Online' : `Active ${p.lastActive}`}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Momentum Meter */}
                    <div className="saas-panel" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Zap size={16} color="#F59E0B" />
                            Momentum
                        </h3>
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Progress</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F59E0B' }}>{momentum}%</span>
                            </div>
                            <div style={{ height: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                                <motion.div
                                    style={{
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
                                        borderRadius: '6px'
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${momentum}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                            Momentum builds as you complete tasks. Keep shipping!
                        </div>
                    </div>

                    {/* Velocity Index (DORA Metrics) */}
                    <div className="saas-panel" style={{ padding: '24px', marginTop: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={16} color="#10B981" />
                            Velocity Index
                        </h3>
                        <div style={{ height: '100px', marginBottom: '12px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={velocityData}>
                                    <defs>
                                        <linearGradient id="colorDeploys" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip contentStyle={{ background: '#1c1c24', border: 'none', fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="deploys" stroke="#10B981" fillOpacity={1} fill="url(#colorDeploys)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            <span>High Frequency</span>
                            <span style={{ color: '#10B981' }}>Elastic</span>
                        </div>
                    </div>

                    {/* Stress Test Protocol */}
                    <div className="saas-panel" style={{ padding: '24px', marginTop: '24px', border: stressMode ? '1px solid #EF4444' : '1px solid transparent' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: stressMode ? '#EF4444' : 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {stressMode ? <AlertCircle size={16} /> : <RefreshCw size={16} />}
                            {stressMode ? 'CRISIS MODE' : 'Pivot Protocol'}
                        </h3>

                        {!stressMode ? (
                            <button
                                className="btn-ghost"
                                style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'center' }}
                                onClick={() => setStressMode(true)}
                            >
                                Trigger Random Stress Test
                            </button>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#EF4444', fontWeight: 600 }}>
                                        Scenario #4: "OpenAI API Deprecated"
                                    </p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        The model you built on just broke. You have 4 hours to swap providers.
                                    </p>
                                </div>
                                <button
                                    className="btn-primary"
                                    style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'center', background: '#EF4444' }}
                                    onClick={() => setStressMode(false)}
                                >
                                    Resolve Crisis
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Center - Kanban Board */}
                <div>
                    <div className="saas-panel" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckSquare size={20} />
                            Project Board
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <KanbanColumn title="To Do" tasks={tasks.todo} color="#6B7280" />
                            <KanbanColumn title="Doing" tasks={tasks.doing} color="#3B82F6" />
                            <KanbanColumn title="Done" tasks={tasks.done} color="#10B981" />
                        </div>

                        {/* Add Task */}
                        {isAddingTask ? (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!newTaskTitle.trim()) return;
                                    setTasks(prev => ({
                                        ...prev,
                                        todo: [...prev.todo, { id: Date.now().toString(), title: newTaskTitle, assignee: 'You' }]
                                    }));
                                    setNewTaskTitle('');
                                    setIsAddingTask(false);
                                }}
                                style={{ marginTop: '16px' }}
                            >
                                <input
                                    autoFocus
                                    className="glass-input"
                                    placeholder="Enter task title..."
                                    value={newTaskTitle}
                                    onChange={e => setNewTaskTitle(e.target.value)}
                                    onBlur={() => !newTaskTitle && setIsAddingTask(false)}
                                    style={{ padding: '10px 16px', fontSize: '0.9rem' }}
                                />
                            </form>
                        ) : (
                            <button
                                className="btn-ghost"
                                style={{ width: '100%', marginTop: '16px', justifyContent: 'center', borderStyle: 'dashed' }}
                                onClick={() => setIsAddingTask(true)}
                            >
                                + Add Task
                            </button>
                        )}
                    </div>

                    {/* Progress Summary */}
                    <div className="saas-panel" style={{ padding: '20px', marginTop: '16px', background: 'rgba(99, 102, 241, 0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Tasks Completed
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                                    {completedTasks} / {totalTasks}
                                </div>
                            </div>
                            <div style={{ fontSize: '4rem' }}>
                                {completedTasks / totalTasks > 0.5 ? '🔥' : '💪'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Activity Feed & Vote */}
                <div>
                    {/* Activity Feed */}
                    <div className="saas-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={16} />
                            Live Activity
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {recentActivity.map((activity, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: activity.type === 'code' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {activity.type === 'code' ? <GitCommit size={14} color="var(--accent-primary)" /> : <CheckSquare size={14} color="#10B981" />}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                                            <strong>{activity.user}</strong> {activity.action}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{activity.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Code Review Simulator */}
                    <div className="saas-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MessageSquare size={16} color="#6366F1" />
                            Code Review Log
                        </h3>
                        <div style={{ marginBottom: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <p>How did the last PR feel?</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-ghost" style={{ flex: 1, fontSize: '1.2rem' }} title="Toxic/Nitpicky">😤</button>
                            <button className="btn-ghost" style={{ flex: 1, fontSize: '1.2rem' }} title="Neutral/Silent">😐</button>
                            <button className="btn-ghost" style={{ flex: 1, fontSize: '1.2rem' }} title="Constructive/Collaborative">🤝</button>
                        </div>
                    </div>

                    {/* Voting Panel */}
                    <div className="saas-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid var(--accent-primary)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                            Ready to Vote?
                        </h3>
                        {!hasVoted ? (
                            <>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                                    When time expires, you'll vote: "Pursue Partnership" or "Pass". Votes are blind - your partner won't see your choice until both vote.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <button
                                        className="btn-primary"
                                        style={{ width: '100%', justifyContent: 'center', background: '#10B981' }}
                                        onClick={() => setHasVoted(true)}
                                        disabled={timeRemaining > 0}
                                    >
                                        <ThumbsUp size={16} />
                                        Pursue Partnership
                                    </button>
                                    <button
                                        className="btn-ghost"
                                        style={{ width: '100%', justifyContent: 'center', color: '#EF4444' }}
                                        onClick={() => setHasVoted(true)}
                                        disabled={timeRemaining > 0}
                                    >
                                        <ThumbsDown size={16} />
                                        Pass
                                    </button>
                                </div>
                                {timeRemaining > 0 && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '12px', textAlign: 'center' }}>
                                        Voting unlocks when timer expires
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <CheckSquare size={48} color="#10B981" style={{ marginBottom: '16px' }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#10B981', marginBottom: '8px' }}>
                                    Vote Submitted
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    Waiting for your partner to vote...
                                </div>
                                <button
                                    className="btn-primary"
                                    style={{ marginTop: '16px', width: '100%' }}
                                    onClick={() => setShowReport(true)}
                                >
                                    View Final Report
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function KanbanColumn({ title, tasks, color }) {
    return (
        <div>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color, textTransform: 'uppercase' }}>{title}</h4>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                    {tasks.length}
                </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '200px' }}>
                {tasks.map(task => (
                    <div
                        key={task.id}
                        className="saas-panel"
                        style={{
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            cursor: 'grab',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 500 }}>
                            {task.title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                            {task.assignee}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
