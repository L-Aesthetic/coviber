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
import { supabase } from '../lib/supabaseClient';

export default function LiveSession() {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tasks');
    const [projectName, setProjectName] = useState('Loading...');
    const [targetEndTime, setTargetEndTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(48 * 3600);
    const [vibeScore, setVibeScore] = useState(85);
    const [sessionId, setSessionId] = useState(null); // Derived from description
    const [isPaused, setIsPaused] = useState(false);
    const [sprintStartTime, setSprintStartTime] = useState(null); // Explicit start time


    // Button Handlers
    const confirmExtension = async () => {
        try {
            const { data: team } = await supabase.from('teams').select('description, created_at').eq('id', teamId).single();
            if (team) {
                // If not extended yet, add 24h to the deadline (or rather, note it)
                // New logic: Just append |EXTENDED to description if not there
                if (!team.description.includes('|EXTENDED')) {
                    const newDesc = team.description + '|EXTENDED';
                    const { error } = await supabase.from('teams').update({ description: newDesc }).eq('id', teamId);
                    if (error) throw error;
                    // Optimistic update handled by subscription or re-fetch
                    setShowExtensionModal(false);
                    // trigger refresh
                    // fetchData(); // defined inside effect, can't call easily. 
                    // Subscription will pick it up
                } else {
                    alert("Session already extended.");
                    setShowExtensionModal(false);
                }
            }
        } catch (e) {
            console.error(e);
            alert("Error extending time");
        }
    };

    const handleStartSprint = async () => {
        try {
            // Set START time to now. Remove any PAUSE or OLD start tags?
            // Strategy: Append |START:<timestamp>
            // Ideally we clean up old tags, but appending works if we parse last one.
            // Better: Replace existing START tag or append if properly delimited.

            const now = Date.now();
            const { data: team } = await supabase.from('teams').select('description').eq('id', teamId).single();
            if (!team) return;

            // Simple append for MVP, or regex replace
            // Let's assume description is "Title|Key:Val|..."
            // We'll just append |START:now

            let newDesc = team.description;
            // Remove previous START/PAUSE/EXTENDED to reset fully?
            // "Active Sprint" implies we might want to keep history? 
            // The user wants to "fix" stuck 00:00:00, so likely a full reset of the timer context.

            // Remove old tags to be clean
            newDesc = newDesc.replace(/\|START:\d+/g, '').replace(/\|PAUSE:\d+/g, '').replace(/\|EXTENDED/g, '');
            newDesc += `|START:${now}`;

            await supabase.from('teams').update({ description: newDesc }).eq('id', teamId);
        } catch (e) { console.error(e); }
    };

    const togglePause = async () => {
        try {
            const now = Date.now();
            const { data: team } = await supabase.from('teams').select('description').eq('id', teamId).single();
            if (!team) return;

            let newDesc = team.description;

            if (isPaused) {
                // RESUME: Remove PAUSE tag, and adjust START time so that "used time" creates same specific deadline?
                // Actually easier: Store "PAUSED_AT" and "ACCUMULATED_PAUSE".
                // MVP Way: 
                // If paused, we need to shift the START time forward by (Now - PauseTime).
                // So EffectiveStart = OldStart + (Now - PauseTime).
                // We find |PAUSE:timestamp
                const pauseMatch = newDesc.match(/\|PAUSE:(\d+)/);
                if (pauseMatch) {
                    const pauseTime = parseInt(pauseMatch[1]);
                    const pausedDuration = now - pauseTime;

                    // Find Start
                    const startMatch = newDesc.match(/\|START:(\d+)/);
                    if (startMatch) {
                        const oldStart = parseInt(startMatch[1]);
                        const newStart = oldStart + pausedDuration;
                        newDesc = newDesc.replace(`|START:${oldStart}`, `|START:${newStart}`);
                    }
                    // Remove Pause
                    newDesc = newDesc.replace(/\|PAUSE:\d+/g, '');
                }
            } else {
                // PAUSE: Add |PAUSE:now
                newDesc += `|PAUSE:${now}`;
            }

            await supabase.from('teams').update({ description: newDesc }).eq('id', teamId);
        } catch (e) { console.error(e); }
    };

    const handleEndSession = () => {
        setShowRedirectModal(true);
        // Delay navigation slightly to show the polished modal
        setTimeout(() => {
            if (sessionId) {
                navigate(`/chemistry/${sessionId}`);
            } else {
                // Determine if we should navigate anyway or stay
                console.error("No Session ID found");
                // For now, redirect to dashboard if no session found? 
                // Or navigate to chemistry check with teamId? 
                // Let's assume we navigate to /chemistry/undefined if we must? No. 
                navigate('/dashboard');
            }
        }, 1500);

    };

    // --- Timer Logic ---
    useEffect(() => {
        if (isPaused) return;
        if (!targetEndTime && !sprintStartTime) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            // If we have a specific target end time calculated from logic
            if (targetEndTime) {
                const distance = targetEndTime - now;
                setTimeLeft(Math.max(0, Math.floor(distance / 1000)));
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [targetEndTime, sprintStartTime, isPaused]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // --- Real Data State ---
    const [members, setMembers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);

    // Add Task State
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // Shared Notes State
    const [notes, setNotes] = useState('');
    const [notesId, setNotesId] = useState(null);
    const [isSavingNotes, setIsSavingNotes] = useState(false);

    // Chat State
    const [chatMessage, setChatMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Modal States for Polish
    const [showExtensionModal, setShowExtensionModal] = useState(false);
    const [showRedirectModal, setShowRedirectModal] = useState(false);

    // Call Room State
    const [isCallActive, setIsCallActive] = useState(false);

    const handleSendMessage = async () => {
        if (!chatMessage.trim()) return;
        setIsSending(true);
        try {
            await supabase.from('activity_logs').insert([{
                team_id: teamId,
                user_id: (await supabase.auth.getUser()).data.user?.id,
                action_type: 'chat',
                description: chatMessage
            }]);
            setChatMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    // Credentials State
    const [credentials, setCredentials] = useState([]);
    const [isAddingCredential, setIsAddingCredential] = useState(false);
    const [newCredTitle, setNewCredTitle] = useState('');
    const [newCredValue, setNewCredValue] = useState('');

    // Debounced Save for Notes (Simple Async)
    const updateNotes = async (newContent) => {
        setNotes(newContent);
        setIsSavingNotes(true);
        // In a real app we would use useDebounce, but here we just upsert async
        const { data } = await supabase
            .from('shared_notes')
            .upsert({
                ...(notesId ? { id: notesId } : {}),
                team_id: teamId,
                content: newContent,
                last_updated_by: (await supabase.auth.getUser()).data.user?.id
            })
            .select()
            .single();

        if (data) setNotesId(data.id);
        setIsSavingNotes(false);
    };

    // --- Supabase Subscription ---
    useEffect(() => {
        // 1. Initial Fetch
        const fetchData = async () => {
            setLoading(true);
            const { data: tasksData } = await supabase
                .from('tasks')
                .select(`*, assignee:assignee_id(name)`) // Join to get name
                .eq('team_id', teamId);

            const { data: teamData } = await supabase
                .from('teams')
                .select('*')
                .eq('id', teamId)
                .single();

            if (teamData) {
                setProjectName(teamData.project_name || 'Chemistry Session');

                // Parse Description for Metadata
                const desc = teamData.description || '';

                // Check if Paused
                const pauseMatch = desc.match(/\|PAUSE:(\d+)/);
                const isSystemPaused = !!pauseMatch;
                setIsPaused(isSystemPaused);

                // Determine Start Time
                // Priority: START tag > created_at
                const startMatch = desc.match(/\|START:(\d+)/);
                let startTime = teamData.created_at ? new Date(teamData.created_at).getTime() : Date.now();

                if (startMatch) {
                    startTime = parseInt(startMatch[1]);
                    setSprintStartTime(startTime);
                }

                // Determine Duration
                let duration = 48 * 3600 * 1000;
                if (desc.includes('|EXTENDED')) duration += 24 * 3600 * 1000;

                // Calculate Target End
                const target = startTime + duration;
                setTargetEndTime(target);

                // If paused, we technically don't countdown, so timeLeft should be fixed at (Target - PauseTime)
                if (isSystemPaused) {
                    const pauseTime = parseInt(pauseMatch[1]);
                    const frozenDistance = target - pauseTime;
                    setTimeLeft(Math.max(0, Math.floor(frozenDistance / 1000)));
                } else {
                    // Timer effect will handle live update, but set initial here to avoid flash
                    const now = Date.now();
                    setTimeLeft(Math.max(0, Math.floor((target - now) / 1000)));
                }

                // Extract SessionId
                if (teamData?.description?.startsWith('Chemistry-Session:')) {
                    const sid = teamData.description.split('Chemistry-Session:')[1].split('|')[0];
                    setSessionId(sid);
                }
            }

            const { data: feedData } = await supabase
                .from('activity_logs')
                .select(`*, user:user_id(name)`)
                .eq('team_id', teamId)
                .order('created_at', { ascending: false })
                .limit(20);

            const { data: membersData } = await supabase
                .from('team_members')
                .select(`
                    user_id,
                    role,
                    profile:profiles!user_id(full_name, avatar_url)
                `)
                .eq('team_id', teamId);

            if (membersData) setMembers(membersData);

            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            const { data: notesData } = await supabase
                .from('shared_notes')
                .select('*')
                .eq('team_id', teamId)
                .single();

            const { data: credsData } = await supabase
                .from('credentials')
                .select('*')
                .eq('team_id', teamId);

            if (tasksData) {
                setTasks(tasksData.map(t => ({ ...t, assignee: t.assignee?.name || 'Unassigned' })));

                // Calculate Momentum
                const total = tasksData.length;
                const completed = tasksData.filter(t => t.status === 'shipped').length;
                // Simple momentum: % completed. 
                // If 0 items, 100% velocity (fresh). If items exist, calc real %.
                const momentum = total === 0 ? 100 : Math.round((completed / total) * 100);
                setVibeScore(momentum);
            }
            if (feedData) setFeed(feedData.map(f => ({
                id: f.id,
                user: f.user?.name || 'System',
                content: f.description,
                time: new Date(f.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: f.action_type === 'system' ? 'system' : 'chat',
                // Mock icons/colors for MVP based on action type
                color: f.action_type === 'system' ? '#F59E0B' : undefined,
                icon: f.action_type === 'system' ? Zap : undefined
            })));

            if (notesData) {
                setNotes(notesData.content);
                setNotesId(notesData.id);
            } else {
                setNotes(`# MVP Requirements\\n\\n1. Built with CoVibr.\\n2. ...`);
            }
            if (credsData) setCredentials(credsData);

            setLoading(false);
        };

        fetchData();

        // 2. Realtime Subscription
        const channel = supabase
            .channel('room-updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `team_id=eq.${teamId}` }, (payload) => {
                fetchData(); // Simple re-fetch for now to handle joins
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs', filter: `team_id=eq.${teamId}` }, (payload) => {
                const newLog = payload.new;
                fetchData();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'shared_notes', filter: `team_id=eq.${teamId}` }, (payload) => {
                if (payload.new && payload.new.content !== notes) {
                    setNotes(payload.new.content);
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'credentials', filter: `team_id=eq.${teamId}` }, (payload) => {
                fetchData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [teamId]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)', gap: '20px' }}>

            {/* 1. HUD (Heads-Up Display) */}
            <header className="saas-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(90deg, rgba(99,102,241,0.05), transparent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Sprint</div>
                        <h1 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{projectName}</h1>
                    </div>
                    <div style={{ width: '1px', height: '30px', background: 'var(--border-subtle)' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {members.map(m => {
                            const isMe = m.user_id === currentUser?.id;
                            const name = isMe ? 'You' : (m.profile?.full_name || 'Member');
                            return (
                                <PresenceIndicator
                                    key={m.user_id}
                                    user={name}
                                    status="online" // Placeholder for real presence
                                    sub={m.role}
                                />
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    {/* Vibe Meter */}
                    <div style={{ width: '200px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px', fontWeight: 700 }}>
                            <span style={{ color: 'var(--text-secondary)' }}>MOMENTUM</span>
                            <span style={{ color: 'var(--accent-primary)' }}>{vibeScore}% VELOCITY</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${vibeScore}%` }}
                                transition={{ duration: 1 }}
                                style={{ height: '100%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }}
                            />
                        </div>
                    </div>

                    {/* Timer */}
                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                        <div style={{ fontSize: '0.7rem', color: timeLeft === 0 ? '#EF4444' : (isPaused ? '#F59E0B' : 'var(--text-tertiary)'), fontWeight: 700 }}>
                            {timeLeft === 0 ? 'TIME EXPIRED' : (isPaused ? 'PAUSED' : 'REMAINING')}
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: timeLeft === 0 ? '#EF4444' : (isPaused ? '#F59E0B' : 'var(--text-primary)'), letterSpacing: '-1px' }}>
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
                        <ModuleTab active={activeTab === 'video'} onClick={() => setActiveTab('video')} icon={Video} label="Call Room" />
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
                                    <KanbanColumn
                                        title="To Do"
                                        tasks={tasks.filter(t => t.status === 'todo')}
                                        color="var(--text-tertiary)"
                                        onAddTask={() => setIsAddingTask(true)}
                                    />
                                    <KanbanColumn title="In Progress" tasks={tasks.filter(t => t.status === 'progress')} color="var(--accent-primary)" active />
                                    <KanbanColumn title="Shipped" tasks={tasks.filter(t => t.status === 'shipped')} color="#10B981" />
                                </motion.div>
                            )}

                            {/* Add Task Overlay */}
                            {isAddingTask && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{
                                        position: 'absolute',
                                        top: '20%', left: '33%', transform: 'translateX(-50%)',
                                        width: '300px',
                                        background: '#151515',
                                        border: '1px solid var(--accent-primary)',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        zIndex: 50,
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>New Task</h4>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        if (!newTaskTitle.trim()) return;

                                        // 1. Insert Task
                                        const { error } = await supabase.from('tasks').insert([{
                                            team_id: teamId,
                                            title: newTaskTitle,
                                            status: 'todo',
                                            type: 'General',
                                            // Fallback for user ID if auth is tricky in preview
                                            assignee_id: (await supabase.auth.getUser()).data.user?.id
                                        }]);

                                        if (!error) {
                                            // 2. Log Activity
                                            await supabase.from('activity_logs').insert([{
                                                team_id: teamId,
                                                user_id: (await supabase.auth.getUser()).data.user?.id,
                                                action_type: 'task_created',
                                                description: `Added task: "${newTaskTitle}"`
                                            }]);
                                            setNewTaskTitle('');
                                            setIsAddingTask(false);
                                        }
                                    }}>
                                        <input
                                            autoFocus
                                            className="glass-input"
                                            placeholder="Task title..."
                                            value={newTaskTitle}
                                            onChange={e => setNewTaskTitle(e.target.value)}
                                            style={{ marginBottom: '8px' }}
                                        />
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button type="button" className="btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => setIsAddingTask(false)}>Cancel</button>
                                            <button type="submit" className="btn-primary" style={{ fontSize: '0.8rem' }}>Create</button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === 'notes' && (
                                <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Product Requirements Document (Live)</h2>
                                    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <textarea
                                            className="glass-input"
                                            style={{ flex: 1, resize: 'none', lineHeight: 1.6, fontSize: '0.95rem' }}
                                            value={notes}
                                            onChange={(e) => updateNotes(e.target.value)}
                                            placeholder="Start capturing requirements..."
                                        />
                                        {isSavingNotes && (
                                            <div style={{ position: 'absolute', bottom: '12px', right: '12px', fontSize: '0.7rem', color: 'var(--accent-primary)', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>
                                                Saving...
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'vault' && (
                                <motion.div key="vault" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Team Secrets</h3>
                                        <button
                                            className="btn-ghost"
                                            style={{ fontSize: '0.8rem' }}
                                            onClick={() => setIsAddingCredential(true)}
                                        >
                                            + Add Secret
                                        </button>
                                    </div>

                                    {isAddingCredential && (
                                        <div className="saas-panel" style={{ padding: '16px', marginBottom: '16px', border: '1px solid var(--accent-primary)' }}>
                                            <form onSubmit={async (e) => {
                                                e.preventDefault();
                                                if (!newCredTitle || !newCredValue) return;

                                                await supabase.from('credentials').insert([{
                                                    team_id: teamId,
                                                    title: newCredTitle,
                                                    value: newCredValue,
                                                    is_link: newCredValue.startsWith('http')
                                                }]);

                                                // Log it
                                                await supabase.from('activity_logs').insert([{
                                                    team_id: teamId,
                                                    user_id: (await supabase.auth.getUser()).data.user?.id,
                                                    action_type: 'credential_added',
                                                    description: `Added secret: "${newCredTitle}"`
                                                }]);

                                                setNewCredTitle('');
                                                setNewCredValue('');
                                                setIsAddingCredential(false);
                                            }}>
                                                <input
                                                    className="glass-input"
                                                    placeholder="Key Name (e.g. Stripe Pub Key)"
                                                    value={newCredTitle}
                                                    onChange={e => setNewCredTitle(e.target.value)}
                                                    style={{ marginBottom: '8px', fontSize: '0.9rem' }}
                                                    autoFocus
                                                />
                                                <input
                                                    className="glass-input"
                                                    placeholder="Value (e.g. pk_test_...)"
                                                    value={newCredValue}
                                                    onChange={e => setNewCredValue(e.target.value)}
                                                    style={{ marginBottom: '12px', fontFamily: 'monospace', fontSize: '0.85rem' }}
                                                />
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button type="button" className="btn-ghost" onClick={() => setIsAddingCredential(false)}>Cancel</button>
                                                    <button type="submit" className="btn-primary">Safe Save</button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                        {credentials.length === 0 && !isAddingCredential && (
                                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                                                No shared secrets yet. Add API keys or links here.
                                            </div>
                                        )}
                                        {credentials.map(cred => (
                                            <VaultCard key={cred.id} title={cred.title} value={cred.value} isLink={cred.is_link} />
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'video' && (
                                <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {!isCallActive ? (
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                                <Video size={40} color="var(--accent-primary)" />
                                            </div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Deep Sync Room</h3>
                                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Always-on audio channel for the sprint.</p>
                                            <button
                                                className="btn-primary"
                                                style={{ padding: '12px 32px' }}
                                                onClick={() => setIsCallActive(true)}
                                            >
                                                Hop in Voice
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', background: '#000', position: 'relative' }}>
                                            <iframe
                                                allow="camera; microphone; fullscreen; display-capture; autoplay"
                                                src={`https://meet.jit.si/CoVibr-${teamId}#config.prejoinPageEnabled=false`}
                                                style={{ width: '100%', height: '100%', border: 'none' }}
                                                title="Jitsi Meet"
                                            />
                                            <button
                                                onClick={() => setIsCallActive(false)}
                                                style={{
                                                    position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                                                    background: '#EF4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px',
                                                    fontWeight: 600, cursor: 'pointer', zIndex: 10
                                                }}
                                            >
                                                Leave Call
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
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
                                placeholder="Message team..."
                                style={{ flex: 1, fontSize: '0.85rem' }}
                                value={chatMessage}
                                onChange={e => setChatMessage(e.target.value)}
                                onKeyDown={async (e) => {
                                    if (e.key === 'Enter') await handleSendMessage();
                                }}
                            />
                            <button
                                className="btn-primary"
                                style={{ width: '40px', height: '40px', padding: 0, justifyContent: 'center' }}
                                onClick={handleSendMessage}
                                disabled={isSending}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="saas-panel" style={{ padding: '20px' }}>
                        <button
                            className="btn-primary"
                            onClick={handleEndSession}
                            style={{ width: '100%', height: '54px', justifyContent: 'center', marginBottom: '12px', background: 'var(--accent-primary)' }}
                        >
                            <CheckCircle2 size={18} /> Submit MVP for Review
                        </button>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <button className="btn-ghost" onClick={() => setShowExtensionModal(true)} style={{ fontSize: '0.8rem', justifyContent: 'center' }}>Need Extension?</button>
                            <button className="btn-ghost" onClick={handleEndSession} style={{ fontSize: '0.8rem', justifyContent: 'center', color: '#EF4444' }}>Abort Mission</button>
                        </div>

                        {/* Pause / Resume / Restart Actions */}
                        <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', gap: '8px' }}>
                            {timeLeft === 0 ? (
                                <button
                                    className="btn-primary"
                                    onClick={handleStartSprint}
                                    style={{ width: '100%', justifyContent: 'center', background: '#10B981' }}
                                >
                                    <Zap size={16} /> Start New Sprint
                                </button>
                            ) : (
                                <button
                                    className="btn-ghost"
                                    onClick={togglePause}
                                    style={{ width: '100%', justifyContent: 'center', color: isPaused ? '#10B981' : '#F59E0B', borderColor: 'currentColor', border: '1px solid' }}
                                >
                                    {isPaused ? 'Resume Sprint' : 'Pause Timer'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>


        {/* Polished Modals */}
        <AnimatePresence>
        {showExtensionModal && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', inset: 0, zIndex: 200,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="saas-panel"
                    style={{ maxWidth: '400px', width: '90%', padding: '32px', border: '1px solid var(--accent-primary)' }}
                >
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Buy More Time? ⏳</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
                        Running behind? You can extend the deadline by <strong>24 hours</strong>. This will be logged in your final report.
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowExtensionModal(false)}>Cancel</button>
                        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={confirmExtension}>Confirm (+24h)</button>
                    </div>
                </motion.div>
            </motion.div>
        )}

        {showRedirectModal && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', inset: 0, zIndex: 300,
                    background: '#05050A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                }}
            >
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ marginBottom: '24px' }}
                >
                    <Zap size={48} color="var(--accent-primary)" />
                </motion.div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Entering Decision Protocol...</h2>
                <p style={{ color: 'var(--text-tertiary)' }}>Prepare to cast your vote.</p>
            </motion.div>
        )}
    </AnimatePresence>
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

function KanbanColumn({ title, tasks, color, active, onAddTask }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: `2px solid ${active ? color : 'var(--border-subtle)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{title.toUpperCase()}</h3>
                    <div style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-tertiary)' }}>{tasks.length}</div>
                </div>
                {onAddTask && (
                    <button
                        onClick={onAddTask}
                        style={{ color: 'var(--text-tertiary)', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                        <Plus size={16} />
                    </button>
                )}
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
