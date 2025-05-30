
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import SecureFileUpload from "@/components/security/SecureFileUpload";

interface FileUploadComponentProps {
  recordId: string;
  onFileUploaded: () => void;
}

const FileUploadComponent = ({ recordId, onFileUploaded }: FileUploadComponentProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadFiles = async () => {
    if (selectedFiles.length === 0 || !user) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${recordId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload to storage with enhanced security
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('medical-files')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw uploadError;
        }

        // Save file record to database with validation
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
          // If DB insert fails, clean up the uploaded file
          await supabase.storage.from('medical-files').remove([fileName]);
          throw dbError;
        }

        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      toast({
        title: "Sucesso",
        description: `${selectedFiles.length} arquivo(s) enviado(s) com sucesso`,
      });

      setSelectedFiles([]);
      onFileUploaded();

    } catch (error: any) {
      console.error('Upload error:', error);
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

  return (
    <div className="space-y-4">
      <SecureFileUpload
        onFileSelect={setSelectedFiles}
        maxFileSize={2 * 1024 * 1024} // 2MB
        allowedTypes={['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']}
        maxFiles={5}
      />
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-center text-gray-600">
            Enviando... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}
      
      {selectedFiles.length > 0 && !uploading && (
        <Button 
          onClick={uploadFiles} 
          disabled={uploading}
          className="w-full"
        >
          Enviar Arquivos
        </Button>
      )}
    </div>
  );
};

export default FileUploadComponent;
