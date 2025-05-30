
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { useUserManagement } from "@/hooks/useUserManagement";
import UserTableFilters from "./UserTableFilters";
import UserPlanSelect from "./UserPlanSelect";
import UserActions from "./UserActions";

const UserManagementTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const { isSuperAdmin } = useSuperAdminCheck();
  const {
    users,
    loading,
    updateUserPlan,
    toggleUserStatus,
    sendNotification,
    deleteUser,
  } = useUserManagement();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === "all" || user.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

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
        <UserTableFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          planFilter={planFilter}
          setPlanFilter={setPlanFilter}
        />

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
                    <UserPlanSelect
                      currentPlan={user.plan}
                      onPlanChange={(newPlan) => updateUserPlan(user.id, newPlan)}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                      {user.role === 'admin' ? 'Admin' : 'Usuário'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={true}
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
                    <UserActions
                      userId={user.id}
                      userName={user.name}
                      onSendNotification={sendNotification}
                      onToggleStatus={toggleUserStatus}
                      onDeleteUser={(userId, userName) => deleteUser(userId, userName, isSuperAdmin)}
                      isSuperAdmin={isSuperAdmin}
                    />
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
