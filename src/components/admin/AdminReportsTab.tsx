import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText, Users, Calendar, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface SystemStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  new_users_this_month: number;
  total_appointments: number;
  appointments_this_month: number;
  total_revenue_estimate: number;
  plan_distribution: Record<string, number>;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

const AdminReportsTab = () => {
  const [reportType, setReportType] = useState("users");
  const [dateRange, setDateRange] = useState("last_30_days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_system_statistics');
      
      if (error) throw error;
      
      if (data && typeof data === 'object') {
        setStats(data as unknown as SystemStats);
      }
    } catch (error: any) {
      console.error('Error fetching system stats:', error);
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Não foi possível carregar as estatísticas do sistema",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!stats) return;

    try {
      const doc = new jsPDF();
      
      // Adicionar título
      doc.setFontSize(16);
      doc.text('Relatório Administrativo', 14, 15);
      
      // Adicionar informações do relatório
      doc.setFontSize(12);
      doc.text(`Tipo: ${reportType}`, 14, 25);
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32);
      
      // Preparar dados para a tabela
      let data = [];
      if (reportType === 'users') {
        data = [
          ['Total de Usuários', stats.total_users],
          ['Usuários Ativos', stats.active_users],
          ['Usuários Inativos', stats.inactive_users],
          ['Novos Usuários Este Mês', stats.new_users_this_month]
        ];
      } else if (reportType === 'plans') {
        data = Object.entries(stats.plan_distribution || {}).map(([plan, count]) => [plan, count]);
      }
      
      // Adicionar tabela
      doc.autoTable({
        startY: 40,
        head: [['Métrica', 'Valor']],
        body: data,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 }
      });
      
      // Salvar o PDF
      doc.save(`relatorio-${reportType}-${Date.now()}.pdf`);

      toast({
        title: "Relatório Exportado",
        description: "O relatório PDF foi exportado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast({
        title: "Erro na Exportação",
        description: "Erro ao exportar o relatório PDF",
        variant: "destructive",
      });
    }
  };

  const handleExportExcel = async () => {
    if (!stats) return;

    try {
      // Preparar dados para o Excel
      let data = [];
      const reportDate = new Date().toLocaleDateString('pt-BR');
      
      if (reportType === 'users') {
        data = [
          ['Relatório Administrativo - Usuários'],
          ['Data:', reportDate],
          [''],
          ['Métrica', 'Valor'],
          ['Total de Usuários', stats.total_users],
          ['Usuários Ativos', stats.active_users],
          ['Usuários Inativos', stats.inactive_users],
          ['Novos Usuários Este Mês', stats.new_users_this_month]
        ];
      } else if (reportType === 'plans') {
        data = [
          ['Relatório Administrativo - Distribuição de Planos'],
          ['Data:', reportDate],
          [''],
          ['Plano', 'Quantidade'],
          ...Object.entries(stats.plan_distribution || {})
        ];
      }
      
      // Criar workbook e worksheet
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
      
      // Configurar largura das colunas
      const wscols = [{ wch: 30 }, { wch: 15 }];
      ws['!cols'] = wscols;
      
      // Salvar o arquivo
      XLSX.writeFile(wb, `relatorio-${reportType}-${Date.now()}.xlsx`);

      toast({
        title: "Relatório Exportado",
        description: "O relatório XLSX foi exportado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao exportar XLSX:', error);
      toast({
        title: "Erro na Exportação",
        description: "Erro ao exportar o relatório XLSX",
        variant: "destructive",
      });
    }
  };

  const generateCSVData = () => {
    if (!stats) return '';
    
    let csvContent = '';
    
    if (reportType === 'users') {
      csvContent = 'Métrica,Valor\n';
      csvContent += `Total de Usuários,${stats.total_users}\n`;
      csvContent += `Usuários Ativos,${stats.active_users}\n`;
      csvContent += `Usuários Inativos,${stats.inactive_users}\n`;
      csvContent += `Novos Usuários Este Mês,${stats.new_users_this_month}\n`;
    } else if (reportType === 'plans') {
      csvContent = 'Plano,Quantidade\n';
      Object.entries(stats.plan_distribution || {}).forEach(([plan, count]) => {
        csvContent += `${plan},${count}\n`;
      });
    }
    
    return csvContent;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Erro ao carregar estatísticas do sistema</p>
        <Button onClick={fetchSystemStats} className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios Administrativos</h2>
          <p className="text-gray-600 mt-1">
            Relatórios completos do sistema com dados atualizados
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleExportPDF} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button onClick={handleExportExcel} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar XLSX
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
                  <SelectItem value="plans">Distribuição de Planos</SelectItem>
                  <SelectItem value="appointments">Agendamentos</SelectItem>
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
            <div className="text-2xl font-bold text-blue-600">{stats.total_users.toLocaleString()}</div>
            <p className="text-xs text-gray-500">+{stats.new_users_this_month} este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Usuários Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active_users.toLocaleString()}</div>
            <p className="text-xs text-gray-500">
              {stats.total_users > 0 ? Math.round((stats.active_users / stats.total_users) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Receita Estimada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              R$ {(stats.total_revenue_estimate || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.appointments_this_month.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Este mês ({stats.total_appointments} total)</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Based on Type */}
      <Card>
        <CardHeader>
          <CardTitle>
            {reportType === 'users' && 'Relatório de Usuários'}
            {reportType === 'plans' && 'Distribuição de Planos'}
            {reportType === 'appointments' && 'Relatório de Agendamentos'}
            {reportType === 'revenue' && 'Relatório de Receita'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reportType === 'users' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.total_users}</div>
                  <div className="text-sm text-gray-600">Total de Usuários</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.active_users}</div>
                  <div className="text-sm text-gray-600">Usuários Ativos</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.inactive_users}</div>
                  <div className="text-sm text-gray-600">Usuários Inativos</div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'plans' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(stats.plan_distribution || {}).map(([plan, count]) => (
                <div key={plan} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{count}</div>
                  <div className="text-sm text-gray-600 capitalize">{plan}</div>
                </div>
              ))}
            </div>
          )}

          {reportType === 'appointments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.total_appointments}</div>
                <div className="text-sm text-gray-600">Total de Agendamentos</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.appointments_this_month}</div>
                <div className="text-sm text-gray-600">Agendamentos Este Mês</div>
              </div>
            </div>
          )}

          {reportType === 'revenue' && (
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                R$ {(stats.total_revenue_estimate || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-gray-600">Receita Estimada Este Mês</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReportsTab;
