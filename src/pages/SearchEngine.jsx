import { Search as SearchIcon, Filter, MapPin, Briefcase, Star, CheckCircle2, SlidersHorizontal, Zap, Hammer, Clock, Scale, Info, ShieldCheck, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';

export default function SearchEngine() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch candidates from Supabase
    useEffect(() => {
        const fetchCandidates = async () => {
            setLoading(true);

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .neq('id', user?.id || '');

                if (error) throw error;

                const formattedCandidates = data.map(profile => ({
                    id: profile.id,
                    name: profile.name || 'Anonymous',
                    role: profile.role || 'Builder',
                    location: profile.location || 'Remote',
                    match: Math.min(100, 50 + (profile.bio ? 10 : 0) + ((profile.skills?.length || 0) * 5)),
                    skills: profile.skills || [],
                    isVerified: profile.subscription_tier !== 'free',
                    hasShipped: profile.has_shipped || false,
                    isExFounder: profile.is_ex_founder || false,
                    bio: profile.bio || 'No bio available'
                }));

                setCandidates(formattedCandidates);
            } catch (error) {
                console.error('Error fetching candidates:', error);
                setCandidates([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, [user]);

    const mockCandidates = [
        {
            id: "alex-v",
            name: "Alex V.",
            role: "Full Stack Wizard",
            location: "San Francisco (Remote)",
            match: 98,
            skills: ["Rust", "Next.js", "Solana"],
            isVerified: true,
            hasShipped: true,
            bio: "Ex-Stripe. Built 'FlowState' (10k MAU). Obsessed with marketplace liquidity and zero-knowledge proofs."
        },
        {
            id: "sarah-k",
            name: "Sarah K.",
            role: "Growth Hacker",
            location: "London (Hybrid)",
            match: 94,
            skills: ["SEO", "Stripe API", "Python"],
            isVerified: true,
            isExFounder: true,
            bio: "Second-time founder. Scaled previous SaaS to $1M ARR. Looking for a technical partner to tackle Healthtech HIPAA blockers."
        },
        {
            id: "jordan-t",
            name: "Jordan T.",
            role: "AI Architect",
            location: "Berlin (Remote)",
            match: 89,
            skills: ["PyTorch", "AWS", "Go"],
            hasShipped: true,
            bio: "Built LLM infrastructures for Series A startups. Shipped 4 production apps in 12 months. Value fast sprints over long planning."
        }
    ];

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
                        filteredCandidates.map(c => (
                            <CandidateCard
                                key={c.id}
                                {...c}
                            />
                        ))
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


function CandidateCard({ id, name, role, location, match, skills, isVerified, hasShipped, isExFounder, bio }) {
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
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
                            {name[0]}
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
                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{match}%</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Match Score</div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                        <CompatibilityIcon icon={Scale} tooltip="Equity Alignment" />
                        <CompatibilityIcon icon={Clock} tooltip="Timezone Match" />
                        <CompatibilityIcon icon={Zap} tooltip="Speed Vibe" active />
                    </div>

                    <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                        <IntroButton candidate={{ name, role, id }} />
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

function IntroButton({ candidate }) {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleRequest = async () => {
        if (!user) return alert("Please login first");
        setLoading(true);

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

            // 2. Create intro request (so the other user can see it)
            const { error } = await supabase
                .from('intro_requests')
                .insert([{
                    from_user_id: user.id,
                    to_user_id: candidate.id,
                    status: 'pending',
                    message: `Hi! I'd love to connect and explore potential collaboration.`
                }]);

            if (error) throw error;
            setSent(true);
        } catch (e) {
            console.error(e);
            alert("Failed to request intro");
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <button
                className="btn-ghost"
                style={{ width: '100%', justifyContent: 'center', color: '#10B981', borderColor: '#10B981' }}
                disabled
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={16} /> Sent</span>
            </button>
        )
    }

    return (
        <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleRequest}
            disabled={loading}
        >
            {loading ? "Sending..." : "Request Intro"}
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
