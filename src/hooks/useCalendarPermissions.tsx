
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface CalendarPermission {
  id: string;
  calendar_id: string;
  user_id: string;
  permission_type: 'view' | 'edit' | 'admin';
  granted_by: string;
  created_at: string;
}

export interface CreatePermissionData {
  calendar_id: string;
  user_id: string;
  permission_type: 'view' | 'edit' | 'admin';
}

export const useCalendarPermissions = (calendarId?: string) => {
  const [permissions, setPermissions] = useState<CalendarPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPermissions = async () => {
    if (!user || !calendarId) return;
    
    try {
      setLoading(true);
      console.log('Fetching permissions for calendar:', calendarId);
      
      const { data, error } = await (supabase as any)
        .from('calendar_permissions')
        .select('*')
        .eq('calendar_id', calendarId);

      if (error) {
        console.error('Error fetching permissions:', error);
        throw error;
      }

      console.log('Permissions fetched:', data);
      setPermissions(data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast({
        title: "Erro ao carregar permissões",
        description: "Não foi possível carregar as permissões da agenda.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const grantPermission = async (data: CreatePermissionData) => {
    if (!user) return false;

    try {
      console.log('Granting permission:', data);
      
      const { error } = await (supabase as any)
        .from('calendar_permissions')
        .insert({
          ...data,
          granted_by: user.id,
        });

      if (error) {
        console.error('Error granting permission:', error);
        throw error;
      }

      toast({
        title: "Permissão concedida",
        description: "Permissão foi concedida com sucesso.",
      });

      await fetchPermissions();
      return true;
    } catch (error) {
      console.error('Error granting permission:', error);
      toast({
        title: "Erro ao conceder permissão",
        description: "Não foi possível conceder a permissão. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const revokePermission = async (id: string) => {
    if (!user) return false;

    try {
      console.log('Revoking permission:', id);
      
      const { error } = await (supabase as any)
        .from('calendar_permissions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error revoking permission:', error);
        throw error;
      }

      toast({
        title: "Permissão revogada",
        description: "Permissão foi revogada com sucesso.",
      });

      await fetchPermissions();
      return true;
    } catch (error) {
      console.error('Error revoking permission:', error);
      toast({
        title: "Erro ao revogar permissão",
        description: "Não foi possível revogar a permissão. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user && calendarId) {
      fetchPermissions();
    } else {
      setPermissions([]);
      setLoading(false);
    }
  }, [user, calendarId]);

  return {
    permissions,
    loading,
    grantPermission,
    revokePermission,
    refreshPermissions: fetchPermissions,
  };
};
