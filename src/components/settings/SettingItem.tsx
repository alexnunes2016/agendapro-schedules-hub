
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Trash2 } from "lucide-react";

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string | null;
}

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

export default SettingItem;
