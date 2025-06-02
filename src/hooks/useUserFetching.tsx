
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/services/userService";

export const useUserFetching = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setError(null);
      const data = await userService.fetchUsers();
      setUsers(data);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      const errorMessage = error.message || "Erro ao carregar usuários. Verifique as permissões de admin.";
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
  };
};
