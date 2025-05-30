
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useInputValidator } from './InputValidator';

interface SecureFileUploadProps {
  onFileSelect: (files: File[]) => void;
  maxFileSize?: number;
  allowedTypes?: string[];
  maxFiles?: number;
}

const SecureFileUpload = ({ 
  onFileSelect, 
  maxFileSize = 2 * 1024 * 1024, // 2MB default
  allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'],
  maxFiles = 5
}: SecureFileUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const { validateFileName } = useInputValidator();

  const validateFile = (file: File): string | null => {
    // Validate file name
    const nameValidation = validateFileName(file.name);
    if (!nameValidation.isValid) {
      return nameValidation.errors[0];
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      return `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      return `Arquivo muito grande. Tamanho máximo: ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`;
    }

    // Additional security checks
    const extension = file.name.split('.').pop()?.toLowerCase();
    const mimeToExtension: Record<string, string[]> = {
      'application/pdf': ['pdf'],
      'image/png': ['png'],
      'image/jpeg': ['jpg', 'jpeg'],
      'image/jpg': ['jpg']
    };

    const expectedExtensions = mimeToExtension[file.type];
    if (expectedExtensions && !expectedExtensions.includes(extension || '')) {
      return 'Extensão do arquivo não corresponde ao tipo';
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length > maxFiles) {
      toast({
        title: "Muitos arquivos",
        description: `Máximo de ${maxFiles} arquivos permitidos`,
        variant: "destructive",
      });
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      toast({
        title: "Arquivos inválidos",
        description: errors.join('\n'),
        variant: "destructive",
      });
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      onFileSelect(validFiles);
    }

    // Clear input
    event.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={handleFileSelect}
          className="w-full"
        />
        <div className="text-sm text-gray-500 mt-2">
          <p>Tipos aceitos: {allowedTypes.join(', ')}</p>
          <p>Tamanho máximo: {(maxFileSize / 1024 / 1024).toFixed(1)}MB por arquivo</p>
          <p>Máximo de {maxFiles} arquivos</p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Arquivos selecionados:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">{file.name}</span>
              <span className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)}MB
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SecureFileUpload;
