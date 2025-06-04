
import { useAuth } from "@/hooks/useAuth";
import { PermissionManager } from "@/utils/permissions";

export const useSuperAdminCheck = () => {
  const { profile, loading } = useAuth();
  
  const isSuperAdmin = PermissionManager.isSuperAdminSync(profile);
  
  return {
    isSuperAdmin,
    loading
  };
};
