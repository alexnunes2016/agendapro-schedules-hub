
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SettingItem from "./SettingItem";

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string | null;
}

const GeneralSettingsTab = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    description: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

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

  return (
    <div className="space-y-6">
      {/* Nova Configuração */}
      <Card>
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
    </div>
  );
};

export default GeneralSettingsTab;
