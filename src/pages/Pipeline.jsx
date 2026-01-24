// ... imports
import { useState, useEffect } from 'react';
import { MoreHorizontal, Calendar, MessageSquare, CheckCircle2, AlertCircle, Github, Clock, FileText, Send, UserCheck, TrendingUp, GitPullRequest, X, Plus, Trash2, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';

export default function Pipeline() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab') || 'pipeline';
    const [activeTab, setActiveTab] = useState(tabFromUrl);
    const [counts, setCounts] = useState({
        conversations: 0,
        intros: 0,
        pipeline: 0
    });

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['conversations', 'intros', 'pipeline'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    // Fetch counts for tabs
    useEffect(() => {
        if (!user) return;

        const fetchCounts = async () => {
            try {
                // 1. Active Matches count (accepted intro requests)
                const { count: matchesCount } = await supabase
                    .from('intro_requests')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'accepted')
                    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`);

                // 2. Intro Requests count (pending)
                const { count: introsCount } = await supabase
                    .from('intro_requests')
                    .select('*', { count: 'exact', head: true })
                    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`);

                // 3. Pipeline count
                const { count: pipelineCount } = await supabase
                    .from('pipeline_items')
                    .select('*', { count: 'exact', head: true })
                    .eq('owner_id', user.id);

                setCounts({
                    conversations: matchesCount || 0,
                    intros: introsCount || 0,
                    pipeline: pipelineCount || 0
                });
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        };

        fetchCounts();
    }, [user]);

    return (
        <div>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Communications Hub
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Manage your matches, intro requests, and pipeline.
                </p>
            </header>

            {/* Tabs */}
            <div className="saas-panel" style={{ padding: '4px', display: 'inline-flex', gap: '4px', marginBottom: '32px' }}>
                <TabButton active={activeTab === 'conversations'} onClick={() => setActiveTab('conversations')} icon={MessageSquare} label="Active Matches" count={counts.conversations} />
                <TabButton active={activeTab === 'intros'} onClick={() => setActiveTab('intros')} icon={Send} label="Intro Requests" count={counts.intros} />
                <TabButton active={activeTab === 'pipeline'} onClick={() => setActiveTab('pipeline')} icon={GitPullRequest} label="Pipeline" count={counts.pipeline} />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'conversations' && <ConversationsView />}
                    {activeTab === 'intros' && <IntrosView />}
                    {activeTab === 'pipeline' && <PipelineView />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function TabButton({ active, onClick, icon: Icon, label, count }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                background: active ? 'var(--accent-primary)' : 'transparent',
                color: active ? 'white' : 'var(--text-tertiary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}
        >
            <Icon size={16} />
            {label}
            <span style={{
                background: active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700
            }}>
                {count}
            </span>
        </button>
    );
}

function ConversationsView() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchConversations = async () => {
            setLoading(true);

            try {
                // Fetch accepted intro requests (these are active matches)
                const { data, error } = await supabase
                    .from('intro_requests')
                    .select(`
                        *,
                        from_user:from_user_id(id, name, role),
                        to_user:to_user_id(id, name, role)
                    `)
                    .eq('status', 'accepted')
                    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
                    .order('updated_at', { ascending: false });

                if (error) throw error;

                // Transform to conversation format
                const formattedConversations = data.map(req => {
                    const otherUser = req.from_user_id === user.id ? req.to_user : req.from_user;
                    return {
                        id: otherUser.id,
                        conversationId: req.id, // The intro_requests ID is the conversation ID
                        name: otherUser.name || 'Anonymous',
                        role: otherUser.role || 'Builder',
                        lastMessage: req.message || 'Connected!',
                        time: getRelativeTime(req.updated_at),
                        unread: 0, // TODO: Implement messaging system
                        avatar: otherUser.name?.[0] || '👤',
                        match: 95 // Placeholder
                    };
                });

                setConversations(formattedConversations);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [user]);

    const getRelativeTime = (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffHours = Math.floor((now - past) / (1000 * 60 * 60));
        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hours ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading matches...</div>;
    }

    if (conversations.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No active matches yet. Accept intro requests to start conversations!</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {conversations.map(conv => (
                <Link key={conv.id} to={`/messages/${conv.conversationId}`} style={{ textDecoration: 'none' }}>
                    <motion.div
                        className="saas-panel hover-glass"
                        style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer' }}
                        whileHover={{ x: 4 }}
                    >
                        <div style={{
                            fontSize: '2rem',
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #6366F1, #A855F7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 700
                        }}>
                            {conv.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{conv.name}</h3>
                                <span className="tag tag-purple" style={{ fontSize: '0.7rem' }}>{conv.match}% Match</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '8px' }}>{conv.role}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{conv.lastMessage}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{conv.time}</div>
                            {conv.unread > 0 && (
                                <div style={{
                                    background: 'var(--accent-primary)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 700
                                }}>
                                    {conv.unread}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </Link>
            ))}
        </div>
    );
}

function IntrosView() {
    const { user } = useAuth();
    const [intros, setIntros] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false); // User not loaded, stop loading
            return;
        }

        const fetchIntros = async () => {
            setLoading(true);

            try {
                // Fetch intro requests (both sent and received)
                const { data, error } = await supabase
                    .from('intro_requests')
                    .select(`
                        *,
                        from_user:from_user_id(name),
                        to_user:to_user_id(name)
                    `)
                    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setIntros(data || []);
            } catch (error) {
                console.error('Error fetching intros:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIntros();
    }, [user]);

    const handleAccept = async (introId) => {
        try {
            const { error } = await supabase
                .from('intro_requests')
                .update({ status: 'accepted', updated_at: new Date().toISOString() })
                .eq('id', introId);

            if (error) throw error;

            // Update local state
            setIntros(intros.map(i => i.id === introId ? { ...i, status: 'accepted' } : i));
        } catch (error) {
            console.error('Error accepting intro:', error);
            alert('Failed to accept intro');
        }
    };

    const handleDecline = async (introId) => {
        try {
            const { error } = await supabase
                .from('intro_requests')
                .update({ status: 'declined', updated_at: new Date().toISOString() })
                .eq('id', introId);

            if (error) throw error;

            // Update local state
            setIntros(intros.map(i => i.id === introId ? { ...i, status: 'declined' } : i));
        } catch (error) {
            console.error('Error declining intro:', error);
            alert('Failed to decline intro');
        }
    };

    const getRelativeTime = (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffHours = Math.floor((now - past) / (1000 * 60 * 60));
        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hours ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading intro requests...</div>;
    }

    if (intros.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No intro requests yet.</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {intros.map(intro => {
                const isSent = intro.from_user_id === user?.id;
                const isReceived = intro.to_user_id === user?.id;

                return (
                    <div key={intro.id} className="saas-panel" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                        {isSent ? `To: ${intro.to_user?.name || 'Unknown'}` : `From: ${intro.from_user?.name || 'Unknown'}`}
                                    </h3>
                                    {intro.status === 'pending' && (
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase' }}>Pending</span>
                                    )}
                                    {intro.status === 'accepted' && (
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-success)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <CheckCircle2 size={12} /> Accepted
                                        </span>
                                    )}
                                    {intro.status === 'declined' && (
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase' }}>Declined</span>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
                                    {isSent ? 'You sent an intro request' : 'Intro request received'}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{intro.message || 'No message provided'}</div>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                                {getRelativeTime(intro.created_at)}
                            </div>
                        </div>
                        {intro.status === 'pending' && isReceived && (
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button
                                    className="btn-primary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                    onClick={() => handleAccept(intro.id)}
                                >
                                    <CheckCircle2 size={16} /> Accept Intro
                                </button>
                                <button
                                    className="btn-ghost"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                    onClick={() => handleDecline(intro.id)}
                                >
                                    <X size={16} /> Decline
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function PipelineView() {
    const { user } = useAuth();
    const [columns, setColumns] = useState({
        shortlist: { id: 'shortlist', title: 'Shortlist', color: 'var(--accent-primary)', items: [] },
        contacted: { id: 'contacted', title: 'Intro Sent', color: '#F59E0B', items: [] },
        chemistry: { id: 'chemistry', title: 'Chemistry Test', color: '#EC4899', items: [] },
        offer: { id: 'offer', title: 'Offer / Closing', color: '#8B5CF6', items: [] }
    });
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [composerData, setComposerData] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCandidateName, setNewCandidateName] = useState('');

    // Fetch Pipeline
    useEffect(() => {
        if (!user) return;

        const fetchPipeline = async () => {
            const { data, error } = await supabase
                .from('pipeline_items')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (error) console.error("Error fetching pipeline:", error);

            if (data) {
                const newCols = {
                    shortlist: { ...columns.shortlist, items: [] },
                    contacted: { ...columns.contacted, items: [] },
                    chemistry: { ...columns.chemistry, items: [] },
                    offer: { ...columns.offer, items: [] }
                };

                data.forEach(item => {
                    const status = item.status || 'shortlist';
                    if (newCols[status]) {
                        // Adapt DB fields to UI fields
                        newCols[status].items.push({
                            ...item,
                            waiting: 'Just now', // Placeholder time logic
                            staleDays: 0
                        });
                    }
                });
                setColumns(newCols);
            }
        };

        fetchPipeline();
    }, [user]);

    // DnD State
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragSourceCol, setDragSourceCol] = useState(null);

    const handleDragStart = (e, item, colId) => {
        setDraggedItem(item);
        setDragSourceCol(colId);
        e.dataTransfer.setData('text/plain', item.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, targetColId) => {
        e.preventDefault();
        if (!draggedItem || !dragSourceCol) return;
        if (dragSourceCol === targetColId) return;

        // Optimistic UI Update
        const sourceItems = columns[dragSourceCol].items.filter(i => i.id !== draggedItem.id);
        const targetItems = [...columns[targetColId].items, { ...draggedItem, status: targetColId }];

        setColumns({
            ...columns,
            [dragSourceCol]: { ...columns[dragSourceCol], items: sourceItems },
            [targetColId]: { ...columns[targetColId], items: targetItems }
        });

        // Backend Update
        try {
            const { error } = await supabase
                .from('pipeline_items')
                .update({ status: targetColId })
                .eq('id', draggedItem.id);

            if (error) throw error;
        } catch (err) {
            console.error("Failed to move item:", err);
            // Revert UI if needed (omitted for brevity)
        }

        // Trigger Composer if moving to 'Contacted'
        if (dragSourceCol === 'shortlist' && targetColId === 'contacted') {
            setComposerData(draggedItem);
            setIsComposerOpen(true);
        }

        setDraggedItem(null);
        setDragSourceCol(null);
    };

    const handleMoveItem = async (item, targetColId) => {
        // Find source column
        const sourceColId = Object.keys(columns).find(key => columns[key].items.find(i => i.id === item.id));
        if (!sourceColId || sourceColId === targetColId) return;

        // UI Update
        const sourceItems = columns[sourceColId].items.filter(i => i.id !== item.id);
        const targetItems = [...columns[targetColId].items, { ...item, status: targetColId }];

        setColumns({
            ...columns,
            [sourceColId]: { ...columns[sourceColId], items: sourceItems },
            [targetColId]: { ...columns[targetColId], items: targetItems }
        });

        // Backend Update
        try {
            await supabase
                .from('pipeline_items')
                .update({ status: targetColId })
                .eq('id', item.id);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCandidate = () => {
        setNewCandidateName('');
        setIsAddModalOpen(true);
    };

    const submitAddCandidate = async () => {
        if (!newCandidateName.trim() || !user) return;

        const newItem = {
            name: newCandidateName,
            role: 'Unknown Role',
            status: 'shortlist',
            owner_id: user.id
        };

        // Backend Insert
        const { data, error } = await supabase
            .from('pipeline_items')
            .insert([newItem])
            .select()
            .single();

        if (error) {
            alert("Error adding candidate");
            return;
        }

        // UI Update
        setColumns({
            ...columns,
            shortlist: {
                ...columns.shortlist,
                items: [data, ...columns.shortlist.items]
            }
        });
        setIsAddModalOpen(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Pipeline</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Managing candidates for <b>SaaS CTO Brief</b></p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="tag tag-blur">
                        <TrendingUp size={14} style={{ marginRight: '6px' }} />
                        Health: <span style={{ color: '#10B981', marginLeft: '4px', fontWeight: 700 }}>Excellent</span>
                    </div>
                    <button className="btn-primary" onClick={handleAddCandidate}>
                        <Plus size={16} /> Add Candidate
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', alignItems: 'start' }}>
                {Object.values(columns).map(col => (
                    <Column
                        key={col.id}
                        column={col}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onMove={handleMoveItem}
                    />
                ))}
            </div>

            {/* Simulated Email Composer Popup */}
            <AnimatePresence>
                {isComposerOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="saas-panel"
                            style={{ width: '500px', padding: '32px' }}
                        >
                            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Send size={20} color="var(--accent-primary)" />
                                Send Intro to {composerData?.name}
                            </h3>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Subject</label>
                                <input className="glass-input" value={`CoVibr Intro: Scaling SaaS CTO role`} readOnly />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Body</label>
                                <textarea
                                    className="glass-input"
                                    style={{ height: '150px', resize: 'none' }}
                                    defaultValue={`Hi ${composerData?.name}, I saw your background at Stripe and loved your work on FlowState. I'm building a co-founder matching OS and think we'd vibe...`}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button onClick={() => setIsComposerOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}>Cancel</button>
                                <button className="btn-primary" onClick={() => setIsComposerOpen(false)}>Send Elevator Pitch</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Candidate Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                    }} onClick={() => setIsAddModalOpen(false)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="saas-panel"
                            style={{ width: '400px', padding: '32px', border: '1px solid var(--border-subtle)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Plus size={24} color="var(--accent-primary)" />
                                Add Candidate
                            </h3>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Name *</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="glass-input"
                                    placeholder="e.g. John Doe, Sarah..."
                                    value={newCandidateName}
                                    onChange={e => setNewCandidateName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && submitAddCandidate()}
                                    style={{ width: '100%', fontSize: '1.1rem' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={submitAddCandidate}>
                                    Add to Pipeline
                                </button>
                                <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsAddModalOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Column({ column, onDragStart, onDragOver, onDrop, onMove, onSortColumn, onRenameColumn, onClearColumn }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column.id)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: column.color }}></div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{column.title}</span>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{column.items.length}</span>
                </div>
                <div style={{ position: 'relative' }}>
                    <div
                        className="icon-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{
                            padding: '6px',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            background: isMenuOpen ? 'rgba(255,255,255,0.1)' : 'transparent',
                            transition: 'all 0.2s'
                        }}
                    >
                        <MoreHorizontal size={16} color="var(--text-tertiary)" />
                    </div>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '8px',
                                    background: 'rgba(28, 28, 36, 0.95)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '12px',
                                    width: '180px',
                                    zIndex: 50,
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                                    overflow: 'hidden',
                                    padding: '4px'
                                }}
                            >
                                <div className="menu-item" onClick={() => { alert('Sort logic here'); setIsMenuOpen(false); }}>
                                    <TrendingUp size={14} /> Sort by Date
                                </div>
                                <div className="menu-item" onClick={() => { alert('Rename logic here'); setIsMenuOpen(false); }}>
                                    <Edit3 size={14} /> Rename Column
                                </div>
                                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }}></div>
                                <div className="menu-item" onClick={() => { alert('Clear logic here'); setIsMenuOpen(false); }} style={{ color: '#ef4444' }}>
                                    <Trash2 size={14} /> Clear All Items
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '400px' }}>
                {column.items.map(item => (
                    <Card
                        key={item.id}
                        item={item}
                        colId={column.id}
                        onDragStart={onDragStart}
                        onMove={onMove}
                    />
                ))}
                {column.items.length === 0 && (
                    <div style={{ border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '12px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                        Drop here
                    </div>
                )}
            </div>
        </div>
    )
}

function Card({ item, colId, onDragStart, onMove }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isStale = item.staleDays >= 3;
    const isCriticallyStale = item.staleDays >= 7;

    const getBgColor = () => {
        if (isCriticallyStale) return 'rgba(239, 68, 68, 0.08)';
        if (isStale) return 'rgba(245, 158, 11, 0.08)';
        return 'var(--bg-secondary)';
    };

    const getBorderColor = () => {
        if (isCriticallyStale) return 'rgba(239, 68, 68, 0.2)';
        if (isStale) return 'rgba(245, 158, 11, 0.2)';
        return 'var(--border-subtle)';
    };

    return (
        <motion.div
            layoutId={item.id}
            whileHover={{ scale: 1.02 }}
            className="saas-panel hover-glass"
            draggable
            onDragStart={(e) => onDragStart(e, item, colId)}
            style={{
                padding: '16px',
                cursor: 'grab',
                background: getBgColor(),
                border: `1px solid ${getBorderColor()}`,
                position: 'relative',
                overflow: 'visible'
            }}
            onClick={() => {
                if (colId === 'chemistry') window.location.href = `/chemistry/${item.id}`;
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.name}
                    {isCriticallyStale && <AlertCircle size={14} color="#EF4444" title="Ghosting Risk" />}
                </div>
                <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                    {isStale && (
                        <button className="tag" style={{ background: 'var(--accent-primary)', color: 'white', padding: '2px 8px', fontSize: '0.7rem', border: 'none', cursor: 'pointer' }}>
                            Nudge
                        </button>
                    )}
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                        style={{
                            padding: '4px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            background: isMenuOpen ? 'rgba(255,255,255,0.1)' : 'transparent',
                            transition: 'all 0.2s'
                        }}
                    >
                        <MoreHorizontal size={14} color="var(--text-tertiary)" />
                    </div>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '4px',
                                    background: 'rgba(28, 28, 36, 0.95)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '8px',
                                    padding: '4px',
                                    zIndex: 50,
                                    minWidth: '160px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                                }}
                            >
                                <div style={{ fontSize: '0.65rem', padding: '8px', color: 'var(--text-tertiary)', fontWeight: 700, letterSpacing: '0.05em' }}>MOVE CARD</div>
                                <div className="menu-item" onClick={(e) => { e.stopPropagation(); onMove(item, 'shortlist'); setIsMenuOpen(false); }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div> Shortlist
                                </div>
                                <div className="menu-item" onClick={(e) => { e.stopPropagation(); onMove(item, 'contacted'); setIsMenuOpen(false); }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }}></div> Intro Sent
                                </div>
                                <div className="menu-item" onClick={(e) => { e.stopPropagation(); onMove(item, 'chemistry'); setIsMenuOpen(false); }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EC4899' }}></div> Chemistry
                                </div>
                                <div className="menu-item" onClick={(e) => { e.stopPropagation(); onMove(item, 'offer'); setIsMenuOpen(false); }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B5CF6' }}></div> Offer
                                </div>
                                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }}></div>
                                <div className="menu-item" onClick={(e) => { e.stopPropagation(); alert('Archived'); setIsMenuOpen(false); }} style={{ color: '#ef4444' }}>
                                    <Trash2 size={12} /> Archive
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
                .menu-item {
                    padding: 8px 10px;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    cursor: pointer;
                    border-radius: 6px;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .menu-item:hover {
                    background: rgba(255,255,255,0.08);
                    color: white;
                }
                .icon-btn:hover {
                    background: rgba(255,255,255,0.05);
                }
            `}</style>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{item.role}</div>

            {/* Chemistry Test Telemetry */}
            {colId === 'chemistry' && (
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                        <span>Progress</span>
                        <span>{item.progress}%</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.progress}%`, height: '100%', background: '#EC4899' }}></div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Github size={12} /> {item.ghStatus}</span>
                        <span style={{ fontSize: '0.7rem', color: '#EC4899', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {item.deadline}</span>
                    </div>
                </div>
            )}

            {/* Offer Preview */}
            {colId === 'offer' && (
                <div style={{ marginBottom: '12px', background: 'rgba(139, 92, 246, 0.1)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#8B5CF6', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Equity Split</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#8B5CF6' }}>{item.equity}</div>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                {item.waiting && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isCriticallyStale ? '#EF4444' : 'inherit' }}>
                        <MessageSquare size={12} /> {item.waiting} wait
                    </div>
                )}
                <div className="memo-trigger" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-primary)', cursor: 'help' }}>
                    <FileText size={12} /> Memo
                    <div className="memo-popup" style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '0',
                        width: '100%',
                        background: 'rgba(25, 25, 35, 0.98)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '10px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                        zIndex: 20,
                        opacity: 0,
                        pointerEvents: 'none',
                        transition: 'opacity 0.2s, transform 0.2s',
                        transform: 'translateY(5px)'
                    }}>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '4px', fontWeight: 700 }}>Private Notes</div>
                        <p style={{ color: 'var(--text-primary)', fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>
                            {item.notes}
                        </p>
                        <div style={{ position: 'absolute', top: '100%', left: '20px', border: '8px solid transparent', borderTopColor: 'rgba(25, 25, 35, 0.98)' }}></div>
                    </div>
                </div>
            </div>

            <style>{`
                .memo-trigger:hover .memo-popup {
                    opacity: 1;
                    pointer-events: auto;
                    transform: translateY(0);
                }
            `}</style>
        </motion.div>
    )
}
