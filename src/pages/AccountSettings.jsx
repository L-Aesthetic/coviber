import { User, Mail, Lock, Bell, Shield, Eye, EyeOff, Save, Globe, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AccountSettings() {
    const [showPassword, setShowPassword] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [profileVisibility, setProfileVisibility] = useState('public');
    const [twoFactor, setTwoFactor] = useState(false);

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
                {/* Profile Information */}
                <div className="saas-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <User size={20} color="var(--accent-primary)" />
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Profile Information</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                First Name
                            </label>
                            <input
                                className="glass-input"
                                defaultValue="Louis"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                Last Name
                            </label>
                            <input
                                className="glass-input"
                                defaultValue="Lubin"
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Display Name
                        </label>
                        <input
                            className="glass-input"
                            defaultValue="Louis L."
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Location
                        </label>
                        <input
                            className="glass-input"
                            defaultValue="San Francisco, CA"
                            style={{ width: '100%' }}
                            placeholder="City, State/Country"
                        />
                    </div>
                </div>

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
                            defaultValue="louis@example.com"
                            style={{ width: '100%' }}
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '6px' }}>
                            We'll send a verification email to confirm changes.
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

                {/* Privacy & Visibility */}
                <div className="saas-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Globe size={20} color="var(--accent-primary)" />
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Privacy & Visibility</h2>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                            Profile Visibility
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    checked={profileVisibility === 'public'}
                                    onChange={() => setProfileVisibility('public')}
                                />
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Public</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Visible to all founders on the platform</div>
                                </div>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    checked={profileVisibility === 'matches'}
                                    onChange={() => setProfileVisibility('matches')}
                                />
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Matches Only</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Only visible to your matches</div>
                                </div>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="visibility"
                                    checked={profileVisibility === 'private'}
                                    onChange={() => setProfileVisibility('private')}
                                />
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Private</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Hidden from search, you can only reach out first</div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="saas-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Bell size={20} color="var(--accent-primary)" />
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <ToggleSetting
                            label="Email Notifications"
                            description="Receive email updates for new matches and messages"
                            checked={emailNotifications}
                            onChange={setEmailNotifications}
                        />
                        <ToggleSetting
                            label="Match Recommendations"
                            description="Get weekly digest of top candidate matches"
                            checked={true}
                            onChange={() => { }}
                        />
                        <ToggleSetting
                            label="Marketing Emails"
                            description="Product updates and tips"
                            checked={false}
                            onChange={() => { }}
                        />
                    </div>
                </div>

                {/* Security */}
                <div className="saas-panel" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Shield size={20} color="var(--accent-primary)" />
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Security</h2>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Smartphone size={20} color="var(--accent-primary)" />
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Two-Factor Authentication</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Add an extra layer of security to your account</div>
                            </div>
                        </div>
                        <label className="glass-input" style={{ width: '60px', height: '32px', borderRadius: '16px', padding: '4px', position: 'relative', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={twoFactor}
                                onChange={(e) => setTwoFactor(e.target.checked)}
                                style={{ display: 'none' }}
                            />
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: twoFactor ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                                position: 'absolute',
                                right: twoFactor ? '4px' : '32px',
                                transition: 'right 0.2s, background 0.2s'
                            }}></div>
                        </label>
                    </div>
                </div>

                {/* Save Button */}
                <motion.button
                    className="btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        padding: '16px',
                        fontSize: '1rem',
                        fontWeight: 600
                    }}
                >
                    <Save size={20} />
                    Save Changes
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
