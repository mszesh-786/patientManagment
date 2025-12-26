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
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [role, setRole] = useState<StaffRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);

        if (currentSession?.user) {
          const { data, error } = await supabase
            .from("staff_profiles")
            .select("*")
            .eq("id", currentSession.user.id)
            .single();

          if (error) {
            console.error("Error fetching staff profile:", error);
            setProfile(null);
            setRole(null);
          } else {
            setProfile(data);
            setRole(data.role);
            if (_event === "SIGNED_IN") {
              logAudit("LOGIN", { metadata: { email: currentSession.user.email } });
            }
          }
        } else {
          setProfile(null);
          setRole(null);
          if (_event === "SIGNED_OUT") {
            logAudit("LOGOUT");
          }
        }
        setLoading(false); // Ensure loading is set to false after auth state change
      },
    );

    // Initial check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user || null);
      if (initialSession?.user) {
        supabase
          .from("staff_profiles")
          .select("*")
          .eq("id", initialSession.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching initial staff profile:", error);
              setProfile(null);
              setRole(null);
            } else {
              setProfile(data);
              setRole(data.role);
            }
          })
          .finally(() => { // Ensure loading is set to false after initial profile fetch
            setLoading(false);
          });
      } else {
        setLoading(false); // Ensure loading is set to false if no initial user
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false); // Ensure loading is set to false after sign-in attempt
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false); // Ensure loading is set to false after sign-out attempt
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{ session, user, profile, role, loading, signIn, signOut }}
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