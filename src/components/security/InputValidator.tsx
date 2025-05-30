
import { useState } from 'react';

interface ValidationRule {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  customValidator?: (value: string) => string | null;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const useInputValidator = () => {
  const validateInput = (value: string, rules: ValidationRule): ValidationResult => {
    const errors: string[] = [];

    if (rules.required && (!value || value.trim().length === 0)) {
      errors.push('Este campo é obrigatório');
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      errors.push(`Mínimo de ${rules.minLength} caracteres`);
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Máximo de ${rules.maxLength} caracteres`);
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors.push('Formato inválido');
    }

    if (value && rules.customValidator) {
      const customError = rules.customValidator(value);
      if (customError) {
        errors.push(customError);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const sanitizeInput = (value: string): string => {
    // Remove potentially dangerous characters
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  };

  const validateEmail = (email: string): ValidationResult => {
    return validateInput(email, {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      customValidator: (value) => {
        const sanitized = sanitizeInput(value);
        return sanitized !== value ? 'Email contém caracteres inválidos' : null;
      }
    });
  };

  const validatePassword = (password: string): ValidationResult => {
    return validateInput(password, {
      required: true,
      minLength: 8,
      customValidator: (value) => {
        if (!/(?=.*[a-z])/.test(value)) {
          return 'Deve conter pelo menos uma letra minúscula';
        }
        if (!/(?=.*[A-Z])/.test(value)) {
          return 'Deve conter pelo menos uma letra maiúscula';
        }
        if (!/(?=.*\d)/.test(value)) {
          return 'Deve conter pelo menos um número';
        }
        return null;
      }
    });
  };

  const validateFileName = (fileName: string): ValidationResult => {
    return validateInput(fileName, {
      required: true,
      maxLength: 255,
      pattern: /^[a-zA-Z0-9._-]+$/,
      customValidator: (value) => {
        const dangerous = ['..', '/', '\\', '<', '>', ':', '"', '|', '?', '*'];
        for (const char of dangerous) {
          if (value.includes(char)) {
            return 'Nome do arquivo contém caracteres não permitidos';
          }
        }
        return null;
      }
    });
  };

  return {
    validateInput,
    sanitizeInput,
    validateEmail,
    validatePassword,
    validateFileName
  };
};

interface SecureInputProps {
  value: string;
  onChange: (value: string) => void;
  rules: ValidationRule;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  className?: string;
}

const SecureInput = ({ value, onChange, rules, placeholder, type = 'text', className }: SecureInputProps) => {
  const [showErrors, setShowErrors] = useState(false);
  const { validateInput, sanitizeInput } = useInputValidator();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value);
    onChange(sanitized);
    setShowErrors(true);
  };

  const validation = validateInput(value, rules);

  return (
    <div className="space-y-1">
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${className} ${!validation.isValid && showErrors ? 'border-red-500' : ''}`}
      />
      {showErrors && validation.errors.length > 0 && (
        <div className="text-sm text-red-600">
          {validation.errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SecureInput;
