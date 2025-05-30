
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";

interface AdminMedicalRecord {
  id: string;
  patient_name: string;
  patient_email: string | null;
  patient_phone: string | null;
  date_of_birth: string | null;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles: {
    name: string;
    email: string;
    clinic_name: string | null;
  };
}

export const useAdminMedicalRecords = () => {
  const [records, setRecords] = useState<AdminMedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSuperAdmin } = useSuperAdminCheck();
  const { toast } = useToast();

  const fetchRecords = async () => {
    if (!isSuperAdmin) {
      console.log('User is not super admin');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching all medical records for super admin');
      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          *,
          profiles:user_id (
            name,
            email,
            clinic_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin records:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os prontuários",
          variant: "destructive",
        });
      } else {
        console.log('Fetched admin records:', data);
        setRecords(data || []);
      }
    } catch (error) {
      console.error('Error fetching admin medical records:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar prontuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchRecords();
    } else {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  return {
    records,
    loading,
    fetchRecords,
    refetch: fetchRecords
  };
};
