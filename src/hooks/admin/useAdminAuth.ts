
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { UserRole } from '@/types/admin';

export const useAdminAuth = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (authLoading) return;
      
      if (!user || !profile) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        // Check if user is superadmin
        const { data: isSuperAdmin, error: superAdminError } = await supabase
          .rpc('is_current_user_super_admin');

        if (superAdminError) throw superAdminError;

        if (isSuperAdmin) {
          setRole('superadmin');
        } else if (profile.role === 'admin') {
          setRole('admin');
        } else {
          setRole(null);
        }
      } catch (err: any) {
        console.error('Error checking admin role:', err);
        setError(err.message);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user, profile, authLoading]);

  const isAdmin = role === 'admin' || role === 'superadmin';
  const isSuperAdmin = role === 'superadmin';

  return {
    user,
    profile,
    role,
    isAdmin,
    isSuperAdmin,
    loading,
    error
  };
};
