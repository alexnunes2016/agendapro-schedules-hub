
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Users, Clock } from "lucide-react";

interface AdvancedReportsProps {
  reportType: string;
  dateRange: string;
}

const AdvancedReports = ({ reportType, dateRange }: AdvancedReportsProps) => {
  // Mock data - replace with actual API calls
  const appointmentData = [
    { name: 'Seg', consultas: 12, cancelamentos: 2 },
    { name: 'Ter', consultas: 15, cancelamentos: 1 },
    { name: 'Qua', consultas: 8, cancelamentos: 3 },
    { name: 'Qui', consultas: 18, cancelamentos: 2 },
    { name: 'Sex', consultas: 22, cancelamentos: 1 },
    { name: 'Sáb', consultas: 5, cancelamentos: 0 },
    { name: 'Dom', consultas: 0, cancelamentos: 0 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 3500 },
    { month: 'Fev', revenue: 4200 },
    { month: 'Mar', revenue: 3800 },
    { month: 'Abr', revenue: 4500 },
    { month: 'Mai', revenue: 5200 },
    { month: 'Jun', revenue: 4800 },
  ];

  const serviceData = [
    { name: 'Consulta Geral', value: 45, color: '#3B82F6' },
    { name: 'Exames', value: 25, color: '#10B981' },
    { name: 'Procedimentos', value: 20, color: '#F59E0B' },
    { name: 'Retornos', value: 10, color: '#EF4444' },
  ];

  const renderAppointmentsChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={appointmentData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="consultas" fill="#3B82F6" name="Consultas" />
        <Bar dataKey="cancelamentos" fill="#EF4444" name="Cancelamentos" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderRevenueChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [`R$ ${value}`, 'Faturamento']} />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Faturamento" />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderServiceChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={serviceData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {serviceData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="space-y-6">
      {reportType === 'appointments' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Consultas por Dia da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderAppointmentsChart()}
          </CardContent>
        </Card>
      )}

      {reportType === 'revenue' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Evolução do Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderRevenueChart()}
          </CardContent>
        </Card>
      )}

      {reportType === 'analytics' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Distribuição de Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderServiceChart()}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Comparecimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">86%</div>
            <p className="text-xs text-gray-500">+5% vs mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tempo Médio de Consulta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">45min</div>
            <p className="text-xs text-gray-500">-3min vs mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">NPS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">8.7</div>
            <p className="text-xs text-gray-500">+0.3 vs mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Eficiência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">92%</div>
            <p className="text-xs text-gray-500">+2% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedReports;
