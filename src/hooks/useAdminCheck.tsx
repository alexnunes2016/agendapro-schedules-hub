
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
        console.log('Checking admin status for user:', user.id, 'profile:', profile);
        
        // Check if user has admin role in profile
        if (profile?.role === 'admin') {
          console.log('User is admin via profile');
          setIsAdmin(true);
          setLoading(false);
        } else if (profile) {
          // Only call the function if we have a profile loaded
          console.log('Calling is_admin RPC function');
          const { data, error } = await supabase.rpc('is_admin');
          console.log('is_admin RPC result:', { data, error });
          
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
