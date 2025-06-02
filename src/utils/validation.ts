
import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string()
  .email('Email inválido')
  .min(1, 'Email é obrigatório')
  .max(320, 'Email muito longo')
  .transform((email) => email.toLowerCase().trim());

export const passwordSchema = z.string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .max(128, 'Senha muito longa')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número');

export const phoneSchema = z.string()
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Formato de telefone inválido')
  .min(10, 'Telefone deve ter pelo menos 10 dígitos')
  .max(20, 'Telefone muito longo')
  .optional()
  .transform((phone) => phone?.replace(/\D/g, ''));

export const nameSchema = z.string()
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(100, 'Nome muito longo')
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços')
  .transform((name) => name.trim());

export const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
  .refine((date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime()) && d >= new Date('1900-01-01');
  }, 'Data inválida ou muito antiga');

export const timeSchema = z.string()
  .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário deve estar no formato HH:MM');

export const uuidSchema = z.string()
  .uuid('ID inválido');

// Specific form schemas
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória')
});

export const registerFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  clinic_name: z.string()
    .min(2, 'Nome da clínica deve ter pelo menos 2 caracteres')
    .max(200, 'Nome da clínica muito longo')
    .transform((name) => name.trim()),
  service_type: z.string()
    .min(2, 'Tipo de serviço é obrigatório')
    .max(100, 'Tipo de serviço muito longo')
});

export const appointmentFormSchema = z.object({
  client_name: nameSchema,
  client_email: emailSchema.optional(),
  client_phone: phoneSchema,
  appointment_date: dateSchema.refine((date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
  }, 'Data do agendamento deve ser hoje ou no futuro'),
  appointment_time: timeSchema,
  service_id: uuidSchema,
  notes: z.string()
    .max(1000, 'Observações muito longas')
    .optional()
    .transform((notes) => notes?.trim())
});

export const serviceFormSchema = z.object({
  name: z.string()
    .min(2, 'Nome do serviço deve ter pelo menos 2 caracteres')
    .max(200, 'Nome muito longo')
    .transform((name) => name.trim()),
  description: z.string()
    .max(1000, 'Descrição muito longa')
    .optional()
    .transform((desc) => desc?.trim()),
  duration_minutes: z.number()
    .int('Duração deve ser um número inteiro')
    .min(5, 'Duração mínima é 5 minutos')
    .max(1440, 'Duração máxima é 24 horas'),
  price: z.number()
    .min(0, 'Preço não pode ser negativo')
    .max(999999.99, 'Preço muito alto')
    .optional()
});

export const medicalRecordFormSchema = z.object({
  patient_name: nameSchema,
  patient_email: emailSchema.optional(),
  patient_phone: phoneSchema,
  date_of_birth: dateSchema
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, 'Data de nascimento não pode ser no futuro')
    .optional(),
  diagnosis: z.string()
    .max(2000, 'Diagnóstico muito longo')
    .optional()
    .transform((diag) => diag?.trim()),
  treatment: z.string()
    .max(2000, 'Tratamento muito longo')
    .optional()
    .transform((treat) => treat?.trim()),
  notes: z.string()
    .max(5000, 'Observações muito longas')
    .optional()
    .transform((notes) => notes?.trim())
});

// Validation utilities
export const validateInput = <T,>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean; 
  data?: T; 
  errors?: string[] 
} => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['Erro de validação desconhecido'] };
  }
};

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '');
};

export const sanitizeObject = (obj: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (value !== null && value !== undefined) {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Date validation utilities
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
};

export const isBusinessDay = (date: string): boolean => {
  const day = new Date(date).getDay();
  return day >= 1 && day <= 5; // Monday to Friday
};

export const isValidBusinessHour = (time: string): boolean => {
  const [hours] = time.split(':').map(Number);
  return hours >= 8 && hours <= 18; // 8 AM to 6 PM
};
