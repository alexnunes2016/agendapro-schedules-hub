
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useErrorHandler } from '@/utils/errorHandler';
import { AuthContextType, UserProfile } from '@/types/auth';
import { PermissionManager } from '@/utils/permissions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('AuthProvider mounting...');
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        console.log('Profile fetched:', data);
        setProfile(data as UserProfile);
      } else if (error) {
        console.error('Error fetching profile:', error);
        handleError(error, 'fetchProfile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      handleError(error, 'fetchProfile');
    }
  }, [handleError]);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  useEffect(() => {
    console.log('AuthProvider useEffect running...');
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        try {
          setUser(session?.user ?? null);
          
          if (session?.user && event !== 'SIGNED_OUT') {
            // Use timeout to avoid blocking UI
            setTimeout(() => {
              if (mounted) {
                fetchProfile(session.user.id);
              }
            }, 0);
          } else {
            setProfile(null);
          }
          
          if (event === 'INITIAL_SESSION') {
            setLoading(false);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          handleError(error, 'authStateChange');
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Initial session:', session?.user?.id);
      if (!mounted) return;
      
      if (error) {
        console.error('Error getting session:', error);
        handleError(error, 'getSession');
        setLoading(false);
        return;
      }
      
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, handleError]);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('Attempting sign in...');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      handleError(error, 'signIn');
      return { error };
    }
  }, [handleError]);

  const signUp = useCallback(async (email: string, password: string, userData: any) => {
    console.log('Attempting sign up...');
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      return { error };
    } catch (error) {
      handleError(error, 'signUp');
      return { error };
    }
  }, [handleError]);

  const signOut = useCallback(async () => {
    console.log('Signing out...');
    try {
      await supabase.auth.signOut();
      setProfile(null);
    } catch (error) {
      handleError(error, 'signOut');
    }
  }, [handleError]);

  const isAuthenticated = Boolean(user && profile);
  const isSuperAdmin = PermissionManager.isSuperAdmin(profile);
  const isAdmin = PermissionManager.isAdmin(profile);

  console.log('AuthProvider rendering with loading:', loading, 'user:', !!user);

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      isAuthenticated,
      isSuperAdmin,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
