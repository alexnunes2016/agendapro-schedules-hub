
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MedicalRecord {
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
}

export const useMedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, authLoading } = useAuth();
  const { toast } = useToast();

  const fetchRecords = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching records:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os prontuários",
          variant: "destructive",
        });
      } else {
        setRecords(data || []);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
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
    if (!authLoading && user) {
      fetchRecords();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  return {
    records,
    loading,
    fetchRecords,
    refetch: fetchRecords
  };
};
