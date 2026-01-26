import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            setLoading(false);

            // Auto-populate profile from leads if needed
            if (currentUser && (_event === 'SIGNED_IN' || _event === 'INITIAL_SESSION')) {
                try {
                    // 1. Check if profile exists/needs update
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('archetype, role')
                        .eq('id', currentUser.id)
                        .single();

                    if (!profile || !profile.archetype) {
                        let finalArchetype = null;
                        let finalName = null;

                        // 2a. Check LocalStorage (Most reliable for same-device flow)
                        const localArchetype = localStorage.getItem('covibr_archetype');
                        const localName = localStorage.getItem('covibr_name');

                        if (localArchetype) {
                            console.log("Found archetype in LocalStorage:", localArchetype);
                            finalArchetype = localArchetype;
                        }
                        if (localName) {
                            finalName = localName;
                        }

                        // 2b. Check DB for Lead data (Fallback if cross-device)
                        if (!finalArchetype || !finalName) {
                            const { data: lead } = await supabase
                                .from('leads')
                                .select('archetype, name')
                                .eq('email', currentUser.email)
                                .order('created_at', { ascending: false })
                                .limit(1)
                                .single();

                            if (lead) {
                                if (!finalArchetype) finalArchetype = lead.archetype;
                                if (!finalName) finalName = lead.name;
                            }
                        }

                        if (finalArchetype) {
                            console.log("Syncing archetype to profile:", finalArchetype);

                            // 3. Update Profile
                            const updates = {
                                id: currentUser.id,
                                email: currentUser.email,
                                archetype: finalArchetype,
                                // Default role if missing based on archetype
                                role: !profile?.role ? (finalArchetype === 'Architect' ? 'Engineering' : (finalArchetype === 'Sovereign' ? 'Founder' : 'Operations')) : undefined,
                                subscription_tier: 'founder', // Auto-grant Founder status
                                updated_at: new Date().toISOString()
                            };

                            // Only update name if we found one and profile doesn't have one
                            if (finalName && !profile?.full_name) {
                                updates.full_name = finalName;
                                updates.display_name = finalName;
                            }

                            const { error: updateError } = await supabase
                                .from('profiles')
                                .upsert(updates, { onConflict: 'id' });

                            // Only cleanup if successful
                            if (!updateError) {
                                console.log("Profile synced successfully. Clearing cache.");
                                localStorage.removeItem('covibr_archetype');
                                localStorage.removeItem('covibr_name');
                            } else {
                                console.error("Failed to sync profile (DB Error):", updateError);
                                // Keep localStorage so we can try again
                            }
                        }
                    }
                } catch (err) {
                    console.error("Error auto-syncing profile:", err);
                }
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
        signOut,
        loading,
        supabase // Expose client for advanced auth (resend)
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
