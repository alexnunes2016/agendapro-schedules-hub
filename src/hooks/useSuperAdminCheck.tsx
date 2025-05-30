
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useSuperAdminCheck = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSuperAdminStatus = async () => {
      if (authLoading) {
        return;
      }

      if (!user) {
        setIsSuperAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('Checking super admin status for user:', user.id, 'profile:', profile);
        
        // Verificar se é o email específico do super admin
        if (profile?.email === 'suporte@judahtech.com.br' && profile?.role === 'admin') {
          console.log('User is super admin via profile check');
          setIsSuperAdmin(true);
        } else {
          // Chamar a função RPC como backup
          console.log('Calling is_super_admin RPC function');
          const { data, error } = await supabase.rpc('is_super_admin');
          console.log('is_super_admin RPC result:', { data, error });
          
          if (!error && data) {
            setIsSuperAdmin(true);
          } else {
            setIsSuperAdmin(false);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking super admin status:', error);
        setIsSuperAdmin(false);
        setLoading(false);
      }
    };

    checkSuperAdminStatus();
  }, [user, profile, authLoading]);

  return { isSuperAdmin, loading };
};
