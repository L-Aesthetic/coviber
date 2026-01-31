import { User, Mail, Lock, Bell, Shield, Eye, EyeOff, Save, Globe, Smartphone, RefreshCcw, Github, Linkedin, Twitter, Activity, RotateCcw, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { motion } from 'framer-motion';

export default function AccountSettings() {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        display_name: '',
        location: '',
        bio: '',
        avatar_url: '',
        social_links: {
            linkedin: '',
            twitter: '',
            github: '',
            website: ''
        }
    });

    // Preferences State
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [email, setEmail] = useState('');
    const [profileVisibility, setProfileVisibility] = useState('public');
    const [twoFactor, setTwoFactor] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        matches: true,
        marketing: false
    });

    // Avatar Upload State
    const [uploading, setUploading] = useState(false);
    const [headline, setHeadline] = useState(''); // For Protocol section

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setEmail(user.email);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('notification_prefs, headline')
                    .eq('id', user.id)
                    .maybeSingle(); // Use maybeSingle to avoid 406/JSON error if no row

                if (error) {
                    console.error("Error fetching profile settings:", error);
                    // Don't throw, just allow render with defaults to avoid stuck loading
                }

                if (data) {
                    setHeadline(data.headline || '');
                    if (data.notification_prefs) {
                        setNotifications(data.notification_prefs);
                    }
                }
            } catch (err) {
                console.error("Unexpected error in settings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, authLoading]);

    const handleChange = (e) => {
        if (e.target.name.startsWith('social_')) {
            const platform = e.target.name.replace('social_', '');
            setFormData({
                ...formData,
                social_links: {
                    ...formData.social_links,
                    [platform]: e.target.value
                }
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleAvatarUpload = async (event) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) return;

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            if (data) {
                setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }));
            }
        } catch (error) {
            alert('Error uploading avatar: ' + error.message);
        } finally {
            setUploading(false);
        }
    };


    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        if (status.message) {
            const timer = setTimeout(() => setStatus({ type: '', message: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleSave = async () => {
        setSaving(true);
        setStatus({ type: '', message: '' });
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    notification_prefs: notifications,
                    headline: headline, // Also save headline changes if any
                    updated_at: new Date()
                })
                .eq('id', user.id);

            if (error) throw error;

            if (newPassword) {
                const { error: pwdError } = await supabase.auth.updateUser({ password: newPassword });
                if (pwdError) throw pwdError;
                setNewPassword(''); // Clear after save
            }

            setStatus({ type: 'success', message: 'Settings updated successfully.' });
        } catch (error) {
            console.error('Error updating settings:', error);
            setStatus({ type: 'error', message: 'Failed to update settings. ' + error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        setLoading(true);
        try {
            console.log("Attempting to delete account for user:", user.id);

            // 1. Try to clean up dependencies (Best Effort)
            // Even if these fail (e.g. no permission), we continue to try profile delete.
            try {
                await supabase.from('messages').delete().eq('sender_id', user.id);
                await supabase.from('intro_requests').delete().eq('sender_id', user.id);
            } catch (err) {
                console.warn("Cleanup warning:", err);
            }

            // 2. Delete Profile
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', user.id);

            if (error) {
                console.error("Supabase Deletion Error:", error);
                throw error;
            }

            // 3. Sign out
            await supabase.auth.signOut();
            window.location.href = '/landing';
        } catch (error) {
            console.error('Error deleting account:', error);
            // Show the ACTUAL error message to the user so they can report it
            alert(`Error deleting account: ${error.message || JSON.stringify(error)}. Please screenshot this and contact support.`);
            setLoading(false);
        } finally {
            // Don't close modal if error, so they can retry
            if (!loading) setShowDeleteModal(false);
        }
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading settings...</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Account Settings
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Manage your account security and preferences.
                </p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Email & Password */}
                <div className="saas-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Lock size={20} color="var(--accent-primary)" />
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Email & Password</h2>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Email Address
                        </label>
                        <input
                            className="glass-input"
                            type="email"
                            value={email}
                            disabled
                            style={{ width: '100%', opacity: 0.7, cursor: 'not-allowed' }}
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '6px' }}>
                            Contact support to change email.
                        </p>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Change Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="glass-input"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ width: '100%', paddingRight: '48px' }}
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-tertiary)'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notifications Panel (Adding missing notifications UI we saw in state but wasn't rendered fully) */}
                <div className="saas-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Bell size={20} color="var(--accent-primary)" />
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Notification Preferences</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <ToggleSetting
                            label="Email Notifications"
                            description="Receive essential updates and login alerts."
                            checked={notifications.email}
                            onChange={(val) => setNotifications({ ...notifications, email: val })}
                        />
                        <ToggleSetting
                            label="Match Alerts"
                            description="Get notified when a new co-founder match is found."
                            checked={notifications.matches}
                            onChange={(val) => setNotifications({ ...notifications, matches: val })}
                        />
                        <ToggleSetting
                            label="Marketing"
                            description="Product updates and newsletter."
                            checked={notifications.marketing}
                            onChange={(val) => setNotifications({ ...notifications, marketing: val })}
                        />
                    </div>
                </div>

                {/* Founder Protocol */}
                <div className="saas-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Activity size={20} color="var(--accent-primary)" />
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Founder Protocol</h2>
                    </div>

                    <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Current Archetype</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{headline || 'Not Established'}</div>
                        </div>
                        <button
                            className="btn-ghost"
                            onClick={() => {
                                if (confirm("Retaking the diagnostic will archive your current archetype results. Continue?")) {
                                    window.location.href = '/quiz';
                                }
                            }}
                            style={{ color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}
                        >
                            <RotateCcw size={16} style={{ marginRight: '8px' }} /> Recalibrate
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="saas-panel" style={{ padding: '32px', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Shield size={20} color="#EF4444" />
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#EF4444' }}>Danger Zone</h2>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Delete Account</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Permanently remove your account and all data.
                                {headline ? <span style={{ display: 'block', marginTop: '4px', color: '#F59E0B' }}>Warning: You will lose your Founder Status.</span> : null}
                            </div>
                        </div>
                        <button
                            className="btn-ghost"
                            onClick={() => setShowDeleteModal(true)}
                            style={{
                                color: '#EF4444',
                                borderColor: 'rgba(239, 68, 68, 0.3)',
                                padding: '10px 20px'
                            }}
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                {status.message && (
                    <div style={{
                        marginBottom: '16px',
                        padding: '12px',
                        borderRadius: '8px',
                        background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                        color: status.type === 'success' ? '#10B981' : '#EF4444',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                    }}>
                        {status.message}
                    </div>
                )}

                <motion.button
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        padding: '16px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        opacity: saving ? 0.7 : 1
                    }}
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </motion.button>
                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)', zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '20px', backdropFilter: 'blur(5px)'
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="saas-panel"
                            style={{ maxWidth: '500px', width: '100%', padding: '40px', borderColor: '#EF4444', boxShadow: '0 0 50px rgba(239, 68, 68, 0.1)' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '32px' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                    <Shield size={32} color="#EF4444" />
                                </div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>Delete Account?</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    This action is <strong>permanent</strong> and cannot be undone. All your data, including matches and messaging history, will be erased.
                                </p>
                                {headline && (
                                    <div style={{ marginTop: '16px', padding: '12px 20px', background: 'rgba(255, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 158, 11, 0.2)', color: '#F59E0B', fontSize: '0.9rem', fontWeight: 600 }}>
                                        ⚠️ You will forfeit your Founder Status and Number.
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Type <strong>DELETE</strong> to confirm:</label>
                                <input
                                    className="glass-input"
                                    placeholder="DELETE"
                                    value={deleteInput}
                                    style={{ width: '100%', borderColor: '#EF4444' }}
                                    onChange={(e) => setDeleteInput(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button
                                    className="btn-ghost"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteInput('');
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    id="confirm-delete-btn"
                                    className="btn-primary"
                                    style={{
                                        flex: 1, justifyContent: 'center',
                                        background: '#EF4444', borderColor: '#EF4444',
                                        opacity: deleteInput === 'DELETE' ? 1 : 0.5,
                                        cursor: deleteInput === 'DELETE' ? 'pointer' : 'not-allowed'
                                    }}
                                    disabled={deleteInput !== 'DELETE' || loading}
                                    onClick={handleConfirmDelete}
                                >
                                    {loading ? 'Deleting...' : 'Confirm Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ToggleSetting({ label, description, checked, onChange }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{description}</div>
            </div>
            <label className="glass-input" style={{ width: '60px', height: '32px', borderRadius: '16px', padding: '4px', position: 'relative', cursor: 'pointer' }}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    style={{ display: 'none' }}
                />
                <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: checked ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                    position: 'absolute',
                    right: checked ? '4px' : '32px',
                    transition: 'right 0.2s, background 0.2s'
                }}></div>
            </label>
        </div>
    );
}
