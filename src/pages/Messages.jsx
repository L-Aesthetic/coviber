import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, MoreVertical } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { motion } from 'framer-motion';

export default function Messages() {
    const { conversationId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [otherUser, setOtherUser] = useState(null);

    useEffect(() => {
        if (!user || !conversationId) return;

        const fetchConversation = async () => {
            setLoading(true);

            try {
                // 1. Get the intro request to find the other user
                const { data: introRequest, error: introError } = await supabase
                    .from('intro_requests')
                    .select(`
                        *,
                        from_user:from_user_id(id, name, role),
                        to_user:to_user_id(id, name, role)
                    `)
                    .eq('id', conversationId)
                    .single();

                if (introError) throw introError;

                // Determine other user
                const other = introRequest.from_user_id === user.id
                    ? introRequest.to_user
                    : introRequest.from_user;
                setOtherUser(other);

                // 2. Fetch messages
                const { data: messagesData, error: messagesError } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('conversation_id', conversationId)
                    .order('created_at', { ascending: true });

                if (messagesError) throw messagesError;

                // 3. If no messages yet, create first message from intro request
                if (!messagesData || messagesData.length === 0) {
                    if (introRequest.message) {
                        const { data: firstMessage } = await supabase
                            .from('messages')
                            .insert([{
                                conversation_id: conversationId,
                                sender_id: introRequest.from_user_id,
                                receiver_id: introRequest.to_user_id,
                                content: introRequest.message,
                                created_at: introRequest.created_at
                            }])
                            .select()
                            .single();

                        setMessages(firstMessage ? [firstMessage] : []);
                    }
                } else {
                    setMessages(messagesData);
                }

                // Mark messages as read
                await supabase
                    .from('messages')
                    .update({ read: true })
                    .eq('conversation_id', conversationId)
                    .eq('receiver_id', user.id)
                    .eq('read', false);

            } catch (error) {
                console.error('Error fetching conversation:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversation();

        // Set up real-time subscription
        const subscription = supabase
            .channel(`conversation_${conversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [conversationId, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !otherUser || sending) return;

        setSending(true);

        try {
            const { error } = await supabase
                .from('messages')
                .insert([{
                    conversation_id: conversationId,
                    sender_id: user.id,
                    receiver_id: otherUser.id,
                    content: newMessage.trim()
                }]);

            if (error) throw error;

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const getRelativeTime = (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffMinutes = Math.floor((now - past) / (1000 * 60));
        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        return past.toLocaleDateString();
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Loading conversation...</div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            {/* Header */}
            <div className="saas-panel" style={{ padding: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        className="btn-ghost"
                        style={{ padding: '8px' }}
                        onClick={() => navigate('/pipeline?tab=conversations')}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            {otherUser?.name || 'Unknown'}
                        </h2>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                            {otherUser?.role || 'Builder'}
                        </div>
                    </div>
                </div>
                <button className="btn-ghost" style={{ padding: '8px' }}>
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* Messages */}
            <div
                className="saas-panel"
                style={{
                    flex: 1,
                    padding: '24px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}
            >
                {messages.map((msg, idx) => {
                    const isMe = msg.sender_id === user?.id;
                    return (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                display: 'flex',
                                justifyContent: isMe ? 'flex-end' : 'flex-start'
                            }}
                        >
                            <div style={{
                                maxWidth: '70%',
                                padding: '12px 16px',
                                borderRadius: '16px',
                                background: isMe ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                color: isMe ? 'white' : 'var(--text-primary)'
                            }}>
                                <div style={{ fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '4px' }}>
                                    {msg.content}
                                </div>
                                <div style={{
                                    fontSize: '0.7rem',
                                    color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)',
                                    textAlign: 'right'
                                }}>
                                    {getRelativeTime(msg.created_at)}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleSend}
                style={{
                    marginTop: '20px',
                    display: 'flex',
                    gap: '12px'
                }}
            >
                <input
                    type="text"
                    className="glass-input"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={!newMessage.trim() || sending}
                    style={{ padding: '0 24px' }}
                >
                    <Send size={18} />
                    {sending ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
}
