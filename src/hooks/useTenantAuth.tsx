
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { TenantRole } from '@/types/saas';

interface TenantAuthContextType {
  user: User | null;
  userRole: TenantRole | null;
  loading: boolean;
  isSuperAdmin: boolean;
  hasPermission: (permission: string) => boolean;
}

const TenantAuthContext = createContext<TenantAuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  isSuperAdmin: false,
  hasPermission: () => false,
});

export const useTenantAuth = () => {
  const context = useContext(TenantAuthContext);
  if (!context) {
    throw new Error('useTenantAuth must be used within a TenantAuthProvider');
  }
  return context;
};

export const TenantAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<TenantRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } else {
        setUserRole(data?.role as TenantRole || null);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdmin = userRole === 'super_admin';

  const hasPermission = (permission: string): boolean => {
    if (isSuperAdmin) return true;
    // Add more permission logic here based on your needs
    return false;
  };

  const value = {
    user,
    userRole,
    loading,
    isSuperAdmin,
    hasPermission,
  };

  return (
    <TenantAuthContext.Provider value={value}>
      {children}
    </TenantAuthContext.Provider>
  );
};
