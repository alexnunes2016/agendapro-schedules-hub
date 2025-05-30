
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SettingItem from "./SettingItem";

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string | null;
}

interface SettingsListViewProps {
  settings: SystemSetting[];
  loading: boolean;
  onUpdate: (id: string, key: string, value: string, description: string) => void;
  onDelete: (id: string, key: string) => void;
}

const SettingsListView = ({ settings, loading, onUpdate, onDelete }: SettingsListViewProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configurações Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando configurações...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Existentes</CardTitle>
      </CardHeader>
      <CardContent>
        {settings.length === 0 ? (
          <p className="text-center py-8 text-gray-600 dark:text-gray-400">
            Nenhuma configuração encontrada
          </p>
        ) : (
          <div className="space-y-4">
            {settings.map((setting) => (
              <SettingItem
                key={setting.id}
                setting={setting}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SettingsListView;
