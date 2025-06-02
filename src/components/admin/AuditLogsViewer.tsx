
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useSuperAdminCheck } from '@/hooks/useSuperAdminCheck';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

interface AuditLog {
  id: string;
  action: string;
  table_name: string | null;
  record_id: string | null;
  old_values: Json | null;
  new_values: Json | null;
  user_id: string | null;
  timestamp: string | null;
  ip_address: unknown | null;
  user_agent: string | null;
}

const AuditLogsViewer = () => {
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdminCheck();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!superAdminLoading && isSuperAdmin) {
      fetchAuditLogs();
    } else if (!superAdminLoading && !isSuperAdmin) {
      setLoading(false);
    }
  }, [isSuperAdmin, superAdminLoading]);

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar logs de auditoria",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const formatIpAddress = (ip: unknown) => {
    if (!ip) return 'N/A';
    return String(ip);
  };

  const getActionBadge = (action: string) => {
    const colorMap: Record<string, string> = {
      'password_reset': 'bg-orange-100 text-orange-800',
      'plan_change': 'bg-blue-100 text-blue-800',
      'user_delete': 'bg-red-100 text-red-800',
      'user_create': 'bg-green-100 text-green-800',
      'user_update': 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={colorMap[action] || 'bg-gray-100 text-gray-800'}>
        {action}
      </Badge>
    );
  };

  if (superAdminLoading || loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando logs de auditoria...</div>
        </CardContent>
      </Card>
    );
  }

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Acesso negado. Apenas super administradores podem visualizar logs de auditoria.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs de Auditoria</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center text-gray-500">
            Nenhum log de auditoria encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Tabela</TableHead>
                  <TableHead>ID do Registro</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>{log.table_name || 'N/A'}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.record_id ? `${log.record_id.substring(0, 8)}...` : 'N/A'}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.user_id ? `${log.user_id.substring(0, 8)}...` : 'N/A'}
                    </TableCell>
                    <TableCell>{formatIpAddress(log.ip_address)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogsViewer;
