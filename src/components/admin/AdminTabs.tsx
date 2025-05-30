
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BarChart3 } from "lucide-react";
import UserManagementTable from "@/components/admin/UserManagementTable";

const AdminTabs = () => {
  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList className="grid w-full md:w-auto grid-cols-2">
        <TabsTrigger value="users" className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Usuários</span>
        </TabsTrigger>
        <TabsTrigger value="reports" className="flex items-center space-x-2">
          <BarChart3 className="h-4 w-4" />
          <span>Relatórios</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <UserManagementTable />
      </TabsContent>

      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <CardTitle>Relatórios de Upgrades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Relatórios em Desenvolvimento</p>
              <p className="text-sm">
                Os relatórios detalhados de upgrades e analytics estarão disponíveis em breve.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
