"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface AuthUser {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ error: string | null }>;
    signup: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: string | null; success?: boolean }>;
    signInWithGoogle: () => Promise<{ error: string | null }>;
    updateProfile: (fullName: string) => Promise<{ error: string | null }>;
    updatePassword: (password: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapUser = (supabaseUser: SupabaseUser, fullName?: string | null): AuthUser => ({
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    name:
        fullName ??
        supabaseUser.user_metadata?.full_name ??
        supabaseUser.email?.split("@")[0] ??
        "User",
});

async function fetchProfileName(supabase: ReturnType<typeof createClient>, userId: string) {
    const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single();
    return data?.full_name ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = useMemo(() => createClient(), []);

    const syncUser = useCallback(
        async (supabaseUser: SupabaseUser | null) => {
            if (!supabaseUser) {
                setUser(null);
                return;
            }
            const fullName = await fetchProfileName(supabase, supabaseUser.id);
            setUser(mapUser(supabaseUser, fullName));
        },
        [supabase],
    );

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            syncUser(session?.user ?? null).finally(() => setIsLoading(false));
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            syncUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase, syncUser]);

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
    };

    const signup = async (email: string, password: string, name: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } },
        });
        return { error: error?.message ?? null };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        if (error) return { error: error.message };
        return { error: null, success: true };
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/portal`,
            },
        });
        return { error: error?.message ?? null };
    };

    const updateProfile = async (fullName: string) => {
        if (!user) return { error: "Not authenticated" };
        const { error } = await supabase
            .from("profiles")
            .update({ full_name: fullName })
            .eq("id", user.id);
        if (error) return { error: error.message };
        setUser((prev) => (prev ? { ...prev, name: fullName } : null));
        return { error: null };
    };

    const updatePassword = async (password: string) => {
        const { error } = await supabase.auth.updateUser({ password });
        return { error: error?.message ?? null };
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
                resetPassword,
                signInWithGoogle,
                updateProfile,
                updatePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
