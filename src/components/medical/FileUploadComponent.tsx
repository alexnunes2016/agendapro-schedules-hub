
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadFiles = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${recordId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to storage with enhanced security
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical-files')
        .upload(fileName, selectedFile, {
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
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          file_type: selectedFile.type,
          file_url: fileName,
          uploaded_by: user.id,
        });

      if (dbError) {
        // If DB insert fails, clean up the uploaded file
        await supabase.storage.from('medical-files').remove([fileName]);
        throw dbError;
      }

      setUploadProgress(100);

      toast({
        title: "Sucesso",
        description: "Arquivo enviado com sucesso",
      });

      setSelectedFile(null);
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

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-4">
      <SecureFileUpload
        onFileSelect={setSelectedFile}
        onFileRemove={handleFileRemove}
        selectedFile={selectedFile}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        maxSize={2}
      />
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-center text-gray-600">
            Enviando... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}
      
      {selectedFile && !uploading && (
        <Button 
          onClick={uploadFiles} 
          disabled={uploading}
          className="w-full"
        >
          Enviar Arquivo
        </Button>
      )}
    </div>
  );
};

export default FileUploadComponent;
