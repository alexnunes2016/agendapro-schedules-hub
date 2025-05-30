
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
        // Verificar se é o email específico do super admin
        if (profile?.email === 'suporte@judahtech.com.br' && profile?.role === 'admin') {
          setIsSuperAdmin(true);
        } else {
          // Chamar a função RPC como backup
          const { data, error } = await (supabase as any).rpc('is_super_admin');
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
