
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
  } | null;
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
      
      // Buscar primeiro os prontuários médicos
      const { data: medicalRecordsData, error: medicalRecordsError } = await supabase
        .from('medical_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (medicalRecordsError) {
        console.error('Error fetching medical records:', medicalRecordsError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os prontuários",
          variant: "destructive",
        });
        return;
      }

      // Buscar os perfis dos usuários
      const userIds = medicalRecordsData?.map(record => record.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, clinic_name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados dos profissionais",
          variant: "destructive",
        });
        return;
      }

      // Combinar os dados
      const recordsWithProfiles = medicalRecordsData?.map(record => {
        const profile = profilesData?.find(p => p.id === record.user_id);
        return {
          ...record,
          profiles: profile ? {
            name: profile.name || 'Nome não informado',
            email: profile.email || 'Email não informado',
            clinic_name: profile.clinic_name
          } : null
        };
      }) || [];

      console.log('Fetched admin records:', recordsWithProfiles);
      setRecords(recordsWithProfiles);
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
