
// Application constants for production configuration
export const APP_CONFIG = {
  // Application info
  APP_NAME: 'AgendoPro',
  APP_VERSION: '1.0.0',
  
  // API Configuration
  MAX_RETRIES: 3,
  REQUEST_TIMEOUT: 30000, // 30 seconds
  
  // File upload limits
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_FILE_TYPES: ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'],
  MAX_FILES_PER_UPLOAD: 5,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Rate limiting
  PASSWORD_RESET_COOLDOWN: 60 * 60 * 1000, // 1 hour
  LOGIN_ATTEMPT_LIMIT: 5,
  LOGIN_LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  
  // UI Configuration
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  
  // Plan limits
  PLAN_LIMITS: {
    free: {
      users: 1,
      calendars: 1,
      appointments_per_month: 50,
      storage_mb: 100
    },
    basico: {
      users: 3,
      calendars: 2,
      appointments_per_month: 200,
      storage_mb: 500
    },
    profissional: {
      users: 5,
      calendars: -1, // unlimited
      appointments_per_month: 1000,
      storage_mb: 2000
    },
    premium: {
      users: -1, // unlimited
      calendars: -1, // unlimited
      appointments_per_month: -1, // unlimited
      storage_mb: 10000
    }
  },
  
  // Date and time formats
  DATE_FORMAT: 'dd/MM/yyyy',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
  
  // Business hours
  DEFAULT_BUSINESS_HOURS: {
    start: '08:00',
    end: '18:00'
  },
  
  // Status options
  APPOINTMENT_STATUSES: [
    { value: 'pending', label: 'Pendente', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmado', color: 'green' },
    { value: 'cancelled', label: 'Cancelado', color: 'red' },
    { value: 'completed', label: 'Concluído', color: 'blue' }
  ],
  
  // User roles
  USER_ROLES: [
    { value: 'user', label: 'Usuário' },
    { value: 'admin', label: 'Administrador' },
    { value: 'super_admin', label: 'Super Administrador' }
  ],
  
  // Plans
  AVAILABLE_PLANS: [
    { value: 'free', label: '14 dias teste' },
    { value: 'basico', label: 'Básico' },
    { value: 'profissional', label: 'Profissional' },
    { value: 'premium', label: 'Premium' }
  ]
};

// Environment-specific configuration
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Você não tem permissão para realizar esta ação.',
  FORBIDDEN: 'Acesso negado.',
  NOT_FOUND: 'Recurso não encontrado.',
  VALIDATION_ERROR: 'Dados inválidos fornecidos.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
  RATE_LIMIT: 'Muitas tentativas. Aguarde um momento.',
  FILE_TOO_LARGE: 'Arquivo muito grande.',
  INVALID_FILE_TYPE: 'Tipo de arquivo não permitido.',
  REQUIRED_FIELD: 'Este campo é obrigatório.',
  INVALID_EMAIL: 'Email inválido.',
  WEAK_PASSWORD: 'Senha muito fraca.',
  PASSWORD_MISMATCH: 'Senhas não coincidem.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login realizado com sucesso!',
  LOGOUT: 'Logout realizado com sucesso!',
  REGISTER: 'Conta criada com sucesso!',
  UPDATE: 'Dados atualizados com sucesso!',
  DELETE: 'Item excluído com sucesso!',
  CREATE: 'Item criado com sucesso!',
  SAVE: 'Dados salvos com sucesso!',
  PASSWORD_RESET: 'Senha resetada com sucesso!',
  EMAIL_SENT: 'Email enviado com sucesso!'
};

// Regular expressions for validation
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  NAME: /^[a-zA-ZÀ-ÿ\s]+$/,
  FILENAME: /^[a-zA-Z0-9._-]+$/,
  TIME: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/
};
