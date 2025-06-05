
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TenantAuthContext = createContext({
  user: null,
  session: null,
  tenant: null,
  tenantUser: null,
  userRole: null,
  permissions: [],
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  switchTenant: async () => ({ error: null }),
  hasPermission: () => false,
  isSuperAdmin: false,
  refreshTenant: async () => {},
});

export const useTenantAuth = () => {
  const context = useContext(TenantAuthContext);
  if (!context) {
    throw new Error('useTenantAuth must be used within a TenantAuthProvider');
  }
  return context;
};

export const TenantAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [tenantUser, setTenantUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  // Derived values
  const userRole = tenantUser?.role || null;
  const permissions = tenantUser?.permissions || [];
  const isSuperAdmin = userRole === 'super_admin';

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing tenant auth...');
        
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
            setInitialized(true);
          }
          return;
        }
        
        if (!mounted) return;
        
        console.log('Initial session:', initialSession?.user?.id || 'No session');
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          await fetchTenantData(initialSession.user.id);
        }
        
        setLoading(false);
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id || 'No user');
        
        if (initialized) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user && event !== 'SIGNED_OUT') {
            await fetchTenantData(session.user.id);
          } else {
            setTenant(null);
            setTenantUser(null);
          }
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initialized]);

  const fetchTenantData = async (userId) => {
    try {
      console.log('Fetching tenant data for user:', userId);
      
      // First, get the user's current tenant
      const { data: tenantUserData, error: tenantUserError } = await supabase
        .from('tenant_users')
        .select(`
          *,
          tenants (*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (tenantUserError && tenantUserError.code !== 'PGRST116') {
        console.error('Error fetching tenant user:', tenantUserError);
        return;
      }
      
      if (tenantUserData) {
        console.log('Tenant data loaded:', tenantUserData.tenants?.name);
        setTenantUser(tenantUserData);
        setTenant(tenantUserData.tenants);
      } else {
        console.log('No tenant found for user');
        setTenantUser(null);
        setTenant(null);
      }
    } catch (error) {
      console.error('Error fetching tenant data:', error);
    }
  };

  const signIn = async (email, password, tenantSlug) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Sign in successful');
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao sistema",
        });
      }

      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cadastro realizado",
          description: "Verifique seu email para confirmar a conta.",
        });
      }

      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setTenant(null);
      setTenantUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchTenant = async (tenantId) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('tenant_users')
        .select(`
          *,
          tenants (*)
        `)
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      setTenantUser(data);
      setTenant(data.tenants);
      
      toast({
        title: "Organização alterada",
        description: `Agora você está trabalhando em ${data.tenants.name}`,
      });

      return { error: null };
    } catch (error) {
      console.error('Switch tenant error:', error);
      toast({
        title: "Erro ao alterar organização",
        description: "Não foi possível alterar a organização.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const hasPermission = (permission) => {
    if (isSuperAdmin) return true;
    return permissions.includes(permission);
  };

  const refreshTenant = async () => {
    if (user) {
      await fetchTenantData(user.id);
    }
  };

  const value = {
    user,
    session,
    tenant,
    tenantUser,
    userRole,
    permissions,
    loading,
    signIn,
    signUp,
    signOut,
    switchTenant,
    hasPermission,
    isSuperAdmin,
    refreshTenant,
  };

  return (
    <TenantAuthContext.Provider value={value}>
      {children}
    </TenantAuthContext.Provider>
  );
};
