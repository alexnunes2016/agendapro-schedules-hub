
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCheck = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authLoading) {
        return; // Wait for auth to finish loading
      }

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user has admin role in profile
        if (profile?.role === 'admin') {
          setIsAdmin(true);
          setLoading(false);
        } else if (profile) {
          // Only call the function if we have a profile loaded
          const { data, error } = await (supabase as any).rpc('is_admin');
          if (!error && data) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, profile, authLoading]);

  return { isAdmin, loading };
};
