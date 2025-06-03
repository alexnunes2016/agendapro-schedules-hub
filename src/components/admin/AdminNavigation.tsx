
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Database,
  Mail,
  Smartphone
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';

export const AdminNavigation = () => {
  const { isSuperAdmin } = useAdminAuth();

  const adminSections = [
    {
      title: "Gerenciamento de Usuários",
      description: "Gerenciar usuários, planos e permissões",
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-500"
    },
    {
      title: "Relatórios",
      description: "Visualizar estatísticas e relatórios",
      icon: BarChart3,
      href: "/admin/reports",
      color: "bg-green-500"
    }
  ];

  const superAdminSections = [
    {
      title: "Configurações do Sistema",
      description: "Configurar parâmetros globais",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-purple-500"
    },
    {
      title: "Logs de Auditoria",
      description: "Visualizar logs de atividades",
      icon: Shield,
      href: "/admin/audit",
      color: "bg-red-500"
    },
    {
      title: "Configurações de Email",
      description: "Configurar SMTP e templates",
      icon: Mail,
      href: "/admin/email-settings",
      color: "bg-orange-500"
    },
    {
      title: "Configurações WhatsApp",
      description: "Configurar integração WhatsApp",
      icon: Smartphone,
      href: "/admin/whatsapp-settings",
      color: "bg-green-600"
    }
  ];

  const allSections = isSuperAdmin 
    ? [...adminSections, ...superAdminSections]
    : adminSections;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allSections.map((section, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${section.color}`}>
                <section.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg">{section.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {section.description}
            </p>
            <Link to={section.href}>
              <Button className="w-full">
                Acessar
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
