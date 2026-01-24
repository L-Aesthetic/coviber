import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, X, Mail, MapPin, Briefcase, Clock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';

export default function IncomingRequests() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchRequests = async () => {
            setLoading(true);

            try {
                // Fetch intro requests sent TO this user
                const { data, error } = await supabase
                    .from('intro_requests')
                    .select(`
                        *,
                        from_profile:from_user_id (
                            id,
                            name,
                            role,
                            location,
                            bio,
                            skills,
                            avatar_url
                        )
                    `)
                    .eq('to_user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setRequests(data || []);
            } catch (error) {
                console.error('Error fetching intro requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();

        // Real-time subscription for new requests
        const channel = supabase
            .channel('intro_requests_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'intro_requests',
                filter: `to_user_id=eq.${user.id}`
            }, () => {
                fetchRequests();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const handleResponse = async (requestId, action) => {
        try {
            const { error } = await supabase
                .from('intro_requests')
                .update({
                    status: action,
                    updated_at: new Date().toISOString()
                })
                .eq('id', requestId);

            if (error) throw error;

            // Update local state
            setRequests(prev => prev.filter(r => r.id !== requestId));
        } catch (error) {
            console.error('Error responding to request:', error);
            alert('Failed to respond. Please try again.');
        }
    };

    if (loading) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                Loading requests...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Incoming Requests
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    People who want to connect with you.
                </p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {requests.length === 0 ? (
                    <div className="saas-panel" style={{ padding: '60px 40px', textAlign: 'center' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'rgba(99, 102, 241, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px'
                        }}>
                            <Mail size={32} color="var(--accent-primary)" />
                        </div>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                            No pending requests
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                            When someone requests to connect with you, they'll appear here.
                        </p>
                        <Link to="/search">
                            <button className="btn-primary">
                                Browse Candidates
                            </button>
                        </Link>
                    </div>
                ) : (
                    requests.map(request => (
                        <RequestCard
                            key={request.id}
                            request={request}
                            onAccept={() => handleResponse(request.id, 'accepted')}
                            onDecline={() => handleResponse(request.id, 'declined')}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function RequestCard({ request, onAccept, onDecline }) {
    const [isResponding, setIsResponding] = useState(false);
    const profile = request.from_profile;

    const handleAction = async (action) => {
        setIsResponding(true);
        await action();
        setIsResponding(false);
    };

    const getRelativeTime = (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffHours = Math.floor((now - past) / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return past.toLocaleDateString();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="saas-panel"
            style={{ padding: '32px' }}
        >
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                {/* Avatar */}
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #6366F1, #A855F7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    flexShrink: 0
                }}>
                    {profile?.name?.[0] || '?'}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {profile?.name || 'Anonymous'}
                    </h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Briefcase size={14} />
                            {profile?.role || 'Builder'}
                        </span>
                        {profile?.location && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={14} />
                                {profile.location}
                            </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-tertiary)' }}>
                            <Clock size={14} />
                            {getRelativeTime(request.created_at)}
                        </span>
                    </div>
                    {profile?.bio && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '12px', lineHeight: '1.5' }}>
                            {profile.bio}
                        </p>
                    )}
                    {profile?.skills && profile.skills.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            {profile.skills.slice(0, 5).map(skill => (
                                <span key={skill} className="tag tag-blur">{skill}</span>
                            ))}
                        </div>
                    )}
                    {request.message && (
                        <div className="saas-panel" style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.05)', marginBottom: '16px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '4px', fontWeight: 600 }}>MESSAGE</div>
                            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                "{request.message}"
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => handleAction(onAccept)}
                    disabled={isResponding}
                >
                    <CheckCircle2 size={16} />
                    Accept & Connect
                </button>
                <button
                    className="btn-ghost"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => handleAction(onDecline)}
                    disabled={isResponding}
                >
                    <X size={16} />
                    Decline
                </button>
                <Link to={`/profile/${profile?.id}`} style={{ flex: 1 }}>
                    <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                        View Profile
                    </button>
                </Link>
            </div>
        </motion.div>
    );
}
