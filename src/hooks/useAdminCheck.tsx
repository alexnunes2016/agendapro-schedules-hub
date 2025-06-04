
import { useAuth } from "@/hooks/useAuth";
import { PermissionManager } from "@/utils/permissions";

export const useAdminCheck = () => {
  const { profile, loading } = useAuth();
  
  const isAdmin = PermissionManager.isAdminSync(profile);
  const isSuperAdmin = PermissionManager.isSuperAdminSync(profile);
  
  return {
    isAdmin,
    isSuperAdmin,
    loading
  };
};
