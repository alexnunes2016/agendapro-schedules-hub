
import { useState } from 'react';
import DOMPurify from 'dompurify';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}

export class InputValidator {
  // Email validation with enhanced security
  static validateEmail(email: string): ValidationResult {
    const sanitized = DOMPurify.sanitize(email.trim());
    
    // Basic email regex with security considerations
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(sanitized)) {
      return { isValid: false, error: 'Email inválido' };
    }
    
    // Check for potential script injection
    if (sanitized.includes('<') || sanitized.includes('>') || sanitized.includes('script')) {
      return { isValid: false, error: 'Email contém caracteres inválidos' };
    }
    
    return { isValid: true, sanitizedValue: sanitized };
  }

  // Password validation with security requirements
  static validatePassword(password: string): ValidationResult {
    if (password.length < 8) {
      return { isValid: false, error: 'Senha deve ter pelo menos 8 caracteres' };
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { isValid: false, error: 'Senha deve conter ao menos uma letra minúscula, maiúscula e um número' };
    }
    
    // Check for common weak passwords
    const weakPasswords = ['12345678', 'password', 'qwerty123', 'admin123'];
    if (weakPasswords.includes(password.toLowerCase())) {
      return { isValid: false, error: 'Senha muito fraca. Escolha uma senha mais segura.' };
    }
    
    return { isValid: true, sanitizedValue: password };
  }

  // General text input sanitization
  static sanitizeText(input: string): string {
    return DOMPurify.sanitize(input.trim(), {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
  }

  // Phone number validation
  static validatePhone(phone: string): ValidationResult {
    const sanitized = DOMPurify.sanitize(phone.replace(/\D/g, ''));
    
    if (sanitized.length < 10 || sanitized.length > 15) {
      return { isValid: false, error: 'Número de telefone inválido' };
    }
    
    return { isValid: true, sanitizedValue: sanitized };
  }

  // Name validation
  static validateName(name: string): ValidationResult {
    const sanitized = this.sanitizeText(name);
    
    if (sanitized.length < 2) {
      return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
    }
    
    if (sanitized.length > 100) {
      return { isValid: false, error: 'Nome muito longo' };
    }
    
    // Only allow letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(sanitized)) {
      return { isValid: false, error: 'Nome contém caracteres inválidos' };
    }
    
    return { isValid: true, sanitizedValue: sanitized };
  }
}

// Hook for form validation
export const useInputValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (fieldName: string, value: string, type: 'email' | 'password' | 'name' | 'phone'): boolean => {
    let result: ValidationResult;
    
    switch (type) {
      case 'email':
        result = InputValidator.validateEmail(value);
        break;
      case 'password':
        result = InputValidator.validatePassword(value);
        break;
      case 'name':
        result = InputValidator.validateName(value);
        break;
      case 'phone':
        result = InputValidator.validatePhone(value);
        break;
      default:
        result = { isValid: true };
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: result.error || ''
    }));

    return result.isValid;
  };

  const clearErrors = () => setErrors({});

  return { errors, validateField, clearErrors };
};
