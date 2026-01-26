import { Play, Github, Linkedin, ExternalLink, MapPin, Clock, ChevronLeft, ShieldCheck, Zap, Brain, MessageCircle, AlertTriangle, Users, Trophy, Target, Globe, Video, FileText, Heart, XCircle, Edit2, Save, Image, Trash2, Plus, ChevronRight, Maximize2, RefreshCcw, ChevronDown, Twitter, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Add basic styles for avatar overlay
const styles = `
.avatar-overlay { opacity: 0; }
.avatar-overlay:hover { opacity: 1; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }
`;
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { getArchetypeDetails } from '../data/archetypes';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isSelf = !id || id === 'me';
    const { user, loading: authLoading } = useAuth(); // Import auth loading
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' }); // For sync feedback
    const [isEditing, setIsEditing] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showVouchModal, setShowVouchModal] = useState(false);
    const [showMediaEditModal, setShowMediaEditModal] = useState(false);
    const [showPresetModal, setShowPresetModal] = useState(false); // New modal state
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
    const [newProject, setNewProject] = useState({ title: '', role: '', desc: '', stack: '' });
    const [newVouch, setNewVouch] = useState({ name: '', role: '', text: '' });
    const [initialStatus, setInitialStatus] = useState('ready'); // For setup screen
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [verifyCompany, setVerifyCompany] = useState('');
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

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
        vibe_data: [],
        media_gallery: [],
        social_links: { linkedin: '', twitter: '', github: '', website: '' }
    });

    const isOwner = isSelf || (user && user.id === id);


    // Redirect if trying to view own profile but not logged in
    useEffect(() => {
        if (!authLoading && !user && !id) {
            navigate('/login');
        }
    }, [user, id, authLoading, navigate]);

    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async () => {
            // Wait for auth to settle
            if (authLoading) return;

            setLoading(true);
            try {
                // Determine which ID to fetch
                const targetId = isSelf ? user?.id : id;
                if (!targetId) {
                    if (isMounted) setLoading(false);
                    return;
                }
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', targetId)
                    .maybeSingle();

                if (error) throw error;

                if (data && isMounted) {
                    const richDetails = getArchetypeDetails(data.headline);
                    setProfile(prev => ({
                        ...prev,
                        ...data,
                        // Apply defaults if DB fields are empty
                        commStyle: data.comm_style || richDetails.commStyle,
                        triggerWarning: data.trigger_warning || richDetails.triggerWarning,
                        superpower: data.superpower || richDetails.superpower,
                        kryptonite: data.kryptonite || richDetails.kryptonite,
                        antiPitch: (data.anti_pitch && data.anti_pitch.length > 0) ? data.anti_pitch : (
                            // Use fallback logic for antiPitch if empty
                            richDetails.name === 'Sovereign' ? ["Passive employees", "Safety seekers", "Bureaucrats"] :
                                richDetails.name === 'Architect' ? ["Sales-first overpromisers", "Spaghetti hackers", "Short-term thinkers"] :
                                    ["Chaos agents", "Daily pivots", "Disorganized creatives"]
                        ),
                        // Ensure arrays are at least empty arrays if null in DB
                        tags: data.tags || [],
                        projects: data.projects || [],
                        vouches: data.vouches || [],
                        vibe_data: data.vibe_data || [],
                        media_gallery: data.media_gallery || [],
                        social_links: data.social_links || { linkedin: '', twitter: '', github: '', website: '' }
                    }));
                }
            } catch (err) {
                if (isMounted) {
                    if (err.name !== 'AbortError') {
                        console.error("Error fetching profile:", err);
                        setError(err.message);
                    }
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if ((user || id) && !authLoading) {
            fetchProfile();
        } else if (!authLoading) {
            // Not waiting for auth, but no user/id? Stop loading.
            if (isMounted) setLoading(false);
        }

        return () => { isMounted = false; };
    }, [user, id, isSelf, authLoading]);


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
                media_gallery: profile.media_gallery,
                avail_status: profile.availability,
                updated_at: new Date().toISOString(),
                media_gallery: profile.media_gallery,
                avail_status: profile.availability,
                updated_at: new Date().toISOString(),
                social_links: profile.social_links,
                subscription_tier: profile.subscription_tier || 'founder' // Default to Founder for early users
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(profileData, { onConflict: 'id' });

            if (error) throw error;

            setIsEditing(false);
            setStatus({ type: 'success', message: 'Profile saved successfully!' });
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        } catch (error) {
            console.error('Error saving profile:', error);
            setStatus({ type: 'error', message: 'Failed to save: ' + error.message });
            setTimeout(() => setStatus({ type: '', message: '' }), 5000);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
                <div className="animate-spin" style={{ width: '30px', height: '30px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }}></div>
            </div>
        )
    }

    // --- SUBCOMPONENTS (RENDERED INSIDE) ---
    const PresetModal = () => (
        <AnimatePresence>
            {showPresetModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="saas-panel"
                        style={{ width: '100%', maxWidth: '500px', padding: '32px', border: '1px solid var(--accent-primary)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <Zap size={48} color="var(--accent-primary)" style={{ marginBottom: '16px' }} />
                            <h2 style={{ fontSize: '1.8rem', fontFamily: 'Outfit', marginBottom: '8px' }}>Select Archetype</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Instantly populate your profile with a Founder Persona.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['Sovereign', 'Architect', 'Operator'].map((type) => (
                                <button
                                    key={type}
                                    className="hover-glass"
                                    onClick={() => {
                                        const details = getArchetypeDetails(type);
                                        setProfile(prev => ({
                                            ...prev,
                                            headline: details.headline,
                                            role: details.role,
                                            bio: details.bio,
                                            superpower: details.superpower,
                                            kryptonite: details.kryptonite,
                                            commStyle: details.commStyle,
                                            triggerWarning: details.triggerWarning,
                                            vibe_data: details.vibe_data
                                        }));
                                        setShowPresetModal(false);
                                        setStatus({ type: 'success', message: `${type} preset applied!` });
                                        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
                                    }}
                                    style={{
                                        padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '1.1rem', fontWeight: 600,
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}
                                >
                                    <span>The {type}</span>
                                    <ChevronRight size={18} color="var(--text-tertiary)" />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowPresetModal(false)}
                            style={{ padding: '12px', width: '100%', background: 'transparent', border: 'none', color: 'var(--text-tertiary)', marginTop: '24px', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    // New User State (Only if no Vibe/Headline data exists AND isSelf)
    if (isSelf && !profile.headline && (!profile.vibe_data || profile.vibe_data.length === 0) && !isEditing) {
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

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px', gap: '16px' }}>
                        <div
                            onClick={() => setInitialStatus('ready')}
                            style={{
                                padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', border: '2px solid',
                                borderColor: initialStatus === 'ready' ? '#10B981' : 'transparent',
                                background: initialStatus === 'ready' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                                color: initialStatus === 'ready' ? '#10B981' : 'var(--text-secondary)'
                            }}
                        >
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Ready to Build</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Actively looking</div>
                        </div>
                        <div
                            onClick={() => setInitialStatus('exploring')}
                            style={{
                                padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', border: '2px solid',
                                borderColor: initialStatus === 'exploring' ? '#F59E0B' : 'transparent',
                                background: initialStatus === 'exploring' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.05)',
                                color: initialStatus === 'exploring' ? '#F59E0B' : 'var(--text-secondary)'
                            }}
                        >
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Exploring</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Just browsing</div>
                        </div>
                    </div>

                    <button
                        className="btn-primary"
                        style={{ padding: '16px 32px', fontSize: '1.1rem' }}
                        onClick={() => {
                            setProfile(prev => ({
                                ...prev,
                                name: user?.email?.split('@')[0] || "Founder",
                                headline: "SaaS Founder",
                                bio: "Add your bio here...",
                                location: "Add location",
                                status: initialStatus,
                                role: "Founder",
                                tags: [],
                                projects: [],
                                antiPitch: [],
                                vouches: [],
                                superpower: "Add your superpower",
                                kryptonite: "Add your kryptonite",
                                commStyle: "Add your communication style",
                                triggerWarning: "",
                                media_gallery: [],
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


                    <div style={{ marginTop: '32px' }}>
                        <button
                            className="btn-ghost"
                            style={{ fontSize: '0.9rem', opacity: 0.8 }}
                            onClick={async () => {
                                // Helper to save immediately
                                const saveToDb = async (arch, leadName) => {
                                    setLoading(true);
                                    try {
                                        // Get rich data for this archetype
                                        const details = getArchetypeDetails(arch);

                                        // Construct full profile update
                                        const updates = {
                                            id: user.id,
                                            name: leadName || profile.name || (user.email ? user.email.split('@')[0] : "Founder"),
                                            headline: details.headline,
                                            role: details.role,
                                            bio: details.bio,
                                            superpower: details.superpower,
                                            kryptonite: details.kryptonite,
                                            comm_style: details.commStyle,
                                            trigger_warning: details.triggerWarning,
                                            vibe_data: details.vibe_data,

                                            subscription_tier: 'founder', // Auto-grant Founder status
                                            updated_at: new Date().toISOString()
                                        };

                                        const { error } = await supabase
                                            .from('profiles')
                                            .upsert(updates, { onConflict: 'id' });

                                        if (error) throw error;

                                        // Update local state to reflect changes
                                        setProfile(prev => ({ ...prev, ...updates }));
                                        setStatus({
                                            type: 'success',
                                            message: `Sync Complete! Found "${arch}". refreshing...`
                                        });
                                        setTimeout(() => window.location.reload(), 2000);
                                    } catch (err) {
                                        console.error(err);
                                        setStatus({ type: 'error', message: "Sync failed: " + err.message });
                                    } finally {
                                        setLoading(false);
                                    }
                                };

                                // 1. Try LocalStorage
                                const localArchetype = localStorage.getItem('covibr_archetype');
                                const localName = localStorage.getItem('covibr_name');

                                if (localArchetype) {
                                    await saveToDb(localArchetype, localName);
                                    return;
                                }

                                // 2. Try Database
                                if (!user?.email) {
                                    setStatus({ type: 'error', message: "Please sign in to check database records." });
                                    return;
                                }

                                const { data, error } = await supabase
                                    .from('leads')
                                    .select('archetype, name')
                                    .eq('email', user.email)
                                    .order('created_at', { ascending: false })
                                    .limit(1)
                                    .single();

                                if (data?.archetype) {
                                    await saveToDb(data.archetype, data.name);
                                } else {
                                    setStatus({ type: 'error', message: "No quiz result found for " + user.email + ". Please take the quiz again." });
                                }
                            }}
                        >
                            <RefreshCcw size={14} style={{ marginRight: '6px' }} />
                            I just took the quiz (Sync Result)
                        </button>

                        {/* Status Message Display */}
                        {loading && <div style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Searching for records...</div>}
                        {status.message && (
                            <div style={{
                                marginTop: '16px',
                                padding: '12px',
                                borderRadius: '8px',
                                background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                color: status.type === 'success' ? '#10B981' : '#EF4444',
                            }}>
                                {status.message}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        );
    }



    const handleAvatarUpload = async (event) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                return; // User cancelled
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                if (uploadError.message.includes('bucket not found')) {
                    setStatus({ type: 'error', message: "Storage Bucket 'avatars' missing." });
                } else {
                    throw uploadError;
                }
                return;
            }

            // Get URL
            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            if (data) {
                setProfile({ ...profile, avatar_url: data.publicUrl });
                setStatus({ type: 'success', message: 'Avatar updated!' });
                setTimeout(() => setStatus({ type: '', message: '' }), 3000);
            }

        } catch (error) {
            setStatus({ type: 'error', message: 'Upload failed: ' + error.message });
        } finally {
            setLoading(false); // Fix: logic used 'setUploading' but code used 'setLoading' or similar? Checking previous code. 'setUploading' was used.
            setUploading(false);
            setTimeout(() => setStatus({ type: '', message: '' }), 5000);
        }
    };

    // --- TOAST NOTIFICATION COMPONENT ---
    const Toast = () => (
        <AnimatePresence>
            {status.message && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 20, x: '-50%' }}
                    style={{
                        position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
                        zIndex: 200, padding: '12px 24px', borderRadius: '12px',
                        background: status.type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
                        color: 'white', fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    {status.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                    {status.message}
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
            <style>{styles}</style>

            <Toast />

            {/* Modal Injection */}
            <PresetModal />
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                style={{ display: 'none' }}
            />
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
                            <img
                                src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
                                alt="Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {isEditing && (
                                <div
                                    style={{
                                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', opacity: 0, hover: { opacity: 1 }, transition: 'opacity 0.2s'
                                    }}
                                    className="avatar-overlay"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {uploading ? (
                                        <RefreshCcw size={24} className="spin" color="white" />
                                    ) : (
                                        <Edit2 size={24} color="white" />
                                    )}
                                </div>
                            )}
                        </div>
                        {isEditing ? (
                            <div style={{
                                position: 'absolute', bottom: '-10px', right: '-10px',
                                width: '160px' // Ensure enough width for the dropdown
                            }}>
                                <select
                                    value={profile.status}
                                    onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                                    className="glass-input" // Use glass-input for consistency but override styles
                                    style={{
                                        width: '100%',
                                        background: profile.status === 'ready' ? '#10B981' : '#F59E0B',
                                        color: 'white',
                                        border: '4px solid #1c1c24',
                                        borderRadius: '20px',
                                        padding: '6px 32px 6px 16px', // Right padding for arrow
                                        fontSize: '0.8rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        appearance: 'none', // Hide default arrow
                                        outline: 'none',
                                        textAlign: 'center'
                                    }}
                                >
                                    <option value="ready" style={{ color: 'black' }}>Ready to Build</option>
                                    <option value="exploring" style={{ color: 'black' }}>Exploring</option>
                                </select>
                                <ChevronDown size={14} color="white" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        ) : (
                            <div style={{
                                position: 'absolute', bottom: '-10px', right: '-10px',
                                background: profile.status === 'ready' ? '#10B981' : '#F59E0B',
                                padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800,
                                color: 'white', border: '4px solid #1c1c24', textTransform: 'uppercase'
                            }}>
                                {profile.status === 'ready' ? 'Ready to Build' : 'Exploring'}
                            </div>
                        )}
                        {isEditing && (
                            <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
                                <button
                                    className="btn-ghost"
                                    onClick={() => setShowPresetModal(true)}
                                    style={{ fontSize: '0.8rem', padding: '6px 12px', border: '1px dashed var(--text-tertiary)' }}
                                >
                                    <Zap size={14} style={{ marginRight: '6px' }} /> Apply Preset
                                </button>
                            </div>
                        )}
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
                                        onClick={() => setShowVerifyModal(true)}
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
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '4px' }}>Headline</label>
                                    <input className="glass-input" value={profile.headline} onChange={e => setProfile({ ...profile, headline: e.target.value })} style={{ width: '100%', fontSize: '1.2rem', fontWeight: 600 }} placeholder="e.g. Building the next big thing" />
                                </div>
                            ) : (
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '16px' }}>
                                    {profile.headline}
                                </h2>
                            )}

                            {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {/* Location & Availability */}
                                    <div style={{ display: 'flex', gap: '12px', fontSize: '1rem', alignItems: 'center' }}>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MapPin size={18} color="var(--text-tertiary)" />
                                            <input
                                                className="glass-input"
                                                value={profile.location || ''}
                                                onChange={e => setProfile({ ...profile, location: e.target.value })}
                                                placeholder="City, Country"
                                                style={{ width: '100%', padding: '8px' }}
                                            />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Clock size={18} color="var(--text-tertiary)" />
                                            <select
                                                className="glass-input"
                                                value={profile.availability || 'Full-time'}
                                                onChange={e => setProfile({ ...profile, availability: e.target.value })}
                                                style={{ width: '100%', padding: '8px', cursor: 'pointer' }}
                                            >
                                                <option value="Full-time">Full-time</option>
                                                <option value="Part-time">Part-time</option>
                                                <option value="Nights & Weekends">Nights & Weekends</option>
                                                <option value="Advisory">Advisory</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Social Links Editing */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div style={{ display: 'flex', items: 'center', gap: '8px' }}>
                                            <Linkedin size={16} color="var(--text-tertiary)" style={{ marginTop: '8px' }} />
                                            <input className="glass-input" placeholder="LinkedIn URL" value={profile.social_links?.linkedin || ''} onChange={e => setProfile({ ...profile, social_links: { ...profile.social_links, linkedin: e.target.value } })} style={{ width: '100%', fontSize: '0.85rem' }} />
                                        </div>
                                        <div style={{ display: 'flex', items: 'center', gap: '8px' }}>
                                            <Twitter size={16} color="var(--text-tertiary)" style={{ marginTop: '8px' }} />
                                            <input className="glass-input" placeholder="X (Twitter) URL" value={profile.social_links?.twitter || ''} onChange={e => setProfile({ ...profile, social_links: { ...profile.social_links, twitter: e.target.value } })} style={{ width: '100%', fontSize: '0.85rem' }} />
                                        </div>
                                        <div style={{ display: 'flex', items: 'center', gap: '8px' }}>
                                            <Github size={16} color="var(--text-tertiary)" style={{ marginTop: '8px' }} />
                                            <input className="glass-input" placeholder="GitHub URL" value={profile.social_links?.github || ''} onChange={e => setProfile({ ...profile, social_links: { ...profile.social_links, github: e.target.value } })} style={{ width: '100%', fontSize: '0.85rem' }} />
                                        </div>
                                        <div style={{ display: 'flex', items: 'center', gap: '8px' }}>
                                            <Globe size={16} color="var(--text-tertiary)" style={{ marginTop: '8px' }} />
                                            <input className="glass-input" placeholder="Personal Website" value={profile.social_links?.website || ''} onChange={e => setProfile({ ...profile, social_links: { ...profile.social_links, website: e.target.value } })} style={{ width: '100%', fontSize: '0.85rem' }} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', gap: '24px', color: 'var(--text-tertiary)', fontSize: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} /> {profile.location || 'Remote'}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} /> {profile.availability || 'Full-time'}</div>
                                    </div>

                                    {/* Social Links Display */}
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        {profile.social_links?.linkedin && (
                                            <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: '8px' }} title="LinkedIn">
                                                <Linkedin size={18} />
                                            </a>
                                        )}
                                        {profile.social_links?.twitter && (
                                            <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: '8px' }} title="X (Twitter)">
                                                <Twitter size={18} />
                                            </a>
                                        )}
                                        {profile.social_links?.github && (
                                            <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: '8px' }} title="GitHub">
                                                <Github size={18} />
                                            </a>
                                        )}
                                        {profile.social_links?.website && (
                                            <a href={profile.social_links.website} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: '8px' }} title="Website">
                                                <Globe size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
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
                        <div style={{ height: '300px', width: '100%', minHeight: '300px', margin: '20px 0' }}>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 className="section-title" style={{ fontSize: '1rem', marginBottom: 0 }}><Image size={18} /> Media Gallery</h3>
                                {isEditing && (
                                    <button
                                        onClick={() => setShowMediaEditModal(true)}
                                        className="btn-ghost"
                                        style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                                    >
                                        <Edit2 size={12} style={{ marginRight: '4px' }} /> Edit
                                    </button>
                                )}
                            </div>

                            {(profile.media_gallery && profile.media_gallery.length > 0) ? (
                                <div
                                    style={{ aspectRatio: '16/9', background: 'black', borderRadius: '12px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
                                    onClick={() => setSelectedMediaIndex(0)}
                                >
                                    <img
                                        src={profile.media_gallery[0].url}
                                        alt={profile.media_gallery[0].description}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 30%)' }}></div>
                                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px' }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{profile.media_gallery[0].description}</div>
                                        {profile.media_gallery.length > 1 && (
                                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                                                + {profile.media_gallery.length - 1} more
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.5)', padding: '6px', borderRadius: '50%' }}>
                                        <Maximize2 size={16} color="white" />
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    aspectRatio: '16/9',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: '12px',
                                    border: '1px dashed var(--border-subtle)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-tertiary)',
                                    cursor: isEditing ? 'pointer' : 'default'
                                }}
                                    onClick={() => isEditing && setShowMediaEditModal(true)}
                                >
                                    <Image size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                                    <span style={{ fontSize: '0.9rem' }}>{isEditing ? 'Add photos/videos' : 'No media added'}</span>
                                </div>
                            )}
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

            {/* Add Project Modal */}
            <AnimatePresence>
                {showProjectModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowProjectModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="saas-panel"
                            style={{ maxWidth: '500px', width: '100%', padding: '32px' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Add Project</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Project Title</label>
                                    <input
                                        className="glass-input"
                                        placeholder="e.g., FinanceHub"
                                        value={newProject.title}
                                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Your Role</label>
                                    <input
                                        className="glass-input"
                                        placeholder="e.g., Co-founder"
                                        value={newProject.role}
                                        onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Tech Stack</label>
                                    <input
                                        className="glass-input"
                                        placeholder="e.g., React, Node, PostgreSQL"
                                        value={newProject.stack}
                                        onChange={(e) => setNewProject({ ...newProject, stack: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Description</label>
                                    <textarea
                                        className="glass-input"
                                        placeholder="Brief description of the project..."
                                        rows={3}
                                        value={newProject.desc}
                                        onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                    <button
                                        className="btn-primary"
                                        style={{ flex: 1 }}
                                        onClick={() => {
                                            if (newProject.title.trim()) {
                                                setProfile({
                                                    ...profile,
                                                    projects: [...(profile.projects || []), {
                                                        title: newProject.title,
                                                        role: newProject.role || 'Founder',
                                                        outcome: 'Active',
                                                        desc: newProject.desc || 'Description...',
                                                        stack: newProject.stack || 'Various',
                                                        color: '#3b82f6'
                                                    }]
                                                });
                                                setNewProject({ title: '', role: '', desc: '', stack: '' });
                                                setShowProjectModal(false);
                                            }
                                        }}
                                    >
                                        Add Project
                                    </button>
                                    <button
                                        className="btn-ghost"
                                        style={{ flex: 1 }}
                                        onClick={() => {
                                            setNewProject({ title: '', role: '', desc: '', stack: '' });
                                            setShowProjectModal(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Vouch Modal */}
            <AnimatePresence>
                {showVouchModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowVouchModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="saas-panel"
                            style={{ maxWidth: '500px', width: '100%', padding: '32px' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Add Vouch</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Name</label>
                                    <input
                                        className="glass-input"
                                        placeholder="e.g., Sarah Chen"
                                        value={newVouch.name}
                                        onChange={(e) => setNewVouch({ ...newVouch, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Their Role</label>
                                    <input
                                        className="glass-input"
                                        placeholder="e.g., Former Co-founder"
                                        value={newVouch.role}
                                        onChange={(e) => setNewVouch({ ...newVouch, role: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Testimonial</label>
                                    <textarea
                                        className="glass-input"
                                        placeholder="What did they say about working with you?"
                                        rows={4}
                                        value={newVouch.text}
                                        onChange={(e) => setNewVouch({ ...newVouch, text: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                    <button
                                        className="btn-primary"
                                        style={{ flex: 1 }}
                                        onClick={() => {
                                            if (newVouch.name.trim() && newVouch.text.trim()) {
                                                setProfile({
                                                    ...profile,
                                                    vouches: [...(profile.vouches || []), {
                                                        name: newVouch.name,
                                                        role: newVouch.role || 'Peer',
                                                        text: newVouch.text
                                                    }]
                                                });
                                                setNewVouch({ name: '', role: '', text: '' });
                                                setShowVouchModal(false);
                                            }
                                        }}
                                    >
                                        Add Vouch
                                    </button>
                                    <button
                                        className="btn-ghost"
                                        style={{ flex: 1 }}
                                        onClick={() => {
                                            setNewVouch({ name: '', role: '', text: '' });
                                            setShowVouchModal(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Media Gallery Edit Modal */}
            <AnimatePresence>
                {showMediaEditModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowMediaEditModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="saas-panel"
                            style={{ maxWidth: '600px', width: '100%', padding: '32px', maxHeight: '80vh', overflowY: 'auto' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Edit Media Gallery</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Add up to 5 images to showcase your work or vibe. Paste direct image URLs below.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {(profile.media_gallery || []).map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'start', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                        <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#000' }}>
                                            <img src={item.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL'} />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <input
                                                className="glass-input"
                                                value={item.url}
                                                placeholder="Image URL..."
                                                onChange={(e) => {
                                                    const newGallery = [...profile.media_gallery];
                                                    newGallery[i].url = e.target.value;
                                                    setProfile({ ...profile, media_gallery: newGallery });
                                                }}
                                            />
                                            <input
                                                className="glass-input"
                                                value={item.description}
                                                placeholder="Description (e.g. 'Team Offsite 2024')"
                                                onChange={(e) => {
                                                    const newGallery = [...profile.media_gallery];
                                                    newGallery[i].description = e.target.value;
                                                    setProfile({ ...profile, media_gallery: newGallery });
                                                }}
                                            />
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newGallery = profile.media_gallery.filter((_, idx) => idx !== i);
                                                setProfile({ ...profile, media_gallery: newGallery });
                                            }}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}

                                {(profile.media_gallery?.length || 0) < 5 && (
                                    <button
                                        className="btn-ghost"
                                        onClick={() => {
                                            const newGallery = [...(profile.media_gallery || []), { url: '', description: '' }];
                                            setProfile({ ...profile, media_gallery: newGallery });
                                        }}
                                        style={{ borderStyle: 'dashed', justifyContent: 'center' }}
                                    >
                                        <Plus size={18} style={{ marginRight: '8px' }} /> Add Image
                                    </button>
                                )}

                                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <button
                                        className="btn-primary"
                                        style={{ flex: 1, justifyContent: 'center' }}
                                        onClick={() => setShowMediaEditModal(false)}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Full Screen Media Carousel Modal */}
            <AnimatePresence>
                {selectedMediaIndex !== null && profile.media_gallery?.[selectedMediaIndex] && (
                    <div
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setSelectedMediaIndex(null)}
                    >
                        <button
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', zIndex: 210 }}
                            onClick={() => setSelectedMediaIndex(null)}
                        >
                            <XCircle size={24} />
                        </button>

                        <div
                            style={{ width: '100%', maxWidth: '1000px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.img
                                key={selectedMediaIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                src={profile.media_gallery[selectedMediaIndex].url}
                                alt={profile.media_gallery[selectedMediaIndex].description}
                                style={{ maxHeight: '70vh', maxWidth: '100%', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ color: 'white', textAlign: 'center' }}
                            >
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>{profile.media_gallery[selectedMediaIndex].description}</h3>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                    {profile.media_gallery.map((_, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                width: '8px', height: '8px', borderRadius: '50%',
                                                background: i === selectedMediaIndex ? 'white' : 'rgba(255,255,255,0.3)',
                                                cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                            onClick={() => setSelectedMediaIndex(i)}
                                        />
                                    ))}
                                </div>
                            </motion.div>

                            {/* Navigation Arrows */}
                            {selectedMediaIndex > 0 && (
                                <button
                                    style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedMediaIndex(selectedMediaIndex - 1);
                                    }}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}
                            {selectedMediaIndex < profile.media_gallery.length - 1 && (
                                <button
                                    style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedMediaIndex(selectedMediaIndex + 1);
                                    }}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </AnimatePresence>


            {/* Verification Modal */}
            <AnimatePresence>
                {showVerifyModal && (
                    <div
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                        }}
                        onClick={() => setShowVerifyModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="saas-panel"
                            style={{ width: '400px', padding: '32px', border: '1px solid var(--border-subtle)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>Get Verified</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                                Add a verification badge to build trust. Provide your previous company or current affiliation.
                            </p>

                            <input
                                className="glass-input"
                                placeholder="e.g. Ex-Stripe, YC W24, Serial Founder"
                                value={verifyCompany}
                                onChange={e => setVerifyCompany(e.target.value)}
                                style={{ width: '100%', marginBottom: '24px' }}
                                autoFocus
                            />

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    className="btn-primary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                    onClick={() => {
                                        setProfile({ ...profile, verified_at: verifyCompany });
                                        setShowVerifyModal(false);
                                        setVerifyCompany('');
                                    }}
                                >
                                    Verify
                                </button>
                                <button
                                    className="btn-ghost"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                    onClick={() => setShowVerifyModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
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
