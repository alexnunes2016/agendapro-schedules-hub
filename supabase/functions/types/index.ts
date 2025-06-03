export interface WebhookPayload {
  event: string;
  table: string;
  record: Record<string, any>;
  old_record?: Record<string, any>;
  schema: string;
}

export interface WhatsAppMessage {
  to: string;
  template?: string;
  text?: string;
  media_url?: string;
  variables?: Record<string, string>;
}

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
}

export interface AppointmentNotification {
  appointment_id: string;
  type: 'confirmation' | 'reminder' | 'cancellation' | 'rescheduled';
  channel: 'whatsapp' | 'email' | 'sms';
  recipient: {
    name: string;
    phone?: string;
    email?: string;
  };
  details: {
    date: string;
    time: string;
    service: string;
    professional: string;
    location?: string;
    notes?: string;
  };
}

export interface SystemStatistics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  new_users_this_month: number;
  total_revenue_estimate: number;
  plan_distribution: Record<string, number>;
  total_appointments: number;
  appointments_this_month: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, any>;
} 