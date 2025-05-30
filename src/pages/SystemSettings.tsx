import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings as SettingsIcon, Save, Trash2, Plus, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { useAuth } from "@/hooks/useAuth";
import WhatsAppSettings from "@/components/WhatsAppSettings";

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string | null;
}

interface EmailSettings {
  smtp_host: string;
  smtp_port: string;
  smtp_user: string;
  smtp_password: string;
  smtp_from_email: string;
  smtp_from_name: string;
  email_confirmation_enabled: boolean;
}

const SystemSettings = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtp_host: "",
    smtp_port: "587",
    smtp_user: "",
    smtp_password: "",
    smtp_from_email: "",
    smtp_from_name: "AgendoPro",
    email_confirmation_enabled: false
  });
  const [loading, setLoading] = useState(true);
  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    description: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdminCheck();
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !superAdminLoading && !isSuperAdmin) {
      navigate("/dashboard");
      return;
    }

    if (isSuperAdmin) {
      fetchSettings();
      fetchEmailSettings();
    }
  }, [isSuperAdmin, superAdminLoading, authLoading, navigate]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('system_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailSettings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('system_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'smtp_host', 'smtp_port', 'smtp_user', 'smtp_password',
          'smtp_from_email', 'smtp_from_name', 'email_confirmation_enabled'
        ]);

      if (error) throw error;

      const emailSettingsData = data.reduce((acc: any, item: any) => {
        let value = item.setting_value;
        if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        acc[item.setting_key] = value;
        return acc;
      }, {});

      setEmailSettings({
        smtp_host: emailSettingsData.smtp_host || "",
        smtp_port: emailSettingsData.smtp_port || "587",
        smtp_user: emailSettingsData.smtp_user || "",
        smtp_password: emailSettingsData.smtp_password || "",
        smtp_from_email: emailSettingsData.smtp_from_email || "",
        smtp_from_name: emailSettingsData.smtp_from_name || "AgendoPro",
        email_confirmation_enabled: Boolean(emailSettingsData.email_confirmation_enabled)
      });
    } catch (error) {
      console.error('Error fetching email settings:', error);
    }
  };

  const saveEmailSettings = async () => {
    try {
      const updates = Object.entries(emailSettings).map(([key, value]) => ({
        setting_key: key,
        setting_value: typeof value === 'string' ? JSON.stringify(value) : value,
        updated_at: new Date().toISOString()
      }));

      for (const update of updates) {
        const { error } = await (supabase as any)
          .from('system_settings')
          .update(update)
          .eq('setting_key', update.setting_key);

        if (error) throw error;
      }

      toast({
        title: "Configurações de email salvas",
        description: "As configurações SMTP foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível salvar as configurações de email",
        variant: "destructive",
      });
    }
  };

  const updateSetting = async (id: string, key: string, value: string, description: string) => {
    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        parsedValue = value;
      }

      const { error } = await (supabase as any)
        .from('system_settings')
        .update({
          setting_value: parsedValue,
          description,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Configuração atualizada",
        description: "A configuração foi salva com sucesso",
      });

      fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Erro ao atualizar configuração",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    }
  };

  const createSetting = async () => {
    if (!newSetting.key.trim()) {
      toast({
        title: "Erro",
        description: "A chave da configuração é obrigatória",
        variant: "destructive",
      });
      return;
    }

    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(newSetting.value);
      } catch {
        parsedValue = newSetting.value;
      }

      const { error } = await (supabase as any)
        .from('system_settings')
        .insert({
          setting_key: newSetting.key,
          setting_value: parsedValue,
          description: newSetting.description || null
        });

      if (error) throw error;

      toast({
        title: "Configuração criada",
        description: "A nova configuração foi adicionada com sucesso",
      });

      setNewSetting({ key: "", value: "", description: "" });
      fetchSettings();
    } catch (error) {
      console.error('Error creating setting:', error);
      toast({
        title: "Erro ao criar configuração",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    }
  };

  const deleteSetting = async (id: string, key: string) => {
    if (!confirm(`Tem certeza que deseja deletar a configuração "${key}"?`)) {
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('system_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Configuração deletada",
        description: "A configuração foi removida com sucesso",
      });

      fetchSettings();
    } catch (error) {
      console.error('Error deleting setting:', error);
      toast({
        title: "Erro ao deletar configuração",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    }
  };

  if (authLoading || superAdminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/settings">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Configurações do Sistema</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="email">Email/SMTP</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Configurações SMTP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp_host">Servidor SMTP</Label>
                    <Input
                      id="smtp_host"
                      value={emailSettings.smtp_host}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp_port">Porta SMTP</Label>
                    <Input
                      id="smtp_port"
                      value={emailSettings.smtp_port}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_port: e.target.value }))}
                      placeholder="587"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp_user">Usuário SMTP</Label>
                    <Input
                      id="smtp_user"
                      value={emailSettings.smtp_user}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_user: e.target.value }))}
                      placeholder="seu-email@gmail.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp_password">Senha SMTP</Label>
                    <Input
                      id="smtp_password"
                      type="password"
                      value={emailSettings.smtp_password}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_password: e.target.value }))}
                      placeholder="sua-senha-app"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp_from_email">Email Remetente</Label>
                    <Input
                      id="smtp_from_email"
                      value={emailSettings.smtp_from_email}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_from_email: e.target.value }))}
                      placeholder="noreply@agendopro.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp_from_name">Nome Remetente</Label>
                    <Input
                      id="smtp_from_name"
                      value={emailSettings.smtp_from_name}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_from_name: e.target.value }))}
                      placeholder="AgendoPro"
                    />
                  </div>
                </div>
                
                <Button onClick={saveEmailSettings} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações SMTP
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-6">
            <WhatsAppSettings isGlobal={true} />
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            {/* Nova Configuração */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Nova Configuração
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newKey">Chave</Label>
                    <Input
                      id="newKey"
                      value={newSetting.key}
                      onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
                      placeholder="setting_key"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newValue">Valor (JSON)</Label>
                    <Input
                      id="newValue"
                      value={newSetting.value}
                      onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                      placeholder='"valor" ou {"key": "value"}'
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newDescription">Descrição</Label>
                    <Input
                      id="newDescription"
                      value={newSetting.description}
                      onChange={(e) => setNewSetting(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição da configuração"
                    />
                  </div>
                </div>
                
                <Button onClick={createSetting} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Configuração
                </Button>
              </CardContent>
            </Card>

            {/* Lista de Configurações */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações Existentes</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando configurações...</p>
                  </div>
                ) : settings.length === 0 ? (
                  <p className="text-center py-8 text-gray-600 dark:text-gray-400">
                    Nenhuma configuração encontrada
                  </p>
                ) : (
                  <div className="space-y-4">
                    {settings.map((setting) => (
                      <SettingItem
                        key={setting.id}
                        setting={setting}
                        onUpdate={updateSetting}
                        onDelete={deleteSetting}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface SettingItemProps {
  setting: SystemSetting;
  onUpdate: (id: string, key: string, value: string, description: string) => void;
  onDelete: (id: string, key: string) => void;
}

const SettingItem = ({ setting, onUpdate, onDelete }: SettingItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(JSON.stringify(setting.setting_value));
  const [description, setDescription] = useState(setting.description || "");

  const handleSave = () => {
    onUpdate(setting.id, setting.setting_key, value, description);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(JSON.stringify(setting.setting_value));
    setDescription(setting.description || "");
    setIsEditing(false);
  };

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        <div>
          <Label className="font-medium text-sm text-gray-600">Chave</Label>
          <p className="font-mono text-sm">{setting.setting_key}</p>
        </div>
        
        <div>
          <Label className="font-medium text-sm text-gray-600">Valor</Label>
          {isEditing ? (
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="min-h-[60px] font-mono text-sm"
            />
          ) : (
            <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono whitespace-pre-wrap">
              {JSON.stringify(setting.setting_value, null, 2)}
            </pre>
          )}
        </div>
        
        <div>
          <Label className="font-medium text-sm text-gray-600">Descrição</Label>
          {isEditing ? (
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[60px]"
            />
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {setting.description || "Sem descrição"}
            </p>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-1" />
                Salvar
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                Editar
              </Button>
              <Button
                onClick={() => onDelete(setting.id, setting.setting_key)}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Deletar
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SystemSettings;
