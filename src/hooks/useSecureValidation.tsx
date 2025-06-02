
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

interface ValidationConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customRules?: ValidationRule[];
}

export const useSecureValidation = () => {
  const { toast } = useToast();

  const sanitizeInput = (input: string): string => {
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  };

  const validateField = (value: string, config: ValidationConfig): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const sanitizedValue = sanitizeInput(value);

    if (config.required && !sanitizedValue) {
      errors.push('Este campo é obrigatório');
    }

    if (sanitizedValue && config.minLength && sanitizedValue.length < config.minLength) {
      errors.push(`Mínimo de ${config.minLength} caracteres`);
    }

    if (sanitizedValue && config.maxLength && sanitizedValue.length > config.maxLength) {
      errors.push(`Máximo de ${config.maxLength} caracteres`);
    }

    if (sanitizedValue && config.pattern && !config.pattern.test(sanitizedValue)) {
      errors.push('Formato inválido');
    }

    if (config.customRules) {
      config.customRules.forEach(rule => {
        if (sanitizedValue && !rule.test(sanitizedValue)) {
          errors.push(rule.message);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    return validateField(password, {
      required: true,
      minLength: 8,
      customRules: [
        {
          test: (value) => /[A-Z]/.test(value),
          message: 'Deve conter ao menos uma letra maiúscula'
        },
        {
          test: (value) => /[a-z]/.test(value),
          message: 'Deve conter ao menos uma letra minúscula'
        },
        {
          test: (value) => /\d/.test(value),
          message: 'Deve conter ao menos um número'
        },
        {
          test: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
          message: 'Deve conter ao menos um caractere especial'
        }
      ]
    });
  };

  const validateEmail = (email: string): { isValid: boolean; errors: string[] } => {
    return validateField(email, {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      maxLength: 254
    });
  };

  const validatePhoneNumber = (phone: string): { isValid: boolean; errors: string[] } => {
    return validateField(phone, {
      pattern: /^\+?[\d\s\-\(\)]+$/,
      minLength: 10,
      maxLength: 20
    });
  };

  const showValidationErrors = (errors: string[]) => {
    if (errors.length > 0) {
      toast({
        title: "Erro de Validação",
        description: errors.join(', '),
        variant: "destructive",
      });
    }
  };

  return {
    sanitizeInput,
    validateField,
    validatePassword,
    validateEmail,
    validatePhoneNumber,
    showValidationErrors
  };
};
