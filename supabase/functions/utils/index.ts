import { ErrorResponse } from '../types';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function handleError(error: any): ErrorResponse {
  console.error('Error:', error);
  
  return {
    error: error.code || 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred',
    details: error.details || undefined
  };
}

export function handleOptions(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
}

export function validateAuthHeader(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return null;
  }

  return authHeader.replace('Bearer ', '');
}

export async function validateRequest(request: Request) {
  const token = validateAuthHeader(request);
  
  if (!token) {
    throw new Error('Missing authorization header');
  }

  // Add additional validation as needed
  return token;
}

export function createResponse(data: any, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  );
}

export function createErrorResponse(error: ErrorResponse, status = 400) {
  return createResponse(error, status);
}

export async function parseRequestBody<T>(request: Request): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    throw new Error('Invalid request body');
  }
}

export function formatPhoneNumber(phone: string): string {
  // Remove todos os caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  // Adiciona o código do país se não existir
  if (numbers.length === 11 || numbers.length === 10) {
    return `+55${numbers}`;
  }
  
  return numbers.startsWith('+') ? numbers : `+${numbers}`;
}

export function formatDateTime(date: string | Date, time?: string): string {
  const d = new Date(date);
  
  if (time) {
    const [hours, minutes] = time.split(':');
    d.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  }
  
  return d.toISOString();
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
} 