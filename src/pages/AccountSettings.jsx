import { User, Mail, Lock, Bell, Shield, Eye, EyeOff, Save, Globe, Smartphone, RefreshCcw, Github, Linkedin, Twitter, Activity, RotateCcw, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { motion } from 'framer-motion';

export default function AccountSettings() {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
            setEmail(user.email);
            const { data, error } = await supabase
                .from('profiles')
                .select('notification_prefs, headline')
                .eq('id', user.id)
                .single();

            if (data) {
                setHeadline(data.headline || '');
                if (data.notification_prefs) {
                    setNotifications(data.notification_prefs);
                }
            }
            setLoading(false);
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


    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    notification_prefs: notifications,
                    updated_at: new Date()
                })
                .eq('id', user.id);

            if (error) throw error;
            alert('Settings updated successfully.');
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Failed to update settings.');
        } finally {
            setSaving(false);
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

                {/* Save Button */}
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
