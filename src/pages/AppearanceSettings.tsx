
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Palette, Upload, Save, Eye } from "lucide-react";
import { useAppearanceSettings } from "@/hooks/useAppearanceSettings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const AppearanceSettings = () => {
  const navigate = useNavigate();
  const { loading: authLoading, profile } = useAuth();
  const { 
    settings, 
    loading, 
    isSuperAdmin, 
    getSetting, 
    updateSetting 
  } = useAppearanceSettings();

  const [formData, setFormData] = useState({
    primary_color: '#3B82F6',
    secondary_color: '#1E40AF',
    logo_url: '',
    favicon_url: '',
    company_name: 'AgendoPro',
    custom_css: '',
    login_background: '',
    dashboard_theme: 'light'
  });

  useEffect(() => {
    if (settings.length > 0) {
      setFormData({
        primary_color: getSetting('primary_color', '#3B82F6'),
        secondary_color: getSetting('secondary_color', '#1E40AF'),
        logo_url: getSetting('logo_url', ''),
        favicon_url: getSetting('favicon_url', ''),
        company_name: getSetting('company_name', 'AgendoPro'),
        custom_css: getSetting('custom_css', ''),
        login_background: getSetting('login_background', ''),
        dashboard_theme: getSetting('dashboard_theme', 'light')
      });
    }
  }, [settings]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    navigate("/dashboard");
    return null;
  }

  const handleSave = async () => {
    for (const [key, value] of Object.entries(formData)) {
      await updateSetting(key, value);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon' | 'background') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Implementar upload de arquivo real aqui
    // Por enquanto, apenas simular URL
    const fakeUrl = `https://exemplo.com/${type}/${file.name}`;
    
    if (type === 'logo') {
      setFormData(prev => ({ ...prev, logo_url: fakeUrl }));
    } else if (type === 'favicon') {
      setFormData(prev => ({ ...prev, favicon_url: fakeUrl }));
    } else if (type === 'background') {
      setFormData(prev => ({ ...prev, login_background: fakeUrl }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/settings" className="sm:hidden">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              
              <Link to="/settings" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
                  <span className="hidden sm:inline">Configurações de Aparência</span>
                  <span className="sm:hidden">Aparência</span>
                </h1>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        
        {/* Cores */}
        <Card>
          <CardHeader>
            <CardTitle>Cores do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary_color">Cor Primária</Label>
                <div className="flex space-x-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                    className="w-16"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="secondary_color">Cor Secundária</Label>
                <div className="flex space-x-2">
                  <Input
                    id="secondary_color"
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                    className="w-16"
                  />
                  <Input
                    value={formData.secondary_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                    placeholder="#1E40AF"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logotipos */}
        <Card>
          <CardHeader>
            <CardTitle>Logotipos e Imagens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company_name">Nome da Empresa</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder="AgendoPro"
              />
            </div>

            <div>
              <Label htmlFor="logo_upload">Logo Principal</Label>
              <div className="flex space-x-2">
                <Input
                  value={formData.logo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder="URL do logo"
                />
                <Button variant="outline" onClick={() => document.getElementById('logo_upload')?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <input
                  id="logo_upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'logo')}
                />
              </div>
              {formData.logo_url && (
                <div className="mt-2">
                  <img src={formData.logo_url} alt="Logo preview" className="h-12 object-contain" />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="favicon_upload">Favicon</Label>
              <div className="flex space-x-2">
                <Input
                  value={formData.favicon_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, favicon_url: e.target.value }))}
                  placeholder="URL do favicon"
                />
                <Button variant="outline" onClick={() => document.getElementById('favicon_upload')?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <input
                  id="favicon_upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'favicon')}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="background_upload">Fundo da Tela de Login</Label>
              <div className="flex space-x-2">
                <Input
                  value={formData.login_background}
                  onChange={(e) => setFormData(prev => ({ ...prev, login_background: e.target.value }))}
                  placeholder="URL da imagem de fundo"
                />
                <Button variant="outline" onClick={() => document.getElementById('background_upload')?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <input
                  id="background_upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'background')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSS Customizado */}
        <Card>
          <CardHeader>
            <CardTitle>CSS Personalizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="custom_css">CSS Customizado</Label>
              <Textarea
                id="custom_css"
                value={formData.custom_css}
                onChange={(e) => setFormData(prev => ({ ...prev, custom_css: e.target.value }))}
                placeholder="/* Adicione seu CSS personalizado aqui */"
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-2">
                Adicione estilos CSS personalizados que serão aplicados globalmente no sistema.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview das Configurações</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="p-6 rounded-lg border-2 border-dashed border-gray-300"
              style={{ 
                backgroundColor: formData.primary_color + '10',
                borderColor: formData.primary_color
              }}
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold" style={{ color: formData.primary_color }}>
                  {formData.company_name}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Preview das cores e configurações selecionadas
                </p>
                <Button 
                  className="mt-4"
                  style={{ 
                    backgroundColor: formData.primary_color,
                    borderColor: formData.primary_color
                  }}
                >
                  Botão de Exemplo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppearanceSettings;
