import { Play, Github, Linkedin, ExternalLink, MapPin, Clock, ChevronLeft, ShieldCheck, Zap, Brain, MessageCircle, AlertTriangle, Users, Trophy, Target, Globe, Video, FileText, Heart, XCircle, Edit2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isSelf = !id || id === 'me';
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showVouchModal, setShowVouchModal] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', role: '', desc: '', stack: '' });
    const [newVouch, setNewVouch] = useState({ name: '', role: '', text: '' });

    // Initial Empty/Skeleton State
    const [profile, setProfile] = useState({
        name: "",
        headline: "",
        role: "Founder",
        location: "",
        status: "ready",
        availability: "",
        bio: "",
        tags: [],
        superpower: "",
        kryptonite: "",
        commStyle: "",
        triggerWarning: "",
        projects: [],
        antiPitch: [],
        vouches: [],
        vibe_data: []
    });

    const isOwner = isSelf || (user && user.id === id);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                // Determine which ID to fetch
                const targetId = isSelf ? user?.id : id;
                if (!targetId) {
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', targetId)
                    .single();

                if (error) {
                    // If profile doesn't exist yet (new user)
                    if (error.code === 'PGRST116') {
                        // Do nothing, just stop loading. 
                        // Render will show "Create Profile" because profile.name is empty.
                    } else {
                        throw error;
                    }
                } else if (data) {
                    // Map DB fields to State fields
                    setProfile({
                        ...data,
                        tags: data.tags || [],
                        projects: data.projects || [],
                        antiPitch: data.anti_pitch || [],
                        vouches: data.vouches || [],
                        availability: data.avail_status || "Full-time",
                        commStyle: data.comm_style || "",
                        vibe_data: data.vibe_data || [
                            { subject: 'Risk', A: 120, fullMark: 150 },
                            { subject: 'Pace', A: 98, fullMark: 150 },
                            { subject: 'Control', A: 86, fullMark: 150 },
                            { subject: 'Optimism', A: 130, fullMark: 150 },
                            { subject: 'Details', A: 60, fullMark: 150 },
                        ]
                    });
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user || id) {
            fetchProfile();
        } else {
            // If auth is done but no user, stop loading
            const timer = setTimeout(() => setLoading(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [user, id, isSelf]);


    const handleSave = async () => {
        if (!user) return;

        try {
            const profileData = {
                id: user.id,
                name: profile.name,
                headline: profile.headline,
                role: profile.role,
                location: profile.location,
                bio: profile.bio,
                tags: profile.tags,
                superpower: profile.superpower,
                kryptonite: profile.kryptonite,
                comm_style: profile.commStyle,
                trigger_warning: profile.triggerWarning,
                projects: profile.projects,
                anti_pitch: profile.antiPitch,
                vouches: profile.vouches,
                vibe_data: profile.vibe_data,
                avail_status: profile.availability,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(profileData, { onConflict: 'id' });

            if (error) throw error;

            setIsEditing(false);
            alert('Profile saved successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
                <div className="animate-spin" style={{ width: '30px', height: '30px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }}></div>
            </div>
        )
    }

    // New User State
    if (!profile.name && !isEditing) {
        return (
            <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center' }}>
                <div className="saas-panel" style={{ padding: '60px' }}>
                    <div style={{ width: '80px', height: '80px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Users size={40} color="var(--accent-primary)" />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>Setup Your Founder Profile</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                        Your profile is your pitch to potential co-founders. Add your bio, experience, and vibe signature to get verified matches.
                    </p>
                    <button
                        className="btn-primary"
                        style={{ padding: '16px 32px', fontSize: '1.1rem' }}
                        onClick={() => {
                            setProfile(prev => ({
                                ...prev,
                                name: user?.email?.split('@')[0] || "Founder",
                                headline: "Ready to Build",
                                status: "ready",
                                role: "Founder",
                                tags: [],
                                projects: [],
                                antiPitch: [],
                                vouches: [],
                                vibe_data: [
                                    { subject: 'Risk', A: 100, fullMark: 150 },
                                    { subject: 'Pace', A: 100, fullMark: 150 },
                                    { subject: 'Control', A: 100, fullMark: 150 },
                                    { subject: 'Optimism', A: 100, fullMark: 150 },
                                    { subject: 'Details', A: 100, fullMark: 150 },
                                ]
                            }));
                            setIsEditing(true);
                        }}
                    >
                        <Edit2 size={20} style={{ marginRight: '10px' }} />
                        Create My Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
            {/* ... Header ... */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <button
                    className="btn-ghost"
                    style={{ paddingLeft: 0, display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft size={18} /> Back
                </button>
                {isSelf && (
                    <button
                        className="btn-ghost"
                        onClick={() => {
                            if (isEditing) {
                                handleSave();
                            } else {
                                setIsEditing(true);
                            }
                        }}
                        style={{ color: isEditing ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                    >
                        {isEditing ? <Save size={18} style={{ marginRight: '8px' }} /> : <Edit2 size={18} style={{ marginRight: '8px' }} />}
                        {isEditing ? "Save Profile" : "Edit Profile"}
                    </button>
                )}
            </div>

            {/* 1. Hero Section (Signal & Status) */}
            <div className="saas-panel" style={{ padding: '48px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '100%', background: 'linear-gradient(45deg, transparent, rgba(99, 102, 241, 0.05))', pointerEvents: 'none' }}></div>

                <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '180px', height: '180px', borderRadius: '40px', background: '#334155',
                            border: '4px solid rgba(255,255,255,0.1)', flexShrink: 0, overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                        }}>
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} alt="Avatar" style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div style={{
                            position: 'absolute', bottom: '-10px', right: '-10px',
                            background: profile.status === 'ready' ? '#10B981' : '#F59E0B',
                            padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800,
                            color: 'white', border: '4px solid #1c1c24', textTransform: 'uppercase'
                        }}>
                            {profile.status === 'ready' ? 'Ready to Build' : 'Exploring'}
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '16px' }}>
                            {/* ... Inputs ... */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                {isEditing ? (
                                    <input className="glass-input" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={{ fontSize: '2rem', fontWeight: 800, padding: '12px 16px' }} />
                                ) : (
                                    <h1 style={{ fontSize: '3rem', fontWeight: 850, letterSpacing: '-0.02em', color: profile.name ? 'inherit' : 'var(--text-tertiary)' }}>
                                        {profile.name || "Your Name"}
                                    </h1>
                                )}

                                {isEditing ? (
                                    <div
                                        className={`tag ${profile.verified_at ? 'tag-green' : 'tag-blur'}`}
                                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', cursor: 'pointer' }}
                                        onClick={() => {
                                            const newVal = profile.verified_at ? null : 'Stripe'; // Toggle logic
                                            const company = newVal ? prompt("Verify with which company/identity?", "Ex-Stripe") : null;
                                            if (newVal && company) setProfile({ ...profile, verified_at: company });
                                            else setProfile({ ...profile, verified_at: null });
                                        }}
                                    >
                                        <ShieldCheck size={18} /> {profile.verified_at ? `Verified: ${profile.verified_at}` : 'Click to Verify'}
                                    </div>
                                ) : (
                                    <div className={`tag ${profile.verified_at ? 'tag-green' : 'tag-blur'}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}>
                                        <ShieldCheck size={18} /> {profile.verified_at ? `Verified: ${profile.verified_at}` : 'Get Verified'}
                                    </div>
                                )}
                            </div>

                            {isEditing ? (
                                <input className="glass-input" value={profile.headline} onChange={e => setProfile({ ...profile, headline: e.target.value })} style={{ width: '100%', marginBottom: '16px', fontSize: '1.2rem', fontWeight: 600 }} />
                            ) : (
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '16px' }}>
                                    {profile.headline}
                                </h2>
                            )}

                            <div style={{ display: 'flex', gap: '24px', color: 'var(--text-tertiary)', fontSize: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} /> {profile.location}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} /> {profile.availability}</div>
                            </div>
                        </div>

                        {isEditing ? (
                            <textarea className="glass-input" value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} style={{ width: '100%', minHeight: '120px', marginBottom: '24px', lineHeight: 1.6, resize: 'vertical' }} />
                        ) : (
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: '800px', marginBottom: '24px' }}>
                                {profile.bio}
                            </p>
                        )}

                        {isEditing ? (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                    className="glass-input"
                                    placeholder="Add tag..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = e.target.value.trim();
                                            if (val) setProfile({ ...profile, tags: [...profile.tags, val] });
                                            e.target.value = '';
                                        }
                                    }}
                                    style={{ padding: '6px 12px', width: '150px', fontSize: '0.9rem' }}
                                />
                                {(profile.tags || []).map((tag, i) => (
                                    <span key={i} className="tag tag-blue" onClick={() => setProfile({ ...profile, tags: profile.tags.filter((_, idx) => idx !== i) })} style={{ fontSize: '0.9rem', padding: '6px 14px', cursor: 'pointer' }}>{tag} <XCircle size={12} style={{ marginLeft: '4px' }} /></span>
                                ))}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {(profile.tags || []).map((tag, i) => (
                                    <span key={i} className="tag tag-blue" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '32px' }}>

                {/* Left Column: Vibe & User Manual */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <section className="saas-panel" style={{ padding: '32px' }}>
                        <h3 className="section-title"><Brain size={20} /> Vibe Signature</h3>
                        {/* ... Chart code (omitted for brevity, assume unchanged) ... */}
                        <div style={{ height: '300px', width: '100%', margin: '20px 0' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={profile.vibe_data || []}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
                                    <Radar
                                        name="Alex"
                                        dataKey="A"
                                        stroke="var(--accent-primary)"
                                        fill="var(--accent-primary)"
                                        fillOpacity={0.3}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '32px' }}>
                            {['superpower', 'kryptonite', 'commStyle', 'triggerWarning'].map((field, i) => (
                                <div key={field} style={{
                                    padding: '20px', borderRadius: '16px', background: isEditing ? 'rgba(255,255,255,0.05)' : (field === 'triggerWarning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.03)'), border: '1px solid var(--border-subtle)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--accent-primary)' }}>
                                        {i === 0 ? <Zap size={18} /> : i === 1 ? <XCircle size={18} /> : i === 2 ? <MessageCircle size={18} /> : <AlertTriangle size={18} />}
                                        <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {i === 0 ? 'My Superpower' : i === 1 ? 'My Kryptonite' : i === 2 ? 'Communication' : 'Trigger Warning'}
                                        </h4>
                                    </div>
                                    {isEditing ? (
                                        <textarea
                                            className="glass-input"
                                            value={profile[field] || ''}
                                            onChange={e => setProfile({ ...profile, [field]: e.target.value })}
                                            style={{ width: '100%', minHeight: '60px', fontSize: '0.95rem' }}
                                        />
                                    ) : (
                                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{profile[field]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="saas-panel" style={{ padding: '32px' }}>
                        <h3 className="section-title"><Target size={20} /> What I'm NOT Looking For</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {(profile.antiPitch || []).map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.1)', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <XCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
                                        <span>{item}</span>
                                    </div>
                                    {isEditing && <XCircle size={16} style={{ cursor: 'pointer', color: 'var(--text-tertiary)' }} onClick={() => setProfile({ ...profile, antiPitch: profile.antiPitch.filter((_, idx) => idx !== i) })} />}
                                </div>
                            ))}
                            {isEditing && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        className="glass-input"
                                        placeholder="Add dealbreaker..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = e.target.value.trim();
                                                if (val) setProfile({ ...profile, antiPitch: [...(profile.antiPitch || []), val] });
                                                e.target.value = '';
                                            }
                                        }}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Trophy Case & Media */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <section className="saas-panel" style={{ padding: '32px' }}>
                        <h3 className="section-title"><Trophy size={20} /> Trophy Case (Proof of Work)</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                            {(profile.projects || []).map((proj, i) => (
                                <div key={i} className="saas-panel project-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: proj.isFailure ? '1px dashed rgba(239, 68, 68, 0.3)' : '1px solid var(--border-subtle)', position: 'relative' }}>
                                    {isEditing && <button onClick={() => setProfile({ ...profile, projects: profile.projects.filter((_, idx) => idx !== i) })} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><XCircle size={16} /></button>}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: proj.color || '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                {proj.isFailure ? <XCircle size={24} /> : <Github size={24} />}
                                            </div>
                                            <div>
                                                <h4 style={{ fontWeight: 800, fontSize: '1.2rem', color: proj.isFailure ? '#ef4444' : 'var(--text-primary)' }}>{proj.title}</h4>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>{proj.role} • {proj.outcome}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>{proj.desc}</p>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stack: {proj.stack}</div>
                                </div>
                            ))}
                            {isEditing && (
                                <button
                                    className="btn-ghost"
                                    style={{ padding: '12px', fontSize: '0.85rem' }}
                                    onClick={() => setShowProjectModal(true)}
                                >
                                    + Add Project (Quick)
                                </button>
                            )}
                        </div>
                    </section>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <section className="saas-panel" style={{ padding: '24px' }}>
                            <h3 className="section-title" style={{ fontSize: '1rem' }}><Video size={18} /> Media Gallery</h3>
                            <div style={{ aspectRatio: '16/9', background: 'black', borderRadius: '12px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <div style={{ position: 'absolute', inset: 0, opacity: 0.5, background: 'url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80) center/cover' }}></div>
                                <Play size={24} fill="white" color="white" style={{ zIndex: 1 }} />
                                <div style={{ position: 'absolute', bottom: '12px', left: '12px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px' }}>60s Intro</div>
                            </div>
                            {isEditing && <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '8px', textAlign: 'center' }}>Video upload coming soon.</p>}
                        </section>

                        <section className="saas-panel" style={{ padding: '24px' }}>
                            <h3 className="section-title" style={{ fontSize: '1rem' }}><FileText size={18} /> Social Proof</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {(profile.vouches || []).map((vouch, i) => (
                                    <div key={i} style={{ position: 'relative' }}>
                                        {isEditing && <XCircle size={12} style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer', color: '#ef4444' }} onClick={() => setProfile({ ...profile, vouches: profile.vouches.filter((_, idx) => idx !== i) })} />}
                                        <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '8px' }}>"{vouch.text}"</p>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>— {vouch.name} <span style={{ fontWeight: 400, color: 'var(--text-tertiary)' }}>({vouch.role})</span></div>
                                    </div>
                                ))}
                                {isEditing && (
                                    <button
                                        className="btn-ghost"
                                        style={{ fontSize: '0.8rem', padding: '8px' }}
                                        onClick={() => setShowVouchModal(true)}
                                    >+ Add Vouch</button>
                                )}
                            </div>
                        </section>
                    </div>

                    {!isSelf && (
                        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                            <button className="btn-primary" style={{ flex: 2, height: '60px', fontSize: '1.2rem' }} onClick={() => navigate('/schedule')}>
                                Initiate Vibe Check <ArrowRight size={20} />
                            </button>
                            <button className="btn-ghost" style={{ flex: 1, height: '60px' }}>
                                Save to Shortlist
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 1.25rem;
                    fontWeight: 800;
                    margin-bottom: 24px;
                    color: var(--text-primary);
                }
                .project-card:hover {
                    background: rgba(255,255,255,0.05) !important;
                    transform: translateY(-4px);
                    border-color: var(--accent-primary) !important;
                }
            `}</style>
        </div>
    );
}

function ManualItem({ icon, title, text, color = 'rgba(255,255,255,0.03)' }) {
    return (
        <div style={{
            padding: '20px',
            borderRadius: '16px',
            background: color,
            border: '1px solid var(--border-subtle)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--accent-primary)' }}>
                {icon}
                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h4>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</p>
        </div>
    )
}

function ArrowRight({ size, color = "currentColor" }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
}
