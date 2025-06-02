
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Shield } from "lucide-react";
import { useCalendarPermissions } from "@/hooks/useCalendarPermissions";
import { Calendar } from "@/hooks/useCalendars";

interface CalendarPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendar: Calendar | null;
}

const permissionTypes = [
  { value: 'view', label: 'Visualizar', description: 'Pode apenas visualizar a agenda' },
  { value: 'edit', label: 'Editar', description: 'Pode editar agendamentos' },
  { value: 'admin', label: 'Administrador', description: 'Controle total da agenda' }
];

const CalendarPermissionsModal = ({ open, onOpenChange, calendar }: CalendarPermissionsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_email: '',
    permission_type: ''
  });

  const { permissions, loading: permissionsLoading, grantPermission, revokePermission } = useCalendarPermissions(calendar?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calendar) return;

    setLoading(true);

    try {
      // Em uma implementação real, você precisaria buscar o user_id pelo email
      // Por enquanto, vamos simular com um ID fictício
      const success = await grantPermission({
        calendar_id: calendar.id,
        user_id: 'user-id-from-email', // Isso precisaria ser implementado
        permission_type: formData.permission_type as 'view' | 'edit' | 'admin'
      });
      
      if (success) {
        setFormData({ user_email: '', permission_type: '' });
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (permissionId: string) => {
    await revokePermission(permissionId);
  };

  const getPermissionBadgeVariant = (type: string) => {
    switch (type) {
      case 'admin': return 'destructive';
      case 'edit': return 'default';
      case 'view': return 'secondary';
      default: return 'secondary';
    }
  };

  if (!calendar) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Gerenciar Permissões - {calendar.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Formulário para adicionar nova permissão */}
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="user_email">Email do Usuário</Label>
                    <Input
                      id="user_email"
                      type="email"
                      placeholder="usuario@exemplo.com"
                      value={formData.user_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="permission_type">Tipo de Permissão</Label>
                    <Select 
                      value={formData.permission_type} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, permission_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a permissão" />
                      </SelectTrigger>
                      <SelectContent>
                        {permissionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || !formData.user_email || !formData.permission_type}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {loading ? "Concedendo..." : "Conceder Permissão"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de permissões existentes */}
          <div>
            <h3 className="text-lg font-medium mb-4">Permissões Concedidas</h3>
            {permissionsLoading ? (
              <div className="text-center py-4">Carregando permissões...</div>
            ) : permissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma permissão concedida ainda
              </div>
            ) : (
              <div className="space-y-2">
                {permissions.map((permission) => {
                  const permissionType = permissionTypes.find(p => p.value === permission.permission_type);
                  return (
                    <div 
                      key={permission.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{permission.user_id}</span>
                        <Badge variant={getPermissionBadgeVariant(permission.permission_type)}>
                          {permissionType?.label}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevoke(permission.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarPermissionsModal;
