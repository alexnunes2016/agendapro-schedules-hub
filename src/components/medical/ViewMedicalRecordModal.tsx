
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Mail, Phone, Upload, FileText, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FileUploadComponent from "@/components/medical/FileUploadComponent";

interface MedicalRecord {
  id: string;
  patient_name: string;
  patient_email: string | null;
  patient_phone: string | null;
  date_of_birth: string | null;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface MedicalRecordFile {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  created_at: string;
}

interface ViewMedicalRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: MedicalRecord;
  userPlan: string;
  onUpdate: () => void;
}

const ViewMedicalRecordModal = ({ open, onOpenChange, record, userPlan, onUpdate }: ViewMedicalRecordModalProps) => {
  const [files, setFiles] = useState<MedicalRecordFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const { toast } = useToast();

  const canUploadFiles = userPlan === 'premium';

  useEffect(() => {
    if (open && canUploadFiles) {
      fetchFiles();
    }
  }, [open, canUploadFiles]);

  const fetchFiles = async () => {
    setLoadingFiles(true);
    try {
      const { data, error } = await supabase
        .from('medical_record_files')
        .select('*')
        .eq('medical_record_id', record.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching files:', error);
      } else {
        setFiles(data || []);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileUploaded = () => {
    fetchFiles();
    onUpdate();
  };

  const downloadFile = async (file: MedicalRecordFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('medical-files')
        .download(file.file_url);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível baixar o arquivo",
          variant: "destructive",
        });
        return;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao baixar arquivo",
        variant: "destructive",
      });
    }
  };

  const deleteFile = async (file: MedicalRecordFile) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('medical-files')
        .remove([file.file_url]);

      if (storageError) {
        console.error('Storage error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('medical_record_files')
        .delete()
        .eq('id', file.id);

      if (dbError) {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o arquivo",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Arquivo excluído com sucesso",
        });
        fetchFiles();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir arquivo",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Prontuário - {record.patient_name}</span>
          </DialogTitle>
          <DialogDescription>
            Visualização completa do prontuário médico
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Informações do Paciente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Nome:</span>
                <span className="font-medium">{record.patient_name}</span>
              </div>
              
              {record.patient_email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="font-medium">{record.patient_email}</span>
                </div>
              )}
              
              {record.patient_phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Telefone:</span>
                  <span className="font-medium">{record.patient_phone}</span>
                </div>
              )}
              
              {record.date_of_birth && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Nascimento:</span>
                  <span className="font-medium">
                    {new Date(record.date_of_birth).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Medical Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Médicas</h3>
            
            {record.diagnosis && (
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Diagnóstico:</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded">{record.diagnosis}</p>
              </div>
            )}
            
            {record.treatment && (
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Tratamento:</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded">{record.treatment}</p>
              </div>
            )}
            
            {record.notes && (
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Observações:</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded">{record.notes}</p>
              </div>
            )}
          </div>

          {/* Files Section - Only for Premium */}
          {canUploadFiles && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Arquivos Anexados</span>
                    <Badge variant="secondary">Premium</Badge>
                  </h3>
                </div>

                <FileUploadComponent 
                  recordId={record.id}
                  onFileUploaded={handleFileUploaded}
                />

                {loadingFiles ? (
                  <p className="text-center text-gray-500">Carregando arquivos...</p>
                ) : files.length > 0 ? (
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">{file.file_name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadFile(file)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteFile(file)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Nenhum arquivo anexado</p>
                )}
              </div>
            </>
          )}

          {!canUploadFiles && (
            <>
              <Separator />
              <div className="text-center p-6 bg-gray-50 rounded">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h4 className="font-medium text-gray-600 mb-1">Upload de Arquivos</h4>
                <p className="text-sm text-gray-500 mb-3">
                  Disponível apenas no plano Premium
                </p>
                <Badge variant="outline">Premium</Badge>
              </div>
            </>
          )}

          <Separator />

          {/* Metadata */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>Criado em: {new Date(record.created_at).toLocaleString('pt-BR')}</p>
            <p>Atualizado em: {new Date(record.updated_at).toLocaleString('pt-BR')}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMedicalRecordModal;
