
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useRoleCheck = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [hasRole, setHasRole] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRoles = async () => {
      if (authLoading) {
        return;
      }

      if (!user) {
        setHasRole({});
        setLoading(false);
        return;
      }

      try {
        console.log('Checking user roles for:', user.id);

        // Check if user is super admin via profile
        const isSuperAdmin = profile?.email === 'suporte@judahtech.com.br' && profile?.role === 'admin';
        
        // Check if user is regular admin
        const isAdmin = profile?.role === 'admin';

        // For now, we'll use the profile-based checks until the database types are updated
        // TODO: Replace with proper user_roles table check when types are regenerated
        setHasRole({
          super_admin: isSuperAdmin || false,
          admin: isAdmin || false,
          user: true
        });

        setLoading(false);
      } catch (error) {
        console.error('Error checking roles:', error);
        setHasRole({});
        setLoading(false);
      }
    };

    checkRoles();
  }, [user, profile, authLoading]);

  return {
    hasRole,
    loading,
    isSuperAdmin: hasRole.super_admin || false,
    isAdmin: hasRole.admin || false
  };
};
