
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";

interface BasicReportsProps {
  reportType: string;
  dateRange: string;
}

const BasicReports = ({ reportType, dateRange }: BasicReportsProps) => {
  // Mock data - replace with actual API calls
  const mockData = {
    appointments: {
      total: 45,
      completed: 38,
      cancelled: 7,
      noShow: 2
    },
    clients: {
      total: 32,
      new: 8,
      returning: 24
    },
    revenue: {
      total: 4500,
      average: 118.42
    }
  };

  const renderAppointmentsReport = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total de Consultas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{mockData.appointments.total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Concluídas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{mockData.appointments.completed}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Canceladas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{mockData.appointments.cancelled}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Faltaram</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{mockData.appointments.noShow}</div>
        </CardContent>
      </Card>
    </div>
  );

  const renderClientsReport = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{mockData.clients.total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Novos Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{mockData.clients.new}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Clientes Recorrentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{mockData.clients.returning}</div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRevenueReport = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Faturamento Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">R$ {mockData.revenue.total.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Ticket Médio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">R$ {mockData.revenue.average.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Relatório Simples - {reportType === 'appointments' ? 'Consultas' : reportType === 'clients' ? 'Clientes' : 'Faturamento'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reportType === 'appointments' && renderAppointmentsReport()}
          {reportType === 'clients' && renderClientsReport()}
          {reportType === 'revenue' && renderRevenueReport()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Este é um relatório básico. Para relatórios mais detalhados com gráficos e filtros avançados, 
            considere fazer upgrade para o plano Profissional ou Premium.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicReports;
