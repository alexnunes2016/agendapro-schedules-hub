
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

        // Use the new user_roles table with the security definer functions
        const { data: userRoles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user roles:', error);
          // Fallback to profile-based checks for backward compatibility
          const isSuperAdmin = profile?.email === 'suporte@judahtech.com.br' && profile?.role === 'admin';
          const isAdmin = profile?.role === 'admin';
          
          setHasRole({
            super_admin: isSuperAdmin || false,
            admin: isAdmin || false,
            user: true
          });
        } else {
          const roles = userRoles?.map(r => r.role) || [];
          
          setHasRole({
            super_admin: roles.includes('super_admin'),
            admin: roles.includes('admin') || roles.includes('super_admin'),
            user: roles.includes('user') || roles.length > 0 || true
          });
        }

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
