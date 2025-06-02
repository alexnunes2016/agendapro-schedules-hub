
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText, Users, Calendar, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminReportsTab = () => {
  const [reportType, setReportType] = useState("users");
  const [dateRange, setDateRange] = useState("last_30_days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { toast } = useToast();

  const handleExportPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "O relatório está sendo gerado e será baixado em breve.",
    });
    // Implement actual PDF export logic here
  };

  const handleExportExcel = () => {
    toast({
      title: "Exportando Excel",
      description: "O relatório está sendo gerado e será baixado em breve.",
    });
    // Implement actual Excel export logic here
  };

  // Mock data
  const reportData = {
    users: {
      total: 1247,
      active: 1124,
      inactive: 123,
      newThisMonth: 89
    },
    upgrades: {
      total: 45,
      thisMonth: 12,
      revenue: 15680,
      conversionRate: 8.5
    },
    plans: {
      free: 623,
      basico: 398,
      profissional: 187,
      premium: 39
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios Administrativos</h2>
          <p className="text-gray-600 mt-1">
            Relatórios completos do sistema e exportação de dados
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleExportPDF} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button onClick={handleExportExcel} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Relatório</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reportType">Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="users">Usuários</SelectItem>
                  <SelectItem value="upgrades">Upgrades</SelectItem>
                  <SelectItem value="plans">Distribuição de Planos</SelectItem>
                  <SelectItem value="revenue">Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateRange">Período</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
                  <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
                  <SelectItem value="last_year">Último ano</SelectItem>
                  <SelectItem value="custom">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === "custom" && (
              <>
                <div>
                  <Label htmlFor="startDate">Data Inicial</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Data Final</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{reportData.users.total.toLocaleString()}</div>
            <p className="text-xs text-gray-500">+{reportData.users.newThisMonth} este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Upgrades este Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{reportData.upgrades.thisMonth}</div>
            <p className="text-xs text-gray-500">Taxa: {reportData.upgrades.conversionRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Receita Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">R$ {reportData.upgrades.revenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Upgrades totais: {reportData.upgrades.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Usuários Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{reportData.users.active.toLocaleString()}</div>
            <p className="text-xs text-gray-500">{Math.round((reportData.users.active / reportData.users.total) * 100)}% do total</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Based on Type */}
      <Card>
        <CardHeader>
          <CardTitle>
            {reportType === 'users' && 'Relatório de Usuários'}
            {reportType === 'upgrades' && 'Relatório de Upgrades'}
            {reportType === 'plans' && 'Distribuição de Planos'}
            {reportType === 'revenue' && 'Relatório de Receita'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reportType === 'users' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{reportData.users.total}</div>
                  <div className="text-sm text-gray-600">Total de Usuários</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{reportData.users.active}</div>
                  <div className="text-sm text-gray-600">Usuários Ativos</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{reportData.users.inactive}</div>
                  <div className="text-sm text-gray-600">Usuários Inativos</div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'plans' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{reportData.plans.free}</div>
                <div className="text-sm text-gray-600">Plano Gratuito</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{reportData.plans.basico}</div>
                <div className="text-sm text-gray-600">Plano Básico</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{reportData.plans.profissional}</div>
                <div className="text-sm text-gray-600">Plano Profissional</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{reportData.plans.premium}</div>
                <div className="text-sm text-gray-600">Plano Premium</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReportsTab;
