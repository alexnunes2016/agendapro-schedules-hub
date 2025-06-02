
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BarChart3, Shield } from "lucide-react";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import AdminReportsTab from "@/components/admin/AdminReportsTab";
import AuditLogsViewer from "@/components/admin/AuditLogsViewer";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";

const AdminTabs = () => {
  const { isSuperAdmin } = useSuperAdminCheck();

  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList className={`grid w-full md:w-auto ${isSuperAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <TabsTrigger value="users" className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Usuários</span>
        </TabsTrigger>
        <TabsTrigger value="reports" className="flex items-center space-x-2">
          <BarChart3 className="h-4 w-4" />
          <span>Relatórios</span>
        </TabsTrigger>
        {isSuperAdmin && (
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Auditoria</span>
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="users">
        <UserManagementTable />
      </TabsContent>

      <TabsContent value="reports">
        <AdminReportsTab />
      </TabsContent>

      {isSuperAdmin && (
        <TabsContent value="audit">
          <AuditLogsViewer />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default AdminTabs;
