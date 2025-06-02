
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Download, FileText, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import BasicReports from "./BasicReports";
import AdvancedReports from "./AdvancedReports";

const ReportsModule = () => {
  const { profile } = useAuth();
  const [reportType, setReportType] = useState("appointments");
  const [dateRange, setDateRange] = useState("last_30_days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isBasicPlan = profile?.plan === 'free' || profile?.plan === 'basico';
  const isAdvancedPlan = profile?.plan === 'profissional' || profile?.plan === 'premium';

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {isBasicPlan 
              ? "Relatórios simples para acompanhar seus atendimentos"
              : "Relatórios completos com análises avançadas"
            }
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Exportar PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Exportar Excel</span>
            <span className="sm:hidden">Excel</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <BarChart3 className="h-5 w-5 mr-2" />
            Filtros de Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reportType" className="text-sm font-medium">Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointments">Consultas</SelectItem>
                  <SelectItem value="clients">Clientes</SelectItem>
                  <SelectItem value="revenue">Faturamento</SelectItem>
                  {isAdvancedPlan && (
                    <>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateRange" className="text-sm font-medium">Período</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
                  <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
                  <SelectItem value="custom">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === "custom" && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-1 space-y-4">
                <div>
                  <Label htmlFor="startDate" className="text-sm font-medium">Data Inicial</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-sm font-medium">Data Final</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isBasicPlan ? (
        <BasicReports reportType={reportType} dateRange={dateRange} />
      ) : (
        <AdvancedReports reportType={reportType} dateRange={dateRange} />
      )}
    </div>
  );
};

export default ReportsModule;
