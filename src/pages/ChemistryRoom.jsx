import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, MessageSquare, AlertCircle, CheckCircle2,
    ArrowRight, GitCommit, CreditCard, Play,
    Video, Mic, Monitor, Smile, ThumbsUp, ThumbsDown,
    RefreshCw, Trash2, ArrowLeft, ExternalLink, Zap, Activity, CheckSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import ChemistryReport from '../components/ChemistryReport';
import { supabase } from '../lib/supabaseClient';

export default function ChemistryRoom() {
    const { sessionId } = useParams();
    const [timeRemaining, setTimeRemaining] = useState(48 * 60 * 60); // 48 hours in seconds
    const [hasVoted, setHasVoted] = useState(false);
    const [verdict, setVerdict] = useState(null); // 'match' or 'mismatch'
    const [showReport, setShowReport] = useState(false);

    const [momentum, setMomentum] = useState(0); // 0-100, dynamic
    const [stressMode, setStressMode] = useState(false); // Pivot Protocol
    const [currentCrisis, setCurrentCrisis] = useState(null); // Active crisis details
    const [teamId, setTeamId] = useState(null); // The REAL team_id (resolved from sessionId)
    const [reviewSentiment, setReviewSentiment] = useState(50); // 0-100
    const [toast, setToast] = useState(null); // { message, type }

    // --- Real Data State ---
    const [participants, setParticipants] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [tasks, setTasks] = useState({ todo: [], doing: [], done: [] });
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const [velocityData, setVelocityData] = useState([]);

    // Countdown timer
    const [targetEndTime, setTargetEndTime] = useState(null);
    const [showTimeExpModal, setShowTimeExpModal] = useState(false); // New: Timer Expiration Modal

    // Countdown timer
    useEffect(() => {
        if (!targetEndTime) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = targetEndTime - now;
            const remaining = Math.max(0, Math.floor(distance / 1000));
            setTimeRemaining(remaining);

            if (remaining === 0 && !hasVoted && !showTimeExpModal) {
                // Double check we haven't already handled this or aren't in a post-game state
                // Only show if we haven't voted yet.
                setShowTimeExpModal(true);
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [targetEndTime, hasVoted, showTimeExpModal]);

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    // --- Init: Resolve Session to Team ---
    useEffect(() => {
        const initSession = async () => {
            if (!sessionId) return;

            // 0. Try Local Cache First (Instant Load)
            const cachedTeamId = localStorage.getItem(`chemistry_team_${sessionId}`);
            if (cachedTeamId) {
                setTeamId(cachedTeamId);
            }

            // 1. Check if a linked team already exists
            const { data: existingTeam } = await supabase
                .from('teams')
                .select('*')
                .eq('description', `Chemistry-Session:${sessionId}`) // Search by base description (or partial if we used contains? No, exact match usually needed unless we change query)
                // Actually, if we append |EXTENDED, exact match fails. We need to handle that.
                // Or better: use 'like' or check logic.
                // Let's refine the query to use 'like' or 'ilike' to catch appended flags.
                .ilike('description', `Chemistry-Session:${sessionId}%`)
                .maybeSingle();

            // Get current user first
            const { data: { user } } = await supabase.auth.getUser();

            if (existingTeam) {
                // Ensure membership exists for existing team
                if (user) {
                    const { data: member } = await supabase.from('team_members').select('id').eq('team_id', existingTeam.id).eq('user_id', user.id).single();
                    if (!member) {
                        await supabase.from('team_members').insert([{
                            team_id: existingTeam.id,
                            user_id: user.id,
                            role: 'Evaluator'
                        }]);
                    }
                }
                setTeamId(existingTeam.id);
                localStorage.setItem(`chemistry_team_${sessionId}`, existingTeam.id);

                if (existingTeam.created_at) {
                    const createdAt = new Date(existingTeam.created_at).getTime();
                    let duration = 48 * 60 * 60 * 1000;

                    // Check for Extension
                    if (existingTeam.description && existingTeam.description.includes('|EXTENDED')) {
                        duration += 24 * 60 * 60 * 1000; // Add 24 hours
                    }

                    setTargetEndTime(createdAt + duration);
                }
            } else {
                // 2. Create it if not
                // First get candidate name
                const { data: candidate } = await supabase
                    .from('pipeline_items')
                    .select('name')
                    .eq('id', sessionId)
                    .single();

                const candidateName = candidate ? candidate.name : 'Unknown Candidate';
                const { data: newTeam, error } = await supabase
                    .from('teams')
                    .insert([{
                        name: `Chemistry: ${candidateName}`,
                        description: `Chemistry-Session:${sessionId}`
                    }])
                    .select()
                    .single();

                if (newTeam) {
                    // Add member FIRST before setting ID to trigger fetches
                    if (user) {
                        await supabase.from('team_members').insert([{
                            team_id: newTeam.id,
                            user_id: user.id,
                            role: 'Evaluator'
                        }]);
                    }
                    setTeamId(newTeam.id);
                    localStorage.setItem(`chemistry_team_${sessionId}`, newTeam.id);

                    if (newTeam.created_at) {
                        const createdAt = new Date(newTeam.created_at).getTime();
                        setTargetEndTime(createdAt + 48 * 60 * 60 * 1000);
                    }
                } else if (error) {
                    console.error("Failed to create session team:", error);
                    alert(`Error initializing session: ${error.message}`);
                }
            }
        };

        if (sessionId) {
            initSession().catch(e => alert(`Init failed: ${e.message}`));
        }
    }, [sessionId]);

    const handleExtendTime = async () => {
        try {
            if (!teamId) return;

            // 1. Fetch current description to append safely
            const { data: team } = await supabase.from('teams').select('description, created_at').eq('id', teamId).single();

            if (team && !team.description.includes('|EXTENDED')) {
                const newDesc = team.description + '|EXTENDED';
                const { error } = await supabase.from('teams').update({ description: newDesc }).eq('id', teamId);

                if (error) throw error;

                // Update local state immediately
                const createdAt = new Date(team.created_at).getTime();
                setTargetEndTime(createdAt + (48 + 24) * 60 * 60 * 1000); // 72 hours total
                setShowTimeExpModal(false);
                setToast({ message: "Time Extended (+24h)", icon: "⏳" });
            } else {
                // Already extended
                setShowTimeExpModal(false);
            }
        } catch (err) {
            console.error("Error extending time:", err);
            alert("Failed to extend time.");
        }
    };

    // Fetch Data from Supabase (Dependent on teamId)
    useEffect(() => {
        const fetchData = async () => {
            if (!teamId) return; // Wait for team resolution

            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            // 1. Fetch Participants
            const { data: membersData } = await supabase
                .from('team_members')
                .select(`
                    user_id,
                    role,
                    profile:profiles!user_id(full_name, avatar_url)
                `)
                .eq('team_id', teamId);

            if (membersData) {
                setParticipants(membersData.map(m => ({
                    userId: m.user_id,
                    name: m.user_id === user?.id ? 'You' : (m.profile?.full_name || 'Member'),
                    avatar: '👤', // Placeholder or from profile
                    lastActive: 'Online', // Placeholder
                    isOnline: true,
                    role: m.role
                })));
            }

            // 2. Fetch Tasks to calculate Momentum
            const { data: tasksData } = await supabase
                .from('tasks')
                .select('*')
                .eq('team_id', teamId);

            if (tasksData) {
                const todo = tasksData.filter(t => t.status === 'todo');
                const doing = tasksData.filter(t => t.status === 'progress');
                const done = tasksData.filter(t => t.status === 'shipped' || t.status === 'done');
                setTasks({ todo, doing, done });

                // Calculate Momentum based on tasks
                const total = tasksData.length;
                if (total > 0) {
                    setMomentum(Math.round((done.length / total) * 100));
                } else {
                    setMomentum(0);
                }
            }

            // 3. Fetch Activity
            const { data: activityData } = await supabase
                .from('activity_logs')
                .select(`*, user:user_id(full_name)`) // Note: user_id links to auth.users, need profile join
                .eq('team_id', teamId)
                .order('created_at', { ascending: false })
                .limit(5);

            // Since we can't join auth.users easily in client, we might rely on a 'user_name' if we stored it, or profile join if setup
            // For now, simpler map:
            if (activityData) {
                // We might need to fetch profile names separately if not joined, but let's assume we can map roughly
                const formattedActivity = await Promise.all(activityData.map(async (act) => {
                    let userName = 'User';
                    if (act.user_id === user?.id) userName = 'You';
                    // For others, we could fetch profile, but for MVP let's see if we have it in members map
                    // Optimization: Use membersData

                    return {
                        user: userName, // simplified for now
                        action: act.description, // using description as action
                        time: new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        type: act.action_type === 'code' ? 'code' : (act.action_type === 'review_sentiment' ? 'review' : 'task')
                    };
                }));
                setRecentActivity(formattedActivity);
            }

            // 4. Calculate Velocity based on Activity Logs (Commits/Tasks per Time Bucket)
            // Simplified: Group activity by day/hour (mocking bucket for visualization)
            // In a real app, query aggregation would happen on backend
            if (activityData) {
                setVelocityData([
                    { time: 'Start', deploys: 0, leadTime: 5 },
                    { time: 'Now', deploys: activityData.length, leadTime: Math.max(1, 5 - activityData.length) } // Mock trend based on volume
                ]);
            } else {
                setVelocityData([
                    { time: 'Start', deploys: 0, leadTime: 5 },
                    { time: 'Now', deploys: 0, leadTime: 5 }
                ]);
            }

            setLoading(false);
        };

        fetchData(); // Expose for refresh
        const interval = setInterval(fetchData, 10000); // Polling for updates
        return () => clearInterval(interval);
    }, [teamId]);

    // State for Challenge Selection
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isSetupOpen, setIsSetupOpen] = useState(false); // Start closed, will open if needed
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [draggedTask, setDraggedTask] = useState(null); // DnD State
    const [editingTask, setEditingTask] = useState(null); // Task being edited

    // Immediate Momentum Update
    useEffect(() => {
        const total = tasks.todo.length + tasks.doing.length + tasks.done.length;
        if (total > 0) {
            setMomentum(Math.round((tasks.done.length / total) * 100));
        } else {
            setMomentum(0);
        }
    }, [tasks]);

    // Auto-detect challenge if tasks already exist (user is returning to an existing session)
    useEffect(() => {
        if (loading || !teamId) return; // Wait for data to load

        const totalTasks = tasks.todo.length + tasks.doing.length + tasks.done.length;

        if (!activeChallenge && totalTasks > 0) {
            // Existing session - detect challenge from tasks
            const allTasks = [...tasks.todo, ...tasks.doing, ...tasks.done];
            const taskTitles = allTasks.map(t => t.title.toLowerCase());

            if (taskTitles.some(title => title.includes('stripe') || title.includes('checkout'))) {
                setActiveChallenge(CHALLENGES.stripe);
                setIsSetupOpen(false);
            } else if (taskTitles.some(title => title.includes('pokemon') || title.includes('sdk') || title.includes('pokeapi'))) {
                setActiveChallenge(CHALLENGES.api_race);
                setIsSetupOpen(false);
            }
        } else if (!activeChallenge && totalTasks === 0 && !loading) {
            // New session - show challenge selection explicitly
            setIsSetupOpen(true);
        }
    }, [tasks, activeChallenge, loading, teamId]);

    // Initial Tasks based on Challenge


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

    const handleStartChallenge = async (challengeKey) => {
        setActiveChallenge(CHALLENGES[challengeKey]);
        setIsSetupOpen(false);

        if (!teamId) return;

        // Batch Insert Challenge Tasks
        const tasksToInsert = CHALLENGES[challengeKey].tasks.map(t => ({
            team_id: teamId,
            title: t.title,
            status: 'todo',
            type: 'General',
            assignee_id: currentUser?.id
        }));

        try {
            await supabase.from('tasks').insert(tasksToInsert);
            // Refresh will happen via polling or could trigger manually
        } catch (error) {
            console.error("Error creating challenge tasks:", error);
        }
    };

    const CRISIS_SCENARIOS = [
        { title: "OpenAI API Deprecated", desc: "The model you built on just broke. You have 4 hours to swap providers.", type: "Crisis" },
        { title: "Competitor Feature Drop", desc: "A competitor just launched your core feature. Pivot to a niche NOW.", type: "Crisis" },
        { title: "Security Breach", desc: "User data leak detected. Drop everything and patch the auth flow.", type: "Crisis" },
        { title: "Payment Processor Ban", desc: "Stripe suspended the account. Switch to LemonSqueezy immediately.", type: "Crisis" }
    ];

    const handleTriggerStress = async () => {
        const scenario = CRISIS_SCENARIOS[Math.floor(Math.random() * CRISIS_SCENARIOS.length)];
        setStressMode(true);
        setCurrentCrisis(scenario);

        try {
            // 1. Insert Crisis Task
            const { data: task, error } = await supabase.from('tasks').insert([{
                team_id: teamId,
                title: `[URGENT] ${scenario.title}`,
                status: 'todo',
                type: 'Crisis',
                assignee_id: currentUser?.id
            }]).select().single();

            if (task) {
                setTasks(prev => ({ ...prev, todo: [task, ...prev.todo] })); // Prepend to top
            }

            // 2. Log Activity
            await supabase.from('activity_logs').insert([{
                team_id: teamId,
                user_id: currentUser?.id,
                action_type: 'task_created',
                description: `TRIGGERED CRISIS: ${scenario.title}`
            }]);

            setToast({ message: "CRISIS MODE ACTIVATED", icon: "🚨", isError: true });

        } catch (error) {
            console.error("Error triggering stress:", error);
        }
    };

    const handleResolveCrisis = () => {
        setStressMode(false);
        setCurrentCrisis(null);
        setToast({ message: "Crisis Resolved", icon: "✅" });
    };

    const handleTaskClick = (task) => {
        setEditingTask(task);
    };

    const handleUpdateTaskDetails = async (taskId, updates) => {
        // Optimistic Update
        setTasks(prev => {
            const newTasks = { ...prev };
            // Find task and update it
            ['todo', 'doing', 'done'].forEach(status => {
                newTasks[status] = newTasks[status].map(t =>
                    t.id === taskId ? { ...t, ...updates } : t
                );
            });
            return newTasks;
        });
        setEditingTask(null);

        try {
            const { error } = await supabase.from('tasks').update(updates).eq('id', taskId);
            if (error) throw error;
            setToast({ message: "Task Updated", icon: "✏️" });
            setTimeout(() => setToast(null), 3000);
        } catch (error) {
            console.error("Error updating task:", error);
            setToast({ message: "Update failed", icon: "⚠️", isError: true });
        }
    };

    const handleTaskMove = async (task) => {
        // Function kept for other uses if needed, but click now opens modal
        // Manual move (click)
        let newStatus = 'todo';
        if (task.status === 'todo') newStatus = 'progress';
        else if (task.status === 'progress') newStatus = 'done';
        else return;

        await updateTaskStatus(task, newStatus);
    };

    const handleDeleteTask = async (taskId) => {
        // Optimistic Delete
        setTasks(prev => ({
            todo: prev.todo.filter(t => t.id !== taskId),
            doing: prev.doing.filter(t => t.id !== taskId),
            done: prev.done.filter(t => t.id !== taskId)
        }));

        try {
            await supabase.from('tasks').delete().eq('id', taskId);
            setToast({ message: "Task Deleted", icon: "🗑️" });
            setTimeout(() => setToast(null), 3000);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleDragStart = (task) => {
        setDraggedTask(task);
    };

    const handleDrop = async (status) => {
        if (!draggedTask) return;
        if (draggedTask.status === status) {
            setDraggedTask(null);
            return;
        }

        // Map UI status to DB status
        let dbStatus = status;
        if (status === 'doing') dbStatus = 'progress';
        if (status === 'done') dbStatus = 'shipped'; // or 'done' depending on schema, let's keep consistent with existing logic

        // Optimistic UI update maps 'doing' -> 'progress' state? 
        // Wait, the state keys are 'todo', 'doing', 'done'. 
        // The task objects have .status of 'todo', 'progress', 'shipped'/'done'. 
        // Let's standardize: The valid state keys are todo, doing, done.
        // Valid DB statuses are todo, progress, shipped/done.

        // Let's use the updateTaskStatus helper I'll create to DRY this up
        // Need to map status (column key) to DB status
        let targetDbStatus = 'todo';
        if (status === 'doing') targetDbStatus = 'progress';
        if (status === 'done') targetDbStatus = 'shipped';

        await updateTaskStatus(draggedTask, targetDbStatus);
        setDraggedTask(null);
    };

    const updateTaskStatus = async (task, newDbStatus) => {
        // Optimistic Update helper
        // Calculate new column key
        let newCol = 'todo';
        if (newDbStatus === 'progress') newCol = 'doing';
        if (newDbStatus === 'shipped' || newDbStatus === 'done') newCol = 'done';

        // Calculate old column key
        let oldCol = 'todo';
        if (task.status === 'progress') oldCol = 'doing';
        if (task.status === 'shipped' || task.status === 'done') oldCol = 'done';

        const updatedTask = { ...task, status: newDbStatus };

        setTasks(prev => {
            const newTasks = { ...prev };
            newTasks[oldCol] = newTasks[oldCol].filter(t => t.id !== task.id);
            newTasks[newCol] = [...newTasks[newCol], updatedTask];
            return newTasks;
        });

        // Auto-Resolve Crisis if moving to Done
        if (task.type === 'Crisis' && newCol === 'done') {
            handleResolveCrisis();
        }

        try {
            await supabase.from('tasks').update({ status: newDbStatus }).eq('id', task.id);
            // Log Activity
            if (teamId) {
                await supabase.from('activity_logs').insert([{
                    team_id: teamId,
                    user_id: currentUser?.id,
                    action_type: 'task_update',
                    description: `Moved "${task.title}" to ${newCol}`
                }]);
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleAddTask = async (e) => {
        if (e) e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id || currentUser?.id;

            if (!teamId) throw new Error("Team not initialized for this session");

            const { data, error } = await supabase.from('tasks').insert([{
                team_id: teamId,
                title: newTaskTitle,
                status: 'todo',
                type: 'General',
                assignee_id: userId
            }]).select().single();

            if (error) throw error;

            if (data) {
                setTasks(prev => ({ ...prev, todo: [...prev.todo, data] }));
                setNewTaskTitle('');
                setIsAddingTask(false);

                // Log Activity
                await supabase.from('activity_logs').insert([{
                    team_id: teamId,
                    user_id: userId,
                    action_type: 'task_created',
                    description: `Added task "${newTaskTitle}"`
                }]);
            }

        } catch (error) {
            console.error("Error adding task:", error);
            alert(`Failed to add task: ${error.message}`);
        }
    };

    const handleReviewLog = async (sentiment, emoji) => {
        try {
            if (!teamId) {
                alert("Please wait for the session team to load.");
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            const { error } = await supabase.from('activity_logs').insert([{
                team_id: teamId,
                user_id: user?.id,
                action_type: 'review_sentiment', // Ensure this value is allowed in DB check constraints
                description: `Code Review Feedback: ${emoji} (${sentiment})`
            }]);

            if (error) {
                console.error("Database error:", error);
                throw error;
            }

            // Optimistic Update
            setRecentActivity(prev => [{
                user: 'You',
                action: `Code Review Feedback: ${emoji} (${sentiment})`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'review'
            }, ...prev.slice(0, 4)]);

            // Trigger Toast
            setToast({ message: `Feedback Recorded: ${sentiment}`, icon: emoji });
            setTimeout(() => setToast(null), 3000);

        } catch (error) {
            console.error("Error logging review:", error);
            setToast({ message: "Failed to log", icon: '⚠️', isError: true });
            setTimeout(() => setToast(null), 3000);
        }
    };


    const totalTasks = Object.values(tasks).flat().length;
    const completedTasks = tasks.done.length;

    if (showReport) {
        return <ChemistryReport challenge={activeChallenge} verdict={verdict} />;
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
                            background: 'rgba(5, 5, 10, 0.8)', backdropFilter: 'blur(16px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="saas-panel"
                            style={{
                                maxWidth: '900px', width: '90%', padding: '60px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                background: 'linear-gradient(145deg, rgba(20,20,25,0.9), rgba(10,10,15,0.95))'
                            }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '6px 12px', borderRadius: '20px',
                                    background: 'rgba(99, 102, 241, 0.1)', color: '#818CF8',
                                    fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px'
                                }}>
                                    <Zap size={14} /> CHEMISTRY CHECK
                                </div>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Select Your Challenge
                                </h2>
                                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                                    Choose a standardized calibration test to benchmark your partnership velocity and communication style.
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                <button
                                    className="saas-panel group"
                                    onClick={() => handleStartChallenge('stripe')}
                                    style={{
                                        padding: '32px', textAlign: 'left', cursor: 'pointer',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        background: 'rgba(255,255,255,0.02)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = '#635BFF';
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(99, 91, 255, 0.15)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99, 91, 255, 0.1)', color: '#635BFF' }}>
                                            <Zap size={32} />
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Stack</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>The Stripe Integration</h3>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                                        Build a subscription checkout flow. Tests speed, documentation reading, and webhook handling.
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#635BFF', fontWeight: 600 }}>
                                        Start Challenge <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                                    </div>
                                </button>
                                <button
                                    className="saas-panel group"
                                    onClick={() => handleStartChallenge('api_race')}
                                    style={{
                                        padding: '32px', textAlign: 'left', cursor: 'pointer',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        background: 'rgba(255,255,255,0.02)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = '#F59E0B';
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(245, 158, 11, 0.15)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                                            <GitCommit size={32} />
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Backend</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>The API Wrapper Race</h3>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                                        Build a typed SDK. Tests architecture, typing discipline, and testing culture.
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#F59E0B', fontWeight: 600 }}>
                                        Start Challenge <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Link to="/teams" className="btn-ghost" style={{ padding: '8px 16px', display: 'inline-flex', gap: '8px' }}>
                        <ArrowLeft size={16} />
                        Exit Room
                    </Link>
                    {/* Link to War Room */}
                    {teamId && (
                        <Link to={`/session/${teamId}`} className="btn-secondary" style={{ padding: '8px 16px', display: 'inline-flex', gap: '8px', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}>
                            <ExternalLink size={16} />
                            Enter War Room
                        </Link>
                    )}
                </div>

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
                        <div style={{ height: '100px', marginBottom: '12px', minWidth: '100px' }}>
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
                    <div className="saas-panel" style={{ padding: '24px', marginTop: '24px', border: stressMode ? '1px solid #EF4444' : '1px solid transparent', background: stressMode ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.02)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: stressMode ? '#EF4444' : 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {stressMode ? <AlertCircle size={16} /> : <RefreshCw size={16} />}
                            {stressMode ? 'CRISIS MODE ACTIVE' : 'Pivot Protocol'}
                        </h3>

                        {!stressMode ? (
                            <button
                                className="btn-ghost"
                                style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'center', border: '1px dashed #EF4444', color: '#EF4444' }}
                                onClick={handleTriggerStress}
                            >
                                Trigger Random Stress Test
                            </button>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                                    <p style={{ fontSize: '0.9rem', color: '#EF4444', fontWeight: 700 }}>
                                        Scenario: "{currentCrisis?.title}"
                                    </p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        {currentCrisis?.desc}
                                    </p>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '12px', fontStyle: 'italic' }}>
                                    * A high-priority task has been added to your board.
                                </div>
                                <button
                                    className="btn-primary"
                                    style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'center', background: '#EF4444' }}
                                    onClick={handleResolveCrisis}
                                >
                                    Mark Crisis Resolved
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
                            <KanbanColumn
                                id="todo"
                                title="To Do"
                                tasks={tasks.todo}
                                color="#6B7280"
                                onTaskClick={handleTaskClick}
                                onDragStart={handleDragStart}
                                onDrop={handleDrop}
                                onDelete={handleDeleteTask}
                            />
                            <KanbanColumn
                                id="doing"
                                title="Doing"
                                tasks={tasks.doing}
                                color="#3B82F6"
                                onTaskClick={handleTaskClick}
                                onDragStart={handleDragStart}
                                onDrop={handleDrop}
                                onDelete={handleDeleteTask}
                            />
                            <KanbanColumn
                                id="done"
                                title="Done"
                                tasks={tasks.done}
                                color="#10B981"
                                onTaskClick={handleTaskClick}
                                onDragStart={handleDragStart}
                                onDrop={handleDrop}
                                onDelete={handleDeleteTask}
                            />
                        </div>

                        {/* Add Task */}
                        {isAddingTask ? (
                            <form
                                onSubmit={handleAddTask}
                                style={{ marginTop: '16px' }}
                            >
                                <input
                                    autoFocus
                                    className="glass-input"
                                    placeholder="Enter task title..."
                                    value={newTaskTitle}
                                    onChange={e => setNewTaskTitle(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault(); // Prevent default form submission if any
                                            handleAddTask(e);
                                        }
                                    }}
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
                                        background: activity.type === 'code' ? 'rgba(99, 102, 241, 0.1)' : (activity.type === 'review' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(16, 185, 129, 0.1)'),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {activity.type === 'code' ? <GitCommit size={14} color="var(--accent-primary)" /> : (activity.type === 'review' ? <MessageSquare size={14} color="#EC4899" /> : <CheckSquare size={14} color="#10B981" />)}
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
                        <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <p>Rate the vibe of the last interaction:</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            {[
                                { id: 'Toxic', icon: '😤', label: 'Toxic', color: '#EF4444' },
                                { id: 'Neutral', icon: '😐', label: 'Neutral', color: 'var(--text-tertiary)' },
                                { id: 'Constructive', icon: '🤝', label: 'Helpful', color: '#10B981' }
                            ].map((btn) => (
                                <button
                                    key={btn.id}
                                    className="saas-panel hover-glass"
                                    style={{
                                        padding: '12px', cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                        border: '1px solid rgba(255,255,255,0.05)', background: 'transparent'
                                    }}
                                    onClick={() => handleReviewLog(btn.id, btn.icon)}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>{btn.icon}</span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: btn.color }}>{btn.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toast Notification */}
                    <AnimatePresence>
                        {toast && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                                style={{
                                    position: 'fixed', bottom: '32px', right: '32px',
                                    background: toast.isError ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '12px 24px', borderRadius: '12px',
                                    color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px',
                                    fontSize: '0.9rem', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 200
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{toast.icon}</span>
                                {toast.message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Task Edit Modal */}
                    <AnimatePresence>
                        {editingTask && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'fixed', inset: 0, zIndex: 150,
                                    background: 'rgba(5, 5, 10, 0.6)', backdropFilter: 'blur(5px)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                                onClick={() => setEditingTask(null)}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    onClick={e => e.stopPropagation()}
                                    className="saas-panel"
                                    style={{ width: '400px', padding: '24px', border: '1px solid var(--border-subtle)', background: '#1c1c24' }}
                                >
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Edit Task</h3>

                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Task Title</label>
                                        <input
                                            className="glass-input"
                                            defaultValue={editingTask.title}
                                            id="edit-task-title"
                                            style={{ width: '100%', padding: '10px' }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Assignee</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            {participants.map(p => (
                                                <button
                                                    key={p.userId}
                                                    type="button" // Prevent form submit if wrapped
                                                    className="saas-panel"
                                                    style={{
                                                        padding: '10px',
                                                        borderColor: editingTask.assignee_id === p.userId ? 'var(--accent-primary)' : 'transparent',
                                                        background: editingTask.assignee_id === p.userId ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                                                        textAlign: 'left',
                                                        display: 'flex', alignItems: 'center', gap: '8px'
                                                    }}
                                                    onClick={() => setEditingTask({ ...editingTask, assignee_id: p.userId })} // Update local temp state
                                                >
                                                    <span>{p.avatar}</span>
                                                    <span style={{ fontSize: '0.85rem' }}>{p.name}</span>
                                                </button>
                                            ))}
                                            {/* Unassign option */}
                                            <button
                                                type="button"
                                                className="saas-panel"
                                                style={{ padding: '10px', textAlign: 'center', color: 'var(--text-tertiary)' }}
                                                onClick={() => setEditingTask({ ...editingTask, assignee_id: null })}
                                            >
                                                Unassigned
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            className="btn-primary"
                                            style={{ flex: 1, justifyContent: 'center' }}
                                            onClick={() => {
                                                const newTitle = document.getElementById('edit-task-title').value;
                                                handleUpdateTaskDetails(editingTask.id, {
                                                    title: newTitle,
                                                    assignee_id: editingTask.assignee_id
                                                });
                                            }}
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            className="btn-ghost"
                                            style={{ flex: 1, justifyContent: 'center', color: '#EF4444' }}
                                            onClick={() => {
                                                if (confirm("Delete this task?")) {
                                                    handleDeleteTask(editingTask.id);
                                                    setEditingTask(null);
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
                                        style={{
                                            width: '100%',
                                            justifyContent: 'center',
                                            background: '#10B981',
                                            opacity: timeRemaining > 0 ? 0.5 : 1,
                                            cursor: timeRemaining > 0 ? 'not-allowed' : 'pointer'
                                        }}
                                        onClick={() => { setHasVoted(true); setVerdict('match'); }}
                                        disabled={timeRemaining > 0}
                                    >
                                        <ThumbsUp size={16} />
                                        We Co-Vibe ⚡
                                    </button>
                                    <button
                                        className="btn-ghost"
                                        style={{
                                            width: '100%',
                                            justifyContent: 'center',
                                            color: '#EF4444',
                                            opacity: timeRemaining > 0 ? 0.5 : 1,
                                            cursor: timeRemaining > 0 ? 'not-allowed' : 'pointer'
                                        }}
                                        onClick={() => { setHasVoted(true); setVerdict('mismatch'); }}
                                        disabled={timeRemaining > 0}
                                    >
                                        <ThumbsDown size={16} />
                                        No Resonance 📉
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

            {/* Time's Up Modal */}
            <AnimatePresence>
                {showTimeExpModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 999, // Highest z-index
                            background: 'rgba(5, 5, 10, 0.9)', backdropFilter: 'blur(10px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="saas-panel"
                            style={{
                                maxWidth: '600px', width: '90%', padding: '40px',
                                border: '1px solid var(--accent-primary)',
                                boxShadow: '0 0 50px rgba(99, 102, 241, 0.2)',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>⏰</div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px', color: 'white' }}>
                                Time's Up!
                            </h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
                                The 48-hour pressure cooker has finished. <br />
                                Did you ship something you're proud of?
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <button
                                    className="saas-panel hover-glass"
                                    onClick={handleExtendTime}
                                    style={{
                                        padding: '24px', cursor: 'pointer',
                                        border: '1px dashed var(--text-tertiary)',
                                        background: 'transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⏳</div>
                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Extend (+24h)</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>We need more time to polish.</div>
                                </button>

                                <button
                                    className="btn-primary"
                                    onClick={() => setShowTimeExpModal(false)}
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        padding: '24px', cursor: 'pointer',
                                        background: 'var(--accent-primary)', border: 'none'
                                    }}
                                >
                                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🗳️</div>
                                    <div style={{ fontWeight: 700, color: 'white', marginBottom: '4px' }}>Vote on Resonance</div>
                                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>We're ready to decide.</div>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function KanbanColumn({ id, title, tasks, color, onTaskClick, onDragStart, onDrop, onDelete }) {
    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.background = 'transparent';
                onDrop(id);
            }}
            onDragLeave={(e) => e.currentTarget.style.background = 'transparent'}
            style={{ borderRadius: '12px', transition: 'background 0.2s' }}
        >
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
                        draggable
                        onDragStart={() => onDragStart(task)}
                        onClick={() => onTaskClick && onTaskClick(task)}
                        className="saas-panel group" // Using group class for hover effects if Tailwind, else custom style
                        style={{
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            cursor: 'grab',
                            transition: 'all 0.2s',
                            border: '1px solid transparent',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.borderColor = color;
                            // Show delete button
                            const delBtn = e.currentTarget.querySelector('.delete-btn');
                            if (delBtn) delBtn.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.borderColor = 'transparent';
                            // Hide delete button
                            const delBtn = e.currentTarget.querySelector('.delete-btn');
                            if (delBtn) delBtn.style.opacity = '0';
                        }}
                    >
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 500, paddingRight: '20px' }}>
                            {task.title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                            {task.assignee?.name || 'Assigned'}
                        </div>

                        {/* Delete Button */}
                        <div
                            className="delete-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Delete task?')) onDelete(task.id);
                            }}
                            style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                opacity: 0,
                                cursor: 'pointer',
                                color: '#EF4444',
                                transition: 'opacity 0.2s',
                                padding: '4px'
                            }}
                        >
                            <Trash2 size={14} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
