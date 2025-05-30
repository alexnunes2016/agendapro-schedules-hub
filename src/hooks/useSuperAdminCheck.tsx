
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useRoleCheck } from './useRoleCheck';

export const useSuperAdminCheck = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { isSuperAdmin, loading: roleLoading } = useRoleCheck();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      setLoading(false);
    }
  }, [authLoading, roleLoading]);

  return { 
    isSuperAdmin: isSuperAdmin || false, 
    loading 
  };
};
