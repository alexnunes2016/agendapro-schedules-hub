
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { AdminService } from '@/services/adminService';

export const useRoleCheck = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRoles = async () => {
      if (authLoading) {
        return;
      }

      if (!user || !profile) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const currentRole = await AdminService.getCurrentUserRole();
        const isSuperAdmin = await AdminService.isCurrentUserSuperAdmin();
        
        setRole(isSuperAdmin ? 'superadmin' : currentRole);
        setLoading(false);
      } catch (error) {
        console.error('Error checking roles:', error);
        setRole(profile.role || 'client');
        setLoading(false);
      }
    };

    checkRoles();
  }, [user, profile, authLoading]);

  return {
    role,
    loading,
    isSuperAdmin: role === 'superadmin',
    isAdmin: role === 'admin' || role === 'superadmin'
  };
};
