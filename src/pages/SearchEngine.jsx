import { Search as SearchIcon, Filter, MapPin, Briefcase, Star, CheckCircle2, SlidersHorizontal, Zap, Hammer, Clock, Scale, Info, ShieldCheck, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { getArchetypeDetails } from '../data/archetypes';

export default function SearchEngine() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);

    // Fetch candidates from Supabase
    useEffect(() => {
        const fetchArchetypes = async () => {
            if (!user) { return }

            setLoading(true);
            try {
                // 1. Get MY archetype
                const { data: myProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                const myArchetype = myProfile?.headline ? getArchetypeDetails(myProfile.headline).name : null;
                const myMatchName = myProfile?.headline ? getArchetypeDetails(myProfile.headline).match.name : null; // e.g. "THE OPERATOR 🎯"

                // Check premium status
                const premiumTiers = ['founder', 'pro', 'certified', 'accelerator'];
                const hasPremium = premiumTiers.includes(myProfile?.subscription_tier);
                setIsPremium(hasPremium);

                // 2. Get CANDIDATES
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .neq('id', user.id);

                if (error) throw error;

                const formattedCandidates = data.map(profile => {
                    const theirDetails = getArchetypeDetails(profile.headline);
                    const theirArchetype = theirDetails.name;
                    const theirMatchName = theirDetails.match.name;

                    // BASE SCORE: 50
                    let score = 50;
                    let matchReason = [];

                    // ARCHETYPE COMPATIBILITY
                    // 1. Do they fit what I need?
                    if (myMatchName && theirArchetype && myMatchName.toUpperCase().includes(theirArchetype.toUpperCase())) {
                        score += 25;
                        matchReason.push("They are your ideal match");
                    }

                    // 2. Do I fit what they need? (Bi-directional bonus)
                    if (theirMatchName && myArchetype && theirMatchName.toUpperCase().includes(myArchetype.toUpperCase())) {
                        score += 20;
                        matchReason.push("You are their ideal match");
                    }

                    // 3. Same Archetype Penalty (Clones are bad co-founders usually)
                    if (myArchetype === theirArchetype) {
                        score -= 10;
                        matchReason.push("Too similar (Risk of conflict)");
                    }

                    // PROFILE COMPLETENESS (+15)
                    if (profile.bio && profile.bio.length > 20) score += 10;
                    if (profile.skills && profile.skills.length > 0) score += 5;

                    // VERIFIED/PAID (+5)
                    if (profile.subscription_tier !== 'free') score += 5;

                    return {
                        id: profile.id,
                        name: profile.full_name || profile.display_name || profile.name || 'Founder',
                        role: profile.role || 'Builder',
                        location: profile.location || 'Remote',
                        match: Math.min(99, Math.max(10, score)), // Clamp between 10 and 99
                        skills: profile.skills || [],
                        isVerified: profile.subscription_tier !== 'free',
                        hasShipped: profile.has_shipped || false,
                        isExFounder: profile.is_ex_founder || false,
                        bio: profile.bio || 'No bio available',
                        avatar_url: profile.avatar_url,
                        headline: profile.headline || theirDetails.headline, // Use default if empty
                        archetype: theirArchetype,
                        matchReason: matchReason
                    };
                });

                // Sort by match score
                setCandidates(formattedCandidates.sort((a, b) => b.match - a.match));
            } catch (error) {
                console.error('Error fetching candidates:', error);
                setCandidates([]);
            } finally {
                setLoading(false);
            }
        };

        fetchArchetypes();
    }, [user]);



    const [filters, setFilters] = useState({
        role: null,
        remote: false,
        shipped: false,
        equity50: false,
        funded: false,
        nights: false,
        exFounder: false,
        verifiedExit: false,
        vcBacked: false
    });

    const filteredCandidates = candidates.filter(c => {
        const query = searchQuery.toLowerCase();
        const matchesQuery = (
            c.name.toLowerCase().includes(query) ||
            c.role.toLowerCase().includes(query) ||
            c.skills.some(s => s.toLowerCase().includes(query)) ||
            c.bio.toLowerCase().includes(query)
        );

        const matchesRole = !filters.role || c.role.includes(filters.role) || (filters.role === 'Engineering' && (c.role.includes('Full Stack') || c.role.includes('Engineer') || c.role.includes('Architect')));

        // Match logic using mock fields (assuming true if field undefined for simplicity in mock, or strictly false if verified required)
        const matchesRemote = !filters.remote || c.location.toLowerCase().includes('remote');
        const matchesShipped = !filters.shipped || c.hasShipped;

        const matchesExFounder = !filters.exFounder || c.isExFounder;

        // For simple MVP mocking, we'll assume bio keywords reflect these traits
        const matchesEquity = !filters.equity50 || c.bio.toLowerCase().includes('equity');
        const matchesFunded = !filters.funded || c.bio.toLowerCase().includes('funded');
        const matchesNights = !filters.nights || c.bio.toLowerCase().includes('nights'); // Mock logic

        // Strict Trust Signals
        const matchesVerifiedExit = !filters.verifiedExit || c.bio.toLowerCase().includes('exit') || c.bio.toLowerCase().includes('acquisition');
        const matchesVC = !filters.vcBacked || c.bio.toLowerCase().includes('series a') || c.bio.toLowerCase().includes('vc');

        return matchesQuery && matchesRole && matchesRemote && matchesShipped && matchesExFounder && matchesEquity && matchesFunded && matchesNights && matchesVerifiedExit && matchesVC;
    });

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }}>
            {/* Sidebar Filters */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <SlidersHorizontal size={18} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Filters</h3>
                    </div>
                    <div className="saas-panel" style={{ padding: '24px' }}>
                        <FilterSection title="Role">
                            <FilterOption
                                label="Engineering"
                                checked={filters.role === 'Engineering'}
                                onClick={() => setFilters(prev => ({ ...prev, role: prev.role === 'Engineering' ? null : 'Engineering' }))}
                            />
                            <FilterOption
                                label="Product"
                                checked={filters.role === 'Product'}
                                onClick={() => setFilters(prev => ({ ...prev, role: prev.role === 'Product' ? null : 'Product' }))}
                            />
                            <FilterOption
                                label="Growth"
                                checked={filters.role === 'Growth'}
                                onClick={() => setFilters(prev => ({ ...prev, role: prev.role === 'Growth' ? null : 'Growth' }))}
                            />
                        </FilterSection>

                        <FilterSection title="Dealbreakers (Risk)">
                            <FilterOption
                                label="Equity (50/50 only)"
                                checked={filters.equity50}
                                onClick={() => setFilters(prev => ({ ...prev, equity50: !prev.equity50 }))}
                            />
                            <FilterOption
                                label="Funded (No Salary)"
                                checked={filters.funded}
                                onClick={() => setFilters(prev => ({ ...prev, funded: !prev.funded }))}
                            />
                            <FilterOption
                                label="Nights & Weekends"
                                checked={filters.nights}
                                onClick={() => setFilters(prev => ({ ...prev, nights: !prev.nights }))}
                            />
                            <FilterOption
                                label="Remote-First"
                                checked={filters.remote}
                                onClick={() => setFilters(prev => ({ ...prev, remote: !prev.remote }))}
                            />
                        </FilterSection>

                        <FilterSection title="Builder Proof">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '12px' }} onClick={() => setFilters(prev => ({ ...prev, shipped: !prev.shipped }))}>
                                <div className="glass-input" style={{ width: '40px', height: '22px', borderRadius: '11px', padding: '2px', position: 'relative', background: filters.shipped ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)' }}>
                                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', right: filters.shipped ? '2px' : 'auto', left: filters.shipped ? 'auto' : '2px', transition: 'all 0.2s' }}></div>
                                </div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Shipped to Prod</span>
                            </label>
                        </FilterSection>

                        <FilterSection title="Trust Signals">
                            <FilterOption
                                label="Verified Ex-Founder"
                                checked={filters.exFounder}
                                onClick={() => setFilters(prev => ({ ...prev, exFounder: !prev.exFounder }))}
                            />
                            <FilterOption
                                label="Verified Exit"
                                checked={filters.verifiedExit}
                                onClick={() => setFilters(prev => ({ ...prev, verifiedExit: !prev.verifiedExit }))}
                            />
                            <FilterOption
                                label="VC Backed"
                                checked={filters.vcBacked}
                                onClick={() => setFilters(prev => ({ ...prev, vcBacked: !prev.vcBacked }))}
                            />
                        </FilterSection>
                    </div>
                </section>
            </aside>

            {/* Main Content */}
            <main>
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                        <SearchIcon size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <input
                            type="text"
                            className="glass-input"
                            placeholder="Search by skills, past projects, or problems solved (e.g. 'HIPAA compliance', 'Stripe Connect')..."
                            style={{ paddingLeft: '56px', fontSize: '1.1rem' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div className="tag tag-blur" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('NYC')}>NYC</div>
                        <div className="tag tag-blur" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('Rust')}>Rust</div>
                        <div className="tag tag-blur" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('Fintech')}>Fintech</div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Loading candidates...
                        </div>
                    ) : filteredCandidates.length > 0 ? (
                        <>
                            {/* Free Tier Limit: Show only 3 */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                                {(isPremium ? filteredCandidates : filteredCandidates.slice(0, 3)).map((candidate, index) => (
                                    <CandidateCard
                                        key={candidate.id}
                                        {...candidate}
                                        index={index}
                                    />
                                ))}

                                {/* FREEMIUM LOCK - Show if not premium and there are more candidates */}
                                {!isPremium && filteredCandidates.length > 3 && (
                                    <div className="saas-panel" style={{
                                        padding: '40px',
                                        display: 'flex',
                                        flexDirection: 'column', // Simplified for clarity
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        minHeight: '200px',
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                                        borderStyle: 'dashed',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            backdropFilter: 'blur(8px)',
                                            zIndex: 0
                                        }}></div>

                                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: '50%',
                                                background: 'rgba(99, 102, 241, 0.1)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <ShieldCheck size={24} color="var(--accent-primary)" />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                                                    {filteredCandidates.length - 3} More Candidates Found
                                                </h3>
                                                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                                                    Upgrade to Pro to see their full profiles, compatibility scores, and send unlimited intro requests.
                                                </p>
                                            </div>
                                            <Link to="/upgrade" style={{ textDecoration: 'none' }}>
                                                <button className="btn-primary" style={{ padding: '12px 32px' }}>
                                                    Unlock All Candidates
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No candidates found {searchQuery && `matching "${searchQuery}"`}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}


function CandidateCard({ id, name, role, location, match, skills, isVerified, hasShipped, isExFounder, bio, avatar_url, archetype, matchReason }) {
    // Reconstruct candidate object for child components if needed
    const candidate = { id, name, role, archetype, matchReason };
    return (
        <Link to={`/profile/${id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="saas-panel hover-glass"
                style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 200px', gap: '32px', cursor: 'pointer' }}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', background: 'linear-gradient(135deg, #6366F1, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
                            {avatar_url ? (
                                <img src={avatar_url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                name[0]
                            )}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>{name}</h3>
                                {isVerified && <ShieldCheck size={16} color="var(--accent-primary)" />}
                                {hasShipped && <Hammer size={16} color="#F59E0B" title="Shipped to Production" />}
                                {isExFounder && <Trophy size={16} color="#10B981" title="Ex-Founder" />}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={14} /> {role}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {location}</span>
                            </div>
                        </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.5' }}>
                        {bio}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {skills.map(s => <span key={s} className="tag tag-blur">{s}</span>)}
                    </div>
                </div>

                <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{match}%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>{candidate.archetype || 'Match'}</div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <CompatibilityIcon icon={Scale} tooltip="Equity Alignment" />
                    <CompatibilityIcon icon={Clock} tooltip="Timezone Match" />
                    <CompatibilityIcon icon={Zap} tooltip="Speed Vibe" active />
                </div>

                <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <IntroButton candidate={{ name, role, id }} />
                </div>
            </motion.div>
        </Link >
    )
}

function IntroButton({ candidate }) {
    const [status, setStatus] = useState('idle'); // idle, sending, sent_pending, sent_accepted, sent_rejected, received_pending, received_accepted, received_rejected, error
    const [requestId, setRequestId] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        const checkStatus = async () => {
            // Check if *I* sent one
            const { data: sentData } = await supabase
                .from('intro_requests')
                .select('*')
                .eq('from_user_id', user.id)
                .eq('to_user_id', candidate.id)
                .maybeSingle();

            if (sentData) {
                setStatus(`sent_${sentData.status}`);
                setRequestId(sentData.id);
                return;
            }

            // Check if *THEY* sent one
            const { data: receivedData } = await supabase
                .from('intro_requests')
                .select('*')
                .eq('from_user_id', candidate.id)
                .eq('to_user_id', user.id)
                .maybeSingle();

            if (receivedData) {
                setStatus(`received_${receivedData.status}`);
                setRequestId(receivedData.id);
            }
        };
        checkStatus();
    }, [user, candidate.id]);

    const handleRequest = async () => {
        if (!user) return navigate('/login');
        setStatus('sending');

        try {
            // 1. Add to requester's pipeline
            await supabase
                .from('pipeline_items')
                .insert([{
                    owner_id: user.id,
                    name: candidate.name,
                    role: candidate.role,
                    status: 'contacted',
                    notes: `Intro requested to ${candidate.name}`
                }]);

            // 2. Create intro request
            const { data, error } = await supabase
                .from('intro_requests')
                .insert([{
                    from_user_id: user.id,
                    to_user_id: candidate.id,
                    status: 'pending',
                    message: `Hi! I'd love to connect and explore potential collaboration.`
                }])
                .select()
                .single();

            if (error) throw error;
            setRequestId(data.id);

            // 3. Trigger Email Notification (Non-blocking)
            fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'intro',
                    targetUserId: candidate.id,
                    senderName: user.user_metadata?.full_name || 'A Founder',
                    message: "Hi! I'd love to connect and explore potential collaboration."
                })
            }).catch(err => console.error("Failed to send intro email:", err));

            setStatus('sent_pending');
        } catch (e) {
            console.error(e);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const handleAccept = async () => {
        if (!requestId) return;
        try {
            const { error } = await supabase
                .from('intro_requests')
                .update({ status: 'accepted', updated_at: new Date().toISOString() })
                .eq('id', requestId);

            if (error) throw error;
            setStatus('received_accepted');
        } catch (e) {
            console.error(e);
            alert("Failed to accept intro.");
        }
    };

    // --- RENDER LOGIC ---

    // 1. I Sent It
    if (status === 'sent_pending') {
        return (
            <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', color: '#10B981', borderColor: '#10B981', opacity: 0.8 }} disabled>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={16} /> Sent</span>
            </button>
        )
    }
    if (status === 'sent_accepted') {
        return (
            <Link to="/pipeline?tab=conversations" style={{ textDecoration: 'none', width: '100%' }}>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#10B981', borderColor: '#10B981' }}>
                    <MessageSquare size={16} style={{ marginRight: '6px' }} /> Chat Open
                </button>
            </Link>
        )
    }
    if (status === 'sent_rejected' || status === 'sent_declined') { // Handle both just in case
        return (
            <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', color: '#EF4444', borderColor: '#EF4444', opacity: 0.8 }} disabled>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><X size={16} /> Declined</span>
            </button>
        )
    }

    // 2. I Received It
    if (status === 'received_pending') {
        return (
            <Link to="/pipeline?tab=intros" style={{ textDecoration: 'none', width: '100%' }}>
                <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', color: '#F59E0B', borderColor: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Accept in Dashboard</span>
                </button>
            </Link>
        )
    }
    if (status === 'received_rejected' || status === 'received_declined') {
        return (
            <button
                className="btn-ghost"
                style={{ width: '100%', justifyContent: 'center', color: '#EF4444', borderColor: '#EF4444' }}
                onClick={handleAccept}
                title="Click to change your mind and accept"
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <X size={16} /> Declined (Undo)
                </span>
            </button>
        )
    }
    if (status === 'received_accepted') {
        return (
            <Link to="/pipeline?tab=conversations" style={{ textDecoration: 'none', width: '100%' }}>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#10B981', borderColor: '#10B981' }}>
                    <MessageSquare size={16} style={{ marginRight: '6px' }} /> Chat Open
                </button>
            </Link>
        )
    }

    // 3. Default / Sending
    return (
        <button
            className="btn-primary"
            style={{
                width: '100%',
                justifyContent: 'center',
                background: status === 'error' ? 'var(--accent-error)' : undefined,
                borderColor: status === 'error' ? 'var(--accent-error)' : undefined
            }}
            onClick={handleRequest}
            disabled={status === 'sending'}
        >
            {status === 'sending' ? "Sending..." : status === 'error' ? "Failed" : "Request Intro"}
        </button>
    )
}

function CompatibilityIcon({ icon: Icon, tooltip, active }) {
    return (
        <div
            className="tooltip-container"
            style={{
                padding: '8px',
                borderRadius: '8px',
                background: active ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-secondary)',
                color: active ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                position: 'relative'
            }}
        >
            <Icon size={16} />
            <div className="tooltip" style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(25, 25, 35, 0.95)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
                marginBottom: '8px',
                pointerEvents: 'none',
                opacity: 0,
                transition: 'opacity 0.2s',
                zIndex: 10
            }}>
                {tooltip}
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', border: '5px solid transparent', borderTopColor: 'rgba(25, 25, 35, 0.95)' }}></div>
            </div>
            <style>{`
                .tooltip-container:hover .tooltip { opacity: 1; }
            `}</style>
        </div>
    )
}

function FilterSection({ title, children }) {
    return (
        <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '16px', letterSpacing: '0.05em' }}>{title}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {children}
            </div>
        </div>
    )
}

function FilterOption({ label, count, checked, onClick }) {
    return (
        <label onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: checked ? 'var(--accent-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {checked && <CheckCircle2 size={12} color="white" />}
                </div>
                <span style={{ fontSize: '0.9rem', color: checked ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: checked ? 600 : 400 }}>{label}</span>
            </div>
            {count && <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{count}</span>}
        </label>
    )
}
