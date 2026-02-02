import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial Session Check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            setLoading(false); // Immediate UI feedback

            // Background Profile Sync
            if (currentUser && (_event === 'SIGNED_IN' || _event === 'INITIAL_SESSION' || _event === 'TOKEN_REFRESHED')) {
                const syncProfile = async () => {
                    try {
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('archetype, role')
                            .eq('id', currentUser.id)
                            .maybeSingle();

                        if (!profile || !profile.archetype) {
                            let finalArchetype = localStorage.getItem('covibr_archetype');
                            let finalName = localStorage.getItem('covibr_name');

                            if (!finalArchetype || !finalName) {
                                const { data: lead } = await supabase
                                    .from('leads')
                                    .select('archetype, name')
                                    .eq('email', currentUser.email)
                                    .order('created_at', { ascending: false })
                                    .limit(1)
                                    .maybeSingle();

                                if (lead) {
                                    if (!finalArchetype) finalArchetype = lead.archetype;
                                    if (!finalName) finalName = lead.name;
                                }
                            }

                            if (finalArchetype) {
                                console.log("Syncing archetype to profile:", finalArchetype);
                                const updates = {
                                    id: currentUser.id,
                                    email: currentUser.email,
                                    archetype: finalArchetype,
                                    role: !profile?.role ? (finalArchetype === 'Architect' ? 'Engineering' : (finalArchetype === 'Sovereign' ? 'Founder' : 'Operations')) : undefined,
                                    subscription_tier: 'free',
                                    updated_at: new Date().toISOString()
                                };

                                if (finalName && !profile?.full_name) {
                                    updates.full_name = finalName;
                                    updates.display_name = finalName;
                                }

                                const { error: updateError } = await supabase
                                    .from('profiles')
                                    .upsert(updates, { onConflict: 'id' });

                                if (!updateError) {
                                    localStorage.removeItem('covibr_archetype');
                                    localStorage.removeItem('covibr_name');
                                }
                            }
                        }
                    } catch (err) {
                        console.error("Background sync error:", err);
                    }
                };
                syncProfile();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email) => {
        // Magic Link Login
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
    };

    const signInWithPassword = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const signUp = async (email, password, metadata = {}) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const value = {
        user,
        signIn,
        signInWithPassword,
        signUp,
        signOut,
        loading,
        supabase // Expose client for advanced auth (resend)
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
