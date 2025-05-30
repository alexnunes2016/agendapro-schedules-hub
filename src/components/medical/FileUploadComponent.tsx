
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface FileUploadComponentProps {
  recordId: string;
  onFileUploaded: () => void;
}

const FileUploadComponent = ({ recordId, onFileUploaded }: FileUploadComponentProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const allowedTypes = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'];
  const maxFileSize = 2 * 1024 * 1024; // 2MB

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Tipo de arquivo não permitido",
          description: `${file.name} não é um tipo de arquivo válido. Use PDF, PNG, JPG ou JPEG.`,
          variant: "destructive",
        });
        return false;
      }
      
      if (file.size > maxFileSize) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 2MB.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    setSelectedFiles(validFiles);
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0 || !user) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${recordId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('medical-files')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        // Save file record to database
        const { error: dbError } = await supabase
          .from('medical_record_files')
          .insert({
            medical_record_id: recordId,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            file_url: fileName,
            uploaded_by: user.id,
          });

        if (dbError) {
          throw dbError;
        }

        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      toast({
        title: "Sucesso",
        description: `${selectedFiles.length} arquivo(s) enviado(s) com sucesso`,
      });

      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onFileUploaded();

    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message || "Erro ao enviar arquivo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Clique para selecionar arquivos ou arraste aqui
          </p>
          <p className="text-xs text-gray-500 mb-4">
            PDF, PNG, JPG, JPEG (máx. 2MB por arquivo)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button 
            type="button" 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            Selecionar Arquivos
          </Button>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Arquivos selecionados:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">{file.name}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFile(index)}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {uploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-center text-gray-600">
                Enviando... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
          
          <Button 
            onClick={uploadFiles} 
            disabled={uploading}
            className="w-full"
          >
            {uploading ? "Enviando..." : "Enviar Arquivos"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
