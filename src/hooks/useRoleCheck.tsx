
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

      if (!user || !profile) {
        console.log('No user or profile, setting default roles');
        setHasRole({
          super_admin: false,
          admin: false,
          user: false
        });
        setLoading(false);
        return;
      }

      try {
        console.log('Checking user roles for:', user.id, 'Profile:', profile);

        // Check if user is the super admin based on email and role
        const isSuperAdmin = profile.email === 'suporte@judahtech.com.br' && profile.role === 'admin';
        const isAdmin = profile.role === 'admin';
        
        console.log('Role check results:', { isSuperAdmin, isAdmin, profileRole: profile.role });

        // Also check user_roles table for additional roles
        const { data: userRoles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (!error && userRoles) {
          const roles = userRoles.map(r => r.role) || [];
          console.log('Additional roles from user_roles table:', roles);
          
          setHasRole({
            super_admin: isSuperAdmin || roles.includes('super_admin'),
            admin: isAdmin || roles.includes('admin') || roles.includes('super_admin'),
            user: true
          });
        } else {
          console.log('Using profile-based role check only');
          setHasRole({
            super_admin: isSuperAdmin,
            admin: isAdmin,
            user: true
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error checking roles:', error);
        // Fallback to profile-based checks
        const isSuperAdmin = profile?.email === 'suporte@judahtech.com.br' && profile?.role === 'admin';
        const isAdmin = profile?.role === 'admin';
        
        setHasRole({
          super_admin: isSuperAdmin || false,
          admin: isAdmin || false,
          user: true
        });
        setLoading(false);
      }
    };

    checkRoles();
  }, [user, profile, authLoading]);

  console.log('useRoleCheck result:', { hasRole, loading, userId: user?.id });

  return {
    hasRole,
    loading,
    isSuperAdmin: hasRole.super_admin || false,
    isAdmin: hasRole.admin || false
  };
};
