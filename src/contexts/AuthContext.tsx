import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { logAudit } from "@/lib/audit";

export type StaffRole = "admin" | "practitioner";

interface StaffProfile {
  id: string;
  full_name: string;
  email: string;
  role: StaffRole;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: StaffProfile | null;
  role: StaffRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, full_name: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [role, setRole] = useState<StaffRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: Initializing auth listener...");
   const { data: authListener } = supabase.auth.onAuthStateChange(
  async (_event, currentSession) => {
    setSession(currentSession);
    setUser(currentSession?.user || null);

    try {
      if (currentSession?.user) {
        const { data, error } = await supabase
          .from("staff_profiles")
          .select("*")
          .eq("user_id", currentSession.user.id) // <-- key change
          .single();

        if (error) {
          console.error("Profile fetch error:", error);
          setProfile(null);
          setRole(null);
        } else {
          setProfile(data);
          setRole(data.role);
        }
      } else {
        setProfile(null);
        setRole(null);
      }
    } catch (e) {
      console.error("Auth state handler crashed:", e);
      setProfile(null);
      setRole(null);
    } finally {
      setLoading(false); // <-- ALWAYS run
    }
  }
);
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("AuthContext: Attempting sign in...");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("AuthContext: Sign in attempt finished, error:", error);
    setLoading(false);
    return { error };
  };

  const signUp = async (email: string, password: string, full_name: string) => {
    console.log("AuthContext: Attempting sign up...");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });
    console.log("AuthContext: Sign up attempt finished, error:", error);
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    console.log("AuthContext: Attempting sign out...");
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (!error) {
      logAudit("LOGOUT");
    }
    console.log("AuthContext: Sign out attempt finished, error:", error);
    setLoading(false);
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{ session, user, profile, role, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};