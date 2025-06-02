import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText } from 'lucide-react';
import { InputValidator, useInputValidation } from './InputValidator';

interface SecureFileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile?: File | null;
  accept?: string;
  maxSize?: number; // in MB
}

const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSize = 10
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    const allowedTypes = accept.split(',');
    const isTypeValid = allowedTypes.some(type => file.type.includes(type.replace('.', '')));
    if (!isTypeValid) {
      alert(`Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`);
      return;
    }

    const maxSizeInBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert(`Arquivo muito grande. O tamanho máximo permitido é ${maxSize}MB`);
      return;
    }

    onFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    handleFileSelect(selectedFile);
  };

  const handleRemoveSelectedFile = () => {
    onFileRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
  };

  const handleClickFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-md p-4 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
        }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileInputChange}
        ref={fileInputRef}
      />
      <div className="text-center">
        {selectedFile ? (
          <div>
            <FileText className="mx-auto h-6 w-6 text-gray-500 dark:text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Arquivo selecionado: {selectedFile.name}
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemoveSelectedFile}
              className="mt-2"
            >
              <X className="h-4 w-4 mr-2" />
              Remover
            </Button>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto h-6 w-6 text-gray-500 dark:text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Arraste e solte arquivos aqui ou
            </p>
            <Button variant="outline" size="sm" onClick={handleClickFileInput}>
              Selecione um arquivo
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Aceita: {accept} | Max: {maxSize}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureFileUpload;
