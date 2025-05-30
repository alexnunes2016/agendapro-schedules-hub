
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useRoleCheck } from './useRoleCheck';

export const useAdminCheck = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useRoleCheck();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      setLoading(false);
    }
  }, [authLoading, roleLoading]);

  return { 
    isAdmin: isAdmin || false, 
    loading 
  };
};
