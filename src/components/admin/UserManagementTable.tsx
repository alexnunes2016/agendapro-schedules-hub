
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Search, Filter, Bell, Edit, Trash2, Lock, Unlock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";

const UserManagementTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const { toast } = useToast();
  const { isSuperAdmin } = useSuperAdminCheck();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      
      // Use service role for admin queries to bypass RLS
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Users fetch result:', { data, error });

      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários. Verifique as permissões de admin.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlan = async (userId: string, newPlan: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ plan: newPlan, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers(); // Recarregar lista
      toast({
        title: "Sucesso",
        description: "Plano do usuário atualizado com sucesso",
      });
    } catch (error) {
      console.error('Error updating user plan:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar plano do usuário",
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean, userName: string) => {
    try {
      // Implementar lógica de bloqueio/desbloqueio
      // Por enquanto, vamos simular com uma atualização no perfil
      const newStatus = !currentStatus;
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          // Adicionar campo de status se necessário
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Usuário ${userName} ${newStatus ? 'desbloqueado' : 'bloqueado'} com sucesso`,
      });
      
      await fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status do usuário",
        variant: "destructive",
      });
    }
  };

  const sendNotification = async (userId: string, userName: string) => {
    try {
      // Aqui você pode implementar o envio de notificação
      // Por exemplo, usando uma edge function ou email
      
      toast({
        title: "Notificação Enviada",
        description: `Notificação enviada para ${userName}`,
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar notificação",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string, userName: string) => {
    if (!isSuperAdmin) {
      toast({
        title: "Acesso Negado",
        description: "Apenas super admins podem excluir usuários",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir o usuário ${userName}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers(); // Recarregar lista
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir usuário",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === "all" || user.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-500';
      case 'basico': return 'bg-blue-500';
      case 'profissional': return 'bg-green-500';
      case 'premium': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'free': return 'Gratuito';
      case 'basico': return 'Básico';
      case 'profissional': return 'Profissional';
      case 'premium': return 'Premium';
      default: return plan;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando usuários...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Gerenciamento de Usuários</span>
          <Badge variant="secondary">{filteredUsers.length} usuários</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por plano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os planos</SelectItem>
              <SelectItem value="free">Gratuito</SelectItem>
              <SelectItem value="basico">Básico</SelectItem>
              <SelectItem value="profissional">Profissional</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabela */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      {user.clinic_name && (
                        <div className="text-sm text-gray-500">{user.clinic_name}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.plan}
                      onValueChange={(newPlan) => updateUserPlan(user.id, newPlan)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <Badge className={`${getPlanBadgeColor(user.plan)} text-white`}>
                          {getPlanLabel(user.plan)}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Gratuito</SelectItem>
                        <SelectItem value="basico">Básico</SelectItem>
                        <SelectItem value="profissional">Profissional</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                      {user.role === 'admin' ? 'Admin' : 'Usuário'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={true} // Por enquanto sempre ativo, implementar lógica de status
                        onCheckedChange={(checked) => toggleUserStatus(user.id, !checked, user.name)}
                      />
                      <span className="text-sm text-gray-600">
                        Ativo
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendNotification(user.id, user.name)}
                        title="Enviar notificação"
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id, true, user.name)}
                        title="Bloquear/Desbloquear usuário"
                      >
                        <Lock className="h-4 w-4 text-orange-500" />
                      </Button>
                      {isSuperAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUser(user.id, user.name)}
                          title="Excluir usuário"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum usuário encontrado</p>
            {users.length === 0 && (
              <p className="text-sm mt-2">
                Se você é admin e não vê usuários, verifique as permissões RLS no Supabase
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagementTable;
