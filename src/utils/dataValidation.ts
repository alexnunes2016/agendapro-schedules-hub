
// Utilitários centralizados para validação de dados
export class DataValidator {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  static isValidDate(date: string): boolean {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate >= new Date();
  }

  static isValidTime(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  static isValidPlan(plan: string): boolean {
    const validPlans = ['free', 'basico', 'profissional', 'premium'];
    return validPlans.includes(plan);
  }

  static validateAppointmentData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.client_name?.trim()) {
      errors.push('Nome do cliente é obrigatório');
    }

    if (data.client_email && !this.isValidEmail(data.client_email)) {
      errors.push('Email inválido');
    }

    if (data.client_phone && !this.isValidPhone(data.client_phone)) {
      errors.push('Telefone inválido');
    }

    if (!data.appointment_date || !this.isValidDate(data.appointment_date)) {
      errors.push('Data do agendamento é obrigatória e deve ser futura');
    }

    if (!data.appointment_time || !this.isValidTime(data.appointment_time)) {
      errors.push('Horário do agendamento é obrigatório e deve ser válido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUserData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name?.trim()) {
      errors.push('Nome é obrigatório');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Email válido é obrigatório');
    }

    if (data.plan && !this.isValidPlan(data.plan)) {
      errors.push('Plano inválido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
