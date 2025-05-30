
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewSettingFormProps {
  onSettingCreated: () => void;
}

const NewSettingForm = ({ onSettingCreated }: NewSettingFormProps) => {
  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    description: ""
  });
  const { toast } = useToast();

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
      onSettingCreated();
    } catch (error) {
      console.error('Error creating setting:', error);
      toast({
        title: "Erro ao criar configuração",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    }
  };

  return (
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
  );
};

export default NewSettingForm;
