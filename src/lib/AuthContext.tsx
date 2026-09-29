import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useConnectivity } from './offline/connectivity';

export type Role = 'ADMIN' | 'EXPEDITION_MANAGER' | 'STATION_OFFICER' | 'VIEWER';

export interface User {
  id: string;
  organization_id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
  designation?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, organizationName: string, role: string, designation?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setOrganization(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (authId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authId)
        .single();
        
      if (profileError) throw profileError;
      
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.organization_id)
        .single();
        
      if (orgError) throw orgError;

      setUser(profile);
      setOrganization(org);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      setError(error.message);
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string, organizationName: string, role: string, designation: string = '') => {
    setError(null);
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const orgCode = organizationName.substring(0, 3).toUpperCase();
        let { data: orgData, error: orgLookupError } = await supabase
          .from('organizations')
          .select('*')
          .eq('code', orgCode)
          .maybeSingle();

        if (orgLookupError) throw orgLookupError;

        if (!orgData) {
          const { data: newOrgData, error: orgError } = await supabase
            .from('organizations')
            .insert({
              name: organizationName,
              code: orgCode,
            })
            .select()
            .single();

          if (orgError) throw orgError;
          orgData = newOrgData;
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            organization_id: orgData.id,
            full_name: fullName,
            email,
            role: 'PENDING',
            status: 'PENDING',
            designation,
          });

        if (profileError) throw profileError;

        const { error: requestError } = await supabase
          .from('access_requests')
          .insert({
            user_id: authData.user.id,
            full_name: fullName,
            email,
            organization: organizationName,
            designation,
            requested_role: role,
            status: 'PENDING'
          });

        if (requestError) throw requestError;

        await fetchProfile(authData.user.id);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOrganization(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const { data: updated, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) throw error;
    setUser(updated);
  };

  const isOnline = useConnectivity();

  return (
    <AuthContext.Provider value={{ user, organization, login, register, logout, updateProfile, loading, error }}>
      {!isOnline && (
        <div style={{ backgroundColor: '#ef4444', color: 'white', textAlign: 'center', padding: '6px', fontSize: '13px', fontWeight: 'bold' }}>
          🔴 Offline — Changes will sync automatically when internet returns
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
