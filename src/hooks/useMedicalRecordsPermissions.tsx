
import { useAuth } from "@/hooks/useAuth";

export const useMedicalRecordsPermissions = () => {
  const { profile } = useAuth();

  const canAccessMedicalRecords = () => {
    return profile?.service_type === 'medicina' || profile?.service_type === 'odontologia';
  };

  const canCreateRecords = () => {
    return ['basico', 'profissional', 'premium'].includes(profile?.plan || '');
  };

  return {
    canAccessMedicalRecords,
    canCreateRecords
  };
};
