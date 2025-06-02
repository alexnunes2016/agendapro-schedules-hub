
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AgendoProWebhookPayload {
  event: string;
  data: {
    id: string;
    client_name: string;
    client_email?: string;
    client_phone?: string;
    service_name: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    notes?: string;
    professional_id?: string;
  };
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse webhook payload
    const payload: AgendoProWebhookPayload = await req.json();
    
    console.log('AgendoPro webhook received:', payload);

    // Validate required fields
    if (!payload.event || !payload.data) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload structure' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { event, data } = payload;

    // Process different event types
    switch (event) {
      case 'appointment.created':
      case 'appointment.updated':
        await handleAppointmentEvent(supabase, event, data);
        break;
      
      case 'appointment.cancelled':
        await handleAppointmentCancellation(supabase, data);
        break;
      
      case 'appointment.confirmed':
        await handleAppointmentConfirmation(supabase, data);
        break;
      
      default:
        console.log(`Unhandled event type: ${event}`);
    }

    // Log the webhook event
    await logWebhookEvent(supabase, payload);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Event ${event} processed successfully` 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('AgendoPro webhook error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleAppointmentEvent(supabase: any, event: string, data: any) {
  try {
    // Find or create the user based on professional_id or email
    let userId = null;
    
    if (data.professional_id) {
      // Try to find user by professional_id in profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('agendopro_id', data.professional_id)
        .single();
      
      if (profile) {
        userId = profile.id;
      }
    }

    if (!userId) {
      console.log('User not found for professional_id:', data.professional_id);
      return;
    }

    // Check if appointment already exists
    const { data: existingAppointment } = await supabase
      .from('appointments')
      .select('id')
      .eq('agendopro_id', data.id)
      .single();

    const appointmentData = {
      agendopro_id: data.id,
      client_name: data.client_name,
      client_email: data.client_email || null,
      client_phone: data.client_phone || null,
      appointment_date: data.appointment_date,
      appointment_time: data.appointment_time,
      status: mapAgendoProStatus(data.status),
      notes: data.notes || null,
      user_id: userId,
      updated_at: new Date().toISOString(),
    };

    if (existingAppointment) {
      // Update existing appointment
      const { error } = await supabase
        .from('appointments')
        .update(appointmentData)
        .eq('id', existingAppointment.id);

      if (error) {
        console.error('Error updating appointment:', error);
        throw error;
      }
      
      console.log('Appointment updated:', existingAppointment.id);
    } else {
      // Create new appointment
      const { error } = await supabase
        .from('appointments')
        .insert({
          ...appointmentData,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }
      
      console.log('New appointment created for AgendoPro ID:', data.id);
    }

  } catch (error) {
    console.error('Error handling appointment event:', error);
    throw error;
  }
}

async function handleAppointmentCancellation(supabase: any, data: any) {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('agendopro_id', data.id);

    if (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
    
    console.log('Appointment cancelled:', data.id);
  } catch (error) {
    console.error('Error handling cancellation:', error);
    throw error;
  }
}

async function handleAppointmentConfirmation(supabase: any, data: any) {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('agendopro_id', data.id);

    if (error) {
      console.error('Error confirming appointment:', error);
      throw error;
    }
    
    console.log('Appointment confirmed:', data.id);
  } catch (error) {
    console.error('Error handling confirmation:', error);
    throw error;
  }
}

async function logWebhookEvent(supabase: any, payload: AgendoProWebhookPayload) {
  try {
    const { error } = await supabase
      .from('webhook_logs')
      .insert({
        provider: 'agendopro',
        event_type: payload.event,
        payload: payload,
        processed_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error logging webhook event:', error);
    }
  } catch (error) {
    console.error('Error in webhook logging:', error);
  }
}

function mapAgendoProStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    'agendado': 'pending',
    'confirmado': 'confirmed',
    'cancelado': 'cancelled',
    'finalizado': 'completed',
    'em_andamento': 'in_progress',
  };

  return statusMap[status.toLowerCase()] || 'pending';
}
